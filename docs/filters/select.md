# Select Filter

The Select filter allows you to filter table data by selecting one or multiple options from a dropdown.

## Usage

```php
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;

// Basic select filter
Filter::select('status')
    ->options([
        ['label' => 'Active', 'value' => 'active'],
        ['label' => 'Inactive', 'value' => 'inactive'],
    ]);
```

## Server-side Search Example

For large datasets, you can enable server-side searching and option loading. This is useful when you want to fetch options dynamically as the user types.

```php
use App\Models\District;

Filter::select('district_id')
    ->label('District')
    ->searchable() // Enable search box in dropdown
    ->serverside() // Enable server-side search
    ->relationship(District::class, 'name', 'name', modifyQueryUsing: function($q) {
        $search = request()->get('district_id_q');
        $q
            ->when(
                $search,
                fn ($q) => $q->where('name', 'ilike', '%' . $search . '%')
            )
            ->limit(5);
    })
    ->query(fn ($query, $op, $val) => $query->whereHas('district', function ($q) use ($op, $val) {
        $q->where('name', $op, $val);
    }));
```

**Explanation:**
- `searchable()`: Shows a search box in the dropdown.
- `serverside()`: Enables server-side search, sending the search query to the backend.
- `relationship(District::class, 'name', 'name', ...)`: Loads options from the `District` model, displaying the `name` field, and allows custom query modification for option loading.
- `modifyQueryUsing`: Customizes the query for fetching options, allowing you to filter and limit results based on the search input.
- The search input is sent as `district_id_q` in the request.
- `query(...)`: Customizes how the filter applies to the table query, e.g., filtering by related district name.

## Important Options

- **options(array $options):** Set available choices.
  - Example: `->options([['label' => 'A', 'value' => 'a'], ...])`
- **multiple(bool $multiple):** Allow multiple selections.
  - Example: `->multiple(true)`
- **searchable(bool $searchable):** Enable search in dropdown.
- **serverside(bool $serverside):** Enable server-side option loading.
- **relationship(string $model, string $displayField, string $valueField, callable $modifyQueryUsing = null):** Load options from an Eloquent model, optionally customizing the query.
- **label(string $label):** Set custom label.
- **operators(array $operators):** Define custom operators.
- **query(callable $callback):** Customize query logic.

## Supported Operators

- Equals (`=`)
- Not equals (`!=`)
- In (`in`)
- Not in (`notIn`)

## Example

```php
Filter::select('category')
    ->label('Category')
    ->multiple(true)
    ->searchable(true)
    ->options([
        ['label' => 'Tech', 'value' => 'tech'],
        ['label' => 'Business', 'value' => 'business'],
    ]);
```

## Notes

- Use for filtering by categories, status, or any predefined options.
- Server-side search is recommended for large datasets or related models.
