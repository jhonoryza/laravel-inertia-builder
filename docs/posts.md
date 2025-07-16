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
        Schema::disableForeignKeyConstraints();

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 400);
            $table->softDeletesTz();
            $table->timestampsTz();
        });

        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title', 400);
            $table->text('description')->nullable();
            $table->longText('content');
            $table->foreignId('author_id')->constrained('users');
            $table->foreignId('category_id')->constrained('categories');
            $table->boolean('published')->default(false);
            $table->date('published_at')->nullable();
            $table->dateTimeTz('expired_at')->nullable();
            $table->jsonb('tags')->nullable();
            $table->text('thumbnail')->nullable();
            $table->softDeletesTz();
            $table->timestampsTz();
        });

        \App\Models\Post::factory()->count(100)->create();

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
        Schema::dropIfExists('categories');
    }
};
```

generate scaffolding 

```bash
php artisan inertia-builder:categories
php artisan inertia-builder:posts
```

edit `PostController` like this

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostStoreRequest;
use App\Http\Requests\PostUpdateRequest;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Factory\Field;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Options\Option;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Actions\Action;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Filters\Factory\Filter;
use Jhonoryza\InertiaBuilder\Inertia\Tables\Table;
use Jhonoryza\InertiaBuilder\Inertia\Tables\TableColumn;
use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(): Response
    {
        $table = Table::make(Post::class)
            //->modifyQueryUsing(fn($query) => $query->whereNotNull('published_at'))
            ->columns([
                TableColumn::make('id')
                    ->label('ID')
                    ->sortable(),
                TableColumn::make('title')
                    ->label('Title')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('author.name')
                    ->label('Author')
                    ->searchable()
                    ->sortable(),
                TableColumn::make('published')
                    ->label('Is Published')
                    ->renderUsing(function ($value) {
                        return $value ? 'Yes' : 'No';
                    }),
                TableColumn::make('published_at')
                    ->label('Published At')
                    ->sortable()
                    ->renderUsing(function ($value) {
                        return $value
                            ?->format('d/m/Y') ?? '-';
                    }),
                TableColumn::make('expired_at')
                    ->label('Expired At')
                    ->sortable()
                    ->renderUsing(function ($value) {
                        return $value
                            ?->format('d/m/Y H:i') ?? '-';
                    }),
                TableColumn::make('created_at')
                    ->label('Created')
                    ->sortable()
                    ->hidden()
                    ->renderUsing(function ($value) {
                        return $value
                            ->format('d/m/Y H:i') ?? '-';
                    }),
                TableColumn::make('updated_at')
                    ->label('Updated')
                    ->sortable()
                    ->renderUsing(function ($value) {
                        return $value
                            ->format('d/m/Y H:i') ?? '-';
                    }),
            ])
            ->filters([
                Filter::number('id'),
                Filter::text('title'),
                Filter::select('author.name')
                    ->label('Author')
                    ->searchable()
                    ->relationship(User::class, 'name', 'name'),
//                    ->loadOptionsUsing(function () {
//                        return User::all();
//                    }),
                Filter::date('published_at'),
                Filter::date('expired_at'),
//                Filter::boolean('published')
//                    ->label('Is Published'),
                Filter::select('published')
                    ->operators()
                    ->query(fn ($query, $op, $val) => $val ? $query->whereNotNull('published_at') : $query->whereNull('published_at'))
                    ->options([
                        Option::make(true)
                            ->label('Published'),
                        Option::make(false)
                            ->label('Unpublished'),
                    ]),
//                Filter::custom('rating')
//                    ->component('rating')
            ])
            ->defaultSort('id', 'desc')
            ->actions([
                Action::make('new')
                    ->needRowSelected(false)
                    ->needConfirm(false),
                Action::make('delete')
                    ->message('Delete this post?'),
                Action::make('publish')
                    ->message('Publish this post?'),
                Action::make('unpublish')
                    ->message('Unpublish this post?'),
            ]);

        return Inertia::render('builder/index', [
            'data' => $table,
            'routeName' => 'posts',
        ]);
    }

    public function actions(Request $request): RedirectResponse
    {
        $action = $request->get('action');
        $ids = $request->get('ids');

        switch ($action) {
            case 'new':
                return redirect()->route('posts.create');
            case 'delete':
                Post::destroy($ids);
                return redirect()->route('posts.index')
                    ->with('description', collect($ids)->implode(', '))
                    ->with('success', 'Post deleted successfully.');
            case 'publish':
                Post::whereIn('id', $ids)->update(['published' => true]);
                return redirect()->route('posts.index')
                    ->with('description', collect($ids)->implode(', '))
                    ->with('success', 'Post published successfully.');
            case 'unpublish':
                Post::whereIn('id', $ids)->update(['published' => false]);
                return redirect()->route('posts.index')
                    ->with('description', collect($ids)->implode(', '))
                    ->with('success', 'Post unpublished successfully.');
            default:
                return redirect()->route('posts.index')
                    ->with('failed', 'undefined action.');

        }
    }

    private function getFormFields(?Post $post = null, $disable = false): array
    {
        return [
            Field::text('title')
                ->disable($disable)
                ->defaultValue($post?->title)
                ->placeholder('Enter post title'),
            Field::textarea('description')
                ->disable($disable)
                ->defaultValue($post?->description),
            Field::markdown('content')
                ->disable($disable)
                ->defaultValue($post?->content)
                ->placeholder('Write your content here...'),
            Field::select('category_id')
                ->disable($disable)
                ->defaultValue($post?->category_id)
                ->label('Category')
                ->placeholder('Choose an option')
                ->relationship(Category::class, 'name'),
            Field::select('author_id')
                ->disable($disable)
                ->defaultValue($post?->author_id)
                ->label('Author')
                ->placeholder('Choose an option')
                ->searchable()
                ->relationship(User::class, 'name'),
            Field::toggle('published')
                ->label('Published ?')
                ->disable($disable)
                ->defaultValue($post?->published),
//            Field::select('published')
//                ->defaultValue($post?->published)
//                ->options([
//                    Option::make(true)
//                        ->label('Published'),
//                    Option::make(false)
//                        ->label('Unpublished'),
//                ]),
            Field::flatpickr('published_at')
                ->disable($disable)
                ->defaultValue($post?->published_at)
                ->date()
                ->placeholder('Select published date'),
            Field::flatpickr('expired_at')
                ->disable($disable)
                ->placeholder('Select expired date')
                ->defaultValue($post?->expired_at),
            Field::tags('tags')
                ->disable($disable)
                ->defaultValue($post?->tags),
            Field::file('thumbnail')
                ->disable($disable)
                ->defaultValue($post?->thumbnail),
        ];
    }

    public function show(Post $post): Response
    {
        return Inertia::render('builder/show', [
            'fields' => $this->getFormFields($post, true),
            'routeName' => 'posts',
            'routeId' => $post->id,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('builder/create', [
            'fields' => $this->getFormFields(),
            'routeName' => 'posts',
        ]);
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('builder/edit', [
            'fields' => $this->getFormFields($post),
            'routeName' => 'posts',
            'routeId' => $post->id,
        ]);
    }

    public function store(PostStoreRequest $request): RedirectResponse
    {
        $post = Post::create($request->validated());

        return redirect()->route('posts.index')
            ->with('description', $post->title)
            ->with('success', 'Post created successfully.');
    }

    public function update(PostUpdateRequest $request, Post $post): RedirectResponse
    {
        $post->update($request->validated());

        return redirect()->route('posts.edit', $post)
            ->with('description', $post->title)
            ->with('success', 'Post updated successfully.');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return redirect()->route('posts.index')
            ->with('description', $post->title)
            ->with('success', 'Post deleted successfully.');
    }
}

```

edit `Post` model and find this relation change to `User`

```php
    public function author(): BelongsTo
    {

        return $this->belongsTo(User::class);

    }
```

edit `CategoryController` and find this code add null safety `?` to `$value`

```php
                TableColumn::make('deleted_at')
                    ->renderUsing(function ($value) {
                        return $value
                            ?->format('d/m/Y H:i') ?? '-';
                    })
                    ->hidden()
                    ->sortable(),
```