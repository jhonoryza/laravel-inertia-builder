<h1 align="center">Laravel Inertia Builder</h1>
<p align="center">
    <a href="https://packagist.org/packages/jhonoryza/laravel-inertia-builder">
        <img src="https://poser.pugx.org/jhonoryza/laravel-inertia-builder/d/total.svg" alt="Total Downloads">
    </a>
    <a href="https://packagist.org/packages/jhonoryza/laravel-inertia-builder">
        <img src="https://poser.pugx.org/jhonoryza/laravel-inertia-builder/v/stable.svg" alt="Latest Stable Version">
    </a>
    <a href="https://packagist.org/packages/jhonoryza/laravel-inertia-builder">
        <img src="https://poser.pugx.org/jhonoryza/laravel-inertia-builder/license.svg" alt="License">
    </a>
</p>

This project is inspired by Filament PHP. It aims to build complex UI components like data tables and forms using a
declarative, backend-driven approach. The structure of the UI (e.g., form fields, table columns) is defined in PHP
controller classes, and a generic set of React components renders the final UI. The goal is to build dynamic interfaces
without writing custom frontend page components for each resource.

**Key Technologies:** Laravel, Inertia.js, React, TypeScript, TailwindCSS.

---

## Key Features

- **Declarative UI Construction:** Define forms and data tables in your Laravel controllers. No need to write bespoke
  frontend components for every CRUD page.
- **Rich Form Fields:** A wide variety of form fields are available out-of-the-box, including Text, Select, Textarea,
  Markdown, File Uploads, Date Pickers, and more.
- **Powerful Data Tables:** Create complex data tables with searchable columns, advanced filtering, sorting, and bulk
  actions.
- **Reactive Components:** Create dependent dropdowns and other reactive form elements where a change in one
  field automatically updates another, all handled seamlessly on the backend.
- **Relationship Handling:** Automatically populate fields and table columns with data from Eloquent relationships (
  `belongsTo`, `hasMany`, etc.).
- **Customizable:** Extend the library with your own custom fields and filters to meet specific needs.

---

## Example: Building a Data Table

Define your entire data table in the `index` method of your controller. The builder handles searching, sorting,
filtering, and actions.

**`PostController.php`**

```php
public function index(): Response
{
    $table = Table::make(Post::class)
        ->columns([
            TableColumn::make('id')->sortable(),
            TableColumn::make('title')->searchable()->sortable(),
            TableColumn::make('author_id')
                ->label('Author')
                ->belongsTo('author', 'name') // Eloquent relationship
                ->searchable(),
            TableColumn::make('published')
                ->renderUsing(fn ($value) => $value ? 'Yes' : 'No'),
            TableColumn::make('published_at')->sortable(),
        ])
        ->filters([
            Filter::text('title'),
            Filter::select('author.name')->label('Author')->relationship(User::class, 'name', 'name'),
            Filter::date('published_at'),
            Filter::select('published')
                ->options([
                    ['label' => 'Publish', 'value' => true],
                    ['label' => 'Unpublish', 'value' => false],
                ]),
        ])
        ->defaultSort('id', 'desc')
        ->actions([
            Action::make('new')->needRowSelected(false),
            Action::make('delete')->message('Delete this post?'),
            Action::make('publish')->message('Publish this post?'),
        ]);

    return Inertia::render('builder/index', [
        'data' => $table,
        'routeName' => 'posts',
    ]);
}
```

---

## Example: Building a Form

Define the fields for your create/edit forms in a reusable private method. The builder handles data binding, validation,
and different field types.

**`PostController.php`**

