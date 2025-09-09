# Example Post

create a migration

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id(); // bigint auto increment (id)
            $table->string('title', 255);
            $table->string('summary', 600)->nullable();
            $table->text('content');
            $table->string('slug', 255)->nullable();
            $table->timestamp('published_at')->nullable();
            $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->boolean('is_markdown')->default(false);
            $table->boolean('is_highlighted')->default(false);
            $table->string('image_url', 600)
                ->default('https://source.unsplash.com/500x300?random');
            $table->string('image_tw_url', 255)
                ->default('https://source.unsplash.com/300x157?random');
            $table->string('image_thumb_url', 255)
                ->default('https://source.unsplash.com/300x300?random');
        });

        // Indexes
        Schema::table('posts', function (Blueprint $table) {
            $table->index('published_at', 'posts_published_at_index');
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id(); // bigint auto increment
            $table->string('name', 255);
            $table->string('slug', 255)->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });

        // Index
        Schema::table('categories', function (Blueprint $table) {
            $table->index('published_at', 'categories_published_at_index');
        });

        Schema::create('post_categories', function (Blueprint $table) {
            $table->unsignedBigInteger('post_id');
            $table->unsignedBigInteger('category_id');

            $table->foreign('post_id')
                ->references('id')->on('posts')
                ->cascadeOnDelete();

            $table->foreign('category_id')
                ->references('id')->on('categories')
                ->cascadeOnDelete();
        });

        // Index
        Schema::table('post_categories', function (Blueprint $table) {
            $table->index(['post_id', 'category_id'], 'post_categories_post_id_category_id_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('post_categories');
    }
};
```

generate scaffolding

```bash
php artisan inertia-builder:categories
php artisan inertia-builder:posts
```

add `Post` model

```php
<?php
class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'summary',
        'content',
        'slug',
        'published_at',
        'author_id',
        'is_markdown',
        'is_highlighted',
        'image_url',
        'image_tw_url',
        'image_thumb_url',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'is_markdown' => 'boolean',
            'is_highlighted' => 'boolean',
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'post_categories');
    }

    public function getImageUrl()
    {
        $prefix = 'blog/laravelblog/storage/';
        $r2Path = $prefix.$this->image_url;

        return Storage::url($r2Path);
    }

    public function getTwitterImageUrl()
    {
        $prefix = 'blog/laravelblog/storage/';
        $r2Path = $prefix.$this->image_tw_url;

        return Storage::url($r2Path);
    }

    public function getThumbImageUrl()
    {
        $prefix = 'blog/laravelblog/storage/';
        $r2Path = $prefix.$this->image_thumb_url;

        return Storage::url($r2Path);
    }
}
```

add `Category` model

```php
<?php
class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }
}
```

add `PostController` like this

```php
<?php

class PostController extends Controller
{
    public function index(): Response
    {
        $table = PostTable::build();

        return Inertia::render('builder/index', [
            'data' => $table,
        ]);
    }

    public function actions(): RedirectResponse
    {
        return PostTable::actions();
    }

    public function show(Post $post): Response
    {
        return Inertia::render('builder/show', [
            'form' => PostForm::view($post),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'form' => PostForm::create(),
        ]);
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('builder/edit', [
            'form' => PostForm::edit($post),
        ]);
    }

    public function store(PostStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data = $this->handlingUpload($data);
        $item = Post::create($data);
        $item->categories()->sync($data['categories']);

        return redirect()
            ->route('posts.index')
            ->with('success', 'Item '.$item->id.' created successfully.');
    }

    private function uploadFile(string $key, string $prefix): string
    {
        $file = request()->file($key);

        // path relatif yang akan disimpan di database
        $relativePath = $prefix.'/'.now()->format('Ymd-His').'-'.$file->getClientOriginalName();

        // prefix internal ke R2
        $prefix = 'blog/laravelblog/storage/';
        $r2Path = $prefix.$relativePath;

        // simpan file ke R2
        Storage::put($r2Path, file_get_contents($file));

        return $relativePath;
    }

    private function handlingUpload(array $data): array
    {
        if ($data['is_upload'] == 'yes') {
            if (request()->hasFile('image_main')) {
                $data['image_url'] = $this->uploadFile('image_main', 'posts');
            }
            if (request()->hasFile('image_twitter')) {
                $data['image_tw_url'] = $this->uploadFile('image_twitter', 'posts/twitter');
            }
            if (request()->hasFile('image_thumb')) {
                $data['image_thumb_url'] = $this->uploadFile('image_thumb', 'posts/thumbnail');
            }
        } else {
            $data['image_url'] = $data['image_main_path'];
            $data['image_tw_url'] = $data['image_twitter_path'];
            $data['image_thumb_url'] = $data['image_thumb_path'];
        }

        return $data;
    }

