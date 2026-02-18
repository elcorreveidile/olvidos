"use client";

import { useState } from "react";
import Link from "next/link";

interface CalendarEvent {
  id: string;
  title: string;
  slug: string;
  startDate: Date;
  endDate: Date | null;
  eventType: string;
  location: string | null;
}

interface CalendarProps {
  events: CalendarEvent[];
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  BOOK_PRESENTATION: "bg-blue-100 text-blue-800 border-blue-300",
  RECITAL: "bg-purple-100 text-purple-800 border-purple-300",
  CONFERENCE: "bg-green-100 text-green-800 border-green-300",
  WORKSHOP: "bg-orange-100 text-orange-800 border-orange-300",
  EXHIBITION: "bg-pink-100 text-pink-800 border-pink-300",
  SCREENING: "bg-red-100 text-red-800 border-red-300",
  CONCERT: "bg-yellow-100 text-yellow-800 border-yellow-300",
  MEETING: "bg-gray-100 text-gray-800 border-gray-300",
  OTHER: "bg-coral/10 text-coral border-coral/30",
};

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function Calendar({ events, year, month, onMonthChange }: CalendarProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Get first day of month and total days
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Get previous month days for padding
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();

  // Group events by day
  const eventsByDay: Record<number, CalendarEvent[]> = {};
  events.forEach((event) => {
    const eventDate = new Date(event.startDate);
    if (eventDate.getFullYear() === year && eventDate.getMonth() === month - 1) {
      const day = eventDate.getDate();
      if (!eventsByDay[day]) {
        eventsByDay[day] = [];
      }
      eventsByDay[day].push(event);
    }
  });

  const handlePreviousMonth = () => {
    if (month === 1) {
      onMonthChange(year - 1, 12);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      onMonthChange(year + 1, 1);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    onMonthChange(today.getFullYear(), today.getMonth() + 1);
  };

  // Generate calendar days
  const calendarDays: Array<{
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    events: CalendarEvent[];
  }> = [];

  // Previous month padding
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isToday: false,
      events: [],
    });
  }

  // Current month days
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() + 1 &&
      year === today.getFullYear();

    calendarDays.push({
      day,
      isCurrentMonth: true,
      isToday,
      events: eventsByDay[day] || [],
    });
  }

  // Next month padding (to complete 6 weeks grid)
  const totalCells = Math.ceil(calendarDays.length / 7) * 7;
  const remainingCells = totalCells - calendarDays.length;
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isToday: false,
      events: [],
    });
  }

  return (
    <div className="bg-white rounded-sm shadow-card">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-acero-light">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-acero-light rounded-sm transition-colors"
          aria-label="Mes anterior"
        >
          <svg className="w-5 h-5 text-azul" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-xl font-bold text-azul">
            {MONTHS[month - 1]} {year}
          </h2>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-acero-light rounded-sm transition-colors"
          aria-label="Mes siguiente"
        >
          <svg className="w-5 h-5 text-azul" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center pb-2">
        <button
          onClick={goToToday}
          className="text-sm font-semibold text-coral hover:underline"
        >
          Ir a hoy
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-px bg-acero-light">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday}
            className="bg-acero/50 py-2 text-center text-xs font-bold text-azul uppercase"
          >
            {weekday}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-acero-light">
        {calendarDays.map((cell, index) => {
          const hasEvents = cell.events.length > 0;

          return (
            <div
              key={index}
              className={`
                min-h-[80px] bg-white p-1 cursor-pointer transition-colors
                ${!cell.isCurrentMonth ? "bg-acero/30" : ""}
                ${cell.isToday ? "bg-coral/5" : ""}
                ${selectedDay === cell.day && cell.isCurrentMonth ? "ring-2 ring-coral" : ""}
                ${hasEvents ? "hover:bg-acero/5" : ""}
              `}
              onClick={() => cell.isCurrentMonth && setSelectedDay(cell.day === selectedDay ? null : cell.day)}
            >
              <span
                className={`
                  inline-flex items-center justify-center w-6 h-6 text-sm font-semibold
                  ${cell.isToday ? "bg-coral text-white rounded-full" : ""}
                  ${!cell.isCurrentMonth ? "text-acero-light" : "text-azul"}
                `}
              >
                {cell.day}
              </span>

              {/* Events for this day */}
              {hasEvents && (
                <div className="mt-1 space-y-1">
                  {cell.events.slice(0, 3).map((event) => (
                    <Link
                      key={event.id}
                      href={`/actividades/${event.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className={`
                        block px-1 py-0.5 text-xs font-medium truncate rounded-sm border
                        ${EVENT_TYPE_COLORS[event.eventType] || EVENT_TYPE_COLORS.OTHER}
                        hover:opacity-80 transition-opacity
                      `}
                    >
                      {event.title}
                    </Link>
                  ))}

                  {cell.events.length > 3 && (
                    <div className="text-xs text-acero-light px-1">
                      +{cell.events.length - 3} más
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-acero-light">
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="font-semibold text-azul">Tipos de evento:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded-sm">Presentación</span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 border border-purple-300 rounded-sm">Recital</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 border border-green-300 rounded-sm">Conferencia</span>
          <span className="px-2 py-1 bg-orange-100 text-orange-800 border border-orange-300 rounded-sm">Taller</span>
          <span className="px-2 py-1 bg-pink-100 text-pink-800 border border-pink-300 rounded-sm">Exposición</span>
        </div>
      </div>
    </div>
  );
}
