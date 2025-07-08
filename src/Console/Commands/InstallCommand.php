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
        $command = 'npm install ' . implode(' ', $packages);
        $result = Process::run($command);

        if ($result->successful()) {
            echo "NPM Packages installed successfully.\n";
            echo $result->output();
        } else {
            echo "NPM Packages Installation failed:\n";
            echo $result->errorOutput();
        }

        // copy inertia builder components
        (new Filesystem)->copyDirectory(__DIR__ . '/../../Stubs/resources/js/components/builder', resource_path('js/Components/builder'));
        (new Filesystem)->copyDirectory(__DIR__ . '/../../Stubs/resources/js/components/custom-fields', resource_path('js/Components/custom-fields'));
        (new Filesystem)->copyDirectory(__DIR__ . '/../../Stubs/resources/js/components/custom-filters', resource_path('js/Components/custom-filters'));
        $this->info('component copied successfully.');

        // copy inertia builder pages
        (new Filesystem)->copyDirectory(__DIR__ . '/../../Stubs/resources/js/pages/builder', resource_path('js/pages/builder'));
        $this->info('page copied successfully.');

        // copy datatable and field builder type
        copy(__DIR__ . '/../../Stubs/resources/js/types/datatable.ts', resource_path('js/types/datatable.ts'));
        copy(__DIR__ . '/../../Stubs/resources/js/types/field-builder.ts', resource_path('js/types/field-builder.ts'));
        copy(__DIR__ . '/../../Stubs/resources/js/app-field-builder.d.ts', resource_path('js/app-field-builder.d.ts'));
        $this->info('datatable & field builder type copied successfully.');

        // copy css themes
        (new Filesystem)->copyDirectory(__DIR__ . '/../../Stubs/resources/css/theme', resource_path('css/theme'));
        $this->info('theme copied successfully.');

        // copy tailwind config
        copy(__DIR__ . '/../../Stubs/tailwind.config.js', base_path('tailwind.config.js'));
        $this->info('tailwind config file copied successfully.');

        $this->info('inertia-builder installed successfully.');
    }
}