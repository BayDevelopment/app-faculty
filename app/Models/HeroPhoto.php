<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// app/Models/HeroPhoto.php
class HeroPhoto extends Model
{
    protected $fillable = ['posisi', 'gambar', 'alt', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    protected $appends = ['url'];

    public function getUrlAttribute(): string
    {
        return str_starts_with($this->gambar, 'http')
            ? $this->gambar
            : asset('storage/' . $this->gambar);
    }
}
