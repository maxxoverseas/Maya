// import React, { useState, useEffect } from "react";
// import {
//   format,
//   startOfMonth,
//   endOfMonth,
//   eachDayOfInterval,
//   addMonths,
//   subMonths,
//   startOfWeek,
//   endOfWeek,
//   isToday,
// } from "date-fns";

// const STORAGE_KEY = "my-calendar-data-v1";

// const Calendar = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   // ✅ PERSISTENT DATA - localStorage se load + auto save
//   const [bookings, setBookings] = useState(() => {
//     try {
//       const saved = localStorage.getItem(STORAGE_KEY);
//       return saved ? JSON.parse(saved) : {};
//     } catch {
//       return {};
//     }
//   });

//   // Draft inputs for modal (only saved on Save click)
//   const [draftStatus, setDraftStatus] = useState(null);
//   const [draftNote, setDraftNote] = useState("");

//   // ✅ Auto-save to localStorage whenever bookings change
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
//   }, [bookings]);

//   // Status → color
//   const getColorClass = (dateKey) => {
//     const b = bookings[dateKey];
//     if (!b || b.status === "available") return "bg-green-500 text-white";
//     if (b.status === "booked") return "bg-red-500 text-white";
//     if (b.status === "in_talks") return "bg-orange-500 text-white";
//     return "bg-green-500 text-white";
//   };

//   // Calendar days grid
//   const days = eachDayOfInterval({
//     start: startOfWeek(startOfMonth(currentDate)),
//     end: endOfWeek(endOfMonth(currentDate)),
//   });

//   const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

//   // Open modal
//   const openModal = (day) => {
//     const key = format(day, "yyyy-MM-dd");
//     const existing = bookings[key];
//     setSelectedDate(day);
//     setDraftStatus(existing?.status || null);
//     setDraftNote(existing?.note || "");
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedDate(null);
//     setDraftStatus(null);
//     setDraftNote("");
//   };

//   // ✅ SAVE — data stays forever until user removes
//   const handleSave = () => {
//     if (!selectedDate) return;
//     const key = format(selectedDate, "yyyy-MM-dd");
//     setBookings((prev) => ({
//       ...prev,
//       [key]: {
//         status: draftStatus || "available",
//         note: draftNote.trim(),
//         savedAt: new Date().toISOString(),
//       },
//     }));
//     closeModal();
//   };

//   // ✅ REMOVE — only here data gets deleted
//   const handleRemove = () => {
//     if (!selectedDate) return;
//     const key = format(selectedDate, "yyyy-MM-dd");
//     setBookings((prev) => {
//       const copy = { ...prev };
//       delete copy[key];
//       return copy;
//     });
//     closeModal();
//   };

//   const selectedKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
//   const hasExisting = selectedKey && bookings[selectedKey];

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-start justify-center p-2 sm:p-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-3 sm:p-4">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-3">
//           <button
//             onClick={() => setCurrentDate(subMonths(currentDate, 1))}
//             className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white text-lg active:scale-95"
//           >
//             ‹
//           </button>
//           <h2 className="text-base sm:text-lg font-bold text-gray-800">
//             {format(currentDate, "MMMM yyyy")}
//           </h2>
//           <button
//             onClick={() => setCurrentDate(addMonths(currentDate, 1))}
//             className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white text-lg active:scale-95"
//           >
//             ›
//           </button>
//         </div>

//         {/* Legend */}
//         <div className="flex items-center justify-center gap-3 mb-2 text-[10px] text-gray-600">
//           <span className="flex items-center gap-1">
//             <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Booked
//           </span>
//           <span className="flex items-center gap-1">
//             <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Talks
//           </span>
//           <span className="flex items-center gap-1">
//             <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Free
//           </span>
//         </div>

//         {/* Week header */}
//         <div className="grid grid-cols-7 gap-1 mb-1">
//           {weekDays.map((d, i) => (
//             <div
//               key={i}
//               className="text-center text-[10px] font-bold text-gray-400"
//             >
//               {d}
//             </div>
//           ))}
//         </div>

//         {/* Days */}
//         <div className="grid grid-cols-7 gap-1">
//           {days.map((day, i) => {
//             const key = format(day, "yyyy-MM-dd");
//             const inMonth = day.getMonth() === currentDate.getMonth();
//             const today = isToday(day);
//             const booking = bookings[key];

