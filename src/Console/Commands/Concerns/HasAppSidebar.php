<?php

namespace Jhonoryza\InertiaBuilder\Console\Commands\Concerns;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Str;

trait HasAppSidebar
{
    protected function addAppSidebar($tableName, $modelName): void
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
}
