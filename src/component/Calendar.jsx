// // Calendar.jsx
// import React, { useState } from "react";
// import {
//   format,
//   startOfMonth,
//   endOfMonth,
//   eachDayOfInterval,
//   isSameDay,
//   addMonths,
//   subMonths,
//   startOfWeek,
//   endOfWeek,
//   isToday,
// } from "date-fns";

// const Calendar = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [note, setNote] = useState("");

//   // Status types with colors
//   const STATUS = {
//     BOOKED: "booked", // Red
//     PENDING: "pending", // Green (khali)
//     IN_TALKS: "in_talks", // Orange (baat chalu)
//   };

//   // Sample data - aap ise API se ya localStorage se la sakte hain
//   const [bookings, setBookings] = useState({
//     // Format: 'yyyy-MM-dd': { status: 'booked' | 'pending' | 'in_talks', note: 'text' }
//     [format(new Date(), "yyyy-MM-dd")]: {
//       status: "booked",
//       note: "Client meeting",
//     },
//   });

//   // Get color based on status
//   const getStatusColor = (dateKey) => {
//     const booking = bookings[dateKey];

//     if (!booking) return "bg-green-500 hover:bg-green-600"; // Khali date = Green
//     if (booking.status === "booked") return "bg-red-500 hover:bg-red-600"; // Booked = Red
//     if (booking.status === "in_talks")
//       return "bg-orange-500 hover:bg-orange-600"; // Talks = Orange
//     if (booking.status === "pending") return "bg-green-500 hover:bg-green-600"; // Pending = Green

//     return "bg-green-500 hover:bg-green-600";
//   };

//   // Get calendar days
//   const getCalendarDays = () => {
//     const monthStart = startOfMonth(currentDate);
//     const monthEnd = endOfMonth(currentDate);
//     const startDate = startOfWeek(monthStart);
//     const endDate = endOfWeek(monthEnd);

//     return eachDayOfInterval({ start: startDate, end: endDate });
//   };

//   // Handle date click
//   const handleDateClick = (date) => {
//     setSelectedDate(date);
//     const dateKey = format(date, "yyyy-MM-dd");
//     const existing = bookings[dateKey];
//     setNote(existing?.note || "");
//     setShowModal(true);
//   };

//   // Update booking status
//   const updateStatus = (status) => {
//     if (!selectedDate) return;
//     const dateKey = format(selectedDate, "yyyy-MM-dd");

//     setBookings((prev) => ({
//       ...prev,
//       [dateKey]: {
//         status,
//         note: note || "",
//       },
//     }));
//   };

//   // Save note
//   const saveNote = () => {
//     if (!selectedDate) return;
//     const dateKey = format(selectedDate, "yyyy-MM-dd");

//     setBookings((prev) => ({
//       ...prev,
//       [dateKey]: {
//         status: prev[dateKey]?.status || "in_talks",
//         note: note,
//       },
//     }));
//   };

//   // Clear booking
//   const clearBooking = () => {
//     if (!selectedDate) return;
//     const dateKey = format(selectedDate, "yyyy-MM-dd");

//     setBookings((prev) => {
//       const updated = { ...prev };
//       delete updated[dateKey];
//       return updated;
//     });
//   };

//   // Close modal
//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedDate(null);
//     setNote("");
//   };

//   // Get current status of selected date
//   const getCurrentStatus = () => {
//     if (!selectedDate) return null;
//     const dateKey = format(selectedDate, "yyyy-MM-dd");
//     return bookings[dateKey];
//   };

//   const days = getCalendarDays();
//   const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-t-xl shadow-lg p-4 md:p-6">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
//             📅 Booking Calendar
//           </h1>

//           {/* Legend */}
//           <div className="flex flex-wrap justify-center gap-4 mb-4">
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 rounded bg-red-500"></div>
//               <span className="text-sm text-gray-600">Booked</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 rounded bg-orange-500"></div>
//               <span className="text-sm text-gray-600">In Talks (Notes)</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 rounded bg-green-500"></div>
//               <span className="text-sm text-gray-600">Available (Khali)</span>
//             </div>
//           </div>
//         </div>

//         {/* Calendar */}
//         <div className="bg-white rounded-b-xl shadow-lg p-4 md:p-6">
//           {/* Month Navigation */}
//           <div className="flex items-center justify-between mb-6">
//             <button
//               onClick={() => setCurrentDate(subMonths(currentDate, 1))}
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//             >
//               ← Prev
//             </button>

//             <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
//               {format(currentDate, "MMMM yyyy")}
//             </h2>

//             <button
//               onClick={() => setCurrentDate(addMonths(currentDate, 1))}
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//             >
//               Next →
//             </button>
//           </div>

//           {/* Week Days Header */}
//           <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
//             {weekDays.map((day) => (
//               <div
//                 key={day}
//                 className="text-center text-xs md:text-sm font-semibold text-gray-500 py-2"
//               >
//                 {day}
//               </div>
//             ))}
//           </div>

