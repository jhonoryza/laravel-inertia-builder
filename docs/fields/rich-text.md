# Rich Text Field

The Rich Text Field provides a powerful WYSIWYG editor for your forms, allowing users to format text, insert links, images, headings, and more. It is built on top of [TipTap](https://tiptap.dev/) and is highly customizable.

## Usage

You can add a rich text field to your form using the `Field::richText()` factory method:

```php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

Field::richText('content')
    ->label('Content')
    ->toolbar([
        'bold', 'italic', 'underline', 'strike',
        'h1', 'h2', 'h3',
        'bulletList', 'orderedList',
        'alignLeft', 'alignCenter', 'alignRight',
        'link', 'code', 'blockquote', 'clear'
    ])
    ->minHeight(300)
    ->maxHeight(600)
    ->placeholder('Write your article here...')
```

## Important Options

### `toolbar(array $options)`

Customize the toolbar buttons available to the user. The default toolbar includes:

- `bold`
- `italic`
- `underline`
- `h1`
- `h2`
- `bulletList`
- `orderedList`
- `link`

You can add or remove tools as needed. Available tools include:

- `bold`, `italic`, `underline`, `strike`
- `h1`, `h2`, `h3` (headings)
- `bulletList`, `orderedList`
- `alignLeft`, `alignCenter`, `alignRight`
- `link`
- `code`, `codeBlock`
- `blockquote`
- `clear` (clear formatting)

### `minHeight(int $height)`

Set the minimum height of the editor in pixels.

### `maxHeight(int $height)`

Set the maximum height of the editor in pixels. If content exceeds this height, the editor will become scrollable.

### `placeholder(string $text)`

Set the placeholder text shown when the editor is empty.

### `mergeClass(string $class)`

Add custom CSS classes to the editor for further styling.

## Example

```php
Field::richText('description')
    ->label('Description')
    ->toolbar(['bold', 'italic', 'h1', 'bulletList', 'link'])
    ->minHeight(200)
    ->maxHeight(400)
    ->placeholder('Enter a detailed description...')
```

## Output

The field will render a rich text editor in your form, and the submitted value will be HTML.

## Notes

- You can fully customize the toolbar to fit your application's needs.
- The editor supports headings, lists, links, code blocks, blockquotes, and more.
- Use `minHeight` and `maxHeight` to control the editor's size.

For more advanced usage, refer to the [TipTap documentation](https://tiptap.dev/).

