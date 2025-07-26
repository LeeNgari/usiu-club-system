<?php

namespace Database\Seeders;

use App\Models\Club;
use App\Models\Event;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csClub = Club::where('name', 'Computer Science Club')->first();
        $roboticsClub = Club::where('name', 'Robotics Club')->first();

        if ($csClub) {
            Event::create([
                'title' => 'AI Workshop',
                'description' => 'An introductory workshop on Artificial Intelligence.',
                'start_time' => '2025-08-10 10:00:00',
                'end_time' => '2025-08-10 12:00:00',
                'club_id' => $csClub->id,
            ]);
        }

        if ($roboticsClub) {
            Event::create([
                'title' => 'Robot Building Competition',
                'description' => 'A competition to build and program robots.',
                'start_time' => '2025-09-01 09:00:00',
                'end_time' => '2025-09-01 17:00:00',
                'club_id' => $roboticsClub->id,
            ]);
        }
    }
}
