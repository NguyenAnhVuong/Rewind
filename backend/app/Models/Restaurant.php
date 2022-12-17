<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'phone',
        'description',
        'user_id',
        'avatar'
    ];

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function images()
    {
        return $this->hasMany(Restaurant_Image::class);
    }
}
