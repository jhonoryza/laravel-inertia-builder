<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

trait HasDebounce
{
	protected int $debounce = 300;

	public function debounce(int $miliSecond): static
	{
		$this->debounce = $miliSecond;

		return $this;
	} 

	public function getDebounce(): int
	{
		return $this->debounce;	    
	}
}