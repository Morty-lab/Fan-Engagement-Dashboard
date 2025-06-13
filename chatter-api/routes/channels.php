<?php
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('conversation.{id}', function () {
    return true; // 👈 Public channel
});
