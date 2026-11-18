<?php

// app/Http/Controllers/ProgramController.php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProgramController extends Controller
{
    public const DEGREES = ['D3', 'D4', 'S1', 'S2', 'S3'];

    public const ACCREDITATIONS = ['Unggul', 'Baik Sekali', 'Baik'];

    /** Kolom daftar teks sederhana (array of string). */
    private const LIST_FIELDS = [
        'competencies',
        'career_prospects',
        'facilities',
        'admission_requirements',
    ];

    /** Kolom file => folder penyimpanan di disk "public". */
    private const FILE_FIELDS = [
        'hero_image' => 'programs',
        'head_photo' => 'programs/heads',
    ];

    public function index(Request $request): Response
    {
        $programs = Program::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = addcslashes(
                    $request->string('search')->toString(),
                    '%_\\'
                );

                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%")
                        ->orWhere('degree', 'like', "%{$search}%")
                        ->orWhere('head_name', 'like', "%{$search}%");
                });
            })
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('programs/index', [
            'programs' => $programs,
            'filters'  => $request->only('search'),
            'options'  => [
                'degrees'        => self::DEGREES,
                'accreditations' => self::ACCREDITATIONS,
            ],
        ]);
    }

    public function show(Program $program): Response
    {
        return Inertia::render('detail-prodi', [
            'program' => [
                'id' => $program->id,
                'slug' => $program->slug,
                'name' => $program->name,
                'degree' => $program->degree,
                'accreditation' => $program->accreditation,

                'description' => $program->description,
                'hero_image' => $program->hero_image
                    ? asset('storage/' . $program->hero_image)
                    : null,

                'overview' => $program->overview,
                'vision' => $program->vision,
                'duration' => $program->duration,
                'credits' => $program->credits,

                'head_name' => $program->head_name,
                'head_title' => $program->head_title,
                'head_photo' => $program->head_photo
                    ? asset('storage/' . $program->head_photo)
                    : null,

                'competencies' => $program->competencies ?? [],
                'curriculum' => $program->curriculum ?? [],
                'career_prospects' => $program->career_prospects ?? [],
                'facilities' => $program->facilities ?? [],
                'admission_requirements' => $program->admission_requirements ?? [],

                'contact_email' => $program->contact_email,
                'contact_phone' => $program->contact_phone,

                'student_count' => $program->student_count,
                'sort_order' => $program->sort_order,
                'is_active' => $program->is_active,
            ],
        ]);
    }


    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        // slug kosong -> dibuat otomatis dari nama
        $data['slug'] = $data['slug'] ?? $this->uniqueSlug($data['name']);

        foreach (self::FILE_FIELDS as $field => $dir) {
            if ($request->hasFile($field)) {
                $data[$field] = $request->file($field)->store($dir, 'public');
            } else {
                unset($data[$field]);
            }
        }

        Program::create($data);

        return redirect()
            ->route('programs.index')
            ->with('success', 'Program studi berhasil ditambahkan.');
    }

    public function update(Request $request, Program $program): RedirectResponse
    {
        $data = $this->validated($request, $program);

        // slug kosong saat edit -> pertahankan slug lama (URL publik tidak berubah)
        if (empty($data['slug'])) {
            unset($data['slug']);
        }

        $oldFiles = [];

        foreach (self::FILE_FIELDS as $field => $dir) {
            if ($request->hasFile($field)) {
                $oldFiles[] = $program->{$field};
                $data[$field] = $request->file($field)->store($dir, 'public');
            } else {
                unset($data[$field]); // pertahankan file lama
            }
        }

        $program->update($data);

        // hapus file lama hanya setelah update berhasil
        foreach (array_filter($oldFiles) as $path) {
            Storage::disk('public')->delete($path);
        }

        return redirect()
            ->route('programs.index', $request->only('page', 'search'))
            ->with('success', 'Program studi berhasil diperbarui.');
    }

    public function destroy(Program $program): RedirectResponse
    {
        $files = array_filter([$program->hero_image, $program->head_photo]);

        $program->delete();

        foreach ($files as $path) {
            Storage::disk('public')->delete($path);
        }

        return redirect()
            ->route('programs.index', request()->only('page', 'search'))
            ->with('success', 'Program studi berhasil dihapus.');
    }

    /**
     * Validasi bersama untuk store & update.
     */
    private function validated(Request $request, ?Program $program = null): array
    {
        $this->normalize($request);

        $listRules = ['nullable', 'array', 'max:30'];

        $data = $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'slug'          => [
                'nullable',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('programs', 'slug')->ignore($program?->id),
            ],
            'degree'        => ['required', Rule::in(self::DEGREES)],
            'accreditation' => ['required', Rule::in(self::ACCREDITATIONS)],
            'description'   => ['required', 'string', 'max:5000'],
            'hero_image'    => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'overview'      => ['nullable', 'string', 'max:10000'],
            'vision'        => ['nullable', 'string', 'max:5000'],
            'duration'      => ['nullable', 'string', 'max:30'],
            'credits'       => ['nullable', 'integer', 'min:0', 'max:400'],

            'head_name'     => ['nullable', 'string', 'max:255'],
            'head_title'    => ['nullable', 'string', 'max:255'],
            'head_photo'    => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],

            'competencies'             => $listRules,
            'competencies.*'           => ['required', 'string', 'max:500'],
            'career_prospects'         => $listRules,
            'career_prospects.*'       => ['required', 'string', 'max:500'],
            'facilities'               => $listRules,
            'facilities.*'             => ['required', 'string', 'max:500'],
            'admission_requirements'   => $listRules,
            'admission_requirements.*' => ['required', 'string', 'max:500'],

            'curriculum'                 => ['nullable', 'array', 'max:20'],
            'curriculum.*.semester'      => ['required', 'string', 'max:100'],
            'curriculum.*.courses'       => ['nullable', 'array', 'max:30'],
            'curriculum.*.courses.*'     => ['required', 'string', 'max:255'],

            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:30'],

            'student_count' => ['nullable', 'integer', 'min:0', 'max:1000000'],
            'sort_order'    => ['nullable', 'integer', 'min:0', 'max:65535'],
            'is_active'     => ['required', 'boolean'],
        ], [
            'slug.regex' => 'Slug hanya boleh huruf kecil, angka, dan tanda hubung (contoh: teknik-informatika).',
        ], [
            'name'                       => 'nama program studi',
            'slug'                       => 'slug',
            'degree'                     => 'jenjang',
            'accreditation'              => 'akreditasi',
            'description'                => 'deskripsi',
            'hero_image'                 => 'gambar hero',
            'overview'                   => 'ikhtisar',
            'vision'                     => 'visi',
            'duration'                   => 'lama studi',
            'credits'                    => 'total SKS',
            'head_name'                  => 'nama ketua program studi',
            'head_title'                 => 'jabatan',
            'head_photo'                 => 'foto ketua program studi',
            'competencies'               => 'kompetensi lulusan',
            'competencies.*'             => 'kompetensi lulusan',
            'career_prospects'           => 'prospek karier',
            'career_prospects.*'         => 'prospek karier',
            'facilities'                 => 'fasilitas',
            'facilities.*'               => 'fasilitas',
            'admission_requirements'     => 'persyaratan penerimaan',
            'admission_requirements.*'   => 'persyaratan penerimaan',
            'curriculum'                 => 'kurikulum',
            'curriculum.*.semester'      => 'nama semester',
            'curriculum.*.courses'       => 'mata kuliah',
            'curriculum.*.courses.*'     => 'mata kuliah',
            'contact_email'              => 'email kontak',
            'contact_phone'              => 'telepon kontak',
            'student_count'              => 'jumlah mahasiswa',
            'sort_order'                 => 'urutan',
            'is_active'                  => 'status',
        ]);

        $data['student_count'] = $data['student_count'] ?? 0;
        $data['sort_order']    = $data['sort_order'] ?? 0;
        $data['slug']          = $data['slug'] ?? null;

        return $data;
    }

    /**
     * Bersihkan item kosong pada daftar & kurikulum sebelum divalidasi.
     */
    private function normalize(Request $request): void
    {
        $clean = [];

        foreach (self::LIST_FIELDS as $field) {
            $clean[$field] = $this->cleanList($request->input($field, []));
        }

        $clean['curriculum'] = $this->cleanCurriculum($request->input('curriculum', []));

        $request->merge($clean);
    }

    private function cleanList(mixed $items): array
    {
        return array_values(array_filter(
            array_map(fn($i) => is_string($i) ? trim($i) : '', (array) $items),
            fn($i) => $i !== ''
        ));
    }

    private function cleanCurriculum(mixed $items): array
    {
        $result = [];

        foreach ((array) $items as $item) {
            if (! is_array($item)) {
                continue;
            }

            $semester = is_string($item['semester'] ?? null) ? trim($item['semester']) : '';
            $courses  = $this->cleanList($item['courses'] ?? []);

            if ($semester === '' && $courses === []) {
                continue;
            }

            $result[] = ['semester' => $semester, 'courses' => $courses];
        }

        return $result;
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'prodi';
        $slug = $base;
        $i    = 2;

        while (Program::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
