<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;

class MarkdownField extends AbstractField
{
    protected static function getType(): string
    {
        return 'markdown';
    }
}
