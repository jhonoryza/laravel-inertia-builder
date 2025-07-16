<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Collection;

trait HasOptions
{
    public array $options = [];

    public function options(array $options): static
    {
        foreach ($options as $option) {
            if (collect($option)->has(['label', 'value']) === false) {
                continue;
            }
            $this->options[] = $option;
        }

        return $this;
    }

    public function loadOptionsUsing(callable $callback): static
    {
        $data = $callback();
        if ($data instanceof Collection) {
            $this->options = $data
                ->map(fn ($item) => [
                    'label' => $item->name,
                    'value' => $item->id,
                ])
                ->toArray();
        }
        if ($data instanceof Builder || $data instanceof EloquentBuilder) {
            $this->options = $data
                ->get()
                ->map(fn ($item) => [
                    'label' => $item->name,
                    'value' => $item->id,
                ])
                ->toArray();
        }
        if (is_array($data)) {
            return $this->options($data);
        }

        return $this;
    }
}
