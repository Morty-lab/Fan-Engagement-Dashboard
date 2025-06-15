<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class ConversationController extends Controller
{


    public function index()
    {
        try {
            $conversations = Conversation::all();
            return response()->json($conversations);
        } catch (\Exception $e) {
            return response('Error fetching conversations: ' . $e->getMessage(), 500);
        }
    }


    public function show($id)
    {
        try {
            $conversation = Conversation::findOrFail($id);
            $messages = Message::where('conversation_id', $id)->get();
            $conversation->messages = $messages;
            return response()->json($conversation);
        } catch (\Exception $e) {
            return response('Error fetching conversation: ' . $e->getMessage(), 500);
        }
    }


    public function markAsRead($id)
    {
        try {
            $messages = Message::where('conversation_id', $id)
                ->where('is_read', 0)
                ->get();
            foreach ($messages as $message) {
                $message->is_read = 1;
                $message->save();
            }
            return response()->json(['message' => 'Successfully marked messages as read']);
        } catch (\Exception $e) {
            return response('Error marking messages as read: ' . $e->getMessage(), 500);
        }

    }

    public function setPriority($id, Request $request)
    {
        try {
            $conversation = Conversation::findOrFail($id);
            $conversation->priority_level = $request->input('priority_level');
            $conversation->save();
            return response()->json(['message' => 'Successfully updated priority level']);
        } catch (\Exception $e) {
            return response('Error updating priority level: ' . $e->getMessage(), 500);
        }
    }

}
