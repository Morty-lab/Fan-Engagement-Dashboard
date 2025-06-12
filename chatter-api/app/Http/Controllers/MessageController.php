<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{

    public function index()
    {
        try {
            $messages = Message::all();
            return response()->json($messages);
        } catch (\Exception $e) {
            return response('Error fetching messages: ' . $e->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
            $messages = Message::where('conversation_id', $id)->get();
            return response()->json($messages);
        } catch (\Exception $e) {
            return response('Error fetching messages: ' . $e->getMessage(), 500);
        }
    }


    public function store(Request $request)
    {
        try {
            $message = Message::create([
                'conversation_id' => $request->input('conversation_id'),
                'sender' => $request->input('sender'),
                'content' => $request->input('content')
            ]);
            return response()->json($message);
        } catch (\Exception $e) {
            return response('Error creating message: ' . $e->getMessage(), 500);
        }
    }
}