//             return (
//               <button
//                 key={i}
//                 onClick={() => openModal(day)}
//                 className={`
//                   relative aspect-square rounded-md flex flex-col items-center justify-center
//                   transition-all active:scale-95
//                   ${inMonth ? getColorClass(key) : "bg-gray-50 text-gray-300"}
//                   ${today ? "ring-2 ring-blue-600 ring-offset-1" : ""}
//                   overflow-hidden
//                 `}
//               >
//                 <span className="text-[11px] sm:text-sm font-semibold leading-none">
//                   {format(day, "d")}
//                 </span>

//                 {/* ✅ Saved note preview on cell */}
//                 {booking?.note && (
//                   <span className="text-[7px] sm:text-[8px] leading-tight px-0.5 mt-0.5 w-full truncate text-center opacity-90">
//                     {booking.note}
//                   </span>
//                 )}

//                 {/* dot indicator for saved status */}
//                 {booking && !booking.note && (
//                   <span className="absolute bottom-0.5 w-1 h-1 bg-white rounded-full opacity-80" />
//                 )}

//               </button>
//             );
//           })}
//         </div>

//         {/* Total count */}
//         <p className="text-center text-[11px] text-gray-400 mt-3">
//           {Object.keys(bookings).length} saved entr
//           {Object.keys(bookings).length === 1 ? "y" : "ies"}
//         </p>
//       </div>

//       {/* ✅ MODAL */}
//       {showModal && selectedDate && (
//         <div
//           className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
//           onClick={closeModal}
//         >
//           <div
//             className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-4 max-h-[90vh] overflow-y-auto animate-slideUp"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="text-sm font-bold text-gray-800">
//                 {format(selectedDate, "EEE, dd MMM yyyy")}
//               </h3>
//               <button
//                 onClick={closeModal}
//                 className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-lg"
//               >
//                 ×
//               </button>
//             </div>

//             {/* Status buttons */}
//             <p className="text-[11px] font-semibold text-gray-500 mb-1">
//               STATUS
//             </p>
//             <div className="grid grid-cols-3 gap-2 mb-3">
//               <button
//                 onClick={() => setDraftStatus("booked")}
//                 className={`py-2 rounded-lg text-[11px] font-bold transition-all ${
//                   draftStatus === "booked"
//                     ? "bg-red-500 text-white ring-2 ring-red-300"
//                     : "bg-red-50 text-red-600"
//                 }`}
//               >
//                 🔴 Booked
//               </button>
//               <button
//                 onClick={() => setDraftStatus("in_talks")}
//                 className={`py-2 rounded-lg text-[11px] font-bold transition-all ${
//                   draftStatus === "in_talks"
//                     ? "bg-orange-500 text-white ring-2 ring-orange-300"
//                     : "bg-orange-50 text-orange-600"
//                 }`}
//               >
//                 🟠 Talks
//               </button>
//               <button
//                 onClick={() => setDraftStatus("available")}
//                 className={`py-2 rounded-lg text-[11px] font-bold transition-all ${
//                   draftStatus === "available"
//                     ? "bg-green-500 text-white ring-2 ring-green-300"
//                     : "bg-green-50 text-green-600"
//                 }`}
//               >
//                 🟢 Free
//               </button>
//             </div>

//             {/* Note input */}
//             <p className="text-[11px] font-semibold text-gray-500 mb-1">NOTE</p>
//             <textarea
//               value={draftNote}
//               onChange={(e) => setDraftNote(e.target.value)}
//               placeholder="Write note..."
//               rows={3}
//               className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none mb-3"
//             />

//             {/* Action buttons */}
//             <div className="flex gap-2">
//               <button
//                 onClick={handleSave}
//                 className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg active:scale-95"
//               >
//                 💾 Save
//               </button>
//               {hasExisting && (
//                 <button
//                   onClick={handleRemove}
//                   className="py-2.5 px-4 bg-red-100 text-red-600 text-sm font-bold rounded-lg active:scale-95"
//                 >
//                   🗑 Remove
//                 </button>
//               )}
//             </div>

//             <p className="text-[10px] text-gray-400 text-center mt-2">
//               Data saved permanently. Remove only when you click Remove.
//             </p>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes slideUp {
//           from { transform: translateY(40px); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
//         }
//         .animate-slideUp { animation: slideUp 0.25s ease-out; }
//       `}</style>
//     </div>
//   );
// };

