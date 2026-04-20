"use client";
import React, { useState, useEffect, useMemo } from "react";

const DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];
const HOURS = Array.from({ length: 21 }, (_, i) => i + 6);
const KEYWORDS = [
  "gomme",
  "taf",
  "fils",
  "vaisselle",
  "linge",
  "nettoyage",
  "repas",
  "rangement",
  "courses",
  "sortie",
  "repos",
  "docteur",
];

interface Slot {
  id?: number;
  day: string;
  startTime: number;
  user: string;
  activity: string;
  weekId: string;
}

export default function CalendarPage() {
  // --- ÉTATS ---
  const [currentUser, setCurrentUser] = useState<"Lui" | "Elle">("Lui");
  const [selectedKeyword, setSelectedKeyword] = useState(KEYWORDS[0]);
  const [appointments, setAppointments] = useState<
    Record<string, Record<string, string>>
  >({});
  const [isMouseDown, setIsMouseDown] = useState(false);

  const [currentMonday, setCurrentMonday] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  });

  // --- LOGIQUE DE DATE ---

  const weekId = useMemo(() => {
    const d = new Date(currentMonday);
    const oneJan = new Date(d.getFullYear(), 0, 1);
    const numberOfDays = Math.floor(
      (d.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000),
    );
    const weekNumber = Math.ceil((d.getDay() + 1 + numberOfDays) / 7);
    return `${d.getFullYear()}-W${weekNumber}`;
  }, [currentMonday]);

  const weekTitle = useMemo(() => {
    const month = currentMonday.toLocaleString("fr-FR", { month: "long" });
    const weekNum = weekId.split("-W")[1];
    return `${month} semaine ${weekNum}`;
  }, [currentMonday, weekId]);

  const changeWeek = (offset: number) => {
    const newDate = new Date(currentMonday);
    newDate.setDate(newDate.getDate() + offset * 7);
    setCurrentMonday(newDate);
  };

  // --- EFFETS ---

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsMouseDown(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/slots?weekId=${weekId}`,
        );
        const data: Slot[] = await response.json();
        const formatted: Record<string, Record<string, string>> = {};
        data.forEach((slot: Slot) => {
          const key = `${slot.day}-${slot.startTime}`;
          if (!formatted[key]) formatted[key] = {};
          formatted[key][slot.user] = slot.activity;
        });
        setAppointments(formatted);
      } catch (error) {
        console.error("Erreur chargement :", error);
        setAppointments({});
      }
    };
    fetchSlots();
  }, [weekId]);

  // --- ACTIONS ---

  const saveToBackend = async (
    day: string,
    hour: number,
    user: string,
    activity: string,
  ) => {
    try {
      await fetch("http://localhost:3001/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day, startTime: hour, user, activity, weekId }),
      });
    } catch (error) {
      console.error("Erreur sauvegarde :", error);
    }
  };

  const updateCell = (day: string, hour: number) => {
    const cellKey = `${day}-${hour}`;
    const isEraser = selectedKeyword === "gomme";

    setAppointments((prev) => {
      const currentCell = { ...(prev[cellKey] || {}) };
      let currentActivity = currentCell[currentUser] || "";

      if (isEraser) {
        if (!currentCell[currentUser]) return prev;
        delete currentCell[currentUser];
      } else {
        // Logique Multi-activités
        if (currentActivity === "") {
          currentActivity = selectedKeyword;
        } else {
          const activities = currentActivity.split("/");
          if (activities.includes(selectedKeyword)) return prev; // Évite les doublons
          currentActivity = `${currentActivity}/${selectedKeyword}`;
        }
        currentCell[currentUser] = currentActivity;
      }

      saveToBackend(
        day,
        hour,
        currentUser,
        isEraser ? "" : currentCell[currentUser],
      );
      return { ...prev, [cellKey]: currentCell };
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight">
          FamilyPlan
        </h1>
        <div className="flex items-center justify-center gap-6 mt-4">
          <button
            onClick={() => changeWeek(-1)}
            className="p-2 hover:bg-gray-200 rounded-full text-4xl"
          >
            ⬅️
          </button>
          <h2 className="text-2xl font-semibold text-blue-600 capitalize bg-white px-6 py-2 rounded-md shadow-sm border border-blue-100">
            {weekTitle}
          </h2>
          <button
            onClick={() => changeWeek(1)}
            className="p-2 hover:bg-gray-200 rounded-full text-4xl"
          >
            ➡️
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-4 flex gap-2">
        <button
          onClick={() => setCurrentUser("Lui")}
          className={`px-6 py-2 rounded-lg font-bold transition-all shadow-md ${currentUser === "Lui" ? "bg-blue-600 text-white scale-105" : "bg-white text-gray-400 border"}`}
        >
          Moi (Bleu)
        </button>
        <button
          onClick={() => setCurrentUser("Elle")}
          className={`px-6 py-2 rounded-lg font-bold transition-all shadow-md ${currentUser === "Elle" ? "bg-red-600 text-white scale-105" : "bg-white text-gray-400 border"}`}
        >
          Ma femme (Rouge)
        </button>
      </div>

      <div className="max-w-7xl mx-auto mb-6 bg-white p-4 rounded-xl shadow-sm flex flex-wrap gap-2 items-center">
        {KEYWORDS.map((kw) => (
          <button
            key={kw}
            onClick={() => setSelectedKeyword(kw)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              selectedKeyword === kw
                ? kw === "gomme"
                  ? "bg-red-100 text-red-600 border-red-300"
                  : "bg-gray-900 text-white border-transparent"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {kw === "gomme" ? "🧼 " + kw : kw}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto overflow-x-auto shadow-2xl rounded-xl border border-gray-200 select-none bg-white">
        <div className="grid grid-cols-[80px_repeat(7,1fr)] min-w-[900px]">
          <div className="bg-gray-50 p-3 border-r border-b border-gray-200"></div>
          {DAYS.map((day) => (
            <div
              key={day}
              className="bg-gray-50 p-3 text-center font-bold border-r border-b border-gray-200 text-gray-600 uppercase text-xs tracking-widest"
            >
              {day}
            </div>
          ))}

          {HOURS.map((hour) => (
            <React.Fragment key={hour}>
              <div className="bg-gray-50 p-2 text-right text-xs font-bold border-r border-b border-gray-200 text-gray-400 flex items-center justify-end">
                {hour}h00
              </div>

              {DAYS.map((day) => {
                const cellData = appointments[`${day}-${hour}`];
                const hasLui = cellData?.Lui;
                const hasElle = cellData?.Elle;

                return (
                  <div
                    key={`${day}-${hour}`}
                    className="h-14 border-r border-b border-gray-100 relative cursor-pointer hover:bg-blue-50/30 transition-colors flex overflow-hidden"
                    onMouseDown={() => {
                      setIsMouseDown(true);
                      updateCell(day, hour);
                    }}
                    onMouseEnter={() => {
                      if (isMouseDown) updateCell(day, hour);
                    }}
                  >
                    {hasLui && (
                      <div
                        className={`h-full flex items-center justify-center text-[9px] leading-none font-bold text-white p-0.5 shadow-inner transition-all ${hasElle ? "w-1/2 bg-blue-600" : "w-full bg-blue-600"}`}
                      >
                        <span className="break-all text-center">
                          {cellData.Lui}
                        </span>
                      </div>
                    )}
                    {hasElle && (
                      <div
                        className={`h-full flex items-center justify-center text-[9px] leading-none font-bold text-white p-0.5 shadow-inner transition-all ${hasLui ? "w-1/2 bg-red-600 border-l border-white/30" : "w-full bg-red-600"}`}
                      >
                        <span className="break-all text-center">
                          {cellData.Elle}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </main>
  );
}
