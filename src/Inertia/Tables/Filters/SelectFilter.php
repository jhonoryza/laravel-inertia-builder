<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Tables\Filters;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasMultiple;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasOptions;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasQuery;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasRelationship;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasSearchable;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasServerside;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Base\AbstractFilter;

class SelectFilter extends AbstractFilter
{
    use HasMultiple;
    use HasOptions;
    use HasQuery;
    use HasRelationship;
    use HasSearchable;
    use HasServerside;

    protected static function getType(): string
    {
        return 'select';
    }

    protected function getOperators(): array
    {
        return [
            Operator::equals(),
            Operator::notEquals(),
            Operator::in(),
            Operator::notIn(),
        ];
    }

    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'multiple'   => $this->getIsMultiple(),
            'options'    => $this->relation ? $this->getRelationshipData() : $this->getOptions(),
            'searchable' => $this->getIsSearchable(),
            'serverside' => $this->getIsServerSide(),
        ]);
    }
}
