<?php

namespace App\Http\Controllers;

use App\Models\Fan;
use Illuminate\Http\Request;

class FanController extends Controller
{
public function index()
{
    try {
        $fans = Fan::all();
        return response()->json($fans);
    } catch (\Exception $e) {
        return response('Error fetching fans: ' . $e->getMessage(), 500);
    }
}

public function show($id)
{
    try {
        $fan = Fan::findOrFail($id);
        return response()->json($fan);
    } catch (\Exception $e) {
        return response('Error fetching fan: ' . $e->getMessage(), 500);
    }
}

}
