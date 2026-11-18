<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\News;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(Request $request): Response
    {
        $news = News::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = addcslashes(
                    $request->string('search')->trim()->toString(),
                    '%_\\'
                );

                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('excerpt', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%");
                });
            })
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('news/index', [
            'news' => $news,
            'filters' => $request->only('search'),
            'options' => [
                'categories' => News::query()
                    ->whereNotNull('category')
                    ->distinct()
                    ->orderBy('category')
                    ->pluck('category')
                    ->values(),
            ],
        ]);
    }

    /**
     * Menyimpan berita baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $data['slug'] = $data['slug'] ?: $this->uniqueSlug($data['title']);
        $data = $this->normalizePublishing($request, $data);
        $data['image'] = $request->hasFile('image')
            ? $request->file('image')->store('news', 'public')
            : null;

        News::create($data);

        return redirect()
            ->route('admin.news.index')
            ->with('success', 'Berita berhasil ditambahkan.');
    }

    /**
     * Memperbarui berita.
     */
    public function update(Request $request, News $news): RedirectResponse
    {
        $data = $this->validated($request, $news);

        // slug dikosongkan saat edit: pertahankan slug lama agar URL tidak berubah
        $data['slug'] = $data['slug'] ?: $news->slug;
        $data = $this->normalizePublishing($request, $data);

        $oldImage = $news->getRawOriginal('image');

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('news', 'public');
        } else {
            unset($data['image']);
        }

        $news->update($data);

        if (isset($data['image'])) {
            $this->deleteImage($oldImage);
        }

        return redirect()
            ->route('admin.news.index', $request->only('page', 'search'))
            ->with('success', 'Berita berhasil diperbarui.');
    }

    /**
     * Menghapus berita beserta gambarnya.
     */
    public function destroy(News $news): RedirectResponse
    {
        $image = $news->getRawOriginal('image');

        $news->delete();
        $this->deleteImage($image);

        return redirect()
            ->route('admin.news.index')
            ->with('success', 'Berita berhasil dihapus.');
    }

    /**
     * Validasi data berita.
     */
    private function validated(Request $request, ?News $news = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],

            'slug' => [
                'nullable',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('news', 'slug')->ignore($news?->id),
            ],

            'excerpt' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string', 'max:100000'],
            'category' => ['nullable', 'string', 'max:100'],

            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'published_at' => ['nullable', 'date'],
            'is_published' => ['required', 'boolean'],
        ], [
            'slug.regex' => 'Slug hanya boleh huruf kecil, angka, dan tanda hubung.',
            'slug.unique' => 'Slug sudah dipakai berita lain.',
        ]);
    }

    /**
     * Berita yang diterbitkan tanpa tanggal memakai tanggal hari ini,
     * karena halaman publik hanya menampilkan berita bertanggal.
     */
    private function normalizePublishing(Request $request, array $data): array
    {
        $data['is_published'] = $request->boolean('is_published');

        if ($data['is_published'] && empty($data['published_at'])) {
            $data['published_at'] = now()->toDateString();
        }

        return $data;
    }

    /**
     * Membuat slug unik dari judul.
     */
    private function uniqueSlug(string $title): string
    {
        $base = Str::slug($title) ?: 'berita';
        $slug = $base;
        $i = 2;

        while (News::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }

    /**
     * Hapus file gambar lokal (URL eksternal seperti Unsplash dilewati).
     */
    private function deleteImage(?string $path): void
    {
        if ($path && ! str_starts_with($path, 'http')) {
            Storage::disk('public')->delete($path);
        }
    }
}
