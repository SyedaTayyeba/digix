import { useCallback, useEffect, useState } from 'react';
import { apiGet, normalizePaginated, type ApiError, type PaginatedResponse } from '../../lib/api';

interface UseCrudListOptions {
  page: number;
  perPage?: number;
  search?: string;
  filters?: Record<string, string>;
}

/**
 * Fetches a paginated list from the given endpoint whenever page/search/
 * filters change, and exposes a refetch() for after create/update/delete.
 * Every admin list page (Services, Blog, Leads, etc.) uses this instead
 * of re-implementing its own fetch/loading/error handling.
 */
export function useCrudList<T>(endpoint: string, options: UseCrudListOptions) {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const { page, perPage, search, filters } = options;
  const filtersKey = JSON.stringify(filters ?? {});

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { page };
      if (perPage) params.per_page = perPage;
      if (search) params.search = search;
      if (filters) Object.assign(params, filters);

      const res = await apiGet<PaginatedResponse<T>>(endpoint, { params });
      const normalized = normalizePaginated(res);
      setData(normalized.data);
      setCurrentPage(normalized.currentPage);
      setLastPage(normalized.lastPage);
      setTotal(normalized.total);
    } catch (err) {
      setError(err as ApiError);
      setData([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, page, perPage, search, filtersKey]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { data, currentPage, lastPage, total, loading, error, refetch: fetchList };
}
