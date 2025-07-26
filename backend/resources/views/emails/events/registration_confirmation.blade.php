@component('mail::message')
# Event Registration Confirmation

Dear {{ $user->name }},

Thank you for registering for the event: **{{ $event->title }}**.

**Event Details:**
- **Title:** {{ $event->title }}
- **Description:** {{ $event->description }}
- **Start Time:** {{ $event->start_time }}
- **End Time:** {{ $event->end_time }}

We look forward to seeing you there!

Thanks,
{{ config('app.name') }}
@endcomponent
