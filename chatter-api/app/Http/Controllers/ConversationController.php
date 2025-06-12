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

}
