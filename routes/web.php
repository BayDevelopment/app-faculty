<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ProgramController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/prodi/{program:slug}', [ProgramController::class, 'show'])
    ->name('prodi.show');

Route::get('/berita', [NewsController::class, 'index'])
    ->name('berita.index');

Route::get('/berita/{news:slug}', [NewsController::class, 'show'])
    ->name('berita.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

require __DIR__ . '/settings.php';
