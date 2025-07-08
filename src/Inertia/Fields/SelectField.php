<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasMultiple;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasOptions;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasRelationship;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasSearchable;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasServerside;

class SelectField extends AbstractField
{
    use HasOptions;
    use HasMultiple;
    use HasRelationship;
    use HasSearchable;
    use HasServerside;

    protected static function getType(): string
    {
        return 'select';
    }

    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'multiple' => $this->multiple,
            'options' => $this->relation ? $this->getRelationshipData() : $this->options,
            'searchable' => $this->searchable,
            'serverside' => $this->serverside,
        ]);
    }
}
