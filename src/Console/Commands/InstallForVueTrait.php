<?php

namespace Jhonoryza\InertiaBuilder\Console\Commands;

use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Str;

trait InstallForVueTrait
{
    public function installForVue(): void
    {
        $this->info('Installing inertia builder...');
        $packages = [
            '@tailwindcss/typography@^0.5.16',
            '@tiptap/extension-heading@^3.4.2',
            '@tiptap/extension-image@^3.4.2',
            '@tiptap/extension-link@^3.4.2',
            '@tiptap/extension-text-align@^3.4.2',
            '@tiptap/extension-underline@^3.4.2',
            '@tiptap/starter-kit@^3.4.2',
            '@tiptap/vue-3@^3.4.2',
            'date-fns@^4.1.0',
            'flatpickr@^4.6.13',
            'marked@^16.0.0',
            'next-themes@^0.4.6',
            'sonner@^2.0.5',
            'vue-sonner@^2.0.8',
            'ziggy-js@^2.5.3',
            '@types/ziggy-js@^1.8.0',
            'pinia@^3.0.3',
            '@fontsource/nunito-sans@^5.2.6',
            '@internationalized/date@^3.9.0',
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
        $npxResult = Process::run('npx shadcn-vue@latest add -y -o select calendar command pagination popover radio-group slider sonner switch table tabs textarea alert-dialog');
        if ($npxResult->successful()) {
            $this->info('required shadcn ui added successfully.');
            echo $npxResult->output();
        } else {
            $this->error('required shadcn ui failed to install.');
            echo $npxResult->errorOutput();
        }

        // copy app blade
        copy(__DIR__ . '/../../Stubs/vue/resources/views/app.blade.php', resource_path('views/app.blade.php'));

        // copy inertia builder components
        (new Filesystem)->copyDirectory(__DIR__ . '/../../Stubs/vue/resources/js/components/builder', resource_path('js/components/builder'));
        $this->info('component copied successfully.');

        // copy inertia lib
        (new Filesystem)->copyDirectory(__DIR__ . '/../../Stubs/vue/resources/js/lib', resource_path('js/lib'));
        $this->info('lib copied successfully.');

        // copy inertia builder pages
        (new Filesystem)->copyDirectory(__DIR__ . '/../../Stubs/vue/resources/js/pages/builder', resource_path('js/pages/builder'));
        $this->info('page copied successfully.');

        // copy datatable and field builder type
        copy(__DIR__ . '/../../Stubs/vue/resources/js/types/form.ts', resource_path('js/types/form.ts'));
        copy(__DIR__ . '/../../Stubs/vue/resources/js/types/datatable.ts', resource_path('js/types/datatable.ts'));
        copy(__DIR__ . '/../../Stubs/vue/resources/js/types/field-builder.ts', resource_path('js/types/field-builder.ts'));
        $this->info('datatable & field builder type copied successfully.');

        // copy stores
        (new Filesystem)->copyDirectory(__DIR__ . '/../../Stubs/vue/resources/js/stores', resource_path('js/stores'));
        $this->info('stores copied successfully.');

        // copy css themes
        (new Filesystem)->copyDirectory(__DIR__ . '/../../Stubs/vue/resources/css/theme', resource_path('css/theme'));
        copy(__DIR__ . '/../../Stubs/vue/resources/css/app.css', resource_path('css/app.css'));
        $this->info('theme copied successfully.');

        // copy tailwind config
        copy(__DIR__ . '/../../Stubs/vue/tailwind.config.js', base_path('tailwind.config.js'));
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

        $this->addToasterVueComponent();
        $this->addToasterMessageToInertiaMiddleware();

        $this->updateAppTs();
        $this->updateSsrTs();

        $this->info('inertia-builder installed successfully.');
    }

    private function updateAppTs(): void
    {
        $filePath = base_path('resources/js/app.ts');
        $content  = File::get($filePath);
        if (Str::contains($content, 'pinia')) {
            $this->warn('app.ts updated. Skipping.');

            return;
        }

        $importAdd = "import { createPinia } from 'pinia';
        const pinia = createPinia();";
        $useAdd = '.use(pinia)';

        $import = "const appName = import.meta.env.VITE_APP_NAME || 'Laravel';";
        if (Str::contains($content, $import)) {
            $replacement = $importAdd . PHP_EOL . $import;
            $content     = Str::replaceFirst($import, $replacement, $content);
        }

        $use = '.use(plugin)';
        if (Str::contains($content, $use)) {
            $replacement = $useAdd . PHP_EOL . $use;
            $content     = Str::replaceFirst($use, $replacement, $content);
        }

        File::put($filePath, $content);
        Process::run("./node_modules/.bin/prettier --write $filePath");
        $this->info('app.ts updated.');
    }

    private function updateSsrTs(): void
    {
        $filePath = base_path('resources/js/ssr.ts');
        $content  = File::get($filePath);
        if (Str::contains($content, 'pinia')) {
            $this->warn('ssr.ts updated. Skipping.');

            return;
        }

        $importAdd = "import { createPinia } from 'pinia';
        const pinia = createPinia();";
        $useAdd = '.use(pinia)';

        $import = "const appName = import.meta.env.VITE_APP_NAME || 'Laravel';";
        if (Str::contains($content, $import)) {
            $replacement = $importAdd . PHP_EOL . $import;
            $content     = Str::replaceFirst($import, $replacement, $content);
        }

        $use = '.use(plugin)';
        if (Str::contains($content, $use)) {
            $replacement = $useAdd . $use;
            $content     = Str::replaceFirst($use, $replacement, $content);
        }

        File::put($filePath, $content);
        Process::run("./node_modules/.bin/prettier --write $filePath");
        $this->info('ssr.ts updated.');
    }
}
