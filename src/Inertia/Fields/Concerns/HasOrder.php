<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;

trait HasOrder
{
    protected int|Closure $order = 0;

    public function order(int|callable $order): self
    {
        $this->order = $order;

        return $this;
    }

    public function getOrder(): int
    {
        return is_callable($this->order) ?
            $this->evaluate($this->order) : $this->order;
    }
}
