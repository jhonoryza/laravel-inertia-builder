<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Tables\Filters;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasFlatpickrConfig;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasQuery;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Base\AbstractFilter;

class DateFilter extends AbstractFilter
{
    use HasFlatpickrConfig;
    use HasQuery;

    public static function make(string $field): static
    {
        return parent::make($field)
            ->date();
    }

    protected static function getType(): string
    {
        return 'date';
    }

    protected function getOperators(): array
    {
        return [
            Operator::equals(),
            Operator::notEquals(),
            Operator::greater(),
            Operator::greaterAndEqual(),
            Operator::less(),
            Operator::lessAndEqual(),
            Operator::between(),
            Operator::notBetween(),
        ];
    }

    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'mode'       => $this->mode,
            'config'     => $this->config,
            'withTime'   => $this->withTime,
            'utcConvert' => $this->utcConvert,
        ]);
    }
}