```php
private function getFormFields(?Post $post = null, $disable = false): array
{
    return [
        Field::text('title')->defaultValue($post?->title),
        Field::textarea('description')->defaultValue($post?->description),
        Field::markdown('content')->defaultValue($post?->content),
        Field::select('category_id')
            ->label('Category')
            ->relationship(Category::class, 'name'),
        Field::select('author_id')
            ->label('Author')
            ->searchable()
            ->relationship(User::class, 'name'),
        Field::toggle('published')->label('Published ?'),
        Field::flatpickr('published_at')->date(),
        Field::tags('tags')->defaultValue($post?->tags),
        Field::file('thumbnail')->defaultValue($post?->thumbnail),
    ];
}
```

---

## Core Concept: Reactive Forms (The Inertia Way)

The form builder supports creating fields that react to changes in other fields (e.g., dependent dropdowns). This is
achieved without custom frontend logic or API endpoints by using Inertia's "Partial Reloads" feature.

### How It Works

1. **Backend (Marking a Field as Reactive):** In a controller, call the `.reactive()` method on any field that should
   trigger an update when its value changes.
2. **Frontend (Triggering the Reload):** The generic field builder component detects if a field is `reactive`. When its
   value changes, it automatically makes an Inertia partial visit to the current URL, sending the new value.
3. **Backend (Handling the Reload):** The controller method (e.g., `create` or `edit`) receives the partial reload
   request. It uses the new value from the request to dynamically build a new `fields` array with updated options for
   other fields.
4. **Frontend (Seamless Update):** Inertia receives the updated `fields` prop and seamlessly updates the form,
   preserving the user's other input and scroll position.

### Example: Dependent Dropdowns

Here is how to set up a dependent dropdown for `City` based on the selected `Province`.

```php
private function getFormFields(?Subdistrict $subdistrict = null, $disable = false): array
{
    // ... logic to get current province_id from request or model
    $provinceId = request()->input('province_id') ?: $subdistrict?->district?->city?->province_id;

    return [
        Field::select('province_id')
            ->label('Province')
            ->relationship(Province::class, 'name')
            ->reactive() // Mark this field as reactive
            ->defaultValue($provinceId),

        Field::select('city_id')
            ->label('City')
            ->placeholder('Select Province first')
            ->relationship(City::class, 'name')
            // This field depends on 'province_id'.
            // The builder will automatically filter cities based on the selected province.
            ->dependsOn(dependencyField: 'province_id', foreignKey: 'province_id', value: $provinceId)
            ->defaultValue($cityId), // Set default value for city
    ];
}
```

---

## Project Structure

- **`src/Inertia/Fields`**: Contains the PHP classes for the **Form Builder** (e.g., `TextField`, `SelectField`).
- **`src/Inertia/Tables`**: Contains the PHP classes for the **Datatable Builder** (e.g., `Table`, `TableColumn`,
  `Filter`).
- **`resources/js/pages/builder`**: Contains the generic Inertia page components (`index.tsx`, `create.tsx`, `edit.tsx`)
  that render the UI based on props from the backend.
- **`resources/js/components/builder`**: Contains the reusable React components that make up the form and table
  builders (e.g., `app-datatable.tsx`, `app-form-builder.tsx`).

---

## More Examples

For more detailed examples, including CRUD implementations for Provinces, Cities, and Districts, please check
the [docs](./docs/index.md).

## Requirement

- PHP >= 8.4
- Laravel >= 12
- Nodejs & npm >= 20
- Tailwind 4
- Laravel [official starter kit with React](https://laravel.com/docs/12.x/starter-kits#react)

currently not supported for `official vue starter kit`

## Getting Started

### Package installation

```bash
composer require jhonoryza/laravel-inertia-builder
php artisan inertia-builder:install
```

### Generator scaffolding

you need at least a table structure in your database

let's say `posts` table using laravel migration or manually

then run this command to generate: Model, Factory, Controller, Request, and Routes

```bash
php artisan inertia-builder:generate posts
```

then run `npm run dev` to recompile the frontend

## Security

If you've found a bug regarding security, please mail [jardik.oryza@gmail.com](mailto:jardik.oryza@gmail.com) instead of
using the issue tracker.

## License

The MIT License (MIT). Please see [License File](license.md) for more information.