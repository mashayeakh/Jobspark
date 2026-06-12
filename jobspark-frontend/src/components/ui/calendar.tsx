import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface CalendarProps {
  mode?: "single" | "range" | "multiple"
  selected?: Date | Date[] | { from?: Date; to?: Date }
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  initialFocus?: boolean
  className?: string
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, mode = "single", selected, onSelect, disabled, initialFocus, ...props }, ref) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date())
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
      Array.isArray(selected) ? selected[0] : selected as Date
    )

    React.useEffect(() => {
      if (selected) {
        if (Array.isArray(selected)) {
          setSelectedDate(selected[0] as Date)
        } else {
          setSelectedDate(selected as Date)
        }
      }
    }, [selected])

    const daysInMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const firstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const generateCalendarDays = () => {
      const days = []
      const daysInCurrentMonth = daysInMonth(currentMonth)
      const firstDay = firstDayOfMonth(currentMonth)

      // Add empty cells for days before month starts
      for (let i = 0; i < firstDay; i++) {
        days.push(null)
      }

      // Add days of the month
      for (let i = 1; i <= daysInCurrentMonth; i++) {
        days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i))
      }

      return days
    }

    const handleDateClick = (date: Date) => {
      if (disabled && disabled(date)) return

      if (onSelect) {
        onSelect(date)
      }
    }

    const handlePrevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
    }

    const handleNextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
    }

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    const isDateSelected = (date: Date) => {
      if (!selectedDate) return false
      return date.toDateString() === selectedDate.toDateString()
    }

    const isDateDisabled = (date: Date) => {
      return disabled ? disabled(date) : false
    }

    return (
      <div className={`p-3 ${className || ''}`} ref={ref} {...props}>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {generateCalendarDays().map((date, index) => (
            <div key={index} className="aspect-square">
              {date && (
                <button
                  onClick={() => handleDateClick(date)}
                  disabled={isDateDisabled(date)}
                  className={`w-full h-full p-2 text-sm rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDateSelected(date)
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : isDateDisabled(date)
                      ? 'text-gray-300 cursor-not-allowed'
                      : ''
                    }`}
                >
                  {date.getDate()}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }
)
Calendar.displayName = "Calendar"

export { Calendar }
