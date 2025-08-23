# Number Field

The Number field provides an input for numeric values, supporting validation and step increments.

## Usage

```php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

Field::number('quantity');
```

## Important Options

- **placeholder(string $text):** Set custom placeholder text.
  - Example: `->placeholder('Enter a number')`
- **mergeClass(string $class):** Add custom CSS classes.
- **disable(bool $state = true):** Disable the field.
- **hidden(bool $state = true):** Hide the field.

## Example

```php
Field::number('age')
    ->placeholder('18')
    ->mergeClass('w-32');
```

## Notes

- Only numeric input is allowed.
- Useful for quantities, ages, prices, and other numeric data.
