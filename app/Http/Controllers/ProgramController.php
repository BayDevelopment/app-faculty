<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Inertia\Inertia;
use Inertia\Response;

class ProgramController extends Controller
{
    public function show(Program $program): Response
    {
        // Program yang dinonaktifkan admin tidak bisa dibuka lewat URL langsung
        abort_unless($program->is_active, 404);

        return Inertia::render('detail-prodi', [
            'program' => $program,
            'related' => Program::active()
                ->whereKeyNot($program->id)
                ->take(3)
                ->get(['id', 'slug', 'name', 'degree', 'accreditation', 'description', 'student_count']),
        ]);
    }
}
