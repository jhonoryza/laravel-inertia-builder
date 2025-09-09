# Table Column

The TableColumn class defines the columns displayed in a table, including label, sorting, searching, visibility, relation configuration, and custom rendering.

## Usage

```php
<?php
use Jhonoryza\InertiaBuilder\Inertia\Tables\TableColumn;

// Basic column
TableColumn::make('name')
    ->label('Name');

// Sortable column
TableColumn::make('created_at')
    ->label('Created At')
    ->sortable();

// Searchable column
TableColumn::make('email')
    ->label('Email')
    ->searchable();

// Hidden column
TableColumn::make('internal_code')
    ->label('Code')
    ->hidden();

// Custom rendering
TableColumn::make('status')
    ->label('Status')
    ->renderUsing(function ($value, $row) {
        return $value === 'active' ? '<span class="text-green-500">Active</span>' : '<span class="text-red-500">Inactive</span>';
    });

// BelongsTo relation
TableColumn::make('role.name')
    ->label('Role');

// HasMany relation
TableColumn::make('tags.name')
    ->label('Tags');
```

## Important Methods & Options

- **make(string $name):** Create a new TableColumn instance.
- **label(string $label):** Set the column label shown in the table header.
- **sortable():** Enable sorting for the column. Clicking the header will sort by this column.
- **searchable():** Enable searching for the column. The column will be included in global search.
- **hidden():** Hide the column from the table display. Useful for internal data.
- **renderUsing(callable $callback):** Set a callback to format or transform the value before displaying. The callback receives the value and the row, check [this link for more detail](/docs/tables/render-using.md)
- **belongsTo(string $relation, string $displayField):** Display a related model's field (one-to-one relation). Example: show the `name` field from the related `role`, make sure relation is defined in model.
- **hasMany(string $relation, string $displayField):** Display related models' fields (one-to-many relation). Example: show all `name` fields from related `tags`, make sure relation is defined in model.

## Example

```php
<?php
TableColumn::make('status')
    ->label('Status')
    ->sortable()
    ->searchable()
    ->renderUsing(function ($value, $row) {
        return $value === 'active' ? '<span class="text-green-500">Active</span>' : '<span class="text-red-500">Inactive</span>';
    });

TableColumn::make('role.name')
    ->label('Role');

TableColumn::make('tags.name')
    ->label('Tags');
```

## Notes

- All methods return the TableColumn instance, allowing method chaining.
- Use `sortable()` and `searchable()` to enable sorting and searching on columns.
- Relations use `dot notation` allow displaying related data easily.
- `renderUsing` lets you format or transform the value before displaying.
- Hidden columns are not rendered but can be used for internal logic or export.
