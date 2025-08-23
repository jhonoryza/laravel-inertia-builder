# Tags Field

The **Tags Field** allows users to input and manage multiple tags in a single field. Tags are useful for categorizing, labeling, or grouping items. This field provides a user-friendly interface for adding, removing, and suggesting tags.

## Usage

Here's how to define a tags field in your form:

```php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

Field::tags('skills')
    ->label('Skills')
    ->suggestions(['Laravel', 'PHP', 'Vue', 'React'])
    ->separator(',')
    ->addButtonLabel('Add Skill')
    ->maxTags(5)
    ->tagPrefix('#')
    ->placeholder('Add your skills...');
```

## Options

| Option            | Type      | Description                                                                                 |
|-------------------|-----------|---------------------------------------------------------------------------------------------|
| `suggestions`     | `array`   | Array of suggested tags that appear as dropdown options when typing.                        |
| `separator`       | `string`  | Character used to separate multiple tags when typing (default: `,`).                        |
| `addButtonLabel`  | `string`  | Custom label for the "Add Tag" button.                                                      |
| `maxTags`         | `int`     | Maximum number of tags allowed (default: `100`).                                            |
| `tagPrefix`       | `string`  | Prefix added to each tag (e.g., `#` for hashtags).                                          |
| `placeholder`     | `string`  | Placeholder text for the input field.                                                       |
| `mergeClass`      | `string`  | Custom CSS classes for styling the field.                                                   |

## Example

```php
Field::tags('topics')
    ->label('Topics')
    ->suggestions(['API', 'Backend', 'Frontend', 'DevOps'])
    ->separator(';')
    ->addButtonLabel('Add Topic')
    ->maxTags(10)
    ->tagPrefix('@')
    ->placeholder('Type and press enter...')
```

## Features

- **Add tags** by typing and pressing Enter or clicking the add button.
- **Remove tags** by clicking the remove icon next to each tag.
- **Suggestions dropdown** appears as you type, based on the `suggestions` array.
- **Multiple tags** can be added at once using the separator character.
- **Limit the number of tags** with `maxTags`.
- **Customize appearance** with `addButtonLabel`, `tagPrefix`, and `mergeClass`.

## Notes

- If `maxTags` is reached, the input will be disabled until a tag is removed.
- The `separator` option allows users to quickly add multiple tags by typing them separated by the specified character.

