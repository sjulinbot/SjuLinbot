import React, { useState } from 'react';
import './Calendar.css';

const events = {
    "2026-0": {
        1: { type: "red", label: "New Year" },
        14: { type: "red", label: "Makara Sankranti" },
        26: { type: "red", label: "Republic Day" },
        12: { type: "yellow", label: "Sports Day" }
    },
    "2026-1": {
        20: { type: "purple", label: "University Holiday" },
        11: { type: "yellow", label: "No Classes" }
    },
    "2026-2": {
        5: { type: "blue", label: "Day Order Change" }
    },
    "2026-6": {
        6: { type: "red", label: "Last Day of Moharam" },
        7: { type: "red", label: "Bakrid" },
        1: { type: "yellow", label: "Selection for University Sports team" },
        15: { type: "yellow", label: "Selection for University Sports team" }
    },
    "2026-7": {
        15: { type: "red", label: "Independence Day" },
        27: { type: "red", label: "Varasiddhi Vinayaka Vrata" },
        11: { type: "blue", label: "Order of Thu timetable" },
        4: { type: "yellow", label: "PEGASUS intramurals Phase-1" }
    },
    "2026-8": {
        5: { type: "red", label: "Eid-Milad" },
        21: { type: "red", label: "Mahalaya Amavasya" },
        8: { type: "purple", label: "Nativity of the Blessed Virgin Mary" },
        13: { type: "blue", label: "Order of Mon timetable" },
        16: { type: "blue", label: "Order of Fri timetable" },
        27: { type: "yellow", label: "Convocation day" }
    },
    "2026-9": {
        2: { type: "red", label: "Gandhi Jayanthi" },
        1: { type: "red", label: "Mahanavami/Ayudhapooja" },
        7: { type: "red", label: "Maharshi Valmiki Jayanthi" },
        20: { type: "red", label: "Naraka Chaturdashi" },
        22: { type: "red", label: "Balipadyami, Deepavali" },
        6: { type: "blue", label: "Order of Tue timetable" },
        10: { type: "blue", label: "Order of Wed timetable" }
    },
    "2026-10": {
        1: { type: "red", label: "Kannada Rajyotsava" },
        8: { type: "red", label: "Kanakadasa Jayanthi" }
    }
};

const colorDescriptions = {
    "purple": "Holidays declared by the University",
    "red": "Public holidays",
    "yellow": "Working days - no regular classes",
    "blue": "Day order is changed for these days"
};

const Calendar = () => {
    // Start at Jan 2026 as per request
    const [currentDate, setCurrentDate] = useState(new Date());

    const getMonthData = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const startDayIndex = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
        const totalDays = lastDayOfMonth.getDate();

        // Previous month days to fill
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        const prevMonthDays = [];
        for (let i = startDayIndex - 1; i >= 0; i--) {
            prevMonthDays.push(prevMonthLastDay - i);
        }

        // Current month days
        const currentMonthDays = [];
        for (let i = 1; i <= totalDays; i++) {
            currentMonthDays.push(i);
        }

        // Next month days to fill grid (42 cells total)
        const currentFilled = startDayIndex + totalDays;
        const toFill = 42 - currentFilled;
        const nextMonthDays = [];
        for (let i = 1; i <= toFill; i++) {
            nextMonthDays.push(i);
        }

        return { year, month, prevMonthDays, currentMonthDays, nextMonthDays };
    };

    const { year, month, prevMonthDays, currentMonthDays, nextMonthDays } = getMonthData(currentDate);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthKey = `${year}-${month}`;
    const monthEvents = events[monthKey] || {};
    const today = new Date();

    const changeMonth = (diff) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + diff, 1);
        setCurrentDate(newDate);
    };

    const changeYear = (diff) => {
        const newDate = new Date(currentDate.getFullYear() + diff, currentDate.getMonth(), 1);
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    return (
        <div className="calendar-container">
            <div className="calendar-breadcrumb">ACADEMIC CALENDAR</div>
            <div className="calendar-title">ACADEMIC CALENDAR</div>

            <div className="calendar-header">
                <div className="calendar-nav">
                    <div className="nav-btn" onClick={() => changeYear(-1)}>&laquo;</div>
                    <div className="nav-btn" onClick={() => changeMonth(-1)}>&lsaquo;</div>
                    <div id="monthYearDisplay">{monthNames[month]} {year}</div>
                    <div className="nav-btn" onClick={() => changeMonth(1)}>&rsaquo;</div>
                    <div className="nav-btn" onClick={() => changeYear(1)}>&raquo;</div>
                </div>
                <button className="today-btn" onClick={goToToday}>Today</button>
            </div>

            <div className="calendar-grid">
                {/* Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="grid-header">{day}</div>
                ))}

                {/* Previous Month Cells */}
                {prevMonthDays.map(day => (
                    <div key={`prev-${day}`} className="grid-cell other-month">
                        <span className="date-number">{day}</span>
                    </div>
                ))}

                {/* Current Month Cells */}
                {currentMonthDays.map(day => {
                    const event = monthEvents[day];
                    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
                    let cellClass = 'grid-cell';
                    if (isToday) cellClass += ' highlight-yellow';
                    if (event) {
                        if (event.type === 'purple') cellClass += ' bg-purple';
                        if (event.type === 'red') cellClass += ' bg-red';
                        if (event.type === 'yellow') cellClass += ' bg-yellow';
                        if (event.type === 'blue') cellClass += ' bg-blue';
                    }

                    return (
                        <div key={`curs-${day}`} className={cellClass} title={event ? `${colorDescriptions[event.type]} (${event.label})` : (isToday ? "Today" : "")}>
                            <span className="date-number">{day}</span>
                            {event && <div className="event-label">{event.label}</div>}
                        </div>
                    );
                })}

                {/* Next Month Cells */}
                {nextMonthDays.map(day => (
                    <div key={`next-${day}`} className="grid-cell other-month">
                        <span className="date-number">{day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
