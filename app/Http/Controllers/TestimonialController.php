<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    /**
     * Menampilkan daftar testimonial.
     */
    public function index(Request $request): Response
    {
        $testimonials = Testimonial::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = addcslashes(
                    $request->string('search')->trim()->toString(),
                    '%_\\'
                );

                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('batch', 'like', "%{$search}%")
                        ->orWhere('job', 'like', "%{$search}%")
                        ->orWhere('company', 'like', "%{$search}%");
                });
            })
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('testimonial/index', [
            'testimonials' => $testimonials,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Menyimpan testimonial baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $data['is_active'] = $request->boolean('is_active');
        $data['photo'] = $request->hasFile('photo')
            ? $request->file('photo')->store('testimonials', 'public')
            : null;

        Testimonial::create($data);

        return redirect()
            ->route('testimonials.index')
            ->with('success', 'Testimonial berhasil ditambahkan.');
    }

    /**
     * Memperbarui testimonial.
     */
    public function update(
        Request $request,
        Testimonial $testimonial
    ): RedirectResponse {
        $data = $this->validated($request);

        $data['is_active'] = $request->boolean('is_active');

        $oldPhoto = $testimonial->getRawOriginal('photo');

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('testimonials', 'public');
        } else {
            unset($data['photo']);
        }

        $testimonial->update($data);

        if (isset($data['photo'])) {
            $this->deletePhoto($oldPhoto);
        }

        return redirect()
            ->route('testimonials.index', $request->only('page', 'search'))
            ->with('success', 'Testimonial berhasil diperbarui.');
    }

    /**
     * Menghapus testimonial beserta fotonya.
     */
    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $photo = $testimonial->getRawOriginal('photo');

        $testimonial->delete();
        $this->deletePhoto($photo);

        return redirect()
            ->route('testimonials.index')
            ->with('success', 'Testimonial berhasil dihapus.');
    }

    /**
     * Validasi data testimonial.
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'batch' => ['required', 'string', 'max:30'],
            'job' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'quote' => ['required', 'string', 'max:1000'],

            'photo' => [
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
     * Hapus file foto lokal (URL eksternal seperti Unsplash dilewati).
     */
    private function deletePhoto(?string $path): void
    {
        if ($path && ! str_starts_with($path, 'http')) {
            Storage::disk('public')->delete($path);
        }
    }
}
