<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

trait HasServerside
{
    protected bool $serverside = false;

    public function serverside($state = true): self
    {
        $this->serverside = $state;

        return $this;
    }
}
