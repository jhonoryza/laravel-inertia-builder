<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;

class TextField extends AbstractField
{
    protected static function getType(): string
    {
        return 'text';
    }
}
