# Toggle Field

The Toggle field provides a switch for boolean values, allowing users to enable or disable a setting.

## Usage

```php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

Field::toggle('is_active');
```

## Important Options

- **mergeClass(string $class):** Add custom CSS classes.
- **disable(bool $state = true):** Disable the field.
- **hidden(bool $state = true):** Hide the field.

## Example

```php
Field::toggle('newsletter')
    ->mergeClass('ml-2');
```

## Notes

- Use for settings, preferences, or any true/false value.
