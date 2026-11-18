<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $table = 'news';

    protected $fillable = [
        'slug',
        'title',
        'excerpt',
        'content',
        'category',
        'image',
        'published_at',
        'is_published',
    ];

    protected $casts = [
        'published_at' => 'date:Y-m-d',
        'is_published' => 'boolean',
    ];

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true)
            ->whereDate('published_at', '<=', now())
            ->latest('published_at')
            ->latest('id');
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
