<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(FanSeeder::class);
        $this->call(ConversationSeeder::class);
        $this->call(MessageSeeder::class);
        $this->call(TemplateSeeder::class);

    }
}
