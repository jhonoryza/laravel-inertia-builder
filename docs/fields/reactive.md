# Reactive Fields

Reactive fields allow your form to dynamically update its UI and available options based on changes to other fields, without custom frontend logic. This is especially useful for creating dependent dropdowns, toggling field types, or updating options based on user input.

## How It Works

- Mark any field as **reactive** by calling `.reactive()` on it.
- When the value of a reactive field changes, the frontend automatically triggers an Inertia partial reload to the backend.
- The backend receives the new value and can rebuild the form fields array, changing field types, options, or other properties.
- The frontend updates the form UI seamlessly, reflecting the new configuration.

## Example: Dynamic Field Type Switching

Suppose you want to let users choose whether to upload an image file or just enter an image URL. You can use a reactive radio field to toggle between a file input and a text input.

```php
<?php
$isUpload = request('is_upload', 'no') == 'yes';
$uiUpload = $isUpload ? 'file' : 'text';

return Form::make()
    ->columns(1)
    ->fields([
        Field::text('title')
            ->defaultValue($post?->title)
            ->disable($disable),
        // ... other fields ...
        Field::radio('is_upload')
            ->label('Upload Image ?')
            ->defaultValue(request('is_upload', 'no'))
            ->reactive() // Mark as reactive
            ->options([
                ['label' => 'yes', 'value' => 'yes'],
                ['label' => 'no', 'value' => 'no'],
            ])
            ->disable($disable),
        Field::$uiUpload('image_main')
            ->label('Image path')
            ->defaultValue($isUpload ? $post?->getImageUrl() : $post?->image_url)
            ->disable($disable),
        Field::$uiUpload('image_twitter')
            ->label('Image twitter path')
            ->defaultValue($isUpload ? $post?->getTwitterImageUrl() : $post?->image_tw_url)
            ->disable($disable),
        Field::$uiUpload('image_thumb')
            ->label('Image thumb path')
            ->defaultValue($isUpload ? $post?->getThumbImageUrl() : $post?->image_thumb_url)
            ->disable($disable),
    ]);
```

**Explanation:**
- The `is_upload` radio field is marked as `.reactive()`.
- When the user changes its value, the form reloads and `$isUpload` is recalculated.
- `$uiUpload` is set to `'file'` or `'text'` depending on the value.
- The image fields (`image_main`, `image_twitter`, `image_thumb`) are rendered as either file upload fields or text fields, dynamically.

## Use Cases

- **Dependent Dropdowns:** Update city options when province changes.
- **Conditional Fields:** Show/hide or change field types based on user selection.
- **Dynamic Validation:** Change validation rules or required fields based on other field values.

## How to Use

1. Add `.reactive()` to any field that should trigger a form reload when changed.
2. In your controller, use the new value from the request to rebuild the fields array as needed.
3. The frontend will automatically update the form UI.

## Notes

- Any field type can be made reactive.
- You can use this pattern for complex dynamic forms without writing custom JavaScript.
- Works seamlessly with Inertia's partial reloads for fast, dynamic UX.
