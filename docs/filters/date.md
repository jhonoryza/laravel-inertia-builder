# Date Filter

The Date filter allows you to filter table data based on date values. It supports single date, range, and various comparison operators.

## Usage

```php
<?php
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;

// Basic date filter
Filter::date('created_at');
```

## Important Options

- **label(string $label):** Set a custom label for the filter.
  - Example: `->label('Created Date')`
- **operators(array $operators):** Define custom operators for filtering.
  - Example: `->operators([Operator::between(), Operator::greater()])`
- **config(array $config):** Pass custom flatpickr configuration.
- **withTime(bool $withTime):** Enable time selection.
- **utcConvert(bool $utc):** Convert date to UTC ISO string.
- **query(callable $callback):** Customize the query logic.

## Supported Operators

- Equals (`=`)
- Not equals (`!=`)
- Greater than (`>`)
- Greater than or equal to (`>=`)
- Less than (`<`)
- Less than or equal to (`<=`)
- Between (`><`)
- Not between (`!><`)

## Example

```php
<?php
Filter::date('published_at')
    ->label('Published Date')
    ->withTime(true)
    ->operators([
        Operator::equals(),
        Operator::between(),
    ]);
```

## Notes

- Use for filtering by date or datetime columns.
- Supports advanced date picking via Flatpickr.
