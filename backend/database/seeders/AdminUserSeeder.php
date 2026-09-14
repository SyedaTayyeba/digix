<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::updateOrCreate(
            [
                'email' => 'admin@digixdubai.com',
            ],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('Admin@123456'),
            ]
        );

        $role = Role::where('slug', 'super-admin')->first();

        $user->roles()->sync([
            $role->id,
        ]);
    }
}