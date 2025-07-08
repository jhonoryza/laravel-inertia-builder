<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasMultiple;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasOptions;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasRelationship;

class ComboBoxField extends AbstractField
{
    use HasOptions;
    use HasMultiple;
    use HasRelationship;

    protected static function getType(): string
    {
        return 'combobox';
    }

    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'multiple' => $this->multiple,
            'options' => $this->relation ? $this->getRelationshipData() : $this->options,
        ]);
    }
}
