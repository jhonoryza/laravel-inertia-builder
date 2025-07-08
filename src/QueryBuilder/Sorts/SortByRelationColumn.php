<?php

namespace Jhonoryza\InertiaBuilder\QueryBuilder\Sorts;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;

class SortByRelationColumn implements Sort
{
    protected string $relation;

    protected string $column;

    public function __construct(string $relation, string $column)
    {
        $this->relation = $relation;
        $this->column   = $column;
    }

    public function __invoke(Builder $query, $descending, string $property)
    {
        $model = $query->getModel();

        if (! method_exists($model, $this->relation)) {
            throw new \RuntimeException("Relation `{$this->relation}` does not exist on model " . get_class($model));
        }

        $relation     = $model->{$this->relation}();
        $relatedTable = $relation->getRelated()->getTable();
        $foreignKey   = $relation->getQualifiedForeignKeyName(); // posts.author_id
        $ownerKey     = $relation->getOwnerKeyName(); // usually id

        $query->join($relatedTable, $foreignKey, '=', "{$relatedTable}.{$ownerKey}")
            ->orderBy("{$relatedTable}.{$this->column}", $descending ? 'desc' : 'asc')
            ->select("{$model->getTable()}.*");
    }

    public static function make(string $relation, string $column): self
    {
        return new self($relation, $column);
    }
}
