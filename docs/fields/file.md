# File Field

The File field allows users to upload files through your form. It supports single and multiple file uploads, file type restrictions, and previewing selected files.

## Usage

```php
<?php
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;

// Single file upload
Field::file('document')
    ->preview(fn ($model) => $model->doc_url);

// Multiple file upload
Field::file('photos')
    ->multiple();

// Restrict accepted file types
Field::file('avatar')
    ->accept(['image/png', 'image/jpeg']);
```

## Important Options

- **accept(array $types):** Restrict the file types that can be uploaded. Accepts MIME types or file extensions.
  - Example: `->accept(['image/png', 'image/jpeg'])`
- **multiple(bool $multiple = true):** Allow users to select and upload multiple files.
  - Example: `->multiple()`
- **placeholder(string $text):** Set custom placeholder text for the file input.
  - Example: `->placeholder('Upload your resume')`
- **mergeClass(string $class):** Add custom CSS classes to the input.
- **disable(bool $state = true):** Disable the field.
- **hidden(bool $state = true):** Hide the field.

## Example

```php
<?php
Field::file('attachments')
    ->accept(['application/pdf', 'image/*'])
    ->multiple()
    ->placeholder('Select files to upload');
```

## Notes

- Uploaded files are available in the request as instances of `Illuminate\Http\UploadedFile`.
- You can preview images and download other file types directly from the form.
