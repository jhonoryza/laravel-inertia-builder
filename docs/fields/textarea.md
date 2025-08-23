# Textarea Field

The Textarea field provides a multi-line text input for longer content such as comments, descriptions, or notes.

## Usage

```php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

Field::textarea('description');
```

## Important Options

- **cols(int $cols):** Set the number of columns (width).
  - Example: `->cols(40)`
- **rows(int $rows):** Set the number of rows (height).
  - Example: `->rows(5)`
- **placeholder(string $text):** Set custom placeholder text.
- **mergeClass(string $class):** Add custom CSS classes.
- **disable(bool $state = true):** Disable the field.
- **hidden(bool $state = true):** Hide the field.

## Example

```php
Field::textarea('notes')
    ->cols(50)
    ->rows(6)
    ->placeholder('Enter your notes here');
```

## Notes

- Use for multi-line input such as comments, feedback, or descriptions.
