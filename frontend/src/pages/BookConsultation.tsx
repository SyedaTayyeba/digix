import type { FormEvent } from 'react';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

import PageHero from '../components/ui/PageHero';
import GlassCard from '../components/ui/GlassCard';
import { api } from '../lib/api';
import PageOverlay from '../components/ui/PageOverlay';

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

const cardClass =
  'surface-card surface-card-hover';

const inputClass =
  'field';

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

      const availability = response.data;

      const slots = Array.isArray(
        availability?.slots
      )
        ? availability.slots
        : [];

      setAvailableSlots(slots);

      if (slots.length === 0) {
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

      const appointment = response.data;

      const appointmentId =
        appointment?.data?.id;

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

      if (appointment?.message) {
        console.log(appointment.message);
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

  const selectedDisplayTime =
    availableSlots.find(
      (slot) => slot.time === time
    )?.display_time ?? time;

  return (
    <div>
      <PageOverlay />
      <PageHero
        eyebrow="Book a Consultation"
        title="Pick a time that works for you"
        description="A 30-minute call to understand what you need — no obligation either way."
        highlightWords={['time']}
      />

      <section className="border-t border-brand/15 px-5 py-16 sm:px-8 md:px-12">
        <div className="mx-auto max-w-2xl">
          <GlassCard
            className={`p-5 sm:p-7 md:p-8 ${cardClass}`}
          >
            {error &&
              step !== 'details' && (
                <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

            {/* Progress */}
            {step !== 'confirmed' && (
              <div className="mb-8">
                <div className="flex items-center justify-between gap-2">
                  {[
                    ['date', 'Date'],
                    ['preference', 'Preference'],
                    ['time', 'Time'],
                    ['details', 'Details'],
                  ].map(
                    ([stepKey, label], index) => {
                      const active =
                        step === stepKey;

                      const completed =
                        [
                          'preference',
                          'time',
                          'details',
                        ].includes(step) &&
                        index === 0
                          ? true
                          : step === 'time' &&
                            index === 1
                          ? true
                          : step ===
                              'details' &&
                            index <= 1
                          ? true
                          : false;

                      return (
                        <div
                          key={stepKey}
                          className="flex flex-1 items-center gap-2"
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 ${
                              active ||
                              completed
                                ? 'border-brand bg-brand/15 text-brand-300'
                                : 'border-brand/15 bg-white/5 text-white'
                            }`}
                          >
                            {index + 1}
                          </div>

                          <span
                            className={`hidden text-[11px] sm:block ${
                              active ||
                              completed
                                ? 'text-white'
                                : 'text-white'
                            }`}
                          >
                            {label}
                          </span>

                          {index < 3 && (
                            <div className="mx-1 h-px flex-1 bg-white/10" />
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* Step 1 — Date */}
            {step === 'date' && (
              <div>
                <div className="mb-6">
                  <p className="eyebrow text-brand-300">
                    Step 1
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
                    Choose a date
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white">
                    Select a date that works for
                    you.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {days.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() =>
                        handleDateSelect(day)
                      }
                      className="group rounded-xl border border-brand/15 bg-white/5 px-4 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand/10"
                    >
                      <span className="block text-sm font-bold text-white transition-colors group-hover:text-brand-300">
                        {formatDate(day)}
                      </span>

                      <span className="mt-2 block text-[10px] uppercase tracking-wider text-white">
                        Available
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Preference */}
            {step === 'preference' && (
              <div>
                <div className="mb-6">
                  <p className="eyebrow text-brand-300">
                    Step 2
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
                    Choose your preferred time
                  </h2>

                  <p className="mt-2 text-sm text-white">
                    {formatDate(date)}
                  </p>
                </div>

                <div className="space-y-3">
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
                        className="group flex w-full items-center justify-between rounded-xl border border-brand/15 bg-white/5 px-5 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span>
                          <span className="block text-sm font-bold text-white group-hover:text-brand-300">
                            {option.label}
                          </span>

                          <span className="mt-1 block text-xs text-white">
                            {
                              option.description
                            }
                          </span>
                        </span>

                        <ChevronRight
                          size={18}
                          className="text-white transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-300"
                        />
                      </button>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setStep('date')
                  }
                  className="mt-5 text-xs font-medium text-white transition-colors hover:text-brand-300"
                >
                  ← Change date
                </button>
              </div>
            )}

            {/* Step 3 — Time */}
            {step === 'time' && (
              <div>
                <div className="mb-6">
                  <p className="eyebrow text-brand-300">
                    Step 3
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
                    Choose an available time
                  </h2>

                  <p className="mt-2 text-sm text-white">
                    {formatDate(date)} ·{' '}
                    {timePreference
                      ? `${timePreference.charAt(0).toUpperCase()}${timePreference.slice(1)}`
                      : ''}
                  </p>
                </div>

                {loadingSlots ? (
                  <div className="rounded-xl border border-brand/15 bg-white/5 px-4 py-8 text-center">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-brand/15 border-t-brand" />

                    <p className="mt-3 text-sm text-white">
                      Loading available times...
                    </p>
                  </div>
                ) : availableSlots.length >
                  0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                          className="rounded-xl border border-brand/15 bg-white/5 px-4 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand/10 hover:text-brand-300"
                        >
                          {slot.display_time}
                        </button>
                      )
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-brand/15 bg-white/5 px-5 py-8 text-center">
                    <p className="text-sm text-white">
                      No available times for
                      this preference.
                    </p>

                    <p className="mt-1 text-xs text-white">
                      Please choose another
                      preference or date.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setStep('preference')
                  }
                  className="mt-5 text-xs font-medium text-white transition-colors hover:text-brand-300"
                >
                  ← Change preference
                </button>
              </div>
            )}

            {/* Step 4 — Details */}
            {step === 'details' && (
              <form
                onSubmit={handleDetailsSubmit}
              >
                <div className="mb-6">
                  <p className="eyebrow text-brand-300">
                    Step 4
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
                    Your details
                  </h2>

                  <div className="mt-3 rounded-xl border border-brand/15 bg-brand/5 px-4 py-3">
                    <p className="text-xs text-white">
                      Your consultation
                    </p>

                    <p className="mt-1 text-sm font-bold text-white">
                      {formatDate(date)}
                      {' · '}
                      {selectedDisplayTime}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
                  />

                  <input
                    type="text"
                    placeholder="Service you're interested in"
                    value={service}
                    onChange={(e) =>
                      setService(e.target.value)
                    }
                    disabled={submitting}
                    className={inputClass}
                  />

                  <div className="pt-2">
                    <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                      Meeting type
                    </p>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {MEETING_TYPES.map(
                        (option) => {
                          const selected =
                            meetingType ===
                            option.value;

                          return (
                            <button
                              key={
                                option.value
                              }
                              type="button"
                              onClick={() =>
                                setMeetingType(
                                  option.value
                                )
                              }
                              disabled={
                                submitting
                              }
                              className={`rounded-xl border px-4 py-4 text-left transition-all duration-300 disabled:opacity-60 ${
                                selected
                                  ? 'border-brand/50 bg-brand/10 shadow-[0_0_25px_rgba(47,188,186,0.08)]'
                                  : 'border-brand/15 bg-white/5 hover:border-brand/25 hover:bg-white/10'
                              }`}
                            >
                              <span
                                className={`block text-sm font-bold ${
                                  selected
                                    ? 'text-brand-300'
                                    : 'text-white'
                                }`}
                              >
                                {
                                  option.label
                                }
                              </span>

                              <span className="mt-1 block text-xs text-white">
                                {
                                  option.description
                                }
                              </span>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  <textarea
                    placeholder="Anything you'd like us to know? (optional)"
                    value={message}
                    onChange={(e) =>
                      setMessage(
                        e.target.value
                      )
                    }
                    rows={4}
                    disabled={submitting}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setStep('time')
                    }
                    disabled={submitting}
                    className="rounded-full border border-brand/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:border-brand/30 hover:bg-brand/10 hover:text-brand-300 disabled:opacity-50"
                  >
                    ← Change time
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting
                      ? 'Confirming...'
                      : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}

            {/* Confirmation */}
            {step === 'confirmed' && (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brand/20 bg-brand/10 text-2xl font-bold text-brand-300 shadow-[0_0_35px_rgba(47,188,186,0.12)]">
                  ✓
                </div>

                <p className="mt-6 eyebrow text-brand-300">
                  Booking received
                </p>

                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Your consultation is requested
                </h2>

                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white">
                  We&apos;ve received your request
                  for{' '}
                  <strong className="text-white">
                    {formatDate(date)}
                  </strong>{' '}
                  at{' '}
                  <strong className="text-white">
                    {selectedDisplayTime}
                  </strong>
                  .
                </p>

                <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-white">
                  We&apos;ll confirm the appointment
                  and contact you using the details
                  you provided.
                </p>
              </div>
            )}
          </GlassCard>
        </div>
      </section>
    </div>
  );
}