//           {/* Calendar Days */}
//           <div className="grid grid-cols-7 gap-1 md:gap-2">
//             {days.map((day, idx) => {
//               const dateKey = format(day, "yyyy-MM-dd");
//               const isCurrentMonth = day.getMonth() === currentDate.getMonth();
//               const isTodayDate = isToday(day);
//               const booking = bookings[dateKey];

//               return (
//                 <button
//                   key={idx}
//                   onClick={() => handleDateClick(day)}
//                   className={`
//                     relative aspect-square rounded-lg p-1 md:p-2 transition-all duration-200
//                     ${getStatusColor(dateKey)}
//                     ${!isCurrentMonth ? "opacity-40" : ""}
//                     ${isTodayDate ? "ring-2 ring-blue-500 ring-offset-1" : ""}
//                     text-white font-semibold
//                     hover:scale-105 transform
//                     shadow-sm
//                     flex flex-col items-center justify-center
//                   `}
//                 >
//                   <span className="text-sm md:text-lg">{format(day, "d")}</span>

//                   {/* Note indicator */}
//                   {booking?.note && (
//                     <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></span>
//                   )}

//                   {/* Status label (desktop) */}
//                   {booking && (
//                     <span className="hidden md:block text-[10px] mt-1 opacity-90 truncate w-full text-center">
//                       {booking.status === "booked"
//                         ? "Booked"
//                         : booking.status === "in_talks"
//                         ? "Talks"
//                         : "Free"}
//                     </span>
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* MODAL - Click par options open */}
//       {showModal && selectedDate && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//           onClick={closeModal}
//         >
//           <div
//             className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-xl font-bold text-gray-800">
//                 {format(selectedDate, "EEEE, dd MMMM yyyy")}
//               </h3>
//               <button
//                 onClick={closeModal}
//                 className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
//               >
//                 ×
//               </button>
//             </div>

//             {/* Current Status */}
//             {getCurrentStatus() && (
//               <div className="mb-4 p-3 rounded-lg bg-gray-50">
//                 <span className="text-sm text-gray-600">Current status: </span>
//                 <span
//                   className={`font-semibold capitalize ${
//                     getCurrentStatus().status === "booked"
//                       ? "text-red-500"
//                       : getCurrentStatus().status === "in_talks"
//                       ? "text-orange-500"
//                       : "text-green-500"
//                   }`}
//                 >
//                   {getCurrentStatus().status === "in_talks"
//                     ? "In Talks"
//                     : getCurrentStatus().status}
//                 </span>
//               </div>
//             )}

//             {/* Options */}
//             <div className="space-y-3 mb-4">
//               <p className="text-sm font-semibold text-gray-700">
//                 Select Status:
//               </p>

//               <button
//                 onClick={() => updateStatus("booked")}
//                 className={`w-full py-3 rounded-lg font-semibold text-white transition-all
//                   ${
//                     getCurrentStatus()?.status === "booked"
//                       ? "bg-red-600 ring-2 ring-red-300"
//                       : "bg-red-500 hover:bg-red-600"
//                   }`}
//               >
//                 🔴 Booked
//               </button>

//               <button
//                 onClick={() => updateStatus("in_talks")}
//                 className={`w-full py-3 rounded-lg font-semibold text-white transition-all
//                   ${
//                     getCurrentStatus()?.status === "in_talks"
//                       ? "bg-orange-600 ring-2 ring-orange-300"
//                       : "bg-orange-500 hover:bg-orange-600"
//                   }`}
//               >

//                 🟠 In Talks (Baat Chalu)
//               </button>

//               <button
//                 onClick={() => updateStatus("pending")}
//                 className={`w-full py-3 rounded-lg font-semibold text-white transition-all
//                   ${
//                     getCurrentStatus()?.status === "pending"
//                       ? "bg-green-600 ring-2 ring-green-300"
//                       : "bg-green-500 hover:bg-green-600"
//                   }`}
//               >
//                 🟢 Available / Khali
//               </button>
//             </div>

//             {/* Notes */}
//             <div className="mb-4">
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 📝 Notes (feed)
//               </label>
//               <textarea
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//                 placeholder="Yahan note likhein..."
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                 rows={3}
//               />
//               <button
//                 onClick={saveNote}
//                 className="mt-2 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
//               >
//                 Save Note
//               </button>
//             </div>

//             {/* Clear / Delete */}
//             <button
//               onClick={() => {
//                 clearBooking();
//                 closeModal();
//               }}
//               className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
//             >
//               🗑️ Clear / Reset
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Inline styles for animation */}
//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: scale(0.95); }
//           to { opacity: 1; transform: scale(1); }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.2s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Calendar;
import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
} from "date-fns";

