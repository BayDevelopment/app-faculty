<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FacultyController extends Controller
{
    public function index(Request $request): Response
    {
        $faculties = Faculty::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->toString();
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('university', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('faculties/index', [
            'faculties' => $faculties,
            'filters'   => $request->only('search'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        if ($request->hasFile('hero_image')) {
            $data['hero_image'] = $request->file('hero_image')->store('faculties', 'public');
        }

        Faculty::create($data);

        return redirect()
            ->route('faculties.index')
            ->with('success', 'Fakultas berhasil ditambahkan.');
    }

    public function update(Request $request, Faculty $faculty): RedirectResponse
    {
        $data = $this->validated($request);

        if ($request->hasFile('hero_image')) {
            if ($faculty->hero_image) {
                Storage::disk('public')->delete($faculty->hero_image);
            }
            $data['hero_image'] = $request->file('hero_image')->store('faculties', 'public');
        } else {
            unset($data['hero_image']); // pertahankan gambar lama
        }

        $faculty->update($data);

        return redirect()
            ->route('faculties.index', $request->only('page', 'search'))
            ->with('success', 'Fakultas berhasil diperbarui.');
    }

    public function destroy(Faculty $faculty): RedirectResponse
    {
        if ($faculty->hero_image) {
            Storage::disk('public')->delete($faculty->hero_image);
        }

        $faculty->delete();

        return redirect()
            ->route('faculties.index', request()->only('page', 'search'))
            ->with('success', 'Fakultas berhasil dihapus.');
    }

    /**
     * Validasi bersama untuk store & update.
     */
    private function validated(Request $request): array
    {
        // Bersihkan misi kosong sebelum divalidasi
        $request->merge([
            'missions' => array_values(array_filter(
                array_map(fn($m) => is_string($m) ? trim($m) : '', (array) $request->input('missions', [])),
                fn($m) => $m !== ''
            )),
        ]);

        return $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'university'   => ['required', 'string', 'max:255'],
            'tagline'      => ['required', 'string', 'max:255'],
            'description'  => ['required', 'string'],
            'hero_image'   => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'vision'       => ['required', 'string'],
            'missions'     => ['required', 'array', 'min:1'],
            'missions.*'   => ['required', 'string', 'max:500'],
            'address'      => ['required', 'string', 'max:255'],
            'email'        => ['required', 'email', 'max:255'],
            'phone'        => ['required', 'string', 'max:30'],
        ], [], [
            'name'        => 'nama fakultas',
            'university'  => 'universitas',
            'tagline'     => 'tagline',
            'description' => 'deskripsi',
            'hero_image'  => 'gambar hero',
            'vision'      => 'visi',
            'missions'    => 'misi',
            'missions.*'  => 'misi',
            'address'     => 'alamat',
            'email'       => 'email',
            'phone'       => 'telepon',
        ]);
    }
}
