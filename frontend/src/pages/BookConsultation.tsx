import type { FormEvent } from 'react';
import { useState } from 'react';

import PageHero from '../components/ui/PageHero';
import GlassCard from '../components/ui/GlassCard';
import { api } from '../lib/api';

type Step =
  | 'date'
  | 'preference'
  | 'time'
  | 'details'
  | 'confirmed';

type AvailableSlot = {
  time: string;
  display_time: string;
  time_preference:
    | 'morning'
    | 'afternoon'
    | 'evening';
};

type AvailabilityResponse = {
  date: string;
  slots: AvailableSlot[];
};

type AppointmentResponse = {
  message?: string;
  data?: {
    id?: number;
  };
};

function nextBusinessDays(count: number): string[] {
  const days: string[] = [];
  const cursor = new Date();

  while (days.length < count) {
    cursor.setDate(cursor.getDate() + 1);

    const day = cursor.getDay();

    // Friday = 5, Saturday = 6
    if (day !== 5 && day !== 6) {
      days.push(
        cursor.toISOString().split('T')[0]
      );
    }
  }

  return days;
}

function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);

  return parsed.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const TIME_PREFERENCES = [
  {
    value: 'morning',
    label: 'Morning',
    description: '9:00 AM – 12:00 PM',
  },
  {
    value: 'afternoon',
    label: 'Afternoon',
    description: '12:00 PM – 5:00 PM',
  },
  {
    value: 'evening',
    label: 'Evening',
    description: '5:00 PM – 8:00 PM',
  },
] as const;

const MEETING_TYPES = [
  {
    value: 'google_meet',
    label: 'Google Meet',
    description: 'Video consultation',
  },
  {
    value: 'whatsapp',
    label: 'WhatsApp',
    description: 'WhatsApp call',
  },
  {
    value: 'phone',
    label: 'Phone',
    description: 'Phone consultation',
  },
] as const;

