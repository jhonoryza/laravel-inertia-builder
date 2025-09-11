<?php

namespace Jhonoryza\InertiaBuilder;

use Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull;
use Illuminate\Foundation\Http\Middleware\TrimStrings;
use Illuminate\Support\ServiceProvider as LaravelServiceProvider;
use Jhonoryza\InertiaBuilder\Console\Commands\GenerateCommand;
use Jhonoryza\InertiaBuilder\Console\Commands\InstallCommand;

class ServiceProvider extends LaravelServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        TrimStrings::skipWhen(function ($request) {
            return $request->is('inertia-builder/reactive');
        });
        ConvertEmptyStringsToNull::skipWhen(function ($request) {
            return $request->is('inertia-builder/reactive');
        });
        $this->loadRoutesFrom(__DIR__ . '/Routes/web.php');

        if (! $this->app->runningInConsole()) {
            return;
        }

        $this->publishes([
            __DIR__ . '/Stubs/Generator' => base_path('stubs/inertia-builder'),
        ], 'inertia-builder-stubs');

        $this->commands([
            GenerateCommand::class,
            InstallCommand::class,
        ]);
    }

    public function provides(): array
    {
        return [
            GenerateCommand::class,
            InstallCommand::class,
        ];
    }
}
