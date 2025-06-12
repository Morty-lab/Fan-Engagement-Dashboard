<?php

namespace Database\Seeders;

use App\Models\Template;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
     public function run(): void
    {
        Template::create(['title' => 'Welcome Message', 'body' => 'Hi, beautiful! Thanks for joining my OnlyFans. I hope you enjoy the content. Let me know what you’re into and I can make sure to create more of it. 💕']);
        Template::create(['title' => 'Conversion Prompt', 'body' => 'Hey, sweetheart! I noticed you haven’t unlocked any of my exclusive content yet. If you want to see some really hot stuff, join my VIP now! 😉']);
        Template::create(['title' => 'Follow Up', 'body' => 'Hey, gorgeous! Just checking in. Want to see some new, juicy content? Let me know what you’re into and I’ll make sure to create it. 💋']);
    }
}
