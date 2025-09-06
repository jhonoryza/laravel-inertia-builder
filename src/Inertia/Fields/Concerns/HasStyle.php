<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Closure;

trait HasStyle
{
    protected bool|Closure $isInline = false;

    protected ?string $mergeClass = null;

    protected array $columnSpan = [];

    protected array $columnOrder = [];

    public function inline(bool|callable $state = true): static
    {
        $this->isInline = $state;

        return $this;
    }

    public function mergeClass(string $class): static
    {
        $this->mergeClass = $class;

        return $this;
    }

    public function columnSpan(array $columnSpan): static
    {
        $this->columnSpan = $columnSpan;

        return $this;
    }

    public function columnOrder(array $columnOrder): static
    {
        $this->columnOrder = $columnOrder;

        return $this;
    }

    public function getIsInline(): bool
    {
        return is_callable($this->isInline) ?
            $this->evaluate($this->isInline) : $this->isInline;
    }

    public function getMergeClass(): ?string
    {
        return $this->mergeClass;
    }

    public function getColumnSpan(): array
    {
        return $this->columnSpan;
    }

    public function getColumnOrder(): array
    {
        return $this->columnOrder;
    }
}
