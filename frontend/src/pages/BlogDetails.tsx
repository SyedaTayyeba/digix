import { Link, useParams } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { getBlogPostBySlug, blogPosts } from '../data/content';

/** P-11: title, image, content, date, category/tags, sharing, related posts, SEO meta. */
export default function BlogDetails() {
  const { slug } = useParams();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <PageHero
        eyebrow="Blog"
        title="Article not found"
        description="That post may have been unpublished. Take a look at the blog instead."
      />
    );
  }

  const related = blogPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div>
      <PageHero
        eyebrow={`${post.category} · ${new Date(post.date).toLocaleDateString()}`}
        title={post.title}
        description={post.excerpt}
      />

      <article className="px-5 py-14 sm:px-8 md:px-12">
        <div className="mb-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/60">
              #{tag}
            </span>
          ))}
        </div>
        <p className="max-w-2xl text-base leading-relaxed text-white/85">{post.content}</p>

        <div className="mt-8 flex gap-3 text-sm text-white/60">
          <span>Share:</span>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
            className="hover:text-brand"
          >
            X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            className="hover:text-brand"
          >
            LinkedIn
          </a>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-white/10 px-5 py-14 sm:px-8 md:px-12">
          <h2 className="mb-5 text-lg font-medium">Related posts</h2>
          <div className="flex flex-col gap-3">
            {related.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="text-sm text-brand hover:underline">
                {p.title} →
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
