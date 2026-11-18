<?php

namespace App\Http\Controllers;

use App\Models\Stat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StatController extends Controller
{
    /**
     * Menampilkan daftar statistik.
     */
    public function index(Request $request): Response
    {
        $stats = Stat::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = addcslashes(
                    $request->string('search')->trim()->toString(),
                    '%_\\'
                );

                $query->where('label', 'like', "%{$search}%");
            })
            ->orderBy('sort_order')
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('stats/index', [
            'stats' => $stats,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Menyimpan statistik baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $data['is_active'] = $request->boolean('is_active');
        $data['image'] = $request->hasFile('image')
            ? $request->file('image')->store('stats', 'public')
            : null;

        Stat::create($data);

        return redirect()
            ->route('stats.index')
            ->with('success', 'Statistik berhasil ditambahkan.');
    }

    /**
     * Memperbarui statistik.
     */
    public function update(Request $request, Stat $stat): RedirectResponse
    {
        $data = $this->validated($request);

        $data['is_active'] = $request->boolean('is_active');

        $oldImage = $stat->getRawOriginal('image');

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('stats', 'public');
        } else {
            unset($data['image']);
        }

        $stat->update($data);

        if (isset($data['image'])) {
            $this->deleteImage($oldImage);
        }

        return redirect()
            ->route('stats.index', $request->only('page', 'search'))
            ->with('success', 'Statistik berhasil diperbarui.');
    }

    /**
     * Menghapus statistik beserta gambarnya.
     */
    public function destroy(Stat $stat): RedirectResponse
    {
        $image = $stat->getRawOriginal('image');

        $stat->delete();
        $this->deleteImage($image);

        return redirect()
            ->route('stats.index')
            ->with('success', 'Statistik berhasil dihapus.');
    }

    /**
     * Validasi data statistik.
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'label' => ['required', 'string', 'max:255'],

            // kolom unsignedInteger: 0 sampai 4.294.967.295
            'value' => ['required', 'integer', 'min:0', 'max:4294967295'],

            'suffix' => ['nullable', 'string', 'max:10'],

            // SVG sengaja tidak diizinkan (bisa memuat skrip)
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'sort_order' => ['required', 'integer', 'min:0', 'max:65535'],
            'is_active' => ['required', 'boolean'],
        ]);
    }

    /**
     * Hapus file gambar lokal (URL eksternal dilewati).
     */
    private function deleteImage(?string $path): void
    {
        if ($path && ! str_starts_with($path, 'http')) {
            Storage::disk('public')->delete($path);
        }
    }
}
