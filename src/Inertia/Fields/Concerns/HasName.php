<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

trait HasName
{
    protected string $name;

    public function name($name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }
}
