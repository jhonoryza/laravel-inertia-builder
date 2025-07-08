<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

use Illuminate\Database\Eloquent\Builder;

trait HasRelationship
{
    public ?\Closure $relation = null;

    protected ?string $relationTitle = null;

    protected ?string $relationKey = null;

    protected ?string $dependencyField = null;

    protected ?string $dependencyForeignKey = null;

    protected mixed $dependencyValue = null;

    public function dependsOn(string $dependencyField, ?string $foreignKey = null, mixed $value = null): self
    {
        $this->dependencyField      = $dependencyField;
        $this->dependencyForeignKey = $foreignKey ?? $dependencyField; // Infer foreign key if not provided
        $this->dependencyValue      = $value;

        return $this;
    }

    public function relationship(
        string $modelClass,
        string $titleAttr,
        string $keyAttr = 'id',
        ?callable $modifyQueryUsing = null,
    ): static {
        $this->relationTitle = $titleAttr;
        $this->relationKey   = $keyAttr;
        $this->relation      = function () use ($modelClass, $modifyQueryUsing) {
            $query = (new $modelClass)::query();

            if ($modifyQueryUsing) {
                $modifyQueryUsing($query);
            } elseif ($this->dependencyField) {
                $dependencyValue = request()->input($this->dependencyField) ?? $this->dependencyValue;

                if (blank($dependencyValue)) {
                    return $query->where($this->dependencyForeignKey, null);
                }

                $key = $this->dependencyForeignKey;
                if (str_contains($key, '.')) {
                    $tmp               = explode('.', $key);
                    $relationAttribute = end($tmp);
                    $tmp               = array_diff($tmp, [$relationAttribute]);
                    $relationName      = implode('.', $tmp);
                    $query->whereHas(
                        $relationName,
                        function (Builder $query) use ($relationAttribute, $dependencyValue) {
                            $query->where($relationAttribute, $dependencyValue);
                        }
                    );
                } else {
                    $query->where($key, $dependencyValue);
                }
            }

            // \Log::info($modelClass);
            // \Log::info($query->toSql());
            // \Log::info($query->getBindings()[0] ?? '');
            return $query;
        };

        return $this;
    }

    public function getRelationshipData(): array
    {

        return $this->relation ?
            call_user_func($this->relation)
                ->get()
                ->map(function ($item) {
                    return [
                        'label' => $item->{$this->relationTitle},
                        'value' => $item->{$this->relationKey},
                    ];
                })
                ->toArray()
            : [];
    }
}
