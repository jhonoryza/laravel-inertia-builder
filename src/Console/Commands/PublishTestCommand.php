<?php

namespace Jhonoryza\InertiaBuilder\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\Process;

class PublishTestCommand extends Command
{
    protected $signature = 'inertia-builder:publish-template';

    protected $description = 'copy inertia builder template';

    public function handle(): void
    {
        (new Filesystem)->copyDirectory(__DIR__ . '/../../Tests/app', base_path('app'));
        $this->info('app dir copied successfully.');

        (new Filesystem)->copyDirectory(__DIR__ . '/../../Tests/database', base_path('database'));
        $this->info('database dir copied successfully.');

        (new Filesystem)->copyDirectory(__DIR__ . '/../../Tests/routes', base_path('routes'));
        $this->info('routes dir copied successfully.');

        Process::run('php artisan migrate');
    }
}
