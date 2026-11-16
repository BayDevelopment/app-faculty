<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    protected $fillable = [
        'name', 'university', 'tagline', 'description', 'hero_image',
        'vision', 'missions', 'address', 'email', 'phone',
    ];

    protected $casts = [
        'missions' => 'array',
    ];
}
