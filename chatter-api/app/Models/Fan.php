<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fan extends Model
{
    use HasFactory;

    protected $fillable = [
        'username',
        'display_name',
        'total_spent',
    ];

    protected $casts = [
        'total_spent' => 'decimal:2',
    ];

}
