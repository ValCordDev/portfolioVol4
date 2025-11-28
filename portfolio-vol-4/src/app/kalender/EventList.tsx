"use client";

import { useState, useEffect } from "react";
import { format, parseISO, isBefore, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { nb } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import { Calendar as CalendarIcon } from "lucide-react";
import { getAllEvents, Event } from "@/lib/events";
import { events as fallbackEvents } from "@/data/events";
import { getAllAvailability, Availability } from "@/lib/availability";
import Image from "next/image";

export default function EventList() {
  const [showPast, setShowPast] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [availableDates, setAvailableDates] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const osloTz = "Europe/Oslo";
  const now = toZonedTime(new Date(), osloTz);

  // Load events and availability from Firebase
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const [fetchedEvents, availability] = await Promise.all([getAllEvents(), getAllAvailability()]);
        setEvents(fetchedEvents);
        setAvailableDates(availability);
      } catch (error) {
        console.error("Failed to load events from Firebase:", error);
        setEvents(fallbackEvents);
        setError("Using offline data");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Group events by day
  const grouped = events.reduce((acc: Record<string, Event[]>, ev) => {
    const d = toZonedTime(parseISO(ev.date), osloTz);
    const key = format(d, "yyyy-MM-dd");
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort();

  // Calendar helper functions
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const firstDayOffset = getDay(monthStart);
  const calendarDays = [
    ...Array(firstDayOffset).fill(null),
    ...daysInMonth
  ];

  const availabilityMap: Record<string, Availability> = availableDates.reduce((acc, a) => {
    acc[a.date] = a;
    return acc;
  }, {} as Record<string, Availability>);

  const isAvailableDay = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    return !!availabilityMap[key];
  };

  const getAvailabilityForDay = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    return availabilityMap[key];
  };

  if (loading) {
    return (
      <div className="text-white min-h-screen p-6 max-w-3xl w-full flex items-center justify-center">
        <div className="text-gray-400">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen p-6 max-w-3xl w-full">
      {/* Error message */}
      {error && (
        <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Kalender</h1>
          <p className="text-gray-400 text-sm">Kommende arrangementer/aktiviteter (tilgjengelig andre dager)</p>
        </div>
        <div className="flex items-center space-x-2 text-gray-300">
          <CalendarIcon className="w-5 h-5" />
          <span>{format(now, "MMM yyyy", { locale: nb })}</span>
        </div>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setShowPast(!showPast)}
        className="mb-4 text-sm text-white hover:underline font-semibold hover:cursor-pointer"
      >
        {showPast ? "<- Gjem tidligere arrangementer " : "-> Vis tidligere arrangementer"}
      </button>

      {/* Calendar Section */}
      <div className="mb-8 bg-neutral-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Tilgjengelighet</h2>
            <p className="text-sm font-bold text-gray-300">NB: Tid kan variere</p>
            <p className="text-xs font-light text-gray-400">* Dager markert med gul bakgrunn er tilgjengelige</p>
            
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="px-3 py-1 text-sm bg-neutral-800 hover:bg-neutral-700 rounded transition"
            >
              ←
            </button>
            <span className="px-4 py-1 text-sm font-semibold">{format(currentMonth, "MMMM yyyy", { locale: nb }).replace(/^./, c => c.toUpperCase())}</span>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="px-3 py-1 text-sm bg-neutral-800 hover:bg-neutral-700 rounded transition"
            >
              →
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, idx) => (
            <div
              key={idx}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-semibold transition p-2 ${
                date === null
                  ? "bg-transparent"
                  : isAvailableDay(date)
                  ? "bg-yellow-500 text-black hover:bg-yellow-400 cursor-pointer"
                  : "bg-neutral-800 text-gray-400 hover:bg-neutral-700 cursor-pointer"
              }`}
            >
              {date && <div className="text-center w-full">{format(date, "d")}</div>}
              {date && getAvailabilityForDay(date) && (
                <div className="mt-1 text-xs text-black/80 text-center">
                  {getAvailabilityForDay(date)?.startTime
                    ? `${getAvailabilityForDay(date)?.startTime}${getAvailabilityForDay(date)?.endTime ? `–${getAvailabilityForDay(date)?.endTime}` : ""}`
                    : "Hele dagen"}
                  {getAvailabilityForDay(date)?.location ? ` · ${getAvailabilityForDay(date)?.location}` : ""}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Events */}
      <div className="space-y-6">
        {dates.map((date) => {
          const dayEvents = grouped[date];
          const dateObj = parseISO(date);
          const isPast = isBefore(dateObj, now);
          if (!showPast && isPast) return null;

          return (
            <div key={date} className="flex items-start space-x-4">
              {/* Date pill */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold">
                  {format(dateObj, "d")}
                </div>
                <span className="text-xs text-gray-400 uppercase mt-1">
                  {format(dateObj, "MMM", { locale: nb })} {format(dateObj, "y")}
                </span>
              </div>

              {/* Event cards */}
              <div className="flex-1 space-y-2">
                {dayEvents.map((ev, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral-900 rounded-xl p-4 flex items-center justify-between hover:bg-neutral-800 transition"
                  >
                    <span className="text-sm">{ev.title}</span>
                    {ev.logo && (
                      <Image src={ev.logo} alt={ev.company} className="rounded" width={24} height={24} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
