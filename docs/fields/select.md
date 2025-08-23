# Select Field

The Select field provides a dropdown for choosing one or multiple options, with support for search and server-side loading.

## Usage

```php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

Field::select('role')
    ->options([
        ['label' => 'Admin', 'value' => 'admin'],
        ['label' => 'User', 'value' => 'user'],
    ]);
```

## Server-side Search Example

For large datasets, you can enable server-side searching and option loading. This is useful when you have thousands of options and want to fetch them dynamically as the user types.

```php
use App\Models\District;

Field::select('district_id')
    ->label('District')
    ->searchable() // Enable search box in dropdown
    ->serverside() // Enable server-side search
    ->relationship(District::class, 'name', modifyQueryUsing: function($q) {
        // enabling serverside will add query parameter _q to component name
        $search = request()->get('district_id_q');
        $q
            ->when(
                $search,
                fn ($q) => $q->where('name', 'ilike', '%' . $search . '%')
            )
            ->limit(5);
    })
    ->defaultValue($subdistrict?->district_id)
    ->disable($disable);
```

**Explanation:**
- `searchable()`: Shows a search box in the dropdown.
- `serverside()`: Enables server-side search, sending the search query to the backend.
- `relationship(District::class, 'name', ...)`: Loads options from the `District` model, displaying the `name` field.
- `modifyQueryUsing`: Customizes the query for fetching options, allowing you to filter and limit results based on the search input.
- The search input is sent as `district_id_q` in the request.

## Important Methods & Options

- **options(array $options):** Set the available choices for the dropdown. Each option should be an array with `label` and `value`.
- **multiple(bool $multiple = true):** Allow multiple selections. If enabled, the field returns an array of selected values.
- **searchable(bool $searchable = true):** Enable search functionality in the dropdown, allowing users to filter options.
- **serverside(bool $serverside = true):** Enable server-side option loading and searching, useful for large datasets.
- **relationship(string $model, string $displayField, callable $modifyQueryUsing = null):** Load options from an Eloquent model, optionally customizing the query.
- **mergeClass(string $class):** Add custom CSS classes to the field for styling.
- **disable(bool $state = true):** Disable the field, making it non-interactive.
- **hidden(bool $state = true):** Hide the field from the form.
- **placeholder(string $text):** Set custom placeholder text for the dropdown.
- **label(string $label):** Set a custom label for the field.
- **defaultValue(mixed $value):** Set the default selected value(s).

All methods return the SelectField instance, allowing method chaining.

## Example

```php
Field::select('categories')
    ->options([
        ['label' => 'Tech', 'value' => 'tech'],
        ['label' => 'Business', 'value' => 'business'],
    ])
    ->multiple()
    ->searchable()
    ->mergeClass('w-full')
    ->disable(false)
    ->hidden(false)
    ->placeholder('Choose categories');
```

## Notes

- Supports single or multiple selection.
- Search and server-side loading are useful for large datasets.
- Use method chaining to configure the field as needed.
