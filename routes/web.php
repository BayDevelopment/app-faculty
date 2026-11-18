<?php

use App\Http\Controllers\Admin\NewsController as AdminNewsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\HeroPhotoController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\StatController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');


Route::get('/prodi/{program:slug}', [ProgramController::class, 'show'])
    ->name('prodi.show');

Route::get('/berita', [NewsController::class, 'index'])
    ->name('berita.index');

Route::get('/berita/{news:slug}', [NewsController::class, 'show'])
    ->name('berita.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::resource('prodi', ProgramController::class)
        ->parameters(['prodi' => 'program'])
        ->names('programs')
        ->except(['create', 'show', 'edit']);

    Route::resource('fakultas', FacultyController::class)
        ->parameters(['fakultas' => 'faculty'])
        ->names('faculties')
        ->except(['create', 'show', 'edit']);

    Route::resource('layanan', ServiceController::class)
        ->parameters(['layanan' => 'service'])
        ->names('services')
        ->except(['create', 'show', 'edit']);
    Route::resource('kelola-berita', AdminNewsController::class)
        ->parameters(['kelola-berita' => 'news'])
        ->names('admin.news')
        ->except(['create', 'show', 'edit']);
    Route::resource('testimonial', TestimonialController::class)
        ->names('testimonials')
        ->except(['create', 'show', 'edit']);
    Route::resource('statistik', StatController::class)
        ->parameters(['statistik' => 'stat'])
        ->names('stats')
        ->except(['create', 'show', 'edit']);
    Route::resource('foto-beranda', HeroPhotoController::class)
        ->parameters(['foto-beranda' => 'heroPhoto'])
        ->names('hero-photos')
        ->except(['create', 'show', 'edit']);
    Route::resource('users', UserController::class)
        ->names('users')
        ->except(['create', 'show', 'edit']);
});

require __DIR__ . '/settings.php';
