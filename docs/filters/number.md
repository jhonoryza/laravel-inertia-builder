# Number Filter

The Number filter allows you to filter table data based on numeric values. It supports various operators for comparison and range filtering.

## Usage

```php
<?php
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;

// Basic number filter
Filter::number('age');
```

## Important Options

- **label(string $label):** Set a custom label for the filter.
  - Example: `->label('User Age')`
- **operators(array $operators):** Define custom operators for filtering.
  - Example: `->operators([Operator::greater(), Operator::less()])`
- **query(callable $callback):** Customize the query logic.

## Supported Operators

- Equals (`=`)
- Greater than (`>`)
- Greater than or equal to (`>=`)
- Less than (`<`)
- Less than or equal to (`<=`)
- Between (`><`)
- Not between (`!><`)

## Example

```php
<?php
Filter::number('price')
    ->label('Product Price')
    ->operators([
        Operator::greater(),
        Operator::less(),
        Operator::between(),
    ]);
```

## Notes

- Use for filtering numeric columns such as price, quantity, or age.
