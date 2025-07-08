<?php

namespace Jhonoryza\InertiaBuilder\Console\Commands\Concerns;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Str;

trait HasRoute
{
    protected function addRoutes($tableName, $modelName): void
    {
        $webRoutesPath = base_path('routes/web.php');
        $content       = File::get($webRoutesPath);

        $controllerClass  = "App\\Http\\Controllers\\{$modelName}Controller";
        $batchActionRoute = "Route::post('$tableName/actions', [$controllerClass::class, 'actions'])
            ->name('$tableName.actions');";
        $resourceRoute = "Route::resource('$tableName', $controllerClass::class);";

        if (Str::contains($content, "Route::resource('$tableName'")) {
            $this->warn("Routes for $tableName already exist. Skipping.");

            return;
        }

        $authMiddlewareGroup = "Route::middleware(['auth', 'verified'])->group(function () {";
        if (Str::contains($content, $authMiddlewareGroup)) {
            $replacement = $authMiddlewareGroup . "\n" . $batchActionRoute . "\n" . $resourceRoute;
            $content     = Str::replaceFirst($authMiddlewareGroup, $replacement, $content);
        } else {
            $content .= "\n\n" . str_replace('    ', '', $batchActionRoute) . "\n" . str_replace('    ', '', $resourceRoute);
        }

        File::put($webRoutesPath, $content);
        Process::run('./vendor/bin/pint ' . $webRoutesPath);
        $this->info("Routes for $tableName added.");
    }
}