// export default Calendar;

import React, { useState, useEffect, useCallback } from "react";

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

// YOUR GOOGLE APPS SCRIPT WEB APP URL
const API_URL =
  "https://script.google.com/macros/s/AKfycbyYeyXtkg0BxNVpYek7XkLyqe6IcPybRcj7lxhE-0UpZ8ahyyagZtpYTSV6vfxVAreU/exec";

// GOOGLE APPS SCRIPT JSONP CONNECTION
function callCalendarAPI(params) {
  return new Promise((resolve, reject) => {
    const callback =
      "__calendarCallback_" +
      Date.now() +
      "_" +
      Math.random().toString(36).slice(2);

    const script = document.createElement("script");

    let timeout;

    const cleanup = () => {
      delete window[callback];
      script.remove();
      clearTimeout(timeout);
    };

    window[callback] = (data) => {
      cleanup();

      if (data && data.success !== false) {
        resolve(data);
      } else {
        reject(new Error(data?.error || "Google Sheets API error"));
      }
    };

    const query = new URLSearchParams({
      ...params,
      callback,
    });

    script.src = `${API_URL}?${query.toString()}`;

    script.onerror = () => {
      cleanup();
      reject(new Error("Google Sheets connection failed."));
    };

    timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Request timed out. Please try again."));
    }, 20000);

    document.body.appendChild(script);
  });
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // Shared bookings from Google Sheets
  const [bookings, setBookings] = useState({});

  // Modal draft
  const [draftStatus, setDraftStatus] = useState("available");
  const [draftNote, setDraftNote] = useState("");

  // Loading and connection status
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connectionError, setConnectionError] = useState("");

  // Load all shared bookings
  const refreshBookings = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);

    try {
      const data = await callCalendarAPI({
        action: "list",
      });

      setBookings(data.bookings || {});
      setConnectionError("");
    } catch (error) {
      console.error("Calendar loading error:", error);
      setConnectionError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial loading and automatic sync
  useEffect(() => {
    refreshBookings(true);

    const interval = setInterval(() => {
      refreshBookings(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [refreshBookings]);

  // Calendar days
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  });

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  // Status colors
  const getColorClass = (dateKey) => {
    const booking = bookings[dateKey];

    if (!booking || booking.status === "available") {
      return "bg-green-500 text-white";
    }

    if (booking.status === "booked") {
      return "bg-red-500 text-white";
    }

    if (booking.status === "in_talks") {
      return "bg-orange-500 text-white";
    }

    return "bg-green-500 text-white";
  };

  // Open modal
  const openModal = (day) => {
    if (saving) return;

    const key = format(day, "yyyy-MM-dd");
    const existing = bookings[key];

    setSelectedDate(day);

    setDraftStatus(existing?.status || "available");
    setDraftNote(existing?.note || "");

    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setSelectedDate(null);
    setDraftStatus("available");
    setDraftNote("");
  };

  // Save to Google Sheets
  const handleSave = async () => {
    if (!selectedDate || saving) return;

    const key = format(selectedDate, "yyyy-MM-dd");

    setSaving(true);

    try {
      await callCalendarAPI({
        action: "save",
        date: key,
        status: draftStatus || "available",
        note: draftNote.trim(),
      });

      // Update from server after successful save
      await refreshBookings(false);

      setShowModal(false);
      setSelectedDate(null);
      setDraftStatus("available");
      setDraftNote("");
    } catch (error) {
      console.error("Save error:", error);
      alert("Save failed: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Remove from Google Sheets
  const handleRemove = async () => {
    if (!selectedDate || saving) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove this booking?"
    );

    if (!confirmed) return;

    const key = format(selectedDate, "yyyy-MM-dd");

    setSaving(true);

    try {
      await callCalendarAPI({
        action: "remove",
        date: key,
      });

      await refreshBookings(false);

      setShowModal(false);
      setSelectedDate(null);
      setDraftStatus("available");
      setDraftNote("");
    } catch (error) {
      console.error("Remove error:", error);
      alert("Remove failed: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const selectedKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

  const hasExisting = selectedKey ? Boolean(bookings[selectedKey]) : false;

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-2 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-3 sm:p-4">
        {/* HEADER */}

        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setCurrentDate((prev) => subMonths(prev, 1))}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white text-lg active:scale-95"
          >
            ‹
          </button>

          <h2 className="text-base sm:text-lg font-bold text-gray-800">
            {format(currentDate, "MMMM yyyy")}
          </h2>

          <button
            onClick={() => setCurrentDate((prev) => addMonths(prev, 1))}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white text-lg active:scale-95"
          >
            ›
          </button>
        </div>

        {/* LEGEND */}

        <div className="flex items-center justify-center gap-3 mb-2 text-[10px] text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            Booked
          </span>

          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            Talks
          </span>

          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            Free
          </span>
        </div>

        {/* CONNECTION STATUS */}

        {loading && (
          <p className="text-center text-xs text-blue-500 mb-2">
            Loading shared calendar...
          </p>
        )}

        {!loading && connectionError && (
          <div className="text-center text-xs text-red-500 mb-2">
            Connection error: {connectionError}
            <button
              onClick={() => refreshBookings(true)}
              className="ml-2 underline font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !connectionError && (
          <p className="text-center text-[10px] text-green-600 mb-2">
            ✓ Connected to shared calendar
          </p>
        )}

        {/* WEEK HEADER */}

        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="text-center text-[10px] font-bold text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* CALENDAR DAYS */}

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const key = format(day, "yyyy-MM-dd");

            const inMonth = day.getMonth() === currentDate.getMonth();

            const today = isToday(day);

            const booking = bookings[key];

            return (
              <button
                key={key}
                onClick={() => openModal(day)}
                className={`
                  relative aspect-square rounded-md
                  flex flex-col items-center justify-center
                  transition-all active:scale-95
                  ${inMonth ? getColorClass(key) : "bg-gray-50 text-gray-300"}
                  ${today ? "ring-2 ring-blue-600 ring-offset-1" : ""}
                  overflow-hidden
                `}
              >
                <span className="text-[11px] sm:text-sm font-semibold leading-none">
                  {format(day, "d")}
                </span>

                {/* SAVED NOTE PREVIEW */}

                {booking?.note && (
                  <span className="text-[7px] sm:text-[8px] leading-tight px-0.5 mt-0.5 w-full truncate text-center opacity-90">
                    {booking.note}
                  </span>
                )}

                {/* SAVED STATUS DOT */}

                {booking && !booking.note && (
                  <span className="absolute bottom-0.5 w-1 h-1 bg-white rounded-full opacity-80" />
                )}
              </button>
            );
          })}
        </div>

        {/* TOTAL COUNT */}

        <p className="text-center text-[11px] text-gray-400 mt-3">
          {Object.keys(bookings).length} saved entr
          {Object.keys(bookings).length === 1 ? "y" : "ies"}
        </p>

        {/* MANUAL REFRESH */}

        <button
          onClick={() => refreshBookings(true)}
          disabled={loading || saving}
          className="w-full mt-2 text-[11px] text-blue-600 font-semibold py-2 disabled:opacity-50"
        >
          ↻ Refresh Shared Calendar
        </button>
      </div>

      {/* MODAL */}

      {showModal && selectedDate && (
        <div
          className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-4 max-h-[90vh] overflow-y-auto animate-slideUp"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800">
                {format(selectedDate, "EEE, dd MMM yyyy")}
              </h3>

              <button
                onClick={closeModal}
                disabled={saving}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-lg"
              >
                ×
              </button>
            </div>

            {/* STATUS */}

            <p className="text-[11px] font-semibold text-gray-500 mb-1">
              STATUS
            </p>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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

            {/* NOTE */}

            <p className="text-[11px] font-semibold text-gray-500 mb-1">NOTE</p>

            <textarea
              value={draftNote}
              onChange={(event) => setDraftNote(event.target.value)}
              placeholder="Write note..."
              rows={3}
              maxLength={5000}
              disabled={saving}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none mb-3"
            />

            {/* ACTION BUTTONS */}

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg active:scale-95 disabled:opacity-50"
              >
                {saving ? "Saving..." : "💾 Save"}
              </button>

              {hasExisting && (
                <button
                  onClick={handleRemove}
                  disabled={saving}
                  className="py-2.5 px-4 bg-red-100 text-red-600 text-sm font-bold rounded-lg active:scale-95 disabled:opacity-50"
                >
                  🗑 Remove
                </button>
              )}
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-2">
              Data is saved in Google Sheets and shared with all users.
            </p>
          </div>
        </div>
      )}

      {/* ANIMATION */}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Calendar;
