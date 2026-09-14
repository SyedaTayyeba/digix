<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
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
            'audit-logs',
            'users',
            'roles',
        ];

        $actions = [
            'view',
            'create',
            'edit',
            'delete',
            'publish',
            'manage',
        ];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                Permission::updateOrCreate(
                    [
                        'slug' => "{$module}.{$action}",
                    ],
                    [
                        'name' => ucfirst($action) . ' ' . ucwords(
                            str_replace('-', ' ', $module)
                        ),
                        'module' => $module,
                    ]
                );
            }
        }
    }
}