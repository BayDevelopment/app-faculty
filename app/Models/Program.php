<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $fillable = [
        'slug', 'name', 'degree', 'accreditation', 'description',
        'hero_image', 'overview', 'vision', 'duration', 'credits',
        'head_name', 'head_title', 'head_photo',
        'competencies', 'curriculum', 'career_prospects', 'facilities', 'admission_requirements',
        'contact_email', 'contact_phone',
        'student_count', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'student_count' => 'integer',
        'credits' => 'integer',
        'is_active' => 'boolean',
        'competencies' => 'array',
        'curriculum' => 'array',
        'career_prospects' => 'array',
        'facilities' => 'array',
        'admission_requirements' => 'array',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
}
