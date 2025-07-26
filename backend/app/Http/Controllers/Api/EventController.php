<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\EventRegistrationConfirmation;

class EventController extends Controller
{
    public function index()
    {
        return response()->json(Event::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'cover_image' => 'nullable|string',
            'event_date' => 'required|date',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'club_id' => 'required|exists:clubs,id',
        ]);

        $user = Auth::user();

        if ($user->role === 'admin' && $user->club_id !== (int)$request->club_id) {
            return response()->json(['message' => 'Unauthorized to create events for this club.'], 403);
        }

        $event = Event::create($request->all());

        return response()->json($event, 201);
    }

    public function show(Event $event)
    {
        return response()->json($event);
    }

    public function update(Request $request, Event $event)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'cover_image' => 'nullable|string',
            'event_date' => 'sometimes|required|date',
            'start_time' => 'sometimes|required|date',
            'end_time' => 'sometimes|required|date|after:start_time',
            'club_id' => 'sometimes|required|exists:clubs,id',
        ]);

        $user = Auth::user();

        if ($user->role === 'admin' && $user->club_id !== $event->club_id) {
            return response()->json(['message' => 'Unauthorized to update events for this club.'], 403);
        }

        $event->update($request->all());

        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        $user = Auth::user();

        if ($user->role === 'admin' && $user->club_id !== $event->club_id) {
            return response()->json(['message' => 'Unauthorized to delete events for this club.'], 403);
        }

        $event->delete();

        return response()->json(null, 204);
    }

    public function register(Request $request, Event $event)
    {
        $user = Auth::user();

        if ($event->registrations_count >= 50) {
            return response()->json(['message' => 'Event registration limit reached.'], 400);
        }

        $registration = EventRegistration::firstOrCreate(
            ['user_id' => $user->id, 'event_id' => $event->id]
        );

        if ($registration->wasRecentlyCreated) {
            $event->increment('registrations_count');
            Mail::to($user->email)->send(new EventRegistrationConfirmation($event, $user));
        }

        return response()->json($registration, 201);
    }

    public function cancelRegistration(Request $request, Event $event)
    {
        $user = Auth::user();

        $deleted = EventRegistration::where('user_id', $user->id)
                                    ->where('event_id', $event->id)
                                    ->delete();

        if ($deleted) {
            $event->decrement('registrations_count');
            return response()->json(['message' => 'Registration cancelled successfully.']);
        }

        return response()->json(['message' => 'No registration found for this event.'], 404);
    }
}
