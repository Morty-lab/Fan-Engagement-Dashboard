<?php

namespace Database\Seeders;

use App\Models\Fan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          Fan::factory()->count(10)->create();
    }
}
