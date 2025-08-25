<?php

use Illuminate\Support\Facades\Route;
use Jhonoryza\InertiaBuilder\Controllers\ReactiveController;

Route::post('inertia-builder/reactive', ReactiveController::class)
    ->name('inertia-builder.reactive');
