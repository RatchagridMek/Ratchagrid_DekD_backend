<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class forum extends Model
{
    use HasFactory;
    protected $table_name = 'forums';
    protected $fillable = [
        'forum_header',
        'forum_content',
    ];
}
