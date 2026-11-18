<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Closure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Icon yang diperbolehkan digunakan pada service.
     */
    public const ICONS = [
        'book',
        'flask',
        'handshake',
        'graduation',
        'microscope',
        'users',
        'building',
    ];

    /**
     * Menampilkan daftar service.
     */
    public function index(Request $request): Response
    {
        $services = Service::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = addcslashes(
                    $request->string('search')->toString(),
                    '%_\\'
                );

                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('icon', 'like', "%{$search}%");
                });
            })
            ->orderBy('sort_order')
            ->orderBy('title')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('services/index', [
            'services' => $services,
            'filters' => $request->only('search'),
            'options' => [
                'icons' => self::ICONS,
            ],
        ]);
    }

    /**
     * Menyimpan service baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        Service::create($data);

        return redirect()
            ->route('services.index')
            ->with('success', 'Layanan berhasil ditambahkan.');
    }

    /**
     * Memperbarui service.
     */
    public function update(
        Request $request,
        Service $service
    ): RedirectResponse {
        $data = $this->validated($request);

        $service->update($data);

        return redirect()
            ->route('services.index', $request->only('page', 'search'))
            ->with('success', 'Layanan berhasil diperbarui.');
    }

    /**
     * Menghapus service.
     */
    public function destroy(Service $service): RedirectResponse
    {
        $service->delete();

        return redirect()
            ->route('services.index')
            ->with('success', 'Layanan berhasil dihapus.');
    }

    /**
     * Validasi data service.
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'required',
                'string',
                'max:255',
            ],

            'icon' => [
                'required',
                'string',
                'max:30',
                Rule::in(self::ICONS),
            ],

            'url' => [
                'bail',
                'nullable',
                'string',
                'max:255',
                function (string $attribute, mixed $value, Closure $fail) {
                    // tolak spasi & karakter kontrol (tab/newline dipakai untuk menyelundupkan "//")
                    if (preg_match('/[\x00-\x20\x7F]/', $value)) {
                        $fail('Tautan tidak boleh mengandung spasi atau karakter kontrol.');
                        return;
                    }

                    // "#", "#bagian"
                    if (str_starts_with($value, '#')) {
                        return;
                    }

                    // path internal: "/" atau "/kontak", bukan "//host" maupun "/\host"
                    if (preg_match('#^/(?![/\\\\])#', $value)) {
                        return;
                    }

                    // selain itu harus http/https yang valid
                    if (
                        ! preg_match('#^https?://#i', $value) ||
                        ! filter_var($value, FILTER_VALIDATE_URL)
                    ) {
                        $fail('Tautan harus berupa alamat http(s), path (/halaman), atau #.');
                    }
                },
            ],

            'sort_order' => [
                'required',
                'integer',
                'min:0',
                'max:65535',
            ],

            'is_active' => [
                'required',
                'boolean',
            ],
        ]);
    }
}
