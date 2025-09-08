<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;

trait HasGrid
{
    protected bool|Closure $hasGrid = false;

    protected string|null|Closure $gridKey = null;

    protected array|int $gridCol = 1;

    public function gridCol(int|array $gridCol): self
    {
        if (is_int($gridCol)) {
            $this->gridCol = ['default' => $gridCol];

            return $this;
        }
        $this->gridCol = $gridCol;

        return $this;
    }

    public function getGridCol(): array|int
    {
        return $this->gridCol;
    }

    public function grid(bool|callable $state = true): self
    {
        $this->hasGrid = $state;

        return $this;
    }

    public function getGrid(): bool
    {
        return is_callable($this->hasGrid) ?
            $this->evaluate($this->hasGrid) : $this->hasGrid;
    }

    public function gridKey(string|null|callable $state): self
    {
        $this->gridKey = $state;

        return $this;
    }

    public function getGridKey(): ?string
    {
        return is_callable($this->gridKey) ?
            $this->evaluate($this->gridKey) : $this->gridKey;
    }
}
