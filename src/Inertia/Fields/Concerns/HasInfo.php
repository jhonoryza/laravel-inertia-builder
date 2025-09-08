<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;

trait HasInfo
{
    protected bool|Closure $asInfo = false;

    public function info(bool|callable $state = true): self
    {
        $this->asInfo = $state;

        return $this;
    }

    public function getInfo(): bool
    {
        return is_callable($this->asInfo) ?
            $this->evaluate($this->asInfo)
            : $this->asInfo;
    }
}
