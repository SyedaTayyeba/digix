<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConversionEvent;
use Illuminate\Http\Request;

class ConversionEventController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'event_name' => ['required', 'string', 'max:100'],
            'source' => ['nullable', 'string', 'max:100'],
            'session_id' => ['nullable', 'string', 'max:255'],
            'page_url' => ['nullable', 'string'],
            'metadata' => ['nullable', 'array'],
        ]);

        $data['occurred_at'] = now();

        return response()->json(
            ConversionEvent::create($data),
            201
        );
    }
}