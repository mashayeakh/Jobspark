import React from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const InterviewCalendarLayout = () => {
    // 🔹 Dummy data (will come from backend later)
    const events = [
        {
            title: "Interview with John Doe",
            start: "2025-06-20T10:00:00",
            end: "2025-06-20T11:00:00",
            extendedProps: {
                applicantId: "123",
                jobId: "789",
                meetingType: "Google Meet",
                location: "https://meet.google.com/abc-defg",
                notes: "Frontend Developer Position",
            },
        },
        {
            title: "Interview with Jane Smith",
            start: "2025-06-21T14:30:00",
            end: "2025-06-21T15:30:00",
        },
    ];
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">📅 Interview Calendar</h2>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={events}
                editable={false}
                selectable={true}
                height="auto"
            />
        </div>)
}

export default InterviewCalendarLayout