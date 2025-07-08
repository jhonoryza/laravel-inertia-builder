<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;

class TextareaField extends AbstractField
{
    public ?int $cols = 20;

    public ?int $rows = 2;

    protected static function getType(): string
    {
        return 'textarea';
    }

    /**
     * Set the number of columns
     */
    public function cols(int $cols): static
    {
        $this->cols = $cols;

        return $this;
    }

    /**
     * Set the number of rows
     */
    public function rows(int $rows): static
    {
        $this->rows = $rows;

        return $this;
    }

    /**
     * Convert the field to an array
     */
    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'cols' => $this->cols,
            'rows' => $this->rows,
        ]);
    }
}
