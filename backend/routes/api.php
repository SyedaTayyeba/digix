<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Controllers
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HomepageController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\CaseStudyController;
use App\Http\Controllers\Api\ConversionEventController;
use App\Http\Controllers\Api\PricingController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\PublicLeadController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\AppointmentController as PublicAppointmentController;

/*
|--------------------------------------------------------------------------
| Admin Controllers
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Api\Admin\HomepageController as AdminHomepageController;
use App\Http\Controllers\Api\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\Admin\CaseStudyController as AdminCaseStudyController;
use App\Http\Controllers\Api\Admin\CaseStudyCategoryController;
use App\Http\Controllers\Api\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\Api\Admin\PricingPackageController;
use App\Http\Controllers\Api\Admin\TeamMemberController;
use App\Http\Controllers\Api\Admin\FaqController as AdminFaqController;
use App\Http\Controllers\Api\Admin\FaqCategoryController;
use App\Http\Controllers\Api\Admin\LeadController;
use App\Http\Controllers\Api\Admin\AppointmentController as AdminAppointmentController;
use App\Http\Controllers\Api\Admin\SettingController;
use App\Http\Controllers\Api\Admin\BlogPostController;
use App\Http\Controllers\Api\Admin\BlogCategoryController;
use App\Http\Controllers\Api\Admin\BlogTagController;
use App\Http\Controllers\Api\Admin\ActivityLogController;
use App\Http\Controllers\Api\Admin\NotificationController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\AnalyticsController;
use App\Http\Controllers\Api\Admin\NewsletterController as AdminNewsletterController;
use App\Http\Controllers\Api\Admin\SeoController;


/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

Route::prefix('auth')
    ->name('auth.')
    ->group(function () {

        Route::post('/login', [
            AuthController::class,
            'login',
        ])->name('login');

        Route::middleware('auth:sanctum')->group(function () {

            Route::get('/me', [
                AuthController::class,
                'me',
            ])->name('me');

            Route::post('/logout', [
                AuthController::class,
                'logout',
            ])->name('logout');
        });
    });


/*
|--------------------------------------------------------------------------
| Public Website APIs
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Homepage
|--------------------------------------------------------------------------
*/

Route::get('/homepage', [
    HomepageController::class,
    'index',
])->name('homepage.index');


/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
*/

Route::get('/search', [
    SearchController::class,
    'index',
])->name('search');


/*
|--------------------------------------------------------------------------
| Services
|--------------------------------------------------------------------------
*/

Route::prefix('services')
    ->name('services.')
    ->group(function () {

        Route::get('/', [
            ServiceController::class,
            'index',
        ])->name('index');

        Route::get('/{slug}', [
            ServiceController::class,
            'show',
        ])->name('show');
    });


/*
|--------------------------------------------------------------------------
| Case Studies
|--------------------------------------------------------------------------
|
| Backend remains available for future frontend use.
|
*/

Route::prefix('case-studies')
    ->name('case-studies.')
    ->group(function () {

        Route::get('/', [
            CaseStudyController::class,
            'index',
        ])->name('index');

        Route::get('/{slug}', [
            CaseStudyController::class,
            'show',
        ])->name('show');
    });


/*
|--------------------------------------------------------------------------
| Pricing
|--------------------------------------------------------------------------
*/

Route::prefix('pricing')
    ->name('pricing.')
    ->group(function () {

        Route::get('/', [
            PricingController::class,
            'index',
        ])->name('index');

        Route::get('/{slug}', [
            PricingController::class,
            'show',
        ])->name('show');
    });


/*
|--------------------------------------------------------------------------
| Testimonials
|--------------------------------------------------------------------------
*/

Route::prefix('testimonials')
    ->name('testimonials.')
    ->group(function () {

        Route::get('/', [
            TestimonialController::class,
            'index',
        ])->name('index');

        Route::get('/{testimonial}', [
            TestimonialController::class,
            'show',
        ])->name('show');
    });


/*
|--------------------------------------------------------------------------
| Team
|--------------------------------------------------------------------------
*/

Route::prefix('team')
    ->name('team.')
    ->group(function () {

        Route::get('/', [
            TeamController::class,
            'index',
        ])->name('index');

        Route::get('/{teamMember}', [
            TeamController::class,
            'show',
        ])->name('show');
    });


