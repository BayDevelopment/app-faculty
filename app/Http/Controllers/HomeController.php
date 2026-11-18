<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\HeroPhoto;
use App\Models\News;
use App\Models\Program;
use App\Models\Service;
use App\Models\Stat;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /** Jumlah card per halaman. Pagination aktif otomatis bila data lebih dari ini. */
    private const PER_PAGE = 6;

    public function __invoke(): Response
    {
        return Inertia::render('welcome', [
            'faculty'      => Faculty::first(),
            'stats'        => Stat::active()->get(),
            // Nama parameter dibedakan agar dua pagination tidak saling menimpa
            'programs'     => Program::active()->paginate(self::PER_PAGE, ['*'], 'prodi_page')->withQueryString(),
            'services'     => Service::active()->paginate(self::PER_PAGE, ['*'], 'layanan_page')->withQueryString(),
            'news'         => News::published()->take(3)->get(),
            'testimonials' => Testimonial::active()->get(),
            // di controller beranda
            'heroPhotos' => HeroPhoto::where('is_active', true)
                ->orderBy('posisi')
                ->get(['posisi', 'gambar', 'alt'])
                ->map(fn($p) => [
                    'posisi' => $p->posisi,
                    'url' => $p->url,
                    'alt' => $p->alt,
                ]),
        ]);
    }
}
