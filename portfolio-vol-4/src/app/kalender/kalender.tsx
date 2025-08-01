'use client'


import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewMonthAgenda,
  createViewMonthGrid,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
 
import '@schedule-x/theme-default/dist/index.css'
import { useState } from "react";
import '@/app/globals.css'

function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin())[0]
 
  const calendar = useNextCalendarApp({
    views: [createViewMonthGrid(), createViewMonthAgenda()],
    events: [
      {
        id: '1',
        title: 'In Trondheim',
        start: '2025-08-09',
        end: '2025-12-20',
      },
    ],
    plugins: [eventsService],
    callbacks: {
      onRender: () => {
        eventsService.getAll()
      }
    }
  })
 
  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}
 
export default CalendarApp