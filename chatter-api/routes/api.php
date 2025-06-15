<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\FanController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\TemplateController;
use App\Models\Message;
use App\Events\MessageSent;

//conversation routes
Route::get('/conversations', [ConversationController::class, 'index']);
Route::get('/conversation/{id}', [ConversationController::class, 'show']);
Route::post('/conversation/{id}/mark-read', [ConversationController::class, 'markAsRead']);
Route::put('/conversation/{id}/priority', [ConversationController::class, 'setPriority']);


//fan routes
Route::get('/fan/{id}', [FanController::class, 'show']);

//message routes
Route::post('/message', [MessageController::class, 'store']);
Route::get('/messages', [MessageController::class, 'index']);
Route::get('/message/{id}', [MessageController::class, 'show']);

//template routes
Route::get('/templates', [TemplateController::class, 'index']);
Route::post('/template', [TemplateController::class, 'store']);
Route::put('/template/{id}', [TemplateController::class, 'update']);
Route::delete('/template/{id}', [TemplateController::class, 'delete']);


Route::get('/broadcast-test', function () {
     $message = Message::first();
    if (!$message) {
        return 'No message found';
    }
    event(new MessageSent($message));
    return 'Event broadcasted';
});
