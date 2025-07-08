<?php

namespace Jhonoryza\InertiaBuilder\Inertia\Fields\Concerns;

trait HasFlatpickrConfig
{
    // One of: single, multiple, range, time
    public ?string $mode = 'single';
    public bool $withTime = true;
    public ?array $config = [];
    public bool $utcConvert = false;
    const string DEFAULT_DATE_FORMAT = 'd/m/Y';
    const string DEFAULT_DATETIME_FORMAT = 'd/m/Y H:i:S';
    const string ALT_DATE_FORMAT = 'j F Y';
    const string ALT_DATETIME_FORMAT = 'j F Y H:i:S';

    /**
     * Set the mode for the flatpickr
     * @param string $mode One of: single, multiple, range, time
     */
    public function mode(string $mode): static
    {
        $this->mode = $mode;
        $this->setConfig();
        return $this;
    }

    /**
     * Set additional configuration options for flatpickr
     */
    public function config(array $config): static
    {
        $this->config = array_merge($this->config, $config);
        return $this;
    }

    protected function setConfig(): void
    {
        $this->config([
            'mode' => $this->mode,
            'enableTime' => $this->withTime,
            'dateFormat' => $this->withTime === false ?
                self::DEFAULT_DATE_FORMAT : self::DEFAULT_DATETIME_FORMAT,
            'altInput' => false,
            'altFormat' => $this->withTime === false ?
                self::ALT_DATE_FORMAT : self::ALT_DATETIME_FORMAT,
            'time_24hr' => true,
            'defaultHour' => 0,
            'defaultMinute' => 0,
            'allowInput' => true,
            'clickOpens' => true,
            // 'minDate' => 'today'
        ]);
    }

    public function multiple(): static
    {
        $this->mode = 'multiple';
        $this->setConfig();
        return $this;
    }

    public function range(): static
    {
        $this->mode = 'range';
        $this->setConfig();
        return $this;
    }

    public function time(): static
    {
        $this->mode = 'time';
        $this->setConfig();
        return $this;
    }

    public function date(): static
    {
        $this->withTime = false;
        $this->config['enableTime'] = $this->withTime;
        $this->config['dateFormat'] = $this->withTime === false ?
            self::DEFAULT_DATE_FORMAT : self::DEFAULT_DATETIME_FORMAT;
        $this->config['altFormat'] = $this->withTime === false ?
            self::ALT_DATE_FORMAT : self::ALT_DATETIME_FORMAT;
        $this->setConfig();
        return $this;
    }

    public function disableUtcConvert(): static
    {
        $this->utcConvert = false;
        return $this;
    }
}
