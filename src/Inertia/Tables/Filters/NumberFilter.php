<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Tables\Filters;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasQuery;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Base\AbstractFilter;

class NumberFilter extends AbstractFilter
{
    use HasQuery;

    protected static function getType(): string
    {
        return 'number';
    }

    protected function getOperators(): array
    {
        return [
            Operator::equals(),
            Operator::greater(),
            Operator::greaterAndEqual(),
            Operator::less(),
            Operator::lessAndEqual(),
            Operator::between(),
            Operator::notBetween(),
        ];
    }
}
