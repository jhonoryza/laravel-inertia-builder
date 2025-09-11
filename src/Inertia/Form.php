<?php

namespace Jhonoryza\InertiaBuilder\Inertia;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasColumns;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasFields;
use JsonSerializable;

class Form implements JsonSerializable
{
    use HasColumns, HasFields;

    /**
     * this is used for form model
     */
    protected ?Model $model = null;

    /**
     * this is used for form internal state
     * when model is loaded, this variable will be filled
     * from the model field value
     */
    public array $state = [];

    /**
     * this is used for route resolver in AppFormBuilderAction
     * route(baseRoute + .edit)
     * ex: .edit .show .destroy .forceDestroy .restore
     * form post or patch is handled by inertia useForm
     */
    protected ?string $baseRoute = null;

    /**
     * this is used for route resolver in AppFormBuilderAction
     * you can set this routeId with ex: $model->id
     */
    protected string|int|null $routeId = null;

    /**
     * this is used for which button should be displayed in AppFormBuilderAction
     * mode: show, edit, create
     */
    protected string $mode = '';

    /**
     * this is used for inertia builder internal api route
     * to identify which form class is should be called
     * when state is changed
     */
    protected ?string $formClass = null;

    /**
     * this is used for form title
     */
    protected string $title = '';

    protected bool $canEdit = true;

    public function __construct(string $formClass)
    {
        $this->formClass = $formClass;
    }

    public static function make(string $formClass): static
    {
        return new static($formClass);
    }

    public function model(Model|null|array $model): static
    {
        if (is_array($model)) {
            $this->state($model);
        }
        if ($model && ! is_array($model)) {
            $this->model     = $model;
            $this->baseRoute = $this->baseRoute == null ? Str::plural(Str::snake(class_basename($model))) : $this->baseRoute;
            $this->title     = $this->title     == null ? Str::headline(class_basename($model)) : $this->title;
            $this->routeId   = $this->routeId   == null ? ($model->id ?? null) : $this->routeId;
        }

        return $this;
    }

    public function title(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function baseRoute(string $baseRoute): static
    {
        $this->baseRoute = $baseRoute;

        return $this;
    }

    public function routeId(string|int|null $routeId): static
    {
        $this->routeId = $routeId;

        return $this;
    }

    public function create(): static
    {
        $this->mode = 'create';

        return $this;
    }

    public function edit(): static
    {
        $this->mode = 'edit';

        return $this;
    }

    public function canEdit($state = true): static
    {
        $this->canEdit = $state;

        return $this;
    }

    public function view(): static
    {
        $this->mode = 'show';

        return $this;
    }

    public function formClass(string $class): static
    {
        $this->formClass = $class;

        return $this;
    }

    public function state(array $state): static
    {
        if (! empty($state)) {
            $this->state = $state;
        }

        return $this;
    }

    // will be called when there is reactive call from frontend
    public function handleLiveUpdate(string $key, $value, array &$state): void
    {
        /** @var AbstractField|null $field */
        $field = $this->findField($key);

        // skip if not found or not reactive
        if (! $field || ! $field->getIsReactive()) {
            return;
        }

        // trigger after state update callback if has one
        $field->triggerAfterStateUpdated($value, $state);

        // update the rest field state
        foreach ($this->getFields() as $f) {
            /** @var AbstractField $f */
            $f->form($this);

            $this->state[$f->getKey()] = $f->hasStateCallback() ? $f->getState() : $state[$f->getKey()];
        }
    }

    public function getModel(): ?Model
    {
        return $this->model;
    }

    public function getModelName(): string
    {
        return Str::camel(class_basename($this->model));
    }

    public function getState(): array
    {
        return $this->state;
    }

    // why the form class must have a state containing the state data of all fields
    // it is to override the state of a field when another field’s state changes
    // called during initial load or when there are changes from the frontend
    public function evaluateFields(): array
    {
        return collect($this->getFields())
            ->map(function (AbstractField $field) {

                // set form state to field state
                $field->form($this);
                $formState = $this->state[$field->getKey()] ?? null;
                $field->state($formState);

                return $field;
            })
            ->toArray();
    }

    /**
     * when form state is empty, we need to filled the form state
     * from model field value
     * or from field state when it is available
     */
    private function checkisStateEmpty(): void
    {
        if (empty($this->state)) {
            foreach ($this->getFields() as $field) {
                $field->form($this);

                $state      = $this->model?->{$field->getKey()} ?? null;
                $fieldState = $field->getState();
                $state      = $fieldState !== null ? $fieldState : $state;

                $this->state[$field->getKey()] = $state;
            }
        }
    }

    public function jsonSerialize(): array
    {
        $this->checkisStateEmpty();

        return [
            'columns'    => $this->getColumns(),
            'fields'     => $this->evaluateFields(),
            'baseRoute'  => $this->baseRoute,
            'modelClass' => get_class($this->model),
            'routeId'    => $this->routeId,
            'mode'       => $this->mode,
            'formClass'  => $this->formClass,
            'title'      => $this->title,
            'canEdit'    => $this->canEdit,
        ];
    }
}
