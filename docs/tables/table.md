# Table

The Table class provides a flexible way to display and manage data in a paginated, searchable, and filterable format. It supports sorting, filtering, custom actions, and column configuration.

## Usage

```php
use Jhonoryza\InertiaBuilder\Inertia\Tables\Table;
use Jhonoryza\InertiaBuilder\Inertia\Tables\TableColumn;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Actions\Action;

Table::make(\App\Models\User::class)
    ->name('users')
    ->columns([
        TableColumn::make('id')->label('ID')->sortable(),
        TableColumn::make('name')->label('Name')->searchable(),
        TableColumn::make('email')->label('Email')->searchable(),
        TableColumn::make('created_at')->label('Created At')->sortable(),
    ])
    ->filters([
        Filter::text('name'),
        Filter::select('role')->options([
            ['label' => 'Admin', 'value' => 'admin'],
            ['label' => 'User', 'value' => 'user'],
        ]),
        Filter::date('created_at'),
    ])
    ->actions([
        Action::make('delete')->needConfirm(true),
        Action::make('export')->needRowSelected(false)->needConfirm(false),
    ])
    ->defaultSort('created_at', 'desc')
    ->perPage(25)
    ->perPageOptions([10, 25, 50, 100])
    ->canEdit(true)
    ->canView(true)
    ->canDelete(true)
    ->canForceDelete(false)
    ->canRestore(false)
    ->modifyQueryUsing(function ($query, $request) {
        // Custom query logic
        return $query->where('is_active', true);
    });
```

## Important Options

- **name(string $name):** Set the table name (used for frontend and request parameters).
- **columns(array $columns):** Define the columns to display (see [Table Column](./table-column.md)).
- **filters(array $filters):** Add filters for searching and filtering data.
- **actions(array $actions):** Define custom actions for selected rows.
- **defaultSort(string $column, string $dir = 'asc'):** Set the default sort column and direction.
- **perPage(int $perPage):** Set the default number of rows per page.
- **perPageOptions(array $options):** Set available options for rows per page.
- **pagination(string $method):** Choose pagination method: `'paginate'`, `'simple'`, or `'cursor'`.
- **canEdit(bool $state):** Enable or disable the edit action for table rows.
- **canView(bool $state):** Enable or disable the view action for table rows.
- **canDelete(bool $state):** Enable or disable the delete action for table rows.
- **canForceDelete(bool $state):** Enable or disable the force delete action for table rows.
- **canRestore(bool $state):** Enable or disable the restore action for table rows.
- **modifyQueryUsing(callable $callback):** Customize the underlying Eloquent query. The callback receives the query and request as arguments, allowing advanced filtering, joins, or conditions.

  Example:
  ```php
  ->modifyQueryUsing(function ($query, $request) {
      return $query->where('is_active', true);
  })
  ```

## Features

- **Sorting:** Clickable column headers for sorting.
- **Searching:** Global search across searchable columns.
- **Filtering:** Multiple filter types (text, select, date, boolean, number).
- **Actions:** Custom actions with confirmation and row selection.
- **Pagination:** Supports multiple pagination styles.
- **Column Configuration:** Show/hide columns, custom rendering, relations.

## Notes

- Table integrates with [Spatie Query Builder](https://spatie.be/docs/laravel-query-builder/v5/introduction) for advanced filtering and sorting.
- Use `TableColumn::make()` to define columns and their properties.
- Filters and actions are highly customizable.
