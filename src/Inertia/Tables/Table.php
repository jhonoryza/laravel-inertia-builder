<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Tables;

use Jhonoryza\InertiaBuilder\QueryBuilder\Sorts\SortByRelationColumn;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Js;
use Illuminate\Support\Str;
use JsonSerializable;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class Table implements JsonSerializable
{
    protected string $paginationMethod = 'paginate';
    protected string $model;
    protected array $columns = [];
    public array $filters = [] {
        get {
            return $this->filters;
        }
    }
    protected ?string $defaultSort = null;
    protected ?string $defaultSortDir = 'desc';
    protected int $perPage = 10;
    protected array $perPageOptions = [10, 25, 50, 100];
    protected array $actions = [];

    private array $predefinedOperators = [
        '>', '>=', '<', '<=', '=', '!=', '><', '!><',
        '*=', '!*=', '=*', '!=*', '*', '!*',
        'in', 'notIn', 'isSet', 'isNotSet',
    ];

    protected \Closure|null $queryUsingCallback = null;

    public static function make(string $model): static
    {
        return new static($model);
    }

    public function __construct(string $model)
    {
        $this->model = $model;
    }

    /**
     * @param string $method paginate, simple, cursor
     * @throws \Exception
     */
    public function pagination(string $method): static
    {
        if (!in_array($method, ['paginate', 'simple', 'cursor'])) {
            throw new \Exception('Invalid pagination method: ' . $method);
        }
        $this->paginationMethod = $method;
        return $this;
    }

    public function modifyQueryUsing(callable $modifiedQuery): static
    {
        $this->queryUsingCallback = $modifiedQuery;
        return $this;
    }

    public function columns(array $columns): static
    {
        $this->columns = $columns;
        return $this;
    }

    public function filters(array $filters): static
    {
        $this->filters = $filters;
        return $this;
    }

    public function defaultSort(string $column, string $dir = 'desc'): static
    {
        $this->defaultSort = $column;
        $this->defaultSortDir = $dir;
        return $this;
    }

    public function perPage(int $perPage = 10): static
    {
        $this->perPage = $perPage;
        return $this;
    }

    public function perPageOptions(array $options): static
    {
        $this->perPageOptions = $options;
        return $this;
    }

    public function actions(array $actions): static
    {
        $this->actions = $actions;
        return $this;
    }

    public function getActions(): array
    {
        return $this->actions;
    }

    public function get(): LengthAwarePaginator|Paginator|CursorPaginator
    {
        $sort = request()->get('sort', 'id');
        request()->merge([
            'sort' => request()->get('dir', 'desc') === 'desc' ? '-' . $sort : $sort,
        ]);

        $query = QueryBuilder::for($this->model, request())
            ->when(
                $this->queryUsingCallback,
                function (Builder $query) {
                    $call = $this->queryUsingCallback;
                    return $call($query, request());
                }
            )
            ->allowedFilters($this->getAllowedFilters(request()))
            ->allowedSorts($this->getAllowedSorts());

        if ($this->defaultSort) {
            $dir = request()->get('dir', $this->defaultSortDir) === 'desc' ? '-' : '';
            $query
                ->defaultSort($dir . $this->defaultSort);
        }

        $search = request()->get('q');
        if ($search) {
            $query->where(function ($q) use ($search) {
                foreach ($this->columns as $col) {
                    if ($col->searchable) {
                        if ($col->relation && $col->relationKey) {
                            if (str_contains($col->relation, '.')) {
                                $tmp = explode('.', $col->relation);
                                $relationAttribute = end($tmp);
                                $tmp = array_diff($tmp, [$relationAttribute]);
                                $relationName = implode('.', $tmp);
                            }
                            $q->orWhereHas($relationName ?? $col->relation, function ($q) use ($col, $search) {
                                $q->whereRaw("LOWER($col->relationKey) LIKE ?", "%{$search}%");
                            });
                        } else {
                            $q->orWhereRaw("LOWER($col->name) LIKE ?", "%{$search}%");
                        }
                    }
                }
            });
        }

        $query
            ->with(array_filter(array_map(fn($c) => $c->relation, $this->columns)));

        $perPage = request()->input('perPage', $this->perPage);

        if ($this->paginationMethod === 'cursor') {
            $items = $query->cursorPaginate($perPage)
                ->withQueryString();
        } else if ($this->paginationMethod === 'simple') {
            $items = $query->simplePaginate($perPage)
                ->withQueryString();
        } else {
            $items = $query
                ->paginate($perPage)
                ->withQueryString();
        }

        $items = $this->mapRowsWithRenderUsing($items);

        request()->merge([
            'sort' => $sort,
        ]);

        return $items;
    }

    private function mapRowsWithRenderUsing(
        LengthAwarePaginator|Paginator|CursorPaginator $items,
    ): LengthAwarePaginator|Paginator|CursorPaginator
    {
        $columns = $this->columns;
        $items->getCollection()->transform(function ($row) use ($columns) {
            $arr = [];
            /** @var TableColumn $col */
            foreach ($columns as $col) {
                $value = $row[$col->name] ?? null;
                if ($col->renderUsing && is_callable($col->renderUsing)) {
                    $value = call_user_func($col->renderUsing, $value, $row);
                } elseif ($col->relation && $col->relationKey && $col->relationType === 'belongsTo') {
                    if (str_contains($col->relation, '.')) {
                        $tmps = explode('.', $col->relation);
                        $value = $row;
                            foreach ($tmps as $tmp) {
                                $value = $value->{$tmp};
                            }
                        $value = $value->{$col->relationKey} ?? null;
                    } else {
                        $value = $row->{$col->relation}->{$col->relationKey} ?? null;
                    }
                } elseif ($col->relation && $col->relationKey && $col->relationType === 'hasMany') {
                    $value = $row->{$col->relation}->implode($col->relationKey, ', ');
                }
                $arr[$col->name] = $value;
            }
            return $arr;
        });
        return $items;
    }

    public function getColumns(): array
    {
        return array_map(fn($col) => $col->toArray(), $this->columns);
    }

    private function getAllowedSorts(): array
    {
        $allowedSorts = array_map(
            fn($col) => $col->relation ?
                $col->relation . '.' . $col->relationKey
                : $col->name,
            $this->columns
        );

        return collect($allowedSorts)->map(function ($col) {
            if (str_contains($col, '.')) {
                $relation = explode('.', $col)[0];
                $key = explode('.', $col)[1];
                return AllowedSort::custom($col, SortByRelationColumn::make($relation, $key));
            }
            return $col;
        })->toArray();
    }

    private function getAllowedFilters(Request $request): array
    {
        $allowedFilters = [];
        if (!$request->has('filter')) {
            return $allowedFilters;
        }
        foreach (collect($this->filters) as $filter) {
            $key = $filter->field;
            if (!array_key_exists($key, $request->filter)) {
                continue;
            }
            $oldValue = $request->filter[$key];
            $temp = str_contains($oldValue, ':') ? explode(':', $oldValue, 2) : [$oldValue];
            $operator = null;

            if (count($temp) < 1) {
                // fallback does nothing
                $allowedFilters[] = AllowedFilter::callback($key, function () {
                    //
                });
                continue;
            }

            $operator = $temp[0];
            $value = $temp[1] ?? $operator ?? '';

            if (!in_array($operator, $this->predefinedOperators)) {
                // fallback does nothing
                $allowedFilters[] = AllowedFilter::callback($key, function (Builder $query) use ($key, $value) {
                    $query->where($key, $value);
                });
                continue;
            }

            $allowedFilters[] = AllowedFilter::callback($key, function (Builder $query) use ($key, $operator, $value, $filter) {
                if ($filter->queryCallback) {
                    $call = $filter->queryCallback;
                    $call($query, $operator, $value);
                    return;
                }
                // relation query
                if (str_contains($key, '.')) {
                    $tmp = explode('.', $key);
                    $relationAttribute = end($tmp);
                    $tmp = array_diff($tmp, [$relationAttribute]);
                    $relationName = implode('.', $tmp);
                    $query->whereHas(
                        $relationName,
                        function (Builder $query)
                        use ($relationAttribute, $operator, $value, $filter) {
                            $this->filterQuery($query, $relationAttribute, $operator, $value);
                        });
                    return;
                }
                // no relation query
                $this->filterQuery($query, $key, $operator, $value);
            });
        }

        return $allowedFilters;
    }

    private function filterQuery(Builder $query, string $key, string $operator, mixed $value): void
    {
        if ($operator === '><') {
            $tmp = str_contains($value, ',') ? explode(',', $value, 2) : [$value, null];
            $query->whereBetween($key, [$tmp[0], $tmp[1] ?? null]);
            return;
        }
        if ($operator === '!><') {
            $tmp = str_contains($value, ',') ? explode(',', $value, 2) : [$value, null];
            $query->whereNotBetween($key, [$tmp[0], $tmp[1] ?? null]);
            return;
        }
        if ($operator === '*=') {
            $query->whereRaw("LOWER($key) LIKE ?", ["%$value"]);
            return;
        }
        if ($operator === '!*=') {
            $query->whereRaw("LOWER($key) NOT LIKE ?", ["%$value"]);
            return;
        }
        if ($operator === '=*') {
            $query->whereRaw("LOWER($key) LIKE ?", ["$value%"]);
            return;
        }
        if ($operator === '!=*') {
            $query->whereRaw("LOWER($key) NOT LIKE ?", ["$value%"]);
            return;
        }
        if ($operator === '*') {
            $query->whereRaw("LOWER($key) LIKE ?", ["%$value%"]);
            return;
        }
        if ($operator === '!*') {
            $query->whereRaw("LOWER($key) NOT LIKE ?", ["%$value%"]);
            return;
        }
        if ($operator === 'in') {
            $tmp = str_contains($value, ',') ? explode(',', $value) : [$value];
            $query->whereIn($key, is_array($tmp) ? $tmp : [$tmp]);
            return;
        }
        if ($operator === 'notIn') {
            $tmp = str_contains($value, ',') ? explode(',', $value) : [$value];
            $query->whereNotIn($key, is_array($tmp) ? $tmp : [$tmp]);
            return;
        }
        if ($operator === 'isNull') {
            $query->whereNull($key);
            return;
        }
        if ($operator === 'isNotNull') {
            $query->whereNotNull($key);
            return;
        }

        $query->where($key, $operator, $value);
    }

    public function toArray(): array
    {
        $items = $this->get();
        return [
            'items' => $items,
            'filters' => [
                'q' => request()->input('q'),
                'sort' => request()->input('sort'),
                'dir' => request()->input('dir', 'desc'),
                'opt' => $this->filters,
                'filter' => request()->input('filter'),
            ],
            'perPage' => (int)$items->perPage(),
            'perPageOptions' => $this->perPageOptions,
            'columns' => $this->getColumns(),
            'actions' => $this->getActions(),
        ];
    }

    public function jsonSerialize(): mixed
    {
        return $this->toArray();
    }
}