/*
|--------------------------------------------------------------------------
| FAQs
|--------------------------------------------------------------------------
*/

Route::prefix('faqs')
    ->name('faqs.')
    ->group(function () {

        Route::get('/', [
            FaqController::class,
            'index',
        ])->name('index');

        Route::get('/{faq}', [
            FaqController::class,
            'show',
        ])->name('show');
    });


/*
|--------------------------------------------------------------------------
| Public Leads
|--------------------------------------------------------------------------
|
| Used by:
| - Homepage Hero Lead Form
| - Contact Form
| - Other public lead forms
|
*/

Route::post('/leads', [
    PublicLeadController::class,
    'store',
])->name('leads.store');


/*
|--------------------------------------------------------------------------
| Public WhatsApp Engagement
|--------------------------------------------------------------------------
*/

Route::post('/leads/{lead}/whatsapp', [
    PublicLeadController::class,
    'whatsapp',
])->name('leads.whatsapp');


/*
|--------------------------------------------------------------------------
| Public Appointment Booking
|--------------------------------------------------------------------------
*/

Route::prefix('appointments')
    ->name('appointments.')
    ->group(function () {

        Route::get('/availability', [
            PublicAppointmentController::class,
            'availability',
        ])->name('availability');

        Route::post('/', [
            PublicAppointmentController::class,
            'store',
        ])->name('store');
    });


/*
|--------------------------------------------------------------------------
| Conversion Tracking
|--------------------------------------------------------------------------
*/

Route::post('/conversion-events', [
    ConversionEventController::class,
    'store',
])->name('conversion-events.store');


/*
|--------------------------------------------------------------------------
| Newsletter
|--------------------------------------------------------------------------
*/

Route::prefix('newsletter')
    ->name('newsletter.')
    ->group(function () {

        Route::post('/subscribe', [
            NewsletterController::class,
            'subscribe',
        ])->name('subscribe');

        Route::post('/unsubscribe', [
            NewsletterController::class,
            'unsubscribe',
        ])->name('unsubscribe');
    });


/*
|--------------------------------------------------------------------------
| Admin API
|--------------------------------------------------------------------------
*/

