# Text Field

The Text field provides a single-line input for text data such as names, titles, or short descriptions.

## Usage

```php
<?php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

Field::text('first_name')
    ->copyable()
    ->prefix('Mr/Mrs')
    ->suffix('@company.com');
```

## Important Options

- **placeholder(string $text):** Set custom placeholder text.
  - Example: `->placeholder('Enter your name')`
- **mergeClass(string $class):** Add custom CSS classes.
- **disable(bool $state = true):** Disable the field.
- **hidden(bool $state = true):** Hide the field.
- **copyable(bool $state = true):** Copy field value.
- **prefix(string $prefix):** Add prefix to the field.
- **suffix(string $suffix):** Add suffix to the field.

## Example

```php
<?php
Field::text('username')
    ->placeholder('Enter username')
    ->mergeClass('w-full');
```

## Notes

- Use for short text input such as names, titles, or identifiers.
