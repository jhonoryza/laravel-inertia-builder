# Password Field

The Password field provides a secure input for passwords, hiding the entered text.

## Usage

```php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

Field::password('user_password');
```

## Important Options

- **placeholder(string $text):** Set custom placeholder text.
  - Example: `->placeholder('Enter your password')`
- **mergeClass(string $class):** Add custom CSS classes.
- **disable(bool $state = true):** Disable the field.
- **hidden(bool $state = true):** Hide the field.

## Example

```php
Field::password('password')
    ->placeholder('••••••••')
    ->mergeClass('w-full');
```

## Notes

- The input type is `password`, so the text is obscured.
- Use for login, registration, or password change forms.
