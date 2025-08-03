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
        start: '2025-08-10',
        end: '2025-12-20',
      },
      {
        id: '2',
        title: 'Work',
        start: '2025-08-04',
        end: '2025-08-04',
      },
      {
        id: '3',
        title: 'Work',
        start: '2025-08-06',
        end: '2025-08-06',
      },
      {
        id: '4',
        title: 'Work',
        start: '2025-08-07',
        end: '2025-08-07',
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