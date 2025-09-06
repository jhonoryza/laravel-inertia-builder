<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;

trait HasLabel
{
    protected string|Closure $label;

    public function label(string|callable $label): static
    {
        $this->label = $label;

        return $this;
    }

    public function getLabel(): string
    {
        return is_callable($this->label) ?
            $this->evaluate($this->label) : $this->label;
    }
}
