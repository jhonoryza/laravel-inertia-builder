# Markdown Field

The Markdown field provides a rich editor for writing and previewing Markdown content. It features a tabbed interface for writing and previewing formatted output.

## Usage

```php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

Field::markdown('content');
```

## Important Options

- **placeholder(string $text):** Set custom placeholder text for the editor.
  - Example: `->placeholder('Write your post...')`
- **mergeClass(string $class):** Add custom CSS classes to the editor.
- **disable(bool $state = true):** Disable the field.
- **hidden(bool $state = true):** Hide the field.

## Example

```php
Field::markdown('description')
    ->placeholder('Enter markdown content here')
    ->mergeClass('h-40');
```

## Notes

- The preview tab renders Markdown using the [marked](https://marked.js.org/) library.
- Useful for blog posts, documentation, and any content requiring Markdown formatting.