    public function update(PostUpdateRequest $request, Post $post): RedirectResponse
    {
        $data = $request->validated();
        $data = $this->handlingUpload($data);
        $post->update($data);
        $post->categories()->sync($data['categories']);

        return redirect()
            ->route('posts.edit', $post)
            ->with('success', 'Item '.$post->id.' updated successfully.');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return redirect()
            ->route('posts.index')
            ->with('success', 'Item '.$post->id.' deleted successfully.');
    }
}
```

add `CategoryController`

```php
<?php

namespace App\Http\Controllers;

use App\Builder\Forms\CategoryForm;
use App\Builder\Tables\CategoryTable;
use App\Http\Requests\CategoryStoreRequest;
use App\Http\Requests\CategoryUpdateRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $table = CategoryTable::build();

        return Inertia::render('builder/index', [
            'data' => $table,
            'tableRoute' => route('categories.index'),
            'routeName' => 'categories',
        ]);
    }

    public function actions(): RedirectResponse
    {
        return CategoryTable::actions();
    }

    public function show(Category $category): Response
    {
        return Inertia::render('builder/show', [
            'form' => CategoryForm::view($category),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'form' => CategoryForm::create(),
        ]);
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('builder/edit', [
            'form' => CategoryForm::edit($category),
        ]);
    }

    public function store(CategoryStoreRequest $request): RedirectResponse
    {
        $item = Category::create($request->validated());

        return redirect()
            ->route('categories.index')
            ->with('success', 'Item '.$item->id.' created successfully.');
    }

    public function update(CategoryUpdateRequest $request, Category $category): RedirectResponse
    {
        $category->update($request->validated());

        return redirect()
            ->route('categories.edit', $category)
            ->with('success', 'Item '.$category->id.' updated successfully.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return redirect()
            ->route('categories.index')
            ->with('success', 'Item '.$category->id.' deleted successfully.');
    }
}
```

add `CategoryForm`

```php
<?php

namespace App\Builder\Forms;

use App\Models\Category;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\FormContract;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;
use Jhonoryza\InertiaBuilder\Inertia\Form;
use Jhonoryza\InertiaBuilder\Inertia\Forms\Get;
use Jhonoryza\InertiaBuilder\Inertia\Forms\Set;

class CategoryForm implements FormContract
{
    public static function view(Model $state): Form
    {
        return Form::make(static::class)
            ->columns(1)
            ->model($state)
            ->view()
            ->schema([
                Field::text('name')
                    ->info(),
                Field::text('slug')
                    ->info(),
                Field::text('published_at')
                    ->info(),
            ]);
    }

    public static function edit(Model $state): Form
    {
        return Form::make(static::class)
            ->columns(1)
            ->model($state)
            ->edit()
            ->schema([
                Field::text('name')
                    ->formatStateUsing(fn ($state) => ucwords($state))
                    ->reactive()
                    ->afterStateUpdated(function ($state, Set $set) {
                        $set('slug', Str::slug($state));
                    }),
                Field::text('slug'),
                Field::flatpickr('published_at'),
            ]);
    }

    public static function create(): Form
    {
        return Form::make(static::class)
            ->columns(1)
            ->model(new Category)
            ->create()
            ->schema([
                Field::text('name')
                    ->formatStateUsing(fn ($state) => ucwords($state))
                    ->reactive()
                    ->afterStateUpdated(function ($state, Set $set) {
                        $set('slug', Str::slug($state));
                    }),
                Field::text('slug'),
                // ->hidden(function (Get $get) {
                //     return $get('name') == 'Aa';
                // }),
                Field::flatpickr('published_at'),
            ]);
    }
}
```

add `PostForm`

```php
<?php

namespace App\Builder\Forms;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\FormContract;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;
use Jhonoryza\InertiaBuilder\Inertia\Form;
use Jhonoryza\InertiaBuilder\Inertia\Forms\Get;

class PostForm implements FormContract
{
    public static function view(Model $state): Form
    {
        return Form::make(static::class)
            ->columns(1)
            ->model($state)
            ->view()
            ->schema([
                Field::text('title')
                    ->info(),
                Field::text('slug')
                    ->info(),
                Field::text('summary')
                    ->info(),
                Field::text('is_markdown')
                    ->info(),
                Field::text('is_highlighted')
                    ->info(),
                Field::text('categories')
                    ->info()
                    ->state(fn ($model) => $model->categories->pluck('name')->toArray()),
                Field::markdown('content')
                    ->info()->disable(),
                Field::text('published_at')
                    ->info(),
                Field::text('author_id')
                    ->info()
                    ->label('Author')
                    ->state(fn ($model) => $model->author->name),
                Field::file('main')
                    ->label('Image path')
                    ->state(fn (?Post $model) => $model?->getImageUrl())
                    ->info(),
                Field::file('twitter')
                    ->label('Image twitter path')
                    ->state(fn (?Post $model) => $model?->getTwitterImageUrl())
                    ->info(),
                Field::file('thumb')
                    ->label('Image thumb path')
                    ->state(fn (?Post $model) => $model?->getThumbImageUrl())
                    ->info(),
            ]);
    }

