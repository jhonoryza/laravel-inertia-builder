<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;

class SliderField extends AbstractField
{
    public ?int $min = 0;

    public ?int $max = 10;

    public ?int $step = 1;

    protected static function getType(): string
    {
        return 'slider';
    }

    /**
     * Set the minimum value
     */
    public function min(int $min): static
    {
        $this->min = $min;

        return $this;
    }

    /**
     * Set the maximum value
     */
    public function max(int $max): static
    {
        $this->max = $max;

        return $this;
    }

    /**
     * Set the step value
     */
    public function step(int $step): static
    {
        $this->step = $step;

        return $this;
    }

    /**
     * Convert the field to an array
     */
    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'min'  => $this->min  ?? 0,
            'max'  => $this->max  ?? 100,
            'step' => $this->step ?? 1,
        ]);
    }
}
