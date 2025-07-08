<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields;

use Jhonoryza\InertiaBuilder\Inertia\Fields\Base\AbstractField;
use Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns\HasFlatpickrConfig;

class FlatpickrField extends AbstractField
{
    use HasFlatpickrConfig;

    public function __construct(string $name)
    {
        parent::__construct($name);
        $this->setConfig();
    }

    protected static function getType(): string
    {
        return 'flatpickr';
    }

    /**
     * Convert the field to an array
     */
    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'mode'       => $this->mode,
            'config'     => $this->config,
            'withTime'   => $this->withTime,
            'utcConvert' => $this->utcConvert,
        ]);
    }
}
