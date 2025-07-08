<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;

class FileField extends AbstractField
{
    public ?array $accept = null;
    public bool $multiple = false;

    protected static function getType(): string
    {
        return 'file';
    }

    /**
     * Set accepted file types
     * @param array $types Array of MIME types or file extensions
     */
    public function accept(array $types): static
    {
        $this->accept = $types;
        return $this;
    }

    /**
     * Allow multiple file uploads
     */
    public function multiple(bool $multiple = true): static
    {
        $this->multiple = $multiple;
        return $this;
    }

    /**
     * Convert the field to an array
     */
    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'accept' => $this->accept,
            'multiple' => $this->multiple,
        ]);
    }
}
