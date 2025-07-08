<?php

namespace Jhonoryza\InertiaBuilder;

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
