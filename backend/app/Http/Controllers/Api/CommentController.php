<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\CommentLike;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function index(Event $event)
    {
        return response()->json($event->comments()->with('user', 'likes', 'replies')->get());
    }

    public function store(Request $request, Event $event)
    {
        $request->validate([
            'body' => 'required|string',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = $event->comments()->create([
            'user_id' => Auth::id(),
            'body' => $request->body,
            'parent_id' => $request->parent_id,
        ]);

        return response()->json($comment->load('user'), 201);
    }

    public function update(Request $request, Event $event, Comment $comment)
    {
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $request->validate([
            'body' => 'required|string',
        ]);

        $comment->update($request->all());

        return response()->json($comment);
    }

    public function destroy(Event $event, Comment $comment)
    {
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $comment->delete();

        return response()->json(null, 204);
    }

    public function like(Request $request, Comment $comment)
    {
        $user = Auth::user();

        $like = CommentLike::where('user_id', $user->id)->where('comment_id', $comment->id)->first();

        if ($like) {
            $like->delete();
            return response()->json(['message' => 'Comment unliked.']);
        } else {
            CommentLike::create([
                'user_id' => $user->id,
                'comment_id' => $comment->id,
            ]);
            return response()->json(['message' => 'Comment liked.']);
        }
    }
}
