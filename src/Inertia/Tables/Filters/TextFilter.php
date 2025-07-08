<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Tables\Filters;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasQuery;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Base\AbstractFilter;

class TextFilter extends AbstractFilter
{
    use HasQuery;

    protected static function getType(): string
    {
        return 'text';
    }

    protected function getOperators(): array
    {
        return [
            Operator::contains(),
            Operator::notContains(),
            Operator::equals(),
            Operator::notEquals(),
            Operator::startsWith(),
            Operator::notStartsWith(),
            Operator::endsWith(),
            Operator::notEndsWith(),
        ];
    }
}