    public static function edit(Model $state): Form
    {
        return Form::make(static::class)
            ->columns(1)
            ->model($state)
            ->edit()
            ->schema([
                Field::text('title'),
                Field::text('slug'),
                Field::text('summary'),
                Field::toggle('is_markdown'),
                Field::toggle('is_highlighted'),
                Field::select('categories')
                    ->relationship(Category::class, 'name')
                    ->searchable()
                    ->multiple()
                    ->formatStateUsing(fn (?Post $model) => $model?->categories?->pluck('id')?->toArray()),
                Field::markdown('content'),
                Field::flatpickr('published_at'),
                Field::select('author_id')
                    ->label('Author')
                    ->searchable()
                    ->relationship(User::class, 'name'),
                Field::radio('is_upload')
                    ->label('Upload Image ?')
                    ->options([
                        ['label' => 'yes', 'value' => 'yes'],
                        ['label' => 'no', 'value' => 'no'],
                    ])
                    ->state('no')
                    ->reactive(),

                Field::file('image_main')
                    ->label('Image main')
                    ->hidden(fn (Get $get) => $get('is_upload') == 'no')
                    ->preview(fn (?Post $model) => $model?->getImageUrl()),
                Field::file('image_twitter')
                    ->label('Image twitter')
                    ->hidden(fn (Get $get) => $get('is_upload') == 'no')
                    ->preview(fn (?Post $model) => $model?->getTwitterImageUrl()),
                Field::file('image_thumb')
                    ->label('Image thumb')
                    ->hidden(fn (Get $get) => $get('is_upload') == 'no')
                    ->preview(fn (?Post $model) => $model?->getThumbImageUrl()),

                Field::text('image_main')
                    ->key('image_main_path')
                    ->label('Image main path')
                    ->hidden(fn (Get $get) => $get('is_upload') == 'yes')
                    ->state(fn (?Post $model) => $model?->image_url),
                Field::text('image_twitter')
                    ->key('image_twitter_path')
                    ->label('Image twitter path')
                    ->hidden(fn (Get $get) => $get('is_upload') == 'yes')
                    ->state(fn (?Post $model) => $model?->image_tw_url),
                Field::text('image_thumb')
                    ->key('image_thumb_path')
                    ->label('Image thumb path')
                    ->hidden(fn (Get $get) => $get('is_upload') == 'yes')
                    ->state(fn (?Post $model) => $model?->image_thumb_url),
            ]);
    }

    public static function create(): Form
    {
        return Form::make(static::class)
            ->columns(1)
            ->model(new Post)
            ->create()
            ->schema([
                Field::text('title'),
                Field::text('slug'),
                Field::text('summary'),
                Field::toggle('is_markdown'),
                Field::toggle('is_highlighted'),
                Field::select('categories')
                    ->relationship(Category::class, 'name')
                    ->searchable()
                    ->multiple()
                    ->formatStateUsing(fn (?Post $model) => $model?->categories?->pluck('id')?->toArray()),
                Field::markdown('content'),
                Field::flatpickr('published_at'),
                Field::select('author_id')
                    ->label('Author')
                    ->searchable()
                    ->relationship(User::class, 'name'),
                Field::radio('is_upload')
                    ->label('Upload Image ?')
                    ->options([
                        ['label' => 'yes', 'value' => 'yes'],
                        ['label' => 'no', 'value' => 'no'],
                    ])
                    ->state('no')
                    ->reactive(),

                Field::file('image_main')
                    ->label('Image path')
                    ->hidden(fn (Get $get) => $get('is_upload') == 'no'),
                Field::file('image_twitter')
                    ->label('Image twitter path')
                    ->hidden(fn (Get $get) => $get('is_upload') == 'no'),
                Field::file('image_thumb')
                    ->label('Image thumb path')
                    ->hidden(fn (Get $get) => $get('is_upload') == 'no'),

                Field::text('image_main')
                    ->key('main_path')
                    ->label('Image path')
                    ->hidden(fn (Get $get) => $get('is_upload') == 'yes'),
                Field::text('image_twitter')
                    ->key('twitter_path')
                    ->label('Image twitter path')
                    ->hidden(fn (Get $get) => $get('is_upload') == 'yes'),
                Field::text('image_thumb')
                    ->key('thumb_path')
                    ->label('Image thumb path')
                    ->hidden(fn (Get $get) => $get('is_upload') == 'yes'),
            ]);
    }
}
```

add `CategoryTable`

```php
<?php

