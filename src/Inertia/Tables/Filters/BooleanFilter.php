<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Tables\Filters;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasQuery;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Base\AbstractFilter;

class BooleanFilter extends AbstractFilter
{
    use HasQuery;

    protected static function getType(): string
    {
        return 'boolean';
    }

    protected function getOperators(): array
    {
        return [];
    }
}
