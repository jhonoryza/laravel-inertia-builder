<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasOptions;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasRelationship;

class RadioField extends AbstractField
{
    use HasOptions;
    use HasRelationship;

    protected static function getType(): string
    {
        return 'radio';
    }

    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'options' => $this->relation ? $this->getRelationshipData() : $this->options,
        ]);
    }
}
