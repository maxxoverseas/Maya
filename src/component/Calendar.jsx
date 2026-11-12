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

import React, { useState, useEffect, useCallback, useRef } from "react";
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

// 👇 Apps Script "Web app" ka URL yahan paste karein (SETUP.md dekhein)
const API_URL =
  "https://script.google.com/macros/s/AKfycby1EmrLVCL7wHXvI727y2nGtnT4Xq0OAacWrQgV6YNLF04vjgwSL7xgSE_fPUHg80d0/exec";

const CACHE_KEY = "my-calendar-cache-v2"; // sirf fast first-load ke liye, source of truth = Google Sheet
const POLL_MS = 20000; // har 20 sec me dusre users ka data refresh

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(CACHE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const busyRef = useRef(false); // save ke dauran poll ko rok do

  const [draftStatus, setDraftStatus] = useState(null);
  const [draftNote, setDraftNote] = useState("");

  // ---------- Google Sheet se load ----------
  const loadFromSheet = useCallback(async () => {
    if (busyRef.current) return;
    try {
      const res = await fetch(API_URL, { method: "GET" });
      const data = await res.json();
      setBookings(data);
      setError("");
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch {}
    } catch (e) {
      setError("Server se data nahi aa raha. Internet / URL check karein.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFromSheet();
    const id = setInterval(loadFromSheet, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") loadFromSheet();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [loadFromSheet]);

  // ---------- Google Sheet me write ----------
  const postToSheet = async (payload) => {
    // text/plain => CORS preflight nahi hota, Apps Script ke saath yehi sahi hai
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    const out = await res.json();
    if (!out.ok) throw new Error(out.error || "save failed");
  };

  const getColorClass = (dateKey) => {
    const b = bookings[dateKey];
    if (!b || b.status === "available") return "bg-green-500 text-white";
    if (b.status === "booked") return "bg-red-500 text-white";
    if (b.status === "in_talks") return "bg-orange-500 text-white";
    return "bg-green-500 text-white";
  };

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  });

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

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

  const handleSave = async () => {
    if (!selectedDate) return;
    const key = format(selectedDate, "yyyy-MM-dd");
    const entry = {
      status: draftStatus || "available",
      note: draftNote.trim(),
      savedAt: new Date().toISOString(),
    };
    const previous = bookings;

    busyRef.current = true;
    setSaving(true);
    setBookings((prev) => ({ ...prev, [key]: entry })); // turant UI update
    closeModal();
    try {
      await postToSheet({ action: "save", date: key, ...entry });
      setError("");
    } catch (e) {
      setBookings(previous);
      setError("Save nahi hua. Dobara try karein.");
    } finally {
      busyRef.current = false;
      setSaving(false);
      loadFromSheet();
    }
  };

  const handleRemove = async () => {
    if (!selectedDate) return;
    const key = format(selectedDate, "yyyy-MM-dd");
    const previous = bookings;

    busyRef.current = true;
    setSaving(true);
    setBookings((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    closeModal();
    try {
      await postToSheet({ action: "remove", date: key });
      setError("");
    } catch (e) {
      setBookings(previous);
      setError("Remove nahi hua. Dobara try karein.");
    } finally {
      busyRef.current = false;
      setSaving(false);
      loadFromSheet();
    }
  };

  const selectedKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const hasExisting = selectedKey && bookings[selectedKey];
  const count = Object.keys(bookings).length;

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

        {/* Status bar */}
        <div className="h-5 mb-1 text-center text-[11px]">
          {loading && <span className="text-gray-400">Loading data...</span>}
          {!loading && saving && (
            <span className="text-blue-500">Saving to Google Sheet...</span>
          )}
          {!loading && !saving && error && (
            <button
              onClick={loadFromSheet}
              className="text-red-500 underline"
              title="Retry"
            >
              {error} (Retry)
            </button>
          )}
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

                {booking?.note && (
                  <span className="text-[7px] sm:text-[8px] leading-tight px-0.5 mt-0.5 w-full truncate text-center opacity-90">
                    {booking.note}
                  </span>
                )}

                {booking && !booking.note && (
                  <span className="absolute bottom-0.5 w-1 h-1 bg-white rounded-full opacity-80" />
                )}
              </button>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-3">
          {count} saved entr{count === 1 ? "y" : "ies"}
        </p>
      </div>

      {/* MODAL */}
      {showModal && selectedDate && (
        <div
          className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-4 max-h-[90vh] overflow-y-auto animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
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

            <p className="text-[11px] font-semibold text-gray-500 mb-1">NOTE</p>
            <textarea
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder="Write note..."
              rows={3}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none mb-3"
            />

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
              Data Google Sheet me save hota hai, sab devices par dikhega.
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
