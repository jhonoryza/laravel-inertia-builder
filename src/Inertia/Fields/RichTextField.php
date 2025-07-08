<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;

class RichTextField extends AbstractField
{
    public ?array $toolbar = [
        'bold',
        'italic',
        'underline',
        'h1',
        'h2',
        'bulletList',
        'orderedList',
        'link',
    ];

    public ?int $minHeight = 250;

    public ?int $maxHeight = null;

    protected static function getType(): string
    {
        return 'rich-text';
    }

    /**
     * Set custom toolbar options
     *
     * @param  array  $options  Array of toolbar options
     */
    public function toolbar(array $options): static
    {
        $this->toolbar = $options;

        return $this;
    }

    /**
     * Set minimum height for the editor
     */
    public function minHeight(int $height): static
    {
        $this->minHeight = $height;

        return $this;
    }

    /**
     * Set maximum height for the editor
     */
    public function maxHeight(int $height): static
    {
        $this->maxHeight = $height;

        return $this;
    }

    /**
     * Convert the field to an array
     */
    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'toolbar'   => $this->toolbar,
            'minHeight' => $this->minHeight ?? 200,
            'maxHeight' => $this->maxHeight,
        ]);
    }
}
