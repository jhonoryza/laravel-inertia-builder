# Column Rendering (`renderUsing`)

Secara default, sebuah kolom tabel hanya menampilkan nilai apa adanya dari database.  
Jika ingin menyesuaikan tampilan (misalnya menampilkan link, badge, atau komponen UI lain), gunakan method `renderUsing()`.

---

## Render dengan Komponen React

Jika ingin menampilkan cell menggunakan komponen React yang sudah didaftarkan:

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

Pada contoh di atas:

- `component`: nama komponen yang sudah diregistrasikan di frontend.
- `props`: properti yang akan dilempar ke komponen.

Hasil render misalnya:

```tsx
<BadgeCell value="Active" variant="success" />
```

### Registrasi Komponen

Semua komponen custom untuk cell harus diregistrasikan di:

`resources/js/components/custom-cell/index.ts`

```ts
// Register all custom cell components here.
// Key (ex: 'badge') adalah nama yang digunakan di backend (PHP).

import BadgeCell from "./badge-cell";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customCellComponents: Record<string, React.ComponentType<any>> = {
    'badge': BadgeCell,
};
```

---

## Render dengan HTML Langsung

Selain komponen, cell juga bisa di-render dengan raw HTML menggunakan kunci `__html`:

```php
TableColumn::make('link')
    ->label('Website')
    ->renderUsing(function ($value) {
        return [
            "__html" => "<a href=\"$value\" class=\"hover:text-ring\" target=\"_blank\">$value</a>"
        ];
    });
```

Hasilnya:

```html
<a href="https://example.com" class="hover:text-ring" target="_blank">
  https://example.com
</a>
```