<?php

use App\Http\Controllers\Api\ClubController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\Admin;
use App\Http\Middleware\SuperAdmin;


// Public Auth route
Route::post('/login', [UserController::class, 'login']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {

    Route::post('/logout', [UserController::class, 'logout']);

    // Superadmin routes
    Route::middleware([SuperAdmin::class])->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('clubs', ClubController::class);
    });

    // Admin routes
    Route::middleware([Admin::class])->group(function () {
        Route::apiResource('events', EventController::class)->except(['index', 'show']);
    });

    // Common user routes
    Route::apiResource('events', EventController::class)->only(['index', 'show']);
    Route::post('events/{event}/register', [EventController::class, 'register']);
    Route::post('events/{event}/cancel-registration', [EventController::class, 'cancelRegistration']);
    Route::apiResource('events.comments', CommentController::class);
    Route::post('comments/{comment}/like', [CommentController::class, 'like']);
});
