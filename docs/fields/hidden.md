# Hidden Field

The Hidden field allows you to store data in your form without displaying it to the user. It's useful for passing values such as IDs, tokens, or other metadata.

## Usage

```php
<?php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

Field::hidden('user_id')->defaultValue(auth()->id());
```

## Important Options

- **defaultValue(mixed $value):** Set the default value for the hidden field.
  - Example: `->defaultValue('123')`
- **mergeClass(string $class):** Add custom CSS classes (for styling or targeting).
- **disable(bool $state = true):** Disable the field (rarely needed for hidden fields).
- **hidden(bool $state = true):** Hide the field (default is true).

## Example

```php
<?php
Field::hidden('token')
    ->defaultValue('abc123')
    ->mergeClass('my-hidden-class');
```

## Notes

- Hidden fields are not visible in the UI but are submitted with the form data.
- Useful for storing values that should not be edited by users.