namespace App\Builder\Tables;

use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\TableContract;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Actions\Action;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Table;
use Jhonoryza\InertiaBuilder\Inertia\Tables\TableColumn;

class CategoryTable implements TableContract
{
	public static function build(): Table
	{
	    return Table::make(Category::class)
            ->columns([
                TableColumn::make('id')
                    ->sortable(),
                TableColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('slug')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('published_at')
                    ->renderUsing(function ($value) {
                        return $value
                            ->format('d/m/Y H:i') ?? '-';
                    })
                    ->sortable(),
                TableColumn::make('created_at')
                    ->renderUsing(function ($value) {
                        return $value
                            ->format('d/m/Y H:i') ?? '-';
                    })
                    ->sortable(),
                TableColumn::make('updated_at')
                    ->renderUsing(function ($value) {
                        return $value
                            ->format('d/m/Y H:i') ?? '-';
                    })
                    ->sortable(),
            ])
            ->filters([
                Filter::text('name'),
                Filter::text('slug'),
                Filter::date('published_at'),
            ])
            ->defaultSort('id', 'asc')
            ->actions([
                Action::make('new')
                    ->needRowSelected(false)
                    ->needConfirm(false),
                Action::make('delete')
                    ->message('Delete this item?'),
            ]);
	}

	public static function actions(): RedirectResponse
	{
	    $action = request()->get('action');
        $ids = request()->get('ids');

        switch ($action) {
            case 'new':
                return redirect()->route('categories.create');
            case 'delete':
                Category::destroy($ids);

                return redirect()
                    ->route('categories.index')
                    ->with('success', 'Items '.collect($ids)->implode(', ').' deleted successfully.');
            default:
                return redirect()
                    ->route('categories.index')
                    ->with('failed', 'undefined action.');
        }
	}
}
```

add `PostTable`

```php
<?php

namespace App\Builder\Tables;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Jhonoryza\InertiaBuilder\Inertia\Concerns\TableContract;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Actions\Action;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Table;
use Jhonoryza\InertiaBuilder\Inertia\Tables\TableColumn;

class PostTable implements TableContract
{
    public static function build(): Table
    {
        return Table::make(Post::class)
            ->columns([
                TableColumn::make('id')
                    ->sortable(),
                TableColumn::make('slug')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('author.name')
                    ->label('Author')
                    ->sortable(),
                TableColumn::make('categories.name')
                    ->label('Categories')
                    ->sortable(),
                TableColumn::make('published_at')
                    ->renderUsing(function ($value) {
                        return $value
                            ?->format('d/m/Y H:i') ?? '-';
                    })
                    ->sortable(),
                TableColumn::make('created_at')
                    ->renderUsing(function ($value) {
                        return $value
                            ->format('d/m/Y H:i') ?? '-';
                    })
                    ->sortable(),
                TableColumn::make('updated_at')
                    ->renderUsing(function ($value) {
                        return $value
                            ->format('d/m/Y H:i') ?? '-';
                    })
                    ->sortable(),
            ])
            ->filters([
                Filter::text('title'),
                Filter::text('slug'),
                Filter::date('published_at'),
                Filter::select('author_id')
                    ->label('Author')
                    ->relationship(User::class, 'name', 'name')
                    ->query(fn($query, $op, $val) => $query->whereHas('author', function ($q) use ($op, $val) {
                        $q->where('name', $op, $val);
                    })),
                Filter::boolean('is_markdown'),
                Filter::boolean('is_highlighted'),
            ])
            ->defaultSort('created_at', 'desc')
            ->actions([
                Action::make('new')
                    ->needRowSelected(false)
                    ->needConfirm(false),
                Action::make('delete')
                    ->message('Delete this item?'),
            ]);
    }

    public static function actions(): RedirectResponse
    {
        $action = request()->get('action');
        $ids = request()->get('ids');

        switch ($action) {
            case 'new':
                return redirect()->route('posts.create');
            case 'delete':
                Post::destroy($ids);

                return redirect()
                    ->route('posts.index')
                    ->with('success', 'Items ' . collect($ids)->implode(', ') . ' deleted successfully.');
            default:
                return redirect()
                    ->route('posts.index')
                    ->with('failed', 'undefined action.');
        }
    }
}

```
