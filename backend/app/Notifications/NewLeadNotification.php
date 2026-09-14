<?php

namespace App\Notifications;

use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewLeadNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Lead $lead
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Lead Received')
            ->greeting('New Lead Received')
            ->line('A new lead has been submitted.')
            ->line('Name: ' . $this->lead->name)
            ->line('Email: ' . ($this->lead->email ?? 'N/A'))
            ->line('Phone: ' . ($this->lead->phone ?? 'N/A'))
            ->line('Source: ' . ($this->lead->source ?? 'N/A'))
            ->action(
                'View Lead',
                url('/admin/leads/' . $this->lead->id)
            );
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_lead',
            'lead_id' => $this->lead->id,
            'name' => $this->lead->name,
            'email' => $this->lead->email,
            'phone' => $this->lead->phone,
            'source' => $this->lead->source,
            'stage' => $this->lead->stage,
            'message' => 'A new lead has been received.',
        ];
    }
}