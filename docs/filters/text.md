# Text Filter

The Text filter allows you to filter table data based on text input. It supports various operators for matching and searching.

## Usage

```php
<?php
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;

// Basic text filter
Filter::text('name');
```

## Important Options

- **label(string $label):** Set a custom label for the filter.
  - Example: `->label('User Name')`
- **operators(array $operators):** Define custom operators for filtering.
  - Example: `->operators([Operator::contains(), Operator::startsWith()])`
- **query(callable $callback):** Customize the query logic.

## Supported Operators

- Contains (`*`)
- Not contains (`!*`)
- Equals (`=`)
- Not equals (`!=`)
- Starts with (`=*`)
- Not starts with (`!=*`)
- Ends with (`*=`)
- Not ends with (`!*=`)

## Example

```php
<?php
Filter::text('email')
    ->label('Email')
    ->operators([
        Operator::contains(),
        Operator::equals(),
    ]);
```

## Notes

- Use for filtering by name, email, or any text column.
