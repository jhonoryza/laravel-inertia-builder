<?php

namespace Jhonoryza\InertiaBuilder\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\Process;

class InstallCommand extends Command
{
    protected $signature = 'inertia-builder:install';

    protected $description = 'Install inertia builder required dependencies';

    public function handle(): void
    {
        $this->info('Installing inertia builder...');
        $packages = [
            '@radix-ui/react-slider@^1.3.5',
            '@radix-ui/react-switch@^1.2.5',
            '@radix-ui/react-tabs@^1.1.12',
            '@tailwindcss/typography@^0.5.16',
            '@tiptap/extension-heading@^2.23.0',
            '@tiptap/extension-image@^2.23.0',
            '@tiptap/extension-link@^2.23.0',
            '@tiptap/extension-text-align@^2.23.0',
            '@tiptap/extension-underline@^2.23.0',
            '@tiptap/react@^2.23.0',
            '@tiptap/starter-kit@^2.23.0',
            'date-fns@^4.1.0',
            'flatpickr@^4.6.13',
            'marked@^16.0.0',
            'next-themes@^0.4.6',
            'react-day-picker@^9.7.0',
            'sonner@^2.0.5',
        ];
        $command   = 'npm install ' . implode(' ', $packages);
        $npmResult = Process::run($command);

        if ($npmResult->successful()) {
            $this->info('NPM Packages installed successfully');
            echo $npmResult->output();
        } else {
            $this->error('NPM Packages Installation failed:');
            echo $npmResult->errorOutput();
        }

        // install shadcn ui
        $npxResult = Process::run('npx shadcn@latest add -y -o calendar command pagination popover radio-group slider sonner switch table tabs textarea alert-dialog');
        if ($npxResult->successful()) {
            $this->info('required shadcn ui added successfully.');
            echo $npxResult->output();
        } else {
            $this->error('required shadcn ui failed to install.');
            echo $npxResult->errorOutput();
        }

        // copy inertia builder components
        (new Filesystem)->copyDirectory(__DIR__ . '/../../Stubs/resources/js/components/builder', resource_path('js/components/builder'));
        (new Filesystem)->copyDirectory(__DIR__ . '/../../Stubs/resources/js/components/custom-fields', resource_path('js/components/custom-fields'));
        (new Filesystem)->copyDirectory(__DIR__ . '/../../Stubs/resources/js/components/custom-filters', resource_path('js/components/custom-filters'));
        (new Filesystem)->copyDirectory(__DIR__ . '/../../Stubs/resources/js/components/custom-cell', resource_path('js/components/custom-cell'));
        (new Filesystem)->copyDirectory(__DIR__ . '/../../Stubs/resources/js/components/general', resource_path('js/components/general'));
        $this->info('component copied successfully.');

        // copy inertia builder pages
        (new Filesystem)->copyDirectory(__DIR__ . '/../../Stubs/resources/js/pages/builder', resource_path('js/pages/builder'));
        $this->info('page copied successfully.');

        // copy datatable and field builder type
        copy(__DIR__ . '/../../Stubs/resources/js/types/datatable.ts', resource_path('js/types/datatable.ts'));
        copy(__DIR__ . '/../../Stubs/resources/js/types/field-builder.ts', resource_path('js/types/field-builder.ts'));
        $this->info('datatable & field builder type copied successfully.');

        // copy css themes
        (new Filesystem)->copyDirectory(__DIR__ . '/../../Stubs/resources/css/theme', resource_path('css/theme'));
        copy(__DIR__ . '/../../Stubs/resources/css/app.css', resource_path('css/app.css'));
        $this->info('theme copied successfully.');

        // copy tailwind config
        copy(__DIR__ . '/../../Stubs/tailwind.config.js', base_path('tailwind.config.js'));
        $this->info('tailwind config file copied successfully.');

        // publish generator stubs
        if ((new Filesystem)->exists(base_path('stubs/inertia-builder'))) {
            $path = base_path('stubs/inertia-builder');
            Process::run('rm -rf ' . $path);
        }
        $publishResult = Process::run('php artisan vendor:publish --tag=inertia-builder-stubs');
        if ($publishResult->successful()) {
            echo $publishResult->output();
        } else {
            echo $publishResult->errorOutput();
        }

        $this->info('inertia-builder installed successfully.');
    }
}
