<?php

namespace Jhonoryza\InertiaBuilder\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Jhonoryza\InertiaBuilder\Console\Commands\Concerns\HasAppToaster;

class InstallCommand extends Command
{
    use HasAppToaster;
    use InstallForReactTrait;
    use InstallForVueTrait;

    protected $signature = 'inertia-builder:install';

    protected $description = 'Install inertia builder required dependencies';

    public function handle(): void
    {
        $filePath = base_path('package.json');
        $content  = File::get($filePath);

        if (Str::contains($content, 'vue')) {
            $this->installForVue();

            return;
        } elseif (Str::contains($content, 'react')) {
            $this->installForReact();

            return;
        }

        $this->info('unsupported stack');
    }
}
