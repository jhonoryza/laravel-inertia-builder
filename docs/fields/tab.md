# Tab field

this field allows you to make a tab group

## Usage

```php
<?php
return Form::make(static::class)
    ->view()
    ->model($state)
    ->columns(1)
    ->schema([
        Tabs::make()
            ->tabs([
                Tab::make('indonesia')
                    ->schema([
                        Field::text('title')
                            ->state(function () use ($state) {
                                $state->translateTo('id');
                                return $state->title;
                            }),
                        Field::text('slug')
                            ->state(function () use ($state) {
                                $state->translateTo('id');
                                return $state->slug;
                            }),
                        Field::textarea('description')
                            ->state(function () use ($state) {
                                $state->translateTo('id');
                                return $state->description;
                            }),
                        Field::richText('content')
                            ->state(function () use ($state) {
                                $state->translateTo('id');
                                return $state->content;
                            }),
                    ]),
                Tab::make('english')
                    ->schema([
                        Field::text('title')
                            ->state(function () use ($state) {
                                $state->translateTo('en');
                                return $state->title;
                            }),
                        Field::text('slug')
                            ->state(function () use ($state) {
                                $state->translateTo('en');
                                return $state->slug;
                            }),
                        Field::textarea('description')
                            ->state(function () use ($state) {
                                $state->translateTo('en');
                                return $state->description;
                            }),
                        Field::richText('content')
                            ->state(function () use ($state) {
                                $state->translateTo('en');
                                return $state->content;
                            }),
                    ]),
            ]),
            Field::file('image_url')
                ->preview($state->image_url ? Storage::url($state->image_url): ''),
            Field::toggle('is_published'),
            Field::flatpickr('published_at'),
    ]);
```

## Important Options

- **tabs():** Set the tabs item.
- **schema(array $fields):** Add array of field.

## Examples

the above example is case for multiple translation using this package `richan-fongdasen/laravel-i18n`

validation examples:

```php
<?php

'indonesia_title' => ['required', 'string'],
'indonesia_slug' => ['required', 'string'],
'indonesia_description' => ['nullable', 'string'],
'indonesia_content' => ['required', 'string'],

'english_title' => ['required', 'string'],
'english_slug' => ['required', 'string'],
'english_description' => ['nullable', 'string'],
'english_content' => ['required', 'string'],
```

when using package `richan-fongdasen/laravel-i18n`, you can map data like this

```php
<?php

private function mapData(array $data): array
{
    $data['title'] = [
        'id' => $data['indonesia_title'],
        'en' => $data['english_title'],
    ];
    $data['slug'] = [
        'id' => $data['indonesia_slug'],
        'en' => $data['english_slug'],
    ];
    $data['description'] = [
        'id' => $data['indonesia_description'],
        'en' => $data['english_description'],
    ];
    $data['content'] = [
        'id' => $data['indonesia_content'],
        'en' => $data['english_content'],
    ];
    return $data;
}
```
