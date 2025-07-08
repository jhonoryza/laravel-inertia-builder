<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;

class ToggleField extends AbstractField
{
    protected static function getType(): string
    {
        return 'toggle';
    }
}
