import { useState } from "react";
import { itineraryDays, typeColors } from "../data/mockData";

export default function Itinerary() {
    const [activeDay, setActiveDay] = useState(0);
    const [dragIdx, setDragIdx] = useState(null);
    const [items, setItems] = useState(itineraryDays[0].activities);

    const handleDayChange = (i) => { setActiveDay(i); setItems(itineraryDays[i].activities); };
    const handleDragStart = (i) => setDragIdx(i);
    const handleDragOver = (e, i) => {
        e.preventDefault();
        if (dragIdx === null || dragIdx === i) return;
        const next = [...items]; const [moved] = next.splice(dragIdx, 1); next.splice(i, 0, moved);
        setItems(next); setDragIdx(i);
    };

    return (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Trip Itinerary</h2>
                    <p className="text-sm text-gray-400">Drag to reorder · {itineraryDays[activeDay].city}</p>
                </div>
                <button className="bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors shadow-md shadow-blue-200">🔗 Share Trip</button>
            </div>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {itineraryDays.map((d, i) => (
                    <button key={i} onClick={() => handleDayChange(i)} className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${activeDay === i ? "bg-blue-500 text-white shadow-md shadow-blue-200" : "bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600"}`}>Day {d.day} — {d.city}</button>
                ))}
                <button className="flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all">+ Add Day</button>
            </div>
            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden mb-6 h-36 sm:h-44 relative bg-gradient-to-br from-blue-100 to-sky-200 flex items-center justify-center">
                <div className="text-center z-10">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-blue-700 font-bold text-sm">{itineraryDays[activeDay].city} Map View</p>
                    <p className="text-blue-500 text-xs mt-1">Connect Mapbox API to enable interactive maps</p>
                </div>
                {items.map((_, i) => (
                    <div key={i} className="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold" style={{ left: `${15 + i * 20}%`, top: `${25 + (i % 2) * 35}%` }}>{i + 1}</div>
                ))}
            </div>
            <div className="flex flex-col gap-3">
                {items.map((act, i) => (
                    <div key={`${act.name}-${i}`} draggable onDragStart={() => handleDragStart(i)} onDragOver={e => handleDragOver(e, i)} onDrop={() => setDragIdx(null)}
                        className={`flex items-center gap-4 bg-white rounded-2xl border p-4 cursor-grab active:cursor-grabbing transition-all duration-200 select-none ${dragIdx === i ? "border-blue-300 shadow-lg shadow-blue-100 scale-[1.02]" : "border-gray-100 hover:border-blue-200 hover:shadow-md hover:shadow-blue-50"}`}>
                        <div className="text-gray-300 text-lg flex-shrink-0">⠿</div>
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl flex-shrink-0">{act.icon}</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800">{act.name}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeColors[act.type] || "bg-gray-100 text-gray-600"}`}>{act.type}</span>
                                <span className="text-[10px] text-gray-400">⏱ {act.duration}</span>
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-blue-600">{act.time}</p>
                            <p className="text-[10px] text-gray-400">Start</p>
                        </div>
                    </div>
                ))}
                <button className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl p-4 text-gray-400 text-sm hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all">+ Add Activity</button>
            </div>
        </div>
    );
}