const STORAGE_KEY = "my-calendar-data-v1";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ PERSISTENT DATA - localStorage se load + auto save
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Draft inputs for modal (only saved on Save click)
  const [draftStatus, setDraftStatus] = useState(null);
  const [draftNote, setDraftNote] = useState("");

  // ✅ Auto-save to localStorage whenever bookings change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  // Status → color
  const getColorClass = (dateKey) => {
    const b = bookings[dateKey];
    if (!b || b.status === "available") return "bg-green-500 text-white";
    if (b.status === "booked") return "bg-red-500 text-white";
    if (b.status === "in_talks") return "bg-orange-500 text-white";
    return "bg-green-500 text-white";
  };

  // Calendar days grid
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  });

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  // Open modal
  const openModal = (day) => {
    const key = format(day, "yyyy-MM-dd");
    const existing = bookings[key];
    setSelectedDate(day);
    setDraftStatus(existing?.status || null);
    setDraftNote(existing?.note || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setDraftStatus(null);
    setDraftNote("");
  };

  // ✅ SAVE — data stays forever until user removes
  const handleSave = () => {
    if (!selectedDate) return;
    const key = format(selectedDate, "yyyy-MM-dd");
    setBookings((prev) => ({
      ...prev,
      [key]: {
        status: draftStatus || "available",
        note: draftNote.trim(),
        savedAt: new Date().toISOString(),
      },
    }));
    closeModal();
  };

  // ✅ REMOVE — only here data gets deleted
  const handleRemove = () => {
    if (!selectedDate) return;
    const key = format(selectedDate, "yyyy-MM-dd");
    setBookings((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    closeModal();
  };

  const selectedKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const hasExisting = selectedKey && bookings[selectedKey];

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-2 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-3 sm:p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white text-lg active:scale-95"
          >
            ‹
          </button>
          <h2 className="text-base sm:text-lg font-bold text-gray-800">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white text-lg active:scale-95"
          >
            ›
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 mb-2 text-[10px] text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Booked
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Talks
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Free
          </span>
        </div>

        {/* Week header */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekDays.map((d, i) => (
            <div
              key={i}
              className="text-center text-[10px] font-bold text-gray-400"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const key = format(day, "yyyy-MM-dd");
            const inMonth = day.getMonth() === currentDate.getMonth();
            const today = isToday(day);
            const booking = bookings[key];

            return (
              <button
                key={i}
                onClick={() => openModal(day)}
                className={`
                  relative aspect-square rounded-md flex flex-col items-center justify-center
                  transition-all active:scale-95
                  ${inMonth ? getColorClass(key) : "bg-gray-50 text-gray-300"}
                  ${today ? "ring-2 ring-blue-600 ring-offset-1" : ""}
                  overflow-hidden
                `}
              >
                <span className="text-[11px] sm:text-sm font-semibold leading-none">
                  {format(day, "d")}
                </span>

                {/* ✅ Saved note preview on cell */}
                {booking?.note && (
                  <span className="text-[7px] sm:text-[8px] leading-tight px-0.5 mt-0.5 w-full truncate text-center opacity-90">
                    {booking.note}
                  </span>
                )}

                {/* dot indicator for saved status */}
                {booking && !booking.note && (
                  <span className="absolute bottom-0.5 w-1 h-1 bg-white rounded-full opacity-80" />
                )}
              </button>
            );
          })}
        </div>

        {/* Total count */}
        <p className="text-center text-[11px] text-gray-400 mt-3">
          {Object.keys(bookings).length} saved entr
          {Object.keys(bookings).length === 1 ? "y" : "ies"}
        </p>
      </div>

      {/* ✅ MODAL */}
      {showModal && selectedDate && (
        <div
          className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-4 max-h-[90vh] overflow-y-auto animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800">
                {format(selectedDate, "EEE, dd MMM yyyy")}
              </h3>
              <button
                onClick={closeModal}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-lg"
              >
                ×
              </button>
            </div>

            {/* Status buttons */}
            <p className="text-[11px] font-semibold text-gray-500 mb-1">
              STATUS
            </p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={() => setDraftStatus("booked")}
                className={`py-2 rounded-lg text-[11px] font-bold transition-all ${
                  draftStatus === "booked"
                    ? "bg-red-500 text-white ring-2 ring-red-300"
                    : "bg-red-50 text-red-600"
                }`}
              >
                🔴 Booked
              </button>
              <button
                onClick={() => setDraftStatus("in_talks")}
                className={`py-2 rounded-lg text-[11px] font-bold transition-all ${
                  draftStatus === "in_talks"
                    ? "bg-orange-500 text-white ring-2 ring-orange-300"
                    : "bg-orange-50 text-orange-600"
                }`}
              >
                🟠 Talks
              </button>
              <button
                onClick={() => setDraftStatus("available")}
                className={`py-2 rounded-lg text-[11px] font-bold transition-all ${
                  draftStatus === "available"
                    ? "bg-green-500 text-white ring-2 ring-green-300"
                    : "bg-green-50 text-green-600"
                }`}
              >
                🟢 Free
              </button>
            </div>

            {/* Note input */}
            <p className="text-[11px] font-semibold text-gray-500 mb-1">NOTE</p>
            <textarea
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder="Write note..."
              rows={3}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none mb-3"
            />

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg active:scale-95"
              >
                💾 Save
              </button>
              {hasExisting && (
                <button
                  onClick={handleRemove}
                  className="py-2.5 px-4 bg-red-100 text-red-600 text-sm font-bold rounded-lg active:scale-95"
                >
                  🗑 Remove
                </button>
              )}
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-2">
              Data saved permanently. Remove only when you click Remove.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.25s ease-out; }
      `}</style>
    </div>
  );
};

export default Calendar;
