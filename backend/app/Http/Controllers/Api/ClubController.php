<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Club;
use Illuminate\Http\Request;

class ClubController extends Controller
{
    public function index()
    {
        return response()->json(Club::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'profile_photo_url' => 'required|string',
        ]);

        $club = Club::create($request->all());

        return response()->json($club, 201);
    }

    public function show(Club $club)
    {
        return response()->json($club);
    }

    public function update(Request $request, Club $club)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $club->update($request->all());

        return response()->json($club);
    }

    public function destroy(Club $club)
    {
        $club->delete();

        return response()->json(null, 204);
    }
}
