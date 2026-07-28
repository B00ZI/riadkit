<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('riad.{riadId}.reception', function (User $user, int $riadId) {
    return (int) $user->riad_id === (int) $riadId;
});