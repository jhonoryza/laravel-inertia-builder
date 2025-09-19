<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::post('tests/actions', [App\Http\Controllers\TestController::class, 'actions'])
        ->name('tests.actions');
    Route::resource('tests', App\Http\Controllers\TestController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
