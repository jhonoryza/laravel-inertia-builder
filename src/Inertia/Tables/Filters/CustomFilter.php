<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Tables\Filters;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasQuery;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Base\AbstractFilter;

class CustomFilter extends AbstractFilter
{
    use HasQuery;

    /**
     * @var string
     */
    protected string $component;

    protected static function getType(): string
    {
        return 'custom';
    }

    public function component(string $component): self
    {
        $this->component = $component;

        return $this;
    }

    protected function getOperators(): array
    {
        return [
            Operator::equals(),
            Operator::notEquals(),
        ];
    }

    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'component' => $this->component ?? null,
        ]);
    }
}
