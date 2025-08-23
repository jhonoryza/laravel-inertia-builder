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

## Important Methods & Options

- **options(array $options):** Set the available choices for the dropdown. Each option should be an array with `label` and `value`.
- **multiple(bool $multiple = true):** Allow multiple selections. If enabled, the field returns an array of selected values.
- **searchable(bool $searchable = true):** Enable search functionality in the dropdown, allowing users to filter options.
- **serverside(bool $serverside = true):** Enable server-side option loading and searching, useful for large datasets.
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
    ->serverside()
    ->mergeClass('w-full')
    ->disable(false)
    ->hidden(false)
    ->placeholder('Choose categories');
```

## Notes

- Supports single or multiple selection.
- Search and server-side loading are useful for large datasets.
- Use method chaining to configure the field as needed.
