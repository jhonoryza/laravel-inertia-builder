<?php

namespace Jhonoryza\InertiaBuilder\Console\Commands\Concerns;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Str;

trait HasAppSidebar
{
    private function addReactAppSidebar($tableName): void
    {
        $filePath = base_path('resources/js/components/app-sidebar.tsx');
        $content  = File::get($filePath);

        $title = Str::of($tableName)
            ->replace('-', ' ')
            ->replace('_', ' ')
            ->title();
        $addition = "{
            title: '$title',
            href: '/$tableName',
            icon: LayoutGrid,
        },";

        if (Str::contains($content, "href: '/$tableName'")) {
            $this->warn("app sidebar for $tableName already exist. Skipping.");

            return;
        }

        $specificContent = '];

const footerNavItems: NavItem[] = [';

        if (Str::contains($content, $specificContent)) {
            $replacement = $addition . PHP_EOL . $specificContent;
            $content     = Str::replaceFirst($specificContent, $replacement, $content);
        }

        File::put($filePath, $content);
        Process::run("./node_modules/.bin/prettier --write $filePath");
        $this->info("App Sidebar for $tableName added.");
    }

    private function addVueAppSidebar($tableName): void
    {
        $filePath = base_path('resources/js/components/AppSidebar.vue');
        $content  = File::get($filePath);

        $title = Str::of($tableName)
            ->replace('-', ' ')
            ->replace('_', ' ')
            ->title();
        $addition = "{
            title: '$title',
            href: '/$tableName',
            icon: LayoutGrid,
        },";

        if (Str::contains($content, "href: '/$tableName'")) {
            $this->warn("app sidebar for $tableName already exist. Skipping.");

            return;
        }

        $specificContent = '];

const footerNavItems: NavItem[] = [';

        if (Str::contains($content, $specificContent)) {
            $replacement = $addition . PHP_EOL . $specificContent;
            $content     = Str::replaceFirst($specificContent, $replacement, $content);
        }

        File::put($filePath, $content);
        Process::run("./node_modules/.bin/prettier --write $filePath");
        $this->info("App Sidebar for $tableName added.");
    }

    protected function addAppSidebar($tableName): void
    {
        $filePath = base_path('package.json');
        $content  = File::get($filePath);

        if (Str::contains($content, 'vue')) {
            $this->addVueAppSidebar($tableName);
        } elseif (Str::contains($content, 'react')) {
            $this->addReactAppSidebar($tableName);
        }
    }
}