export default function BookConsultation() {
  const [step, setStep] = useState<Step>('date');

  const [date, setDate] = useState('');
  const [timePreference, setTimePreference] =
    useState<
      'morning' | 'afternoon' | 'evening' | ''
    >('');
  const [time, setTime] = useState('');

  const [meetingType, setMeetingType] =
    useState<
      'google_meet' | 'whatsapp' | 'phone'
    >('google_meet');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');

  const [availableSlots, setAvailableSlots] =
    useState<AvailableSlot[]>([]);

  const [loadingSlots, setLoadingSlots] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState('');

  const days = nextBusinessDays(7);

  async function loadAvailability(
    selectedDate: string,
    preference?: string
  ) {
    try {
      setLoadingSlots(true);
      setError('');
      setAvailableSlots([]);
      setTime('');

      const query = new URLSearchParams({
        date: selectedDate,
      });

      if (preference) {
        query.set(
          'time_preference',
          preference
        );
      }

      const response =
        await api.get<AvailabilityResponse>(
          `/appointments/availability?${query.toString()}`
        );

      setAvailableSlots(response.slots ?? []);

      if (
        (response.slots ?? []).length === 0
      ) {
        setError(
          'No available times for this selection. Please choose another option.'
        );
      }
    } catch (err) {
      console.error(
        'Failed to load appointment availability:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load available times. Please try again.'
      );
    } finally {
      setLoadingSlots(false);
    }
  }

  function handleDateSelect(
    selectedDate: string
  ) {
    setDate(selectedDate);
    setTime('');
    setTimePreference('');
    setError('');
    setStep('preference');
  }

  async function handlePreferenceSelect(
    preference:
      | 'morning'
      | 'afternoon'
      | 'evening'
  ) {
    setTimePreference(preference);

    await loadAvailability(
      date,
      preference
    );

    setStep('time');
  }

  function handleTimeSelect(
    selectedTime: string
  ) {
    setTime(selectedTime);
    setError('');
    setStep('details');
  }

  async function handleDetailsSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError('');

    if (!name.trim() || !email.trim()) {
      setError(
        'Please enter your name and email.'
      );
      return;
    }

    if (
      !date ||
      !time ||
      !timePreference
    ) {
      setError(
        'Please select a date, time preference and time.'
      );
      return;
    }

    try {
      setSubmitting(true);

      const response =
        await api.post<AppointmentResponse>(
          '/appointments',
          {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || null,
            service: service.trim() || null,
            appointment_date: date,
            appointment_time: time,
            time_preference:
              timePreference,
            meeting_type: meetingType,
            message:
              message.trim() || null,
          }
        );

      const appointmentId =
        response.data?.id;

      // Conversion tracking should never block booking.
      try {
        await api.post(
          '/conversion-events',
          {
            event_name:
              'consultation_booked',
            source: 'consultation',
            page_url:
              window.location.href,
            metadata: {
              appointment_id:
                appointmentId ?? null,
              appointment_date: date,
              appointment_time: time,
              time_preference:
                timePreference,
              meeting_type:
                meetingType,
              service:
                service.trim() || null,
            },
          }
        );
      } catch (conversionError) {
        console.error(
          'Failed to track booking conversion:',
          conversionError
        );
      }

      setStep('confirmed');

      if (response.message) {
        console.log(response.message);
      }
    } catch (err) {
      console.error(
        'Failed to create appointment:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to confirm your booking. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHero
        eyebrow="Book a Consultation"
        title="Pick a time that works for you"
        description="A 30-minute call to understand what you need — no obligation either way."
      />

      <section className="px-5 py-14 sm:px-8 md:px-12">
        <GlassCard className="mx-auto max-w-xl">
          {error &&
            step !== 'details' && (
              <p className="mb-4 rounded-md border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

          {step === 'date' && (
            <div>
              <h2 className="mb-1 text-sm font-medium text-white/70">
                Step 1 of 4 — Choose a date
              </h2>

              <p className="mb-5 text-xs text-white/50">
                Select a date that works for you.
              </p>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {days.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() =>
                      handleDateSelect(day)
                    }
                    className="rounded-md border border-white/20 bg-white/5 px-3 py-3 text-left text-sm transition hover:bg-white/10"
                  >
                    <span className="block">
                      {formatDate(day)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'preference' && (
            <div>
              <h2 className="mb-1 text-sm font-medium text-white/70">
                Step 2 of 4 — Choose your preferred time
              </h2>

              <p className="mb-5 text-xs text-white/50">
                {formatDate(date)}
              </p>

              <div className="space-y-2">
                {TIME_PREFERENCES.map(
                  (option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        handlePreferenceSelect(
                          option.value
                        )
                      }
                      disabled={loadingSlots}
                      className="flex w-full items-center justify-between rounded-md border border-white/20 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span>
                        <span className="block text-sm font-medium">
                          {option.label}
                        </span>

                        <span className="mt-1 block text-xs text-white/50">
                          {option.description}
                        </span>
                      </span>

                      <span className="text-white/40">
                        →
                      </span>
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setStep('date')
                }
                className="mt-4 text-xs text-white/50 hover:text-brand"
              >
                ← Change date
              </button>
            </div>
          )}

          {step === 'time' && (
            <div>
              <h2 className="mb-1 text-sm font-medium text-white/70">
                Step 3 of 4 — Choose an available time
              </h2>

              <p className="mb-5 text-xs text-white/50">
                {formatDate(date)} ·{' '}
                {timePreference
                  ? `${timePreference.charAt(0).toUpperCase()}${timePreference.slice(1)}`
                  : ''}
              </p>

              {loadingSlots ? (
                <p className="text-sm text-white/60">
                  Loading available times...
                </p>
              ) : availableSlots.length >
                0 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {availableSlots.map(
                    (slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() =>
                          handleTimeSelect(
                            slot.time
                          )
                        }
                        className="rounded-md border border-white/20 bg-white/5 px-3 py-3 text-sm transition hover:bg-white/10"
                      >
                        {slot.display_time}
                      </button>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-white/60">
                  No available times for
                  this preference. Please
                  choose another preference
                  or date.
                </p>
              )}

              <button
                type="button"
                onClick={() =>
                  setStep('preference')
                }
                className="mt-4 text-xs text-white/50 hover:text-brand"
              >
                ← Change preference
              </button>
            </div>
          )}

          {step === 'details' && (
            <form
              onSubmit={handleDetailsSubmit}
            >
              <h2 className="mb-1 text-sm font-medium text-white/70">
                Step 4 of 4 — Your details
              </h2>

              <p className="mb-5 text-xs text-white/50">
                {formatDate(date)} at{' '}
                {availableSlots.find(
                  (slot) =>
                    slot.time === time
                )?.display_time ??
                  time}
              </p>

              {error && (
                <p className="mb-3 text-sm text-red-300">
                  {error}
                </p>
              )}

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                  autoComplete="name"
                  disabled={submitting}
                  className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 disabled:opacity-60"
                />

                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                  autoComplete="email"
                  disabled={submitting}
                  className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 disabled:opacity-60"
                />

                <input
                  type="tel"
                  placeholder="Phone / WhatsApp number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  autoComplete="tel"
                  disabled={submitting}
                  className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 disabled:opacity-60"
                />

                <input
                  type="text"
                  placeholder="Service you're interested in"
                  value={service}
                  onChange={(e) =>
                    setService(e.target.value)
                  }
                  disabled={submitting}
                  className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 disabled:opacity-60"
                />

                <div>
                  <p className="mb-2 text-xs text-white/60">
                    Meeting type
                  </p>

                  <div className="grid gap-2 sm:grid-cols-3">
                    {MEETING_TYPES.map(
                      (option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setMeetingType(
                              option.value
                            )
                          }
                          disabled={submitting}
                          className={`rounded-md border px-3 py-3 text-left transition disabled:opacity-60 ${
                            meetingType ===
                            option.value
                              ? 'border-brand bg-brand/10'
                              : 'border-white/20 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <span className="block text-sm">
                            {option.label}
                          </span>

                          <span className="mt-1 block text-xs text-white/50">
                            {
                              option.description
                            }
                          </span>
                        </button>
                      )
                    )}
                  </div>
                </div>

                <textarea
                  placeholder="Anything you'd like us to know? (optional)"
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  rows={4}
                  disabled={submitting}
                  className="w-full resize-none rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 disabled:opacity-60"
                />
              </div>

              <div className="mt-5 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-black hover:bg-brand/85 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? 'Confirming...'
                    : 'Confirm Booking'}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setStep('time')
                  }
                  disabled={submitting}
                  className="text-xs text-white/50 hover:text-brand disabled:opacity-50"
                >
                  ← Change time
                </button>
              </div>
            </form>
          )}

          {step === 'confirmed' && (
            <div>
              <h2 className="text-lg font-medium">
                Booking request received
              </h2>

              <p className="mt-2 text-sm text-white/75">
                Your consultation is
                requested for{' '}
                <strong>
                  {formatDate(date)}
                </strong>{' '}
                at{' '}
                <strong>
                  {availableSlots.find(
                    (slot) =>
                      slot.time === time
                  )?.display_time ??
                    time}
                </strong>
                .
              </p>

              <p className="mt-2 text-sm text-white/60">
                We'll confirm the appointment
                and contact you using the
                details you provided.
              </p>
            </div>
          )}
        </GlassCard>
      </section>
    </div>
  );
}
