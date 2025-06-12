<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Testing\Fluent\Concerns\Has;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'fan_id',
    ];

}
