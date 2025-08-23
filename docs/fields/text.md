# Text Field

The Text field provides a single-line input for text data such as names, titles, or short descriptions.

## Usage

```php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

Field::text('first_name');
```

## Important Options

- **placeholder(string $text):** Set custom placeholder text.
  - Example: `->placeholder('Enter your name')`
- **mergeClass(string $class):** Add custom CSS classes.
- **disable(bool $state = true):** Disable the field.
- **hidden(bool $state = true):** Hide the field.

## Example

```php
Field::text('username')
    ->placeholder('Enter username')
    ->mergeClass('w-full');
```

## Notes

- Use for short text input such as names, titles, or identifiers.
