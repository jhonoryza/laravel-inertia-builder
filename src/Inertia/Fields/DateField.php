<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;

class DateField extends AbstractField
{
    protected static function getType(): string
    {
        return 'date';
    }
}
