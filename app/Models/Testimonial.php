<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'name',
        'batch',
        'job',
        'company',
        'quote',
        'photo',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name');
    }

    /**
     * Foto dikembalikan sebagai URL siap pakai.
     * Nilai mentah (path di disk) tetap bisa dibaca lewat getRawOriginal('photo').
     */
    protected function photo(): Attribute
    {
        return Attribute::get(function (?string $value) {
            if (! $value) {
                return null;
            }

            return str_starts_with($value, 'http')
                ? $value
                : '/storage/' . ltrim($value, '/');
        });
    }
}
