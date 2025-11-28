"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { nb } from "date-fns/locale";
import { getAllAvailability, addAvailableDate, removeAvailableDate, Availability } from "@/lib/availability";
import { Check } from "lucide-react";

export default function AvailabilityAdmin() {
  const [availableDates, setAvailableDates] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // --- START: memoize calendar helpers (initialize before effects) ---
  const { calendarDays } = useMemo(() => {
    const ms = startOfMonth(currentMonth);
    const me = endOfMonth(currentMonth);
    const dims = eachDayOfInterval({ start: ms, end: me });
    const fdo = getDay(ms);
    const cds = [...Array(fdo).fill(null), ...dims];
    return { calendarDays: cds };
  }, [currentMonth]);
  // --- END memoized block ---

  // --- START: Drag selection state/handlers ---
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);

  // Modal state to replace window.prompt flows
  const [modalState, setModalState] = useState<{
    mode: "single" | "bulk";
    dates: Date[];
    existing?: Availability | null;
  } | null>(null);

  const [modalForm, setModalForm] = useState({
    startTime: "",
    endTime: "",
    location: "",
    remove: false,
  });

  const openModalForSingle = (date: Date, existing?: Availability | null) => {
    setModalState({ mode: "single", dates: [date], existing: existing || null });
    setModalForm({
      startTime: existing?.startTime ?? "",
      endTime: existing?.endTime ?? "",
      location: existing?.location ?? "",
      remove: false,
    });
  };

  const openModalForBulk = (dates: Date[]) => {
    setModalState({ mode: "bulk", dates });
    setModalForm({ startTime: "", endTime: "", location: "", remove: false });
  };

  const closeModal = () => {
    setModalState(null);
    setModalForm({ startTime: "", endTime: "", location: "", remove: false });
  };

  const confirmModal = async () => {
    if (!modalState) return closeModal();
    const dates = modalState.dates;
    try {
      if (modalForm.remove) {
        await Promise.all(dates.map((d) => removeAvailableDate(format(d, "yyyy-MM-dd"))));
        setAvailableDates((prev) =>
          prev.filter((a) => !dates.some((d) => a.date === format(d, "yyyy-MM-dd")))
        );
      } else {
        const payloads: Availability[] = dates.map((d) => {
          const ds = format(d, "yyyy-MM-dd");
          return {
            date: ds,
            startTime: modalForm.startTime || undefined,
            endTime: modalForm.endTime || undefined,
            location: modalForm.location || undefined,
          };
        });
        await Promise.all(payloads.map((p) => addAvailableDate(p)));
        setAvailableDates((prev) => {
          const map: Record<string, Availability> = {};
          prev.forEach((a) => (map[a.date] = a));
          payloads.forEach((p) => (map[p.date] = p));
          return Object.values(map);
        });
      }
    } catch (err) {
      console.error("Modal availability update failed:", err);
    } finally {
      closeModal();
    }
  };

  // Utility: normalize start/end to an inclusive range [min, max]
  const selectionRange = useCallback(() => {
    if (selectionStart === null || selectionEnd === null) return null;
    const a = Math.min(selectionStart, selectionEnd);
    const b = Math.max(selectionStart, selectionEnd);
    return { start: a, end: b };
  }, [selectionStart, selectionEnd]);

  // helper to check whether index is in current selection
  const isIndexSelected = (idx: number) => {
    const r = selectionRange();
    if (!r) return false;
    return idx >= r.start && idx <= r.end;
  };

  // finalize selection: open modal for bulk operations
  const finalizeSelection = useCallback(() => {
    const r = selectionRange();
    if (!r) {
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }

    const selectedDates: Date[] = [];
    for (let i = r.start; i <= r.end; i++) {
      const d = calendarDays[i];
      if (d) selectedDates.push(d as Date);
    }

    if (selectedDates.length === 0) {
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }

    openModalForBulk(selectedDates);
    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  }, [calendarDays, selectionRange]);
  // global mouseup to ensure finalize when releasing outside cells
  useEffect(() => {
    const onMouseUp = () => {
      if (isSelecting) void finalizeSelection();
    };
    window.addEventListener("mouseup", onMouseUp);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, [isSelecting, finalizeSelection]);
  // --- END: Drag selection state/handlers ---

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const dates = await getAllAvailability();
        setAvailableDates(dates);
      } catch (error) {
        console.error("Failed to load availability:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, []);

  const findAvailability = (dateStr: string) => availableDates.find((a) => a.date === dateStr);

  const toggleAvailability = async (date: Date) => {
    const existing = findAvailability(format(date, "yyyy-MM-dd"));
    openModalForSingle(date, existing ?? null);
  };

  const getAvailability = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return findAvailability(dateStr);
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="text-white min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Administrer Tilgjengelighet</h1>

      <div className="bg-neutral-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy", { locale: nb })}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="px-3 py-1 text-sm bg-neutral-800 hover:bg-neutral-700 rounded transition"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="px-3 py-1 text-sm bg-neutral-800 hover:bg-neutral-700 rounded transition"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, idx) => (
            <button
              key={idx}
              // start drag on mousedown
              onMouseDown={() => {
                if (date === null) return;
                setIsSelecting(true);
                setSelectionStart(idx);
                setSelectionEnd(idx);
              }}
              // extend selection on mouse enter while dragging
              onMouseEnter={() => {
                if (!isSelecting || date === null) return;
                setSelectionEnd(idx);
              }}
              // single-click fallback (mouseup on same cell) will trigger global finalizeSelection
              onClick={() => {
                // avoid triggering single-click while dragging
                if (isSelecting) return;
                if (date) toggleAvailability(date as Date);
              }}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-semibold transition relative p-2 select-none ${
                date === null
                  ? "bg-transparent cursor-default"
                  : getAvailability(date as Date)
                  ? "bg-yellow-500 text-black hover:bg-yellow-400 cursor-pointer"
                  : "bg-neutral-800 text-gray-400 hover:bg-neutral-700 cursor-pointer"
              } ${isIndexSelected(idx) && date !== null ? "ring-2 ring-yellow-400 scale-[1.02]" : ""}`}
            >
              {date && <div className="w-full text-center">{format(date as Date, "d")}</div>}
              {/* small info line */}
              {date && getAvailability(date as Date) && (
                <div className="mt-1 text-xs text-black/80 text-center">
                  {getAvailability(date as Date)?.startTime
                    ? `${getAvailability(date as Date)?.startTime}${getAvailability(date as Date)?.endTime ? `–${getAvailability(date as Date)?.endTime}` : ""}`
                    : "Hele dagen"}
                  {getAvailability(date as Date)?.location ? ` · ${getAvailability(date as Date)?.location}` : ""}
                </div>
              )}
              {date && getAvailability(date as Date) && (
                <Check className="absolute right-2 bottom-2 w-4 h-4" />
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Modal: unified create/edit/remove UI */}
      {modalState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-3">
              {modalState.mode === "bulk" ? `Rediger ${modalState.dates.length} dag(er)` : `Rediger ${format(modalState.dates[0], "yyyy-MM-dd")}`}
            </h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  placeholder="Start time (HH:MM)"
                  value={modalForm.startTime}
                  onChange={(e) => setModalForm((s) => ({ ...s, startTime: e.target.value }))}
                  className="w-1/2 px-2 py-1 rounded bg-neutral-700"
                />
                <input
                  placeholder="End time (HH:MM)"
                  value={modalForm.endTime}
                  onChange={(e) => setModalForm((s) => ({ ...s, endTime: e.target.value }))}
                  className="w-1/2 px-2 py-1 rounded bg-neutral-700"
                />
              </div>
              <input
                placeholder="Location (optional)"
                value={modalForm.location}
                onChange={(e) => setModalForm((s) => ({ ...s, location: e.target.value }))}
                className="w-full px-2 py-1 rounded bg-neutral-700"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={modalForm.remove}
                  onChange={(e) => setModalForm((s) => ({ ...s, remove: e.target.checked }))}
                />
                Fjern tilgjengelighet for valgte dag(er)
              </label>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={closeModal} className="px-3 py-1 rounded bg-neutral-700">Avbryt</button>
                <button
                  onClick={() => void confirmModal()}
                  className="px-3 py-1 rounded bg-yellow-500 text-black"
                >
                  Bekreft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
