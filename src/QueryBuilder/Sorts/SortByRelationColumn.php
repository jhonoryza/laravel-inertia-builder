<?php

namespace Jhonoryza\InertiaBuilder\QueryBuilder\Sorts;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;

class SortByRelationColumn implements Sort
{
    protected string $relationPath;

    protected string $column;

    public function __construct(string $relationPath, string $column)
    {
        $this->relationPath = $relationPath;
        $this->column       = $column;
    }

    public function __invoke(Builder $query, $descending, string $property)
    {
        $model            = $query->getModel();
        $relationSegments = explode('.', $this->relationPath);

        $currentModel         = $model;
        $baseTable            = $model->getTable();
        $previousTable        = $baseTable;
        $previousQualifiedKey = "{$baseTable}.{$model->getKeyName()}"; // Usually primary key

        foreach ($relationSegments as $index => $relationName) {
            if (! method_exists($currentModel, $relationName)) {
                throw new \RuntimeException("Relation `{$relationName}` does not exist on model " . get_class($currentModel));
            }

            /** @var Relation $relation */
            $relation = $currentModel->{$relationName}();

            $relatedModel = $relation->getRelated();
            $relatedTable = $relatedModel->getTable();
            $joinAlias    = $relatedTable . '_as_' . $index;

            $foreignKey = method_exists($relation, 'getQualifiedForeignKeyName')
                ? $relation->getQualifiedForeignKeyName()
                : $relation->getQualifiedForeignPivotKeyName();

            $ownerKey = method_exists($relation, 'getQualifiedOwnerKeyName')
                ? $relation->getQualifiedOwnerKeyName()
                : $relation->getQualifiedRelatedPivotKeyName();

            // Simplify keys to unqualified for join
            $foreignKey = $relation->getForeignKeyName();
            $ownerKey   = $relation->getOwnerKeyName();

            $query->leftJoin("{$relatedTable} as {$joinAlias}", "{$previousTable}.{$foreignKey}", '=', "{$joinAlias}.{$ownerKey}");

            // Prepare for next join
            $previousTable = $joinAlias;
            $currentModel  = $relatedModel;
        }

        $query->orderBy("{$previousTable}.{$this->column}", $descending ? 'desc' : 'asc');

        // Avoid duplicate columns from joins
        $query->select("{$baseTable}.*");
    }

    public static function make(string $relationPath, string $column): self
    {
        return new self($relationPath, $column);
    }
}
