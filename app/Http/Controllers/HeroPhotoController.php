<?php

namespace App\Http\Controllers;

use App\Models\HeroPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HeroPhotoController extends Controller
{
    public function index()
    {
        return Inertia::render('hero/index', [
            'photos' => HeroPhoto::orderBy('posisi')->get()->map(fn($p) => [
                'id' => $p->id,
                'posisi' => $p->posisi,
                'url' => $p->url,
                'alt' => $p->alt,
                'is_active' => $p->is_active,
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'gambar' => ['required', 'image', 'max:3072'],
            'alt' => ['nullable', 'string', 'max:150'],
        ]);

        HeroPhoto::create([
            'posisi' => (HeroPhoto::max('posisi') ?? 0) + 1,
            'gambar' => $request->file('gambar')->store('hero', 'public'),
            'alt' => $data['alt'] ?? null,
            'is_active' => true,
        ]);

        return back()->with('success', 'Foto berhasil ditambahkan.');
    }

    public function update(Request $request, HeroPhoto $heroPhoto)
    {
        $data = $request->validate([
            'gambar' => ['nullable', 'image', 'max:3072'],
            'alt' => ['nullable', 'string', 'max:150'],
            'posisi' => ['nullable', 'integer', 'min:1', 'unique:hero_photos,posisi,' . $heroPhoto->id],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $payload = [];

        if ($request->hasFile('gambar')) {
            $this->deleteFile($heroPhoto);
            $payload['gambar'] = $request->file('gambar')->store('hero', 'public');
        }

        // alt boleh dikosongkan, jadi dicek lewat has(), bukan nilainya
        if ($request->has('alt')) {
            $payload['alt'] = $data['alt'] ?? null;
        }

        if (isset($data['posisi'])) {
            $payload['posisi'] = $data['posisi'];
        }

        if (array_key_exists('is_active', $data) && $data['is_active'] !== null) {
            $payload['is_active'] = $data['is_active'];
        }

        $heroPhoto->update($payload);

        return back()->with('success', 'Foto berhasil diperbarui.');
    }

    public function destroy(HeroPhoto $heroPhoto)
    {
        $this->deleteFile($heroPhoto);
        $heroPhoto->delete();

        return back()->with('success', 'Foto berhasil dihapus.');
    }

    private function deleteFile(HeroPhoto $photo): void
    {
        if ($photo->gambar && ! str_starts_with($photo->gambar, 'http')) {
            Storage::disk('public')->delete($photo->gambar);
        }
    }
}
