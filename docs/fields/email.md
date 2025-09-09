# Email Field

The Email field provides an input for email addresses, with built-in validation for proper email format.

## Usage

```php
<?php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

Field::email('contact_email');
```

## Important Options

- **placeholder(string $text):** Set custom placeholder text.
  - Example: `->placeholder('Enter your email')`
- **mergeClass(string $class):** Add custom CSS classes.
- **disable(bool $state = true):** Disable the field.
- **hidden(bool $state = true):** Hide the field.

## Example

```php
<?php
Field::email('user_email')
    ->placeholder('user@example.com')
    ->mergeClass('w-full');
```

## Notes

- The field enforces email format validation in the browser.
- Use for login, registration, or contact forms.
