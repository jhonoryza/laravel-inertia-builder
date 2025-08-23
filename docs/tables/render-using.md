# Column Rendering (`renderUsing`)

By default, a table column only displays the raw value from the database.  
If you want to customize the display (for example, show a link, badge, or other UI component), use the `renderUsing()` method.

---

## Render with React Component

If you want to render a cell using a registered React component:

```php
TableColumn::make('status')
    ->label('Status')
    ->renderUsing(fn ($value) => [
        'component' => 'badge',
        'props' => [
            'value' => ucfirst($value),
            'variant' => $value === 'active' ? 'success' : 'danger',
        ],
    ]);
```

In the example above:

- `component`: the name of the component registered in the frontend.
- `props`: properties to pass to the component.

Rendered result example:

```tsx
<BadgeCell value="Active" variant="success" />
```

### Component Registration

All custom cell components must be registered in:

`resources/js/components/custom-cell/index.ts`

```ts
// Register all custom cell components here.
// The key (e.g., 'badge') is the name used in backend (PHP).

import BadgeCell from "./badge-cell";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customCellComponents: Record<string, React.ComponentType<any>> = {
    'badge': BadgeCell,
};
```

---

## Render with Raw HTML

Besides components, a cell can also be rendered with raw HTML using the `__html` key:

```php
TableColumn::make('link')
    ->label('Website')
    ->renderUsing(function ($value) {
        return [
            "__html" => "<a href=\"$value\" class=\"hover:text-ring\" target=\"_blank\">$value</a>"
        ];
    });
```

Result:

```html
<a href="https://example.com" class="hover:text-ring" target="_blank">
  https://example.com
</a>
```