Route::prefix('admin')
    ->name('admin.')
    ->middleware('auth:sanctum')
    ->group(function () {


        /*
        |--------------------------------------------------------------------------
        | Dashboard
        |--------------------------------------------------------------------------
        */

        Route::get('/dashboard', [
            DashboardController::class,
            'index',
        ])
            ->middleware('permission:dashboard.view')
            ->name('dashboard');


        /*
        |--------------------------------------------------------------------------
        | Analytics
        |--------------------------------------------------------------------------
        */

        Route::prefix('analytics')
            ->name('analytics.')
            ->group(function () {

                Route::get('/summary', [
                    AnalyticsController::class,
                    'summary',
                ])
                    ->middleware('permission:analytics.view')
                    ->name('summary');

                Route::get('/events', [
                    AnalyticsController::class,
                    'events',
                ])
                    ->middleware('permission:analytics.view')
                    ->name('events');
            });


        /*
        |--------------------------------------------------------------------------
        | Notifications
        |--------------------------------------------------------------------------
        */

        Route::prefix('notifications')
            ->name('notifications.')
            ->group(function () {

                Route::get('/', [
                    NotificationController::class,
                    'index',
                ])
                    ->middleware('permission:notifications.view')
                    ->name('index');

                Route::get('/unread', [
                    NotificationController::class,
                    'unread',
                ])
                    ->middleware('permission:notifications.view')
                    ->name('unread');

                Route::get('/unread-count', [
                    NotificationController::class,
                    'unreadCount',
                ])
                    ->middleware('permission:notifications.view')
                    ->name('unread-count');

                Route::post('/{notification}/read', [
                    NotificationController::class,
                    'markAsRead',
                ])
                    ->middleware('permission:notifications.manage')
                    ->name('read');

                Route::post('/read-all', [
                    NotificationController::class,
                    'markAllAsRead',
                ])
                    ->middleware('permission:notifications.manage')
                    ->name('read-all');

                Route::delete('/{notification}', [
                    NotificationController::class,
                    'destroy',
                ])
                    ->middleware('permission:notifications.delete')
                    ->name('destroy');
            });


        /*
        |--------------------------------------------------------------------------
        | Activity / Audit Logs
        |--------------------------------------------------------------------------
        */

        Route::prefix('activity-logs')
            ->name('activity-logs.')
            ->group(function () {

                Route::get('/', [
                    ActivityLogController::class,
                    'index',
                ])
                    ->middleware('permission:audit-logs.view')
                    ->name('index');

                Route::get('/{activityLog}', [
                    ActivityLogController::class,
                    'show',
                ])
                    ->middleware('permission:audit-logs.view')
                    ->name('show');
            });


        /*
        |--------------------------------------------------------------------------
        | Settings
        |--------------------------------------------------------------------------
        */

        Route::prefix('settings')
            ->name('settings.')
            ->group(function () {

                Route::get('/', [
                    SettingController::class,
                    'index',
                ])
                    ->middleware('permission:settings.view')
                    ->name('index');

                Route::get('/{key}', [
                    SettingController::class,
                    'show',
                ])
                    ->middleware('permission:settings.view')
                    ->name('show');

                Route::post('/', [
                    SettingController::class,
                    'store',
                ])
                    ->middleware('permission:settings.create')
                    ->name('store');

                Route::put('/{key}', [
                    SettingController::class,
                    'update',
                ])
                    ->middleware('permission:settings.edit')
                    ->name('update');
            });


        /*
        |--------------------------------------------------------------------------
        | Homepage Content
        |--------------------------------------------------------------------------
        */

        Route::prefix('homepage')
            ->name('homepage.')
            ->group(function () {

                Route::get('/', [
                    AdminHomepageController::class,
                    'index',
                ])
                    ->middleware('permission:homepage.view')
                    ->name('index');

                Route::put('/', [
                    AdminHomepageController::class,
                    'update',
                ])
                    ->middleware('permission:homepage.edit')
                    ->name('update');
            });


        /*
        |--------------------------------------------------------------------------
        | Services
        |--------------------------------------------------------------------------
        */

        Route::prefix('services')
            ->name('services.')
            ->group(function () {

                Route::get('/', [
                    AdminServiceController::class,
                    'index',
                ])
                    ->middleware('permission:services.view')
                    ->name('index');

                Route::get('/{service}', [
                    AdminServiceController::class,
                    'show',
                ])
                    ->middleware('permission:services.view')
                    ->name('show');

                Route::post('/', [
                    AdminServiceController::class,
                    'store',
                ])
                    ->middleware('permission:services.create')
                    ->name('store');

                Route::put('/{service}', [
                    AdminServiceController::class,
                    'update',
                ])
                    ->middleware('permission:services.edit')
                    ->name('update');

                Route::patch('/{service}', [
                    AdminServiceController::class,
                    'update',
                ])
                    ->middleware('permission:services.edit')
                    ->name('patch');

                Route::delete('/{service}', [
                    AdminServiceController::class,
                    'destroy',
                ])
                    ->middleware('permission:services.delete')
                    ->name('destroy');

                Route::post('/{service}/publish', [
                    AdminServiceController::class,
                    'publish',
                ])
                    ->middleware('permission:services.publish')
                    ->name('publish');
            });


        /*
        |--------------------------------------------------------------------------
        | Case Study Categories
        |--------------------------------------------------------------------------
        */

        Route::prefix('case-study-categories')
            ->name('case-study-categories.')
            ->group(function () {

                Route::get('/', [
                    CaseStudyCategoryController::class,
                    'index',
                ])
                    ->middleware('permission:case-studies.view')
                    ->name('index');

                Route::get('/{caseStudyCategory}', [
                    CaseStudyCategoryController::class,
                    'show',
                ])
                    ->middleware('permission:case-studies.view')
                    ->name('show');

                Route::post('/', [
                    CaseStudyCategoryController::class,
                    'store',
                ])
                    ->middleware('permission:case-studies.create')
                    ->name('store');

                Route::put('/{caseStudyCategory}', [
                    CaseStudyCategoryController::class,
                    'update',
                ])
                    ->middleware('permission:case-studies.edit')
                    ->name('update');

                Route::delete('/{caseStudyCategory}', [
                    CaseStudyCategoryController::class,
                    'destroy',
                ])
                    ->middleware('permission:case-studies.delete')
                    ->name('destroy');
            });


        /*
        |--------------------------------------------------------------------------
        | Case Studies
        |--------------------------------------------------------------------------
        */

        Route::prefix('case-studies')
            ->name('case-studies.')
            ->group(function () {

                Route::get('/', [
                    AdminCaseStudyController::class,
                    'index',
                ])
                    ->middleware('permission:case-studies.view')
                    ->name('index');

                Route::get('/{caseStudy}', [
                    AdminCaseStudyController::class,
                    'show',
                ])
                    ->middleware('permission:case-studies.view')
                    ->name('show');

                Route::post('/', [
                    AdminCaseStudyController::class,
                    'store',
                ])
                    ->middleware('permission:case-studies.create')
                    ->name('store');

                Route::put('/{caseStudy}', [
                    AdminCaseStudyController::class,
                    'update',
                ])
                    ->middleware('permission:case-studies.edit')
                    ->name('update');

                Route::patch('/{caseStudy}', [
                    AdminCaseStudyController::class,
                    'update',
                ])
                    ->middleware('permission:case-studies.edit')
                    ->name('patch');

                Route::delete('/{caseStudy}', [
                    AdminCaseStudyController::class,
                    'destroy',
                ])
                    ->middleware('permission:case-studies.delete')
                    ->name('destroy');

                Route::post('/{caseStudy}/publish', [
                    AdminCaseStudyController::class,
                    'publish',
                ])
                    ->middleware('permission:case-studies.publish')
                    ->name('publish');

                Route::post('/{caseStudy}/archive', [
                    AdminCaseStudyController::class,
                    'archive',
                ])
                    ->middleware('permission:case-studies.edit')
                    ->name('archive');
            });


        /*
        |--------------------------------------------------------------------------
        | Testimonials
        |--------------------------------------------------------------------------
        */

        Route::prefix('testimonials')
            ->name('testimonials.')
            ->group(function () {

                Route::get('/', [
                    AdminTestimonialController::class,
                    'index',
                ])
                    ->middleware('permission:testimonials.view')
                    ->name('index');

                Route::get('/{testimonial}', [
                    AdminTestimonialController::class,
                    'show',
                ])
                    ->middleware('permission:testimonials.view')
                    ->name('show');

                Route::post('/', [
                    AdminTestimonialController::class,
                    'store',
                ])
                    ->middleware('permission:testimonials.create')
                    ->name('store');

                Route::put('/{testimonial}', [
                    AdminTestimonialController::class,
                    'update',
                ])
                    ->middleware('permission:testimonials.edit')
                    ->name('update');

                Route::patch('/{testimonial}', [
                    AdminTestimonialController::class,
                    'update',
                ])
                    ->middleware('permission:testimonials.edit')
                    ->name('patch');

                Route::delete('/{testimonial}', [
                    AdminTestimonialController::class,
                    'destroy',
                ])
                    ->middleware('permission:testimonials.delete')
                    ->name('destroy');

                Route::post('/{testimonial}/publish', [
                    AdminTestimonialController::class,
                    'publish',
                ])
                    ->middleware('permission:testimonials.publish')
                    ->name('publish');

                Route::post('/{testimonial}/unpublish', [
                    AdminTestimonialController::class,
                    'unpublish',
                ])
                    ->middleware('permission:testimonials.edit')
                    ->name('unpublish');
            });


        /*
        |--------------------------------------------------------------------------
        | Pricing
        |--------------------------------------------------------------------------
        */

        Route::prefix('pricing')
            ->name('pricing.')
            ->group(function () {

                Route::get('/', [
                    PricingPackageController::class,
                    'index',
                ])
                    ->middleware('permission:pricing.view')
                    ->name('index');

                Route::get('/{pricingPackage}', [
                    PricingPackageController::class,
                    'show',
                ])
                    ->middleware('permission:pricing.view')
                    ->name('show');

                Route::post('/', [
                    PricingPackageController::class,
                    'store',
                ])
                    ->middleware('permission:pricing.create')
                    ->name('store');

                Route::put('/{pricingPackage}', [
                    PricingPackageController::class,
                    'update',
                ])
                    ->middleware('permission:pricing.edit')
                    ->name('update');

                Route::patch('/{pricingPackage}', [
                    PricingPackageController::class,
                    'update',
                ])
                    ->middleware('permission:pricing.edit')
                    ->name('patch');

                Route::delete('/{pricingPackage}', [
                    PricingPackageController::class,
                    'destroy',
                ])
                    ->middleware('permission:pricing.delete')
                    ->name('destroy');

                Route::post('/{pricingPackage}/publish', [
                    PricingPackageController::class,
                    'publish',
                ])
                    ->middleware('permission:pricing.publish')
                    ->name('publish');
            });


        /*
        |--------------------------------------------------------------------------
        | Team
        |--------------------------------------------------------------------------
        */

        Route::prefix('team')
            ->name('team.')
            ->group(function () {

                Route::get('/', [
                    TeamMemberController::class,
                    'index',
                ])
                    ->middleware('permission:team.view')
                    ->name('index');

                Route::get('/{teamMember}', [
                    TeamMemberController::class,
                    'show',
                ])
                    ->middleware('permission:team.view')
                    ->name('show');

                Route::post('/', [
                    TeamMemberController::class,
                    'store',
                ])
                    ->middleware('permission:team.create')
                    ->name('store');

                Route::put('/{teamMember}', [
                    TeamMemberController::class,
                    'update',
                ])
                    ->middleware('permission:team.edit')
                    ->name('update');

                Route::patch('/{teamMember}', [
                    TeamMemberController::class,
                    'update',
                ])
                    ->middleware('permission:team.edit')
                    ->name('patch');

                Route::delete('/{teamMember}', [
                    TeamMemberController::class,
                    'destroy',
                ])
                    ->middleware('permission:team.delete')
                    ->name('destroy');

                Route::post('/{teamMember}/publish', [
                    TeamMemberController::class,
                    'publish',
                ])
                    ->middleware('permission:team.publish')
                    ->name('publish');
            });


        /*
        |--------------------------------------------------------------------------
        | FAQs
        |--------------------------------------------------------------------------
        */

        Route::prefix('faqs')
            ->name('faqs.')
            ->group(function () {

                Route::get('/', [
                    AdminFaqController::class,
                    'index',
                ])
                    ->middleware('permission:faqs.view')
                    ->name('index');

                Route::get('/{faq}', [
                    AdminFaqController::class,
                    'show',
                ])
                    ->middleware('permission:faqs.view')
                    ->name('show');

                Route::post('/', [
                    AdminFaqController::class,
                    'store',
                ])
                    ->middleware('permission:faqs.create')
                    ->name('store');

                Route::put('/{faq}', [
                    AdminFaqController::class,
                    'update',
                ])
                    ->middleware('permission:faqs.edit')
                    ->name('update');

                Route::patch('/{faq}', [
                    AdminFaqController::class,
                    'update',
                ])
                    ->middleware('permission:faqs.edit')
                    ->name('patch');

                Route::delete('/{faq}', [
                    AdminFaqController::class,
                    'destroy',
                ])
                    ->middleware('permission:faqs.delete')
                    ->name('destroy');

                Route::post('/{faq}/publish', [
                    AdminFaqController::class,
                    'publish',
                ])
                    ->middleware('permission:faqs.publish')
                    ->name('publish');

                Route::post('/{faq}/unpublish', [
                    AdminFaqController::class,
                    'unpublish',
                ])
                    ->middleware('permission:faqs.publish')
                    ->name('unpublish');
            });


        /*
        |--------------------------------------------------------------------------
        | FAQ Categories
        |--------------------------------------------------------------------------
        */

        Route::prefix('faq-categories')
            ->name('faq-categories.')
            ->group(function () {

                Route::get('/', [
                    FaqCategoryController::class,
                    'index',
                ])
                    ->middleware('permission:faqs.view')
                    ->name('index');

                Route::get('/{faqCategory}', [
                    FaqCategoryController::class,
                    'show',
                ])
                    ->middleware('permission:faqs.view')
                    ->name('show');

                Route::post('/', [
                    FaqCategoryController::class,
                    'store',
                ])
                    ->middleware('permission:faqs.create')
                    ->name('store');

                Route::put('/{faqCategory}', [
                    FaqCategoryController::class,
                    'update',
                ])
                    ->middleware('permission:faqs.edit')
                    ->name('update');

                Route::delete('/{faqCategory}', [
                    FaqCategoryController::class,
                    'destroy',
                ])
                    ->middleware('permission:faqs.delete')
                    ->name('destroy');
            });


        /*
        |--------------------------------------------------------------------------
        | Leads / CRM
        |--------------------------------------------------------------------------
        */

        Route::prefix('leads')
            ->name('leads.')
            ->group(function () {

                Route::get('/', [
                    LeadController::class,
                    'index',
                ])
                    ->middleware('permission:leads.view')
                    ->name('index');

                Route::get('/{lead}', [
                    LeadController::class,
                    'show',
                ])
                    ->middleware('permission:leads.view')
                    ->name('show');

                Route::post('/', [
                    LeadController::class,
                    'store',
                ])
                    ->middleware('permission:leads.create')
                    ->name('store');

                Route::put('/{lead}', [
                    LeadController::class,
                    'update',
                ])
                    ->middleware('permission:leads.edit')
                    ->name('update');

                Route::post('/{lead}/stage', [
                    LeadController::class,
                    'updateStage',
                ])
                    ->middleware('permission:leads.edit')
                    ->name('stage');

                Route::post('/{lead}/activity', [
                    LeadController::class,
                    'addActivity',
                ])
                    ->middleware('permission:leads.edit')
                    ->name('activity');

                Route::post('/{lead}/whatsapp', [
                    LeadController::class,
                    'whatsapp',
                ])
                    ->middleware('permission:leads.edit')
                    ->name('whatsapp');

                Route::delete('/{lead}', [
                    LeadController::class,
                    'destroy',
                ])
                    ->middleware('permission:leads.delete')
                    ->name('destroy');
            });


        /*
        |--------------------------------------------------------------------------
        | Appointments
        |--------------------------------------------------------------------------
        */

        Route::prefix('appointments')
            ->name('appointments.')
            ->group(function () {

                Route::get('/', [
                    AdminAppointmentController::class,
                    'index',
                ])
                    ->middleware('permission:appointments.view')
                    ->name('index');

                Route::get('/{appointment}', [
                    AdminAppointmentController::class,
                    'show',
                ])
                    ->middleware('permission:appointments.view')
                    ->name('show');

                Route::post('/', [
                    AdminAppointmentController::class,
                    'store',
                ])
                    ->middleware('permission:appointments.create')
                    ->name('store');

                Route::put('/{appointment}', [
                    AdminAppointmentController::class,
                    'update',
                ])
                    ->middleware('permission:appointments.edit')
                    ->name('update');

                Route::delete('/{appointment}', [
                    AdminAppointmentController::class,
                    'destroy',
                ])
                    ->middleware('permission:appointments.delete')
                    ->name('destroy');
            });


        /*
        |--------------------------------------------------------------------------
        | Appointment Availability
        |--------------------------------------------------------------------------
        */

        Route::prefix('availability')
            ->name('availability.')
            ->group(function () {

                Route::get('/', [
                    AdminAppointmentController::class,
                    'availability',
                ])
                    ->middleware('permission:appointments.view')
                    ->name('index');

                Route::post('/', [
                    AdminAppointmentController::class,
                    'storeAvailability',
                ])
                    ->middleware('permission:appointments.create')
                    ->name('store');

                Route::put('/{availabilitySlot}', [
                    AdminAppointmentController::class,
                    'updateAvailability',
                ])
                    ->middleware('permission:appointments.edit')
                    ->name('update');

                Route::delete('/{availabilitySlot}', [
                    AdminAppointmentController::class,
                    'destroyAvailability',
                ])
                    ->middleware('permission:appointments.delete')
                    ->name('destroy');
            });


        /*
        |--------------------------------------------------------------------------
        | Blog Posts
        |--------------------------------------------------------------------------
        */

        Route::prefix('blog')
            ->name('blog.')
            ->group(function () {

                Route::get('/', [
                    BlogPostController::class,
                    'index',
                ])
                    ->middleware('permission:blog.view')
                    ->name('index');

                Route::get('/{blogPost}', [
                    BlogPostController::class,
                    'show',
                ])
                    ->middleware('permission:blog.view')
                    ->name('show');

                Route::post('/', [
                    BlogPostController::class,
                    'store',
                ])
                    ->middleware('permission:blog.create')
                    ->name('store');

                Route::put('/{blogPost}', [
                    BlogPostController::class,
                    'update',
                ])
                    ->middleware('permission:blog.edit')
                    ->name('update');

                Route::patch('/{blogPost}', [
                    BlogPostController::class,
                    'update',
                ])
                    ->middleware('permission:blog.edit')
                    ->name('patch');

                Route::post('/{blogPost}/publish', [
                    BlogPostController::class,
                    'publish',
                ])
                    ->middleware('permission:blog.publish')
                    ->name('publish');

                Route::delete('/{blogPost}', [
                    BlogPostController::class,
                    'destroy',
                ])
                    ->middleware('permission:blog.delete')
                    ->name('destroy');
            });


        /*
        |--------------------------------------------------------------------------
        | Blog Categories
        |--------------------------------------------------------------------------
        */

        Route::prefix('blog-categories')
            ->name('blog-categories.')
            ->group(function () {

                Route::get('/', [
                    BlogCategoryController::class,
                    'index',
                ])
                    ->middleware('permission:blog.view')
                    ->name('index');

                Route::get('/{blogCategory}', [
                    BlogCategoryController::class,
                    'show',
                ])
                    ->middleware('permission:blog.view')
                    ->name('show');

                Route::post('/', [
                    BlogCategoryController::class,
                    'store',
                ])
                    ->middleware('permission:blog.create')
                    ->name('store');

                Route::put('/{blogCategory}', [
                    BlogCategoryController::class,
                    'update',
                ])
                    ->middleware('permission:blog.edit')
                    ->name('update');

                Route::delete('/{blogCategory}', [
                    BlogCategoryController::class,
                    'destroy',
                ])
                    ->middleware('permission:blog.delete')
                    ->name('destroy');
            });


        /*
        |--------------------------------------------------------------------------
        | Blog Tags
        |--------------------------------------------------------------------------
        */

        Route::prefix('blog-tags')
            ->name('blog-tags.')
            ->group(function () {

                Route::get('/', [
                    BlogTagController::class,
                    'index',
                ])
                    ->middleware('permission:blog.view')
                    ->name('index');

                Route::get('/{blogTag}', [
                    BlogTagController::class,
                    'show',
                ])
                    ->middleware('permission:blog.view')
                    ->name('show');

                Route::post('/', [
                    BlogTagController::class,
                    'store',
                ])
                    ->middleware('permission:blog.create')
                    ->name('store');

                Route::put('/{blogTag}', [
                    BlogTagController::class,
                    'update',
                ])
                    ->middleware('permission:blog.edit')
                    ->name('update');

                Route::delete('/{blogTag}', [
                    BlogTagController::class,
                    'destroy',
                ])
                    ->middleware('permission:blog.delete')
                    ->name('destroy');
            });


        /*
        |--------------------------------------------------------------------------
        | Newsletter
        |--------------------------------------------------------------------------
        */

        Route::prefix('newsletter')
            ->name('newsletter.')
            ->group(function () {

                Route::get('/', [
                    AdminNewsletterController::class,
                    'index',
                ])
                    ->middleware('permission:newsletter.view')
                    ->name('index');

                Route::get('/{newsletterSubscriber}', [
                    AdminNewsletterController::class,
                    'show',
                ])
                    ->middleware('permission:newsletter.view')
                    ->name('show');

                Route::patch('/{newsletterSubscriber}/status', [
                    AdminNewsletterController::class,
                    'updateStatus',
                ])
                    ->middleware('permission:newsletter.edit')
                    ->name('status');

                Route::delete('/{newsletterSubscriber}', [
                    AdminNewsletterController::class,
                    'destroy',
                ])
                    ->middleware('permission:newsletter.delete')
                    ->name('destroy');
            });


        /*
        |--------------------------------------------------------------------------
        | SEO
        |--------------------------------------------------------------------------
        */

        Route::prefix('seo')
            ->name('seo.')
            ->group(function () {

                Route::get('/{type}/{id}', [
                    SeoController::class,
                    'show',
                ])
                    ->middleware('permission:seo.view')
                    ->name('show');

                Route::put('/{type}/{id}', [
                    SeoController::class,
                    'update',
                ])
                    ->middleware('permission:seo.edit')
                    ->name('update');
            });
    });
