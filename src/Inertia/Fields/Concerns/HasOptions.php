<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Collection;
use Jhonoryza\InertiaBuilder\Inertia\Forms\Get;

trait HasOptions
{
    public array|Closure|Collection|Builder|EloquentBuilder $options = [];

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
        $this->options = $callback;

        return $this;
    }

    public function evaluateOptions(): static
    {
        $data = is_callable($this->options) ?
            $this->evaluate($this->options, [
                'options' => $this->options,
                'get'     => new Get($this),
                'model'   => $this->form?->getModel(),
            ]) : $this->options;

        if ($data instanceof Collection) {
            $this->options = $data
                ->map(fn ($item) => [
                    'label' => $item->name,
                    'value' => $item->id,
                ])
                ->toArray();
            return $this;
        }
        if ($data instanceof Builder || $data instanceof EloquentBuilder) {
            $this->options = $data
                ->get()
                ->map(fn ($item) => [
                    'label' => $item->name,
                    'value' => $item->id,
                ])
                ->toArray();
            return $this;
        }

        return $this;
    }

    public function getOptions(): array
    {
        $this->evaluateOptions();

        return $this->options;
    }
}
