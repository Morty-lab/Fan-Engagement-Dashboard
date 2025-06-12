<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Fan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ConversationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
   {
        $fans = Fan::all();

        foreach ($fans as $fan) {
            Conversation::factory()->count(2)->create([
                'fan_id' => $fan->id,
            ]);
        }

    }
}
