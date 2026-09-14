<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Super Admin
        |--------------------------------------------------------------------------
        */

        $superAdmin = Role::updateOrCreate(
            [
                'slug' => 'super-admin',
            ],
            [
                'name' => 'Super Admin',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Assign All Permissions
        |--------------------------------------------------------------------------
        */

        $permissions = Permission::pluck('id')->toArray();

        $superAdmin->permissions()->sync($permissions);

        /*
        |--------------------------------------------------------------------------
        | Admin
        |--------------------------------------------------------------------------
        */

        $admin = Role::updateOrCreate(
            [
                'slug' => 'admin',
            ],
            [
                'name' => 'Admin',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Basic Admin Permissions
        |--------------------------------------------------------------------------
        */

        $adminPermissions = Permission::whereIn('module', [
            'dashboard',
            'settings',
            'homepage',
            'services',
            'case-studies',
            'testimonials',
            'pricing',
            'leads',
            'appointments',
            'blog',
            'faqs',
            'newsletter',
            'team',
            'seo',
            'notifications',
            'analytics',
        ])->whereIn('slug', function ($query) {
            $query->select('slug')
                ->from('permissions')
                ->where('slug', 'like', '%.view')
                ->orWhere('slug', 'like', '%.create')
                ->orWhere('slug', 'like', '%.edit')
                ->orWhere('slug', 'like', '%.delete')
                ->orWhere('slug', 'like', '%.publish')
                ->orWhere('slug', 'like', '%.manage');
        })->pluck('id')->toArray();

        $admin->permissions()->sync($adminPermissions);
    }
}