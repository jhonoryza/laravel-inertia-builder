<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;

trait HasPlaceholder
{
    protected string|null|Closure $placeholder = null;

    public function placeholder(string|callable $placeholder): static
    {
        $this->placeholder = $placeholder;

        return $this;
    }

    public function getPlaceholder(): ?string
    {
        return is_callable($this->placeholder) ?
            $this->evaluate($this->placeholder) : $this->placeholder;
    }
}
