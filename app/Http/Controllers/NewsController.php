<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    /**
     * Menampilkan semua berita
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $category = $request->string('category')->trim()->toString();

        $news = News::query()
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now()->toDateString())

            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('excerpt', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%");
                });
            })

            ->when($category && $category !== 'Semua', function ($query) use ($category) {
                $query->where('category', $category);
            })

            ->latest('published_at')
            ->paginate(6)
            ->withQueryString();

        /*
        |--------------------------------------------------------------------------
        | Daftar kategori
        |--------------------------------------------------------------------------
        */
        $categories = News::query()
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now()->toDateString())
            ->whereNotNull('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category')
            ->values();

        return Inertia::render('berita-all', [
            'news' => $news,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $category ?: 'Semua',
            ],
        ]);
    }

    /**
     * Menampilkan detail berita
     */
    public function show(News $news): Response
    {
        abort_unless(
            $news->is_published &&
                $news->published_at &&
                $news->published_at <= now()->toDateString(),
            404
        );

        return Inertia::render('detail-berita', [
            'news' => $news,

            'related' => News::query()
                ->where('is_published', true)
                ->whereNotNull('published_at')
                ->where('published_at', '<=', now()->toDateString())
                ->whereKeyNot($news->id)
                ->latest('published_at')
                ->take(3)
                ->get([
                    'id',
                    'slug',
                    'title',
                    'excerpt',
                    'category',
                    'image',
                    'published_at',
                ]),
        ]);
    }
}
