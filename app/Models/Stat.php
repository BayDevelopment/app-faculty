<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Stat extends Model
{
    protected $fillable = [
        'label',
        'value',
        'suffix',
        'image',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'value' => 'integer',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id');
    }

    /**
     * Gambar dikembalikan sebagai URL siap pakai.
     * Nilai mentah (path di disk) tetap bisa dibaca lewat getRawOriginal('image').
     */
    protected function image(): Attribute
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
