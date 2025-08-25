<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

trait HasType
{
    protected string $type;

	public function type(string $type): static
	{
		$this->type = $type;

		return $this;	    
	}

	public function getType(): string
	{
		return $this->type;	    
	}

}