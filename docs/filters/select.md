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

## Important Options

- **options(array $options):** Set available choices.
  - Example: `->options([['label' => 'A', 'value' => 'a'], ...])`
- **multiple(bool $multiple):** Allow multiple selections.
  - Example: `->multiple(true)`
- **searchable(bool $searchable):** Enable search in dropdown.
- **serverside(bool $serverside):** Enable server-side option loading.
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
