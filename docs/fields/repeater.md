# Repeater Field

The Repeater Field allows you to create an array of data with a repeatable field schema, perfect for dynamic input such as lists of members, sections, or items.

## Example Usage

```php
<?php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

Field::repeater('sections')
    ->schema([
        Field::text('title')->label('Title'),
        Field::textarea('content')->label('Content'),
        Field::checkbox('is_active')->label('Active'),
    ])
    ->minItems(1)
    ->maxItems(5)
    ->addButtonLabel('Add Section')
    ->itemLabel('Section :index - {title}')
    ->collapsible()
    ->collapsed()
    ->reorderable()
```

## Repeater Options

| Option            | Type         | Default        | Description                                                                                 |
|-------------------|--------------|---------------|---------------------------------------------------------------------------------------------|
| `schema`          | array        | []            | Field schema for each repeater item.                                                        |
| `minItems`        | int|null     | null          | Minimum number of items required.                                                           |
| `maxItems`        | int|null     | null          | Maximum number of items allowed.                                                            |
| `addButtonLabel`  | string|null  | 'Add Item'    | Label for the button to add a new item.                                                     |
| `itemLabel`       | string|null  | 'Item :index' | Label for each item, supports `:index` and `{field_name}` placeholders.                     |
| `collapsible`     | bool         | false         | Whether items can be collapsed/expanded.                                                    |
| `collapsed`       | bool         | false         | Whether items are collapsed by default.                                                     |
| `reorderable`     | bool         | false         | Whether items can be reordered via drag & drop.                                             |

## Item Label Placeholders

- `:index` will be replaced with the item number (starting from 1).
- `{field_name}` will be replaced with the value of the field in that item.

Example:
```php
<?php
->itemLabel('Section :index - {title}')
```
will produce labels like: `Section 1 - Introduction`, `Section 2 - About`, etc.

## Validation

You can combine array validation for repeater fields in Laravel, for example:
```php
<?php
'sections' => 'required|array|min:1|max:5',
'sections.*.title' => 'required|string',
'sections.*.content' => 'nullable|string',
```

## UI

- Add item button is shown below the list.
- Each item can be deleted, reordered (if `reorderable`), and collapsed (if `collapsible`).
- Errors per item are displayed according to the field.

## Notes

- Repeater field is suitable for dynamic and nested data.
- The field schema supports all available field builder types.

---
