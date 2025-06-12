<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\Request;

class TemplateController extends Controller
{

    public function index()
    {
        $templates = Template::all();
        return response($templates, 200);
    }


    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'body' => 'required|string'
        ]);

        $template = Template::create($request->only(['title', 'body']));

        return response($template, 201);
    }

    public function update(Request $request, $id)
    {
        $template = Template::find($id);
        $template->update($request->all());
        return response($template, 200);
    }

    public function delete($id)
    {
        $template = Template::find($id);
        $template->delete();
        return response()->json(null, 204);
    }
}
