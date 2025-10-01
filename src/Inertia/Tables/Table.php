<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Tables;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Jhonoryza\InertiaBuilder\QueryBuilder\Sorts\SortByRelationColumn;
use JsonSerializable;
use Rap2hpoutre\FastExcel\FastExcel;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class Table implements JsonSerializable
{
    /**
     * the pagination method that will be used
     * available: simple, paginate, cursor
     */
    protected string $paginationMethod = 'simple';

    protected bool $disablePagination = false;

    /**
     * this will be used when partial reload happen
     * you need to change this value when using multiple table
     * in a single page
     */
    protected string $name = 'data';

    /**
     * table title used in breadcumb and table header
     */
    protected ?string $title = null;

    /**
     * this is used for route resolver in AppDatatable
     * route(baseRoute + .index)
     */
    protected ?string $baseRoute = null;

    /**
     * this is used for route resolver in AppDatatable
     * baseRoute config will not be used
     * must be full url ex: route('posts.index')
     */
    protected ?string $tableRoute = null;

    /**
     * this is used for route resolver in AppDataTableToolbar
     * used for actions route
     * default using baseRoute + .actions
     */
    protected ?string $actionRoute = null;

    /**
     * this is required to be change when using
     * multiple table in a single page
     */
    protected string $prefix = '';

    protected string $model;

    protected array $columns = [];

    protected array $filters = [];

    protected bool $canEdit = true;

    protected bool $canView = true;

    protected bool $canDelete = true;

    protected bool $canForceDelete = true;

    protected bool $canRestore = true;

    protected string $sortByParam = 'sort';

    protected string $sortDirParam = 'dir';

    protected string $searchParam = 'q';

    protected string $perPageParam = 'perPage';

    protected string $pageParam = 'page';

    protected string $filterParam = 'filter';

    protected ?string $defaultSort = null;

    protected ?string $defaultSortDir = 'asc';

    protected int $perPage = 10;

    protected array $perPageOptions = [10, 25, 50, 100];

    protected array $actions = [];

    private array $predefinedOperators = [
        '>', '>=', '<', '<=', '=', '!=', '><', '!><',
        '*=', '!*=', '=*', '!=*', '*', '!*',
        'in', 'notIn', 'isSet', 'isNotSet',
    ];

    protected ?\Closure $queryUsingCallback = null;

    protected ?\Closure $baseQuery = null;

    public static function make(string $model): static
    {
        return new static($model);
    }

    public function __construct(string $model)
    {
        $this->model     = $model;
        $this->prefix    = Str::snake(class_basename($model));
        $this->baseRoute = $this->baseRoute == null ? Str::plural(Str::snake(class_basename($model))) : $this->baseRoute;
        $this->title     = $this->title     == null ? Str::headline(class_basename($model)) : $this->title;
    }

    public function name(string $name = 'data'): static
    {
        $this->name = $name;

        return $this;
    }

    public function title(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function dataName(string $name = 'data'): static
    {
        $this->name = $name;

        return $this;
    }

    public function baseRoute(string $base): static
    {
        $this->baseRoute = $base;

        return $this;
    }

    public function tableRoute(string $tableRoute): static
    {
        $this->tableRoute = $tableRoute;

        return $this;
    }

    public function actionRoute(string $actionRoute): static
    {
        $this->actionRoute = $actionRoute;

        return $this;
    }

    public function prefix(string $prefix): static
    {
        $this->prefix = $prefix;

        return $this;
    }

    public function getSortByParam(): string
    {
        return $this->prefix . $this->sortByParam;
    }

    public function getSortDirParam(): string
    {
        return $this->prefix . $this->sortDirParam;
    }

    public function getSearchParam(): string
    {
        return $this->prefix . $this->searchParam;
    }

    public function getPageParam(): string
    {
        return $this->prefix . $this->pageParam;
    }

    public function getPerPageParam(): string
    {
        return $this->prefix . $this->perPageParam;
    }

    public function getFilterParam(): string
    {
        return $this->prefix . $this->filterParam;
    }

    /**
     * @param  string  $method  paginate, simple, cursor
     *
     * @throws \Exception
     */
    public function pagination(string $method): static
    {
        if (! in_array($method, ['paginate', 'simple', 'cursor'])) {
            throw new \Exception('Invalid pagination method: ' . $method);
        }
        $this->paginationMethod = $method;

        return $this;
    }

    public function simplePaginate(): static
    {
        $this->paginationMethod = 'simple';

        return $this;
    }

    public function cursorPaginate(): static
    {
        $this->paginationMethod = 'cursor';

        return $this;
    }

    public function standardPaginate(): static
    {
        $this->paginationMethod = 'paginate';

        return $this;
    }

    public function disablePagination($state = true): static
    {
        $this->disablePagination = $state;

        return $this;
    }

    public function modifyQueryUsing(callable $modifiedQuery): static
    {
        $this->queryUsingCallback = $modifiedQuery;

        return $this;
    }

    public function defineBaseQuery(callable $baseQuery): static
    {
        $this->baseQuery = $baseQuery;

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

    public function defaultSort(string $column, string $dir = 'asc'): static
    {
        $this->defaultSort    = $column;
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

    public function canEdit($state = true): static
    {
        $this->canEdit = $state;

        return $this;
    }

    public function canView($state = true): static
    {
        $this->canView = $state;

        return $this;
    }

    public function canDelete($state = true): static
    {
        $this->canDelete = $state;

        return $this;
    }

    public function canForceDelete($state = true): static
    {
        $this->canForceDelete = $state;

        return $this;
    }

    public function canRestore($state = true): static
    {
        $this->canRestore = $state;

        return $this;
    }

    protected function evaluate(mixed $value, array $parameters = [])
    {
        if (! $value instanceof \Closure) {
            return $value;
        }

        $reflector = new \ReflectionFunction($value);
        $args      = [];

        foreach ($reflector->getParameters() as $param) {
            $type = $param->getType()?->getName();
            $name = $param->getName();

            // Inject based on name
            if (array_key_exists($name, $parameters)) {
                $args[] = $parameters[$name];

                continue;
            }

            // Inject based on type-hint
            if ($type && array_key_exists($type, $parameters)) {
                $args[] = $parameters[$type];

                continue;
            }

            // if didn't found, try default value
            if ($param->isDefaultValueAvailable()) {
                $args[] = $param->getDefaultValue();

                continue;
            }

            // fallback null
            $args[] = null;
        }

        return $value(...$args);
    }

    /**
     * get datatable data in pagination format
     */
    private function get(): LengthAwarePaginator|Paginator|CursorPaginator|Collection
    {
        $sort = request()->get($this->getSortByParam(), $this->defaultSort);
        request()->merge([
            $this->getSortByParam() => request()->get($this->getSortDirParam(), $this->defaultSortDir) === 'desc' ? '-' . $sort : $sort,
        ]);

        if ($this->baseQuery == null) {
            config()->set('query-builder.parameters.filter', $this->getFilterParam());
        }

        $query = $this->baseQuery == null ?
            QueryBuilder::for($this->model, request())
                ->when(
                    $this->queryUsingCallback,
                    function (Builder $query) {
                        return $this->evaluate($this->queryUsingCallback, [
                            'query'   => $query,
                            'request' => request(),
                        ]);
                    }
                )
                ->allowedFilters($this->getAllowedFilters(request()))
                ->allowedSorts($this->getAllowedSorts())
                ->with(array_filter(array_map(fn ($c) => $c->relation, $this->columns)))
            : $this->evaluate($this->baseQuery, [
                'request' => request(),
            ]);

        /**
         * default sort handler
         */
        if ($this->defaultSort) {
            $dirStr = request()->get($this->getSortDirParam(), $this->defaultSortDir);
            $dir    = $dirStr === 'desc' ? '-' : '';
            if ($this->baseQuery == null) {
                $query->defaultSort($dir . $this->defaultSort);
            } else {
                $query->orderBy($this->defaultSort, $dirStr);
            }
        }

        /**
         * search handler
         */
        $search = request()->get($this->getSearchParam());
        if ($search) {
            $query->where(function ($q) use ($search) {
                foreach ($this->columns as $col) {
                    if (! $col->searchable) {
                        continue;
                    }
                    if ($col->relation && $col->relationKey) {
                        if (str_contains($col->relation, '.')) {
                            [$relationName, $relationAttribute] = extractRelation($col->relation);
                            $q->orWhereHas($relationName, function ($q) use ($relationAttribute, $search) {
                                $q->whereRaw("LOWER($relationAttribute) LIKE ?", "%{$search}%");
                            });

                            continue;
                        }
                        $q->orWhereHas($col->relation, function ($q) use ($col, $search) {
                            $q->whereRaw("LOWER($col->relationKey) LIKE ?", "%{$search}%");
                        });

                        continue;
                    }
                    if (str_contains($col->name, '.')) {
                        [$relationName, $relationAttribute] = extractRelation($col->name);
                        $q->orWhereHas($relationName, function ($q) use ($relationAttribute, $search) {
                            $q->whereRaw("LOWER($relationAttribute) LIKE ?", "%{$search}%");
                        });

                        continue;
                    }
                    $q->orWhereRaw("LOWER($col->name) LIKE ?", "%{$search}%");
                }
            });
        }

        if ($this->disablePagination == false) {
            /**
             * pagination handler
             */
            $perPage = request()->input($this->getPerPageParam(), $this->perPage);

            if ($this->paginationMethod === 'cursor') {
                $items = $query->cursorPaginate(perPage: $perPage, cursorName: $this->getPageParam())
                    ->withQueryString();
            } elseif ($this->paginationMethod === 'simple') {
                $items = $query->simplePaginate(perPage: $perPage, pageName: $this->getPageParam())
                    ->withQueryString();
            } else {
                $items = $query
                    ->paginate(perPage: $perPage, pageName: $this->getPageParam())
                    ->withQueryString();
            }
        } else {
            $items = $query
                ->get();
        }

        /**
         * datatable rendering handler
         */
        $items = $this->mapRowsWithRenderUsing($items);

        request()->merge([
            $this->getSortByParam() => $sort,
        ]);

        return $items;
    }

    /**
     * datatable rendering handler
     */
    private function mapRowsWithRenderUsing(
        LengthAwarePaginator|Paginator|CursorPaginator|Collection $items,
    ): LengthAwarePaginator|Paginator|CursorPaginator|Collection {
        $columns     = $this->columns;
        $collections = $items instanceof Collection ? $items : $items->getCollection();

        $collections
            ->transform(function ($row) use ($columns) {
                $arr = [];
                /** @var TableColumn $col */
                foreach ($columns as $col) {
                    $value = $row[$col->name] ?? null;
                    if ($col->renderUsing && is_callable($col->renderUsing)) {
                        $value = $this->evaluate($col->renderUsing, [
                            'state' => $value,
                            'value' => $value,
                            'row'   => $row,
                            'model' => $row,
                        ]);
                    } elseif ($col->relation && $col->relationKey && $col->relationType === 'belongsTo') {
                        if (str_contains($col->relation, '.')) {
                            $tmps  = explode('.', $col->relation);
                            $value = $row;
                            foreach ($tmps as $tmp) {
                                $value = $value->{$tmp};
                            }
                            $value = $value->{$col->relationKey} ?? null;
                            $value = str($value)->limit();
                        } else {
                            $value = $row->{$col->relation}->{$col->relationKey} ?? null;
                            $value = str($value)->limit();
                        }
                    } elseif ($col->relation && $col->relationKey && $col->relationType === 'hasMany') {
                        $value = $row->{$col->relation}->implode($col->relationKey, ' ');
                        $value = str($value)
                            ->wordWrap(break: '<br>')
                            ->limit();
                        $value = ['__html' => "<span>$value</span>"];
                    } elseif (str_contains($col->name, '.')) {
                        [$relationName, $relationAttribute] = extractRelation($col->name);
                        $value                              = $row->{$relationName};
                        if ($value instanceof Collection) {
                            $value = $value
                                ->pluck($relationAttribute)
                                ->implode(' ');
                            $value = str($value)
                                ->wordWrap(break: '<br>')
                                ->limit();
                            $value = ['__html' => "<span>$value</span>"];
                        } else {
                            $value = $value->{$relationAttribute} ?? null;
                            $value = str($value)->limit();
                        }
                    }
                    $arr[$col->name] = $value;
                }

                return $arr;
            });

        return $items;
    }

    /**
     * get all columns
     */
    public function getColumns(): array
    {
        return array_map(fn ($col) => $col->toArray(), $this->columns);
    }

    /**
     * sort handler
     */
    private function getAllowedSorts(): array
    {
        $allowedSorts = array_map(
            fn ($col) => $col->relation ?
                $col->relation . '.' . $col->relationKey
                : $col->name,
            $this->columns
        );

        return collect($allowedSorts)->map(function ($col) {
            if (str_contains($col, '.')) {
                [$relationName, $relationAttribute] = extractRelation($col);

                return AllowedSort::custom($col, SortByRelationColumn::make($relationName, $relationAttribute));
            }

            return $col;
        })->toArray();
    }

    /**
     * filter handler
     */
    private function getAllowedFilters(Request $request): array
    {
        $allowedFilters = [];
        if (! $request->has($this->getFilterParam())) {
            return $allowedFilters;
        }
        foreach (collect($this->filters) as $filter) {
            $key = $filter->field;
            if (! array_key_exists($key, $request->{$this->getFilterParam()})) {
                continue;
            }
            $oldValue = $request->{$this->getFilterParam()}[$key];
            $temp     = str_contains($oldValue, ':') ? explode(':', $oldValue, 2) : [$oldValue];
            $operator = null;

            if (count($temp) < 1) {
                // fallback does nothing
                $allowedFilters[] = AllowedFilter::callback($key, function () {
                    //
                });

                continue;
            }

            $operator = $temp[0];
            $value    = $temp[1] ?? $operator ?? '';

            if (! in_array($operator, $this->predefinedOperators)) {
                // fallback does nothing
                $allowedFilters[] = AllowedFilter::callback($key, function (Builder $query) use ($key, $value) {
                    $query->where($key, $value);
                });

                continue;
            }

            $allowedFilters[] = AllowedFilter::callback($key, function (Builder $query) use ($key, $operator, $value, $filter) {
                $isDateType = $filter->type === 'date' && ($filter->withTime ?? false) == false;
                if ($filter->queryCallback) {
                    $this->evaluate($filter->queryCallback, [
                        'query'    => $query,
                        'operator' => $operator,
                        'op'       => $operator,
                        'value'    => $value,
                        'val'      => $value,
                    ]);

                    return;
                }
                // relation query
                if (str_contains($key, '.')) {
                    [$relationName, $relationAttribute] = extractRelation($key);
                    $query->whereHas(
                        $relationName,
                        function (Builder $query) use ($relationAttribute, $operator, $value, $isDateType) {
                            $this->filterQuery($query, $relationAttribute, $operator, $value, $isDateType);
                        });

                    return;
                }
                // no relation query
                $this->filterQuery($query, $key, $operator, $value, $isDateType);
            });
        }

        return $allowedFilters;
    }

    /**
     * filter operator handler
     */
    private function filterQuery(Builder $query, string $key, string $operator, mixed $value, bool $isDateType): void
    {
        if ($operator === '><') {
            $tmp    = str_contains($value, ',') ? explode(',', $value, 2) : [$value, null];
            $newKey = $isDateType ? DB::raw("DATE($key)") : $key;
            $query->whereBetween($newKey, [$tmp[0], $tmp[1] ?? null]);

            return;
        }
        if ($operator === '!><') {
            $tmp    = str_contains($value, ',') ? explode(',', $value, 2) : [$value, null];
            $newKey = $isDateType ? DB::raw("DATE($key)") : $key;
            $query->whereNotBetween($newKey, [$tmp[0], $tmp[1] ?? null]);

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
            $tmp    = str_contains($value, ',') ? explode(',', $value) : [$value];
            $newKey = $isDateType ? DB::raw("DATE($key)") : $key;
            $query->whereIn($newKey, is_array($tmp) ? $tmp : [$tmp]);

            return;
        }
        if ($operator === 'notIn') {
            $tmp    = str_contains($value, ',') ? explode(',', $value) : [$value];
            $newKey = $isDateType ? DB::raw("DATE($key)") : $key;
            $query->whereNotIn($newKey, is_array($tmp) ? $tmp : [$tmp]);

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
        $newKey = $isDateType ? DB::raw("DATE($key)") : $key;
        $query->where($newKey, $operator, $value);
    }

    public function toArray(): array
    {
        $items = $this->get();

        return [
            'items'   => $items,
            'filters' => [
                'q'      => request()->input('q'),
                'sort'   => request()->input('sort', $this->defaultSort),
                'dir'    => request()->input('dir', $this->defaultSortDir),
                'opt'    => $this->filters,
                'filter' => request()->input('filter'),
            ],
            'perPage'           => $this->disablePagination ? 0 : (int) $items->perPage(),
            'perPageOptions'    => $this->disablePagination ? 0 : $this->perPageOptions,
            'columns'           => $this->getColumns(),
            'actions'           => $this->getActions(),
            'prefix'            => $this->prefix,
            'name'              => $this->name,
            'edit'              => $this->canEdit,
            'view'              => $this->canView,
            'delete'            => $this->canDelete,
            'forceDelete'       => $this->canForceDelete,
            'restore'           => $this->canRestore,
            'disablePagination' => $this->disablePagination,
            'paginationMethod'  => $this->paginationMethod,
            'baseRoute'         => $this->baseRoute,
            'tableRoute'        => $this->tableRoute,
            'actionRoute'       => $this->actionRoute,
            'title'             => $this->title,
        ];
    }

    public function jsonSerialize(): mixed
    {
        return $this->toArray();
    }

    public function getItems()
    {
        return $this->get();
    }

    public function export(string|callable $filePath): void
    {
        if (is_callable($filePath)) {
            $this->evaluate($filePath);

            return;
        }
        $fullUrl     = request()->get('url');
        $queryString = parse_url($fullUrl, PHP_URL_QUERY);
        parse_str($queryString, $queryParams);
        request()->query->add($queryParams);

        $data = $this->get();

        (new FastExcel($data))
            ->export($filePath);
    }
}
