import React, { useContext, useEffect, useState } from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { AuthContext } from '../../../../../Context/AuthContextProvider';
import { InterviewContext } from '../../../../../Context/InterviewContextProvider';

const InterviewCalendarLayout = () => {
    const { user } = useContext(AuthContext);
    const { interviewScheduleInfo } = useContext(InterviewContext);
    const recruiterId = user?._id;
    const [calendar, setCalendar] = useState([]);

    console.log("Calandar ", calendar);
    const fetchingInterviewDetails = async () => {
        try {
            const url = `http://localhost:5000/api/v1/recruiter/${recruiterId}/interviews/scheduled-info`;
            const response = await interviewScheduleInfo(url);
            if (response.success === true) {
                setCalendar(response.data);
            } else {
                console.log("Error while fetching interview details");
            }
        } catch (error) {
            console.log("Error from interview Calendar ", error.message);
        }
    }

    useEffect(() => {
        if (!recruiterId) return;
        fetchingInterviewDetails();
    }, [recruiterId]);

    // Flatten the event properties here (no nested extendedProps)
    const formattedEvents = calendar.map(item => ({
        title: `Interview with ${item?.title}`,
        start: item?.start,
        applicantId: item?.extendedProps?.applicantId,
        jobId: item?.extendedProps?.jobId,
        meetingType: item?.extendedProps?.meetingType,
        location: item?.extendedProps?.location,
        notes: item?.extendedProps?.notes,
    }));

    console.log("Formatted Events", formattedEvents);

    const [selectedEvent, setSelectedEvent] = useState(null);
    console.log("Seleceted Evevt===", selectedEvent);

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
                events={formattedEvents}
                eventClick={(info) => {
                    setSelectedEvent({
                        title: info.event.title,
                        start: info.event.start,
                        meetingType: info.event.extendedProps.meetingType,
                        location: info.event.extendedProps.location,
                        notes: info.event.extendedProps.notes,
                    });
                    document.getElementById("interview_modal").showModal();
                }}
                editable={false}
                selectable={true}
                height="auto"
            />

            <dialog id="interview_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">📄 Interview Details</h3>
                    {selectedEvent && (
                        <form className="mt-4 space-y-2 text-sm">
                            <div>
                                <label className="block font-semibold mb-1">👤 Applicant</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={selectedEvent.title}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">📅 Start Time</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={new Date(selectedEvent.start).toLocaleString()}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">🧑‍💼 Meeting Type</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={selectedEvent.meetingType || "Not specified"}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">🌐 Location</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={selectedEvent.location || "Not provided"}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">📝 Notes</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={selectedEvent.notes || "None"}
                                    readOnly
                                />
                            </div>
                        </form>
                    )}

                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default InterviewCalendarLayout;
