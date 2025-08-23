# Boolean Filter

The Boolean filter allows you to filter table data based on true/false values. It is useful for status, active/inactive, or any binary field.

## Usage

```php
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;

// Basic boolean filter
Filter::boolean('is_active');
```

## Important Options

- **label(string $label):** Set a custom label for the filter.
  - Example: `->label('Active Status')`
- **query(callable $callback):** Customize the query logic.

## Example

```php
Filter::boolean('published')
    ->label('Published');
```

## Notes

- No operators are available for boolean filters.
- Use for fields representing true/false or yes/no values.
