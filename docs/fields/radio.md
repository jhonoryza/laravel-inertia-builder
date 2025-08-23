# Radio Field

The Radio field allows users to select one option from a list of choices.

## Usage

```php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

Field::radio('gender')
    ->options([
        ['label' => 'Male', 'value' => 'male'],
        ['label' => 'Female', 'value' => 'female'],
    ]);
```

## Important Options

- **options(array $options):** Set the available choices.
  - Example: `->options([['label' => 'Yes', 'value' => 'yes'], ...])`
- **mergeClass(string $class):** Add custom CSS classes.
- **disable(bool $state = true):** Disable the field.
- **hidden(bool $state = true):** Hide the field.

## Example

```php
Field::radio('status')
    ->options([
        ['label' => 'Active', 'value' => 'active'],
        ['label' => 'Inactive', 'value' => 'inactive'],
    ]);
```

## Notes

- Only one option can be selected at a time.
- Use for gender, status, or other single-choice selections.
