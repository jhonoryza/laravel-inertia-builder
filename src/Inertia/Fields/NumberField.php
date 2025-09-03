<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasPrefix;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasSuffix;

class NumberField extends AbstractField
{
    use HasPrefix, HasSuffix;

    protected static function getType(): string
    {
        return 'number';
    }

    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'prefix' => $this->getPrefix(),
            'suffix' => $this->getSuffix(),
        ]);
    }
}
