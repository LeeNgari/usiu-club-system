<?php

namespace Database\Seeders;

use App\Models\Club;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClubSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Club::create([
            'name' => 'Computer Science Club',
            'description' => 'Club for computer science enthusiasts.',
            'profile_photo_url' => 'https://res.cloudinary.com/dydpguips/image/upload/v1735813189/profile-user-svgrepo-com_zflps6.svg',
        ]);

        Club::create([
            'name' => 'Robotics Club',
            'description' => 'Club for robotics and automation.',
            'profile_photo_url' => 'https://res.cloudinary.com/dydpguips/image/upload/v1735813189/profile-user-svgrepo-com_zflps6.svg',
        ]);
    }
}
