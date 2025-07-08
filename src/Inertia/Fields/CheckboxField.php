<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;

class CheckboxField extends AbstractField
{
    protected static function getType(): string
    {
        return 'checkbox';
    }
}
