<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'content',
        'rating',
        'user_id',
        'restaurant_id'
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}
