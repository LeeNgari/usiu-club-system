<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'cover_image', 'event_date', 'start_time', 'end_time', 'club_id', 'registrations_count', 'max_seats', 'seats_available'];

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function eventRegistrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
