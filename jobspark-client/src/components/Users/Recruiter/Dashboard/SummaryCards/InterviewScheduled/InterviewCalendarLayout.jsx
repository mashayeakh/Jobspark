import React, { useContext, useEffect, useState } from 'react'
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { AuthContext } from '../../../../../Context/AuthContextProvider'
import { InterviewContext } from '../../../../../Context/InterviewContextProvider'
import { FaCalendarAlt, FaMapMarkerAlt, FaStickyNote, FaUser, FaClock, FaTimes } from 'react-icons/fa'
import { MdMeetingRoom, MdOutlineEventNote } from 'react-icons/md'

const InterviewCalendarLayout = () => {
    const { user } = useContext(AuthContext)
    const { interviewScheduleInfo } = useContext(InterviewContext)
    const recruiterId = user?._id
    const [calendar, setCalendar] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedEvent, setSelectedEvent] = useState(null)

    const fetchingInterviewDetails = async () => {
        try {
            setLoading(true)
            const url = `http://localhost:5000/api/v1/recruiter/${recruiterId}/interviews/scheduled-info`
            const response = await interviewScheduleInfo(url)
            if (response.success === true) {
                setCalendar(response.data)
            } else {
                console.log("Error while fetching interview details")
            }
        } catch (error) {
            console.log("Error from interview Calendar ", error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!recruiterId) return
        fetchingInterviewDetails()
    }, [recruiterId])

    const formattedEvents = calendar.map(item => ({
        title: `Interview with ${item?.title}`,
        start: item?.start,
        applicantId: item?.extendedProps?.applicantId,
        jobId: item?.extendedProps?.jobId,
        meetingType: item?.extendedProps?.meetingType,
        location: item?.extendedProps?.location,
        notes: item?.extendedProps?.notes,
    }))

    const renderEventContent = (eventInfo) => {
        return (
            <div className="p-2 bg-white border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
                <div className="font-medium text-gray-800 truncate">{eventInfo.event.title}</div>
                <div className="text-xs text-gray-500 mt-1">
                    {new Date(eventInfo.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <FaCalendarAlt className="mr-3 text-indigo-600" />
                        Interview Calendar
                    </h1>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-96 bg-white rounded-xl shadow-sm">
                        <div className="animate-pulse flex flex-col items-center">
                            <MdOutlineEventNote className="text-4xl text-indigo-300 mb-4" />
                            <p className="text-gray-400">Loading interviews...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden p-8">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right: "dayGridMonth,timeGridWeek,timeGridDay",
                            }}
                            events={formattedEvents}
                            eventContent={renderEventContent}
                            eventClick={(info) => {
                                setSelectedEvent({
                                    title: info.event.title,
                                    start: info.event.start,
                                    meetingType: info.event.extendedProps.meetingType,
                                    location: info.event.extendedProps.location,
                                    notes: info.event.extendedProps.notes,
                                })
                                document.getElementById("interview_modal").showModal()
                            }}
                            editable={false}
                            selectable={true}
                            height="auto"
                            dayMaxEventRows={3}
                            eventDisplay="block"
                            eventClassNames="hover:cursor-pointer"
                            dayHeaderClassNames="bg-gray-50 text-gray-600 font-medium"
                            buttonText={{
                                today: 'Today',
                                month: 'Month',
                                week: 'Week',
                                day: 'Day'
                            }}
                            nowIndicator={true}
                            dayCellClassNames="hover:bg-gray-50"
                        />
                    </div>
                )}

                <dialog id="interview_modal" className="modal">
                    <div className="modal-box max-w-2xl bg-white rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <MdMeetingRoom className="mr-2 text-indigo-600" />
                                Interview Details
                            </h3>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost">
                                    <FaTimes className="text-gray-400" />
                                </button>
                            </form>
                        </div>

                        {selectedEvent && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-500 flex items-center">
                                            <FaUser className="mr-2 text-indigo-400" />
                                            Applicant
                                        </label>
                                        <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                                            {selectedEvent.title}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-500 flex items-center">
                                            <FaClock className="mr-2 text-indigo-400" />
                                            Start Time
                                        </label>
                                        <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                                            {new Date(selectedEvent.start).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-500 flex items-center">
                                            <MdMeetingRoom className="mr-2 text-indigo-400" />
                                            Meeting Type
                                        </label>
                                        <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                                            {selectedEvent.meetingType || "Not specified"}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-500 flex items-center">
                                            <FaMapMarkerAlt className="mr-2 text-indigo-400" />
                                            Location
                                        </label>
                                        <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                                            {selectedEvent.location || "Not provided"}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-500 flex items-center">
                                            <FaStickyNote className="mr-2 text-indigo-400" />
                                            Notes
                                        </label>
                                        <div className="p-3 bg-gray-50 rounded-lg text-gray-800 min-h-[100px]">
                                            {selectedEvent.notes || "None"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="modal-action mt-8">
                            <form method="dialog">
                                <button className="btn btn-primary px-6">Close</button>
                            </form>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </div>
        </div>
    )
}

export default InterviewCalendarLayout