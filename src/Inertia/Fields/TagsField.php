<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;

class TagsField extends AbstractField
{
    public ?array $suggestions = null;
    public ?string $separator = ',';
    public ?string $addButtonLabel = null;
    public ?int $maxTags = 100;
    public ?string $tagPrefix = null;

    protected static function getType(): string
    {
        return 'tags';
    }

    /**
     * Set the tag suggestions
     * Example ['Laravel', 'PHP']
     */
    public function suggestions(array $suggestions): static
    {
        $this->suggestions = $suggestions;
        return $this;
    }

    /**
     * Set the separator character used to add multiple tags at once
     */
    public function separator(string $separator): static
    {
        $this->separator = $separator;
        return $this;
    }

    /**
     * Set the add button label
     */
    public function addButtonLabel(string $label): static
    {
        $this->addButtonLabel = $label;
        return $this;
    }

    /**
     * Set the maximum number of tags allowed
     */
    public function maxTags(int $maxTags): static
    {
        $this->maxTags = $maxTags;
        return $this;
    }

    /**
     * Set a prefix for all tags (e.g., '#')
     */
    public function tagPrefix(string $prefix): static
    {
        $this->tagPrefix = $prefix;
        return $this;
    }

    /**
     * Convert the field to an array
     */
    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'suggestions' => $this->suggestions,
            'separator' => $this->separator,
            'addButtonLabel' => $this->addButtonLabel ?? 'Add Tag',
            'maxTags' => $this->maxTags,
            'tagPrefix' => $this->tagPrefix,
        ]);
    }
}
