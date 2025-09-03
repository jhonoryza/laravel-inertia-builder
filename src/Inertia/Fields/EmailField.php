<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasPrefix;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasSuffix;

class EmailField extends AbstractField
{
    use HasPrefix, HasSuffix;

    protected static function getType(): string
    {
        return 'email';
    }

    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'prefix' => $this->getPrefix(),
            'suffix' => $this->getSuffix(),
        ]);
    }
}
