<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasMultiple;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasPreview;

class FileField extends AbstractField
{
    use HasMultiple;
    use HasPreview;

    public ?array $accept = null;

    protected static function getType(): string
    {
        return 'file';
    }

    /**
     * Set accepted file types
     *
     * @param  array  $types  Array of MIME types or file extensions
     */
    public function accept(array $types): static
    {
        $this->accept = $types;

        return $this;
    }

    /**
     * Convert the field to an array
     */
    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'accept'   => $this->accept,
            'multiple' => $this->getIsMultiple(),
            'preview'  => $this->getPreview(),
        ]);
    }
}
