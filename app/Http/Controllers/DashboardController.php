<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\News;
use App\Models\Program;
use App\Models\Service;
use App\Models\Stat;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        // Program dianggap "lengkap" jika kolom detail utamanya sudah terisi.
        $completeProgramsQuery = Program::query()
            ->whereNotNull('overview')
            ->whereNotNull('vision')
            ->whereNotNull('duration')
            ->whereNotNull('credits')
            ->whereNotNull('head_name')
            ->whereNotNull('curriculum');

        return Inertia::render('dashboard', [
            'faculty' => Faculty::query()
                ->first(['id', 'name', 'university', 'tagline', 'email', 'phone', 'updated_at']),

            'counts' => [
                'programs' => [
                    'total'  => Program::count(),
                    'active' => Program::where('is_active', true)->count(),
                ],
                'services' => [
                    'total'  => Service::count(),
                    'active' => Service::where('is_active', true)->count(),
                ],
                'news' => [
                    'total'     => News::count(),
                    'published' => News::where('is_published', true)->count(),
                    'draft'     => News::where('is_published', false)->count(),
                ],
                'testimonials' => [
                    'total'  => Testimonial::count(),
                    'active' => Testimonial::where('is_active', true)->count(),
                ],
                'stats' => [
                    'total'  => Stat::count(),
                    'active' => Stat::where('is_active', true)->count(),
                ],
                'students' => (int) Program::where('is_active', true)->sum('student_count'),
            ],

            'programCompleteness' => [
                'complete' => $completeProgramsQuery->count(),
                'total'    => Program::count(),
                'incomplete' => Program::query()
                    ->where(function ($q) {
                        $q->whereNull('overview')
                            ->orWhereNull('vision')
                            ->orWhereNull('duration')
                            ->orWhereNull('credits')
                            ->orWhereNull('head_name')
                            ->orWhereNull('curriculum');
                    })
                    ->orderBy('sort_order')
                    ->limit(5)
                    ->get(['id', 'name', 'degree']),
            ],

            'programsByDegree' => Program::query()
                ->selectRaw('degree, COUNT(*) as total, SUM(student_count) as students')
                ->groupBy('degree')
                ->orderBy('degree')
                ->get(),

            'programsByAccreditation' => Program::query()
                ->selectRaw('accreditation, COUNT(*) as total')
                ->groupBy('accreditation')
                ->get(),

            'newsByCategory' => News::query()
                ->selectRaw('category, COUNT(*) as total')
                ->groupBy('category')
                ->orderByDesc('total')
                ->get(),

            'latestNews' => News::query()
                ->latest()
                ->limit(5)
                ->get(['id', 'title', 'category', 'is_published', 'published_at', 'created_at']),

            'latestTestimonials' => Testimonial::query()
                ->latest()
                ->limit(4)
                ->get(['id', 'name', 'batch', 'job', 'company', 'quote', 'photo']),

            'stats' => Stat::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'label', 'value', 'suffix']),

            // Data mini-chart di kartu ringkasan (6 bulan terakhir, kumulatif).
            'trends' => [
                'programs'     => $this->cumulativeTrend(Program::class),
                'services'     => $this->cumulativeTrend(Service::class),
                'news'         => $this->cumulativeTrend(News::class, 'published_at'),
                'testimonials' => $this->cumulativeTrend(Testimonial::class),
                'studentsByProgram' => Program::query()
                    ->where('is_active', true)
                    ->orderBy('sort_order')
                    ->get(['name', 'student_count'])
                    ->map(fn($p) => ['name' => $p->name, 'value' => (int) $p->student_count])
                    ->values(),
            ],

            'security' => [
                'twoFactorEnabled' => $user->two_factor_confirmed_at !== null,
                'emailVerified'    => $user->email_verified_at !== null,
            ],
        ]);
    }

    /**
     * Total kumulatif per bulan untuk N bulan terakhir (untuk sparkline).
     *
     * @param  class-string<\Illuminate\Database\Eloquent\Model>  $model
     * @return int[]
     */
    private function cumulativeTrend(string $model, string $column = 'created_at', int $months = 6): array
    {
        $start = now()->subMonths($months - 1)->startOfMonth();

        $running = $model::where($column, '<', $start)->count();

        $perMonth = $model::where($column, '>=', $start)
            ->pluck($column)
            ->countBy(fn($date) => Carbon::parse($date)->format('Y-m'));

        $series = [];

        for ($i = 0; $i < $months; $i++) {
            $key = $start->copy()->addMonths($i)->format('Y-m');
            $running += $perMonth->get($key, 0);
            $series[] = $running;
        }

        return $series;
    }
}
