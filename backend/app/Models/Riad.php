<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Riad extends Model
{
    protected $guarded = []; // Allow mass assignment for all fields

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
