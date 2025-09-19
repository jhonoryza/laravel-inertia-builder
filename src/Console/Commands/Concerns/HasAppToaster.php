<?php

namespace Jhonoryza\InertiaBuilder\Console\Commands\Concerns;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Str;

trait HasAppToaster
{
    protected function addToasterReactComponent(): void
    {
        $filePath = base_path('resources/js/layouts/app-layout.tsx');
        $content  = File::get($filePath);

        $addition       = "<Toaster theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'} />";
        $importAddition = "import { Toaster } from '@/components/ui/sonner';";

        if (Str::contains($content, $addition) || Str::contains($content, $importAddition)) {
            $this->warn('toaster component already exist. Skipping.');

            return;
        }

        $breadcumbs = '<AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>';

        if (Str::contains($content, $breadcumbs)) {
            $replacement = $breadcumbs . PHP_EOL . $addition;
            $content     = Str::replaceFirst($breadcumbs, $replacement, $content);
        }

        $importContent = "import { type ReactNode } from 'react';";
        if (Str::contains($content, $importContent)) {
            $replacement = $importContent . PHP_EOL . $importAddition;
            $content     = Str::replaceFirst($importContent, $replacement, $content);
        }

        File::put($filePath, $content);
        Process::run("./node_modules/.bin/prettier --write $filePath");
        $this->info('toaster component added.');
    }

    protected function addToasterVueComponent(): void
    {
        $filePath = base_path('resources/js/layouts/AppLayout.vue');
        $content  = File::get($filePath);

        $addition       = '<Toaster :theme="theme" />';
        $importAddition = "import { Toaster } from '@/components/ui/sonner';
        import 'vue-sonner/style.css';
        import { computed } from 'vue';";
        $scriptAddition = "const theme = computed(() =>
            document.documentElement.classList.contains('dark') ? 'dark' : 'light'
        );";

        if (Str::contains($content, 'Toaster')) {
            $this->warn('toaster component already exist. Skipping.');

            return;
        }

        $breadcumbs = '<AppLayout :breadcrumbs="breadcrumbs">';

        if (Str::contains($content, $breadcumbs)) {
            $replacement = $breadcumbs . PHP_EOL . $addition;
            $content     = Str::replaceFirst($breadcumbs, $replacement, $content);
        }

        $importContent = "import AppLayout from '@/layouts/app/AppSidebarLayout.vue';";
        if (Str::contains($content, $importContent)) {
            $replacement = $importContent . PHP_EOL . $importAddition;
            $content     = Str::replaceFirst($importContent, $replacement, $content);
        }

        $scriptContent = '</script>';
        if (Str::contains($content, $scriptContent)) {
            $replacement = $scriptAddition . PHP_EOL . $scriptContent;
            $content     = Str::replaceFirst($scriptContent, $replacement, $content);
        }

        File::put($filePath, $content);
        Process::run("./node_modules/.bin/prettier --write $filePath");
        $this->info('toaster component added.');
    }

    protected function addToasterMessageToInertiaMiddleware(): void
    {
        $filePath = base_path('app/Http/Middleware/HandleInertiaRequests.php');
        $content  = File::get($filePath);

        $flash    = "'flash'";
        $addition = "'flash' => [
            'success' => fn() => \$request->session()->get('success'),
            'error' => fn() => \$this->getErrMessage(\$request),
            'link' => fn () => \$request->session()->get('link'),
        ],";

        $funcAddition = "private function getErrMessage(Request \$request): string
        {
            /** @var ViewErrorBag \$errors */
            \$errors = \$request->session()->get('errors');
            if (\$errors) {
                return collect(\$errors->getMessages())->flatten()->implode(', ');
            }
            return '';
        }";

        if (Str::contains($content, $flash)) {
            $this->warn('toaster message already exist. Skipping.');

            return;
        }

        $specific = '];
    }';

        if (Str::contains($content, $specific)) {
            $replacement = $addition . PHP_EOL . $specific . PHP_EOL . $funcAddition;
            $content     = Str::replaceFirst($specific, $replacement, $content);
        }

        File::put($filePath, $content);
        Process::run("./vendor/bin/pint $filePath");
        $this->info('toaster message added.');
    }
}
