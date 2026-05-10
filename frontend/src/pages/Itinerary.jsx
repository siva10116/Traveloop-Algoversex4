import { useState, useEffect } from "react";
import { typeColors } from "../data/mockData";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default marker icons in React/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

// --- MOCK DATA FOR APIs ---

export default function Itinerary({ days, setDays }) {
    const [viewMode, setViewMode] = useState("builder"); // 'builder' or 'timeline'
    const [activeDay, setActiveDay] = useState(0);
    const [dragIdx, setDragIdx] = useState(null);
    const [isMapExpanded, setIsMapExpanded] = useState(false);
    
    // Modals
    const [showCitySearch, setShowCitySearch] = useState(false);
    const [showActivitySearch, setShowActivitySearch] = useState(false);
    const [cityQuery, setCityQuery] = useState("");
    const [activityQuery, setActivityQuery] = useState("");
    const [cityResults, setCityResults] = useState([]);
    const [isSearchingCities, setIsSearchingCities] = useState(false);
    const [activityResults, setActivityResults] = useState([]);
    const [isSearchingActivities, setIsSearchingActivities] = useState(false);

    useEffect(() => {
        if (cityQuery.trim().length < 2) {
            setCityResults([]);
            return;
        }
        
        const timeoutId = setTimeout(async () => {
            setIsSearchingCities(true);
            try {
                // Using Open-Meteo Geocoding API (Fast, Free, No API Key, No strict CORS)
                const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityQuery)}&count=5&language=en&format=json`);
                const data = await res.json();
                
                if (data.results) {
                    const results = data.results.map(city => ({
                        id: city.id,
                        name: city.name,
                        country: city.admin1 ? `${city.admin1}, ${city.country}` : city.country,
                        popularity: city.population ? (city.population / 1000000).toFixed(1) + "M" : "N/A",
                        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=200&q=80" // mock image
                    }));
                    setCityResults(results);
                } else {
                    setCityResults([]);
                }
            } catch (err) {
                console.error("City Search Error", err);
            } finally {
                setIsSearchingCities(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [cityQuery]);

    useEffect(() => {
        if (activityQuery.trim().length < 2) {
            setActivityResults([]);
            return;
        }
        
        const timeoutId = setTimeout(async () => {
            setIsSearchingActivities(true);
            try {
                // Using Open-Meteo Geocoding API for places/activities too
                const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(activityQuery)}&count=5&language=en&format=json`);
                const data = await res.json();
                
                if (data.results) {
                    const results = data.results.map(place => ({
                        id: place.id,
                        name: place.name,
                        type: "Location",
                        cost: "Free",
                        duration: "2h",
                        icon: "📍",
                        lat: place.latitude,
                        lon: place.longitude,
                        desc: place.admin1 ? `${place.admin1}, ${place.country}` : place.country
                    }));
                    setActivityResults(results);
                } else {
                    setActivityResults([]);
                }
            } catch (err) {
                console.error("Activity Search Error", err);
            } finally {
                setIsSearchingActivities(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [activityQuery]);

    // State passed via props from App.jsx to persist
    const activeActivities = days[activeDay]?.activities || [];

    // --- Drag & Drop Handlers ---
    const handleDragStart = (i) => setDragIdx(i);
    const handleDragOver = (e, i) => {
        e.preventDefault();
        if (dragIdx === null || dragIdx === i) return;
        const newDays = [...days];
        const next = [...newDays[activeDay].activities];
        const [moved] = next.splice(dragIdx, 1);
        next.splice(i, 0, moved);
        newDays[activeDay].activities = next;
        setDays(newDays);
        setDragIdx(i);
    };

    // --- Delete Function ---
    const handleDeleteActivity = (actId) => {
        const newDays = [...days];
        newDays[activeDay].activities = newDays[activeDay].activities.filter(a => a.id !== actId);
        setDays(newDays);
    };

    // --- Add Functions ---
    const handleAddCity = (city) => {
        const newDay = {
            id: Date.now(),
            day: days.length + 1,
            city: city.name,
            activities: []
        };
        setDays([...days, newDay]);
        setShowCitySearch(false);
        setActiveDay(days.length);
    };

    const handleAddActivity = (activity) => {
        const newDays = [...days];
        newDays[activeDay].activities.push({
            id: Date.now(),
            time: "10:00", // default time
            name: activity.name,
            type: activity.type,
            duration: activity.duration,
            icon: activity.icon,
            lat: activity.lat,
            lon: activity.lon
        });
        setDays(newDays);
        setShowActivitySearch(false);
    };

    // Component to automatically adjust map bounds/center
    const ChangeView = ({ center }) => {
        const map = useMap();
        map.setView(center, map.getZoom());
        return null; 
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-50/50">
            {/* Header */}
            <div className="p-4 sm:p-6 pb-0 flex-shrink-0">
                <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            Trip Itinerary 
                            <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md shadow-indigo-200 hover:shadow-lg transition-all flex items-center gap-1 ml-2">
                                ✨ Auto-Generate (AI)
                            </button>
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Plan your perfect trip day by day.</p>
                    </div>
                    <div className="flex gap-2 bg-gray-200 p-1 rounded-xl">
                        <button 
                            onClick={() => setViewMode("builder")} 
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${viewMode === "builder" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Builder
                        </button>
                        <button 
                            onClick={() => setViewMode("timeline")} 
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${viewMode === "timeline" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Timeline View
                        </button>
                    </div>
                </div>
            </div>

            {/* BUILDER MODE */}
            {viewMode === "builder" && (
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {/* Day Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                        {days.map((d, i) => (
                            <button 
                                key={d.id} 
                                onClick={() => setActiveDay(i)} 
                                className={`flex-shrink-0 px-5 py-3 rounded-2xl text-sm font-bold transition-all border ${activeDay === i ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"}`}
                            >
                                Day {d.day} <span className="opacity-60 font-normal ml-1">— {d.city}</span>
                            </button>
                        ))}
                        <button 
                            onClick={() => setShowCitySearch(true)} 
                            className="flex-shrink-0 px-5 py-3 rounded-2xl text-sm font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all border-dashed"
                        >
                            + Add Day/City
                        </button>
                    </div>

                    {/* Interactive Map */}
                    <div className={`${isMapExpanded ? 'fixed inset-0 z-50 sm:inset-4 sm:rounded-3xl bg-white shadow-2xl border-4 border-white' : 'rounded-3xl h-48 sm:h-64 mb-6 relative border border-gray-200 shadow-sm isolate'} overflow-hidden transition-all duration-300 ease-in-out`}>
                        <button 
                            onClick={() => setIsMapExpanded(!isMapExpanded)}
                            className="absolute top-4 right-4 z-[400] w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center text-gray-700 hover:text-blue-600 hover:bg-white transition-colors border border-gray-200"
                            title={isMapExpanded ? "Minimize Map" : "Maximize Map"}
                        >
                            {isMapExpanded ? "⤡" : "⤢"}
                        </button>
                        <MapContainer 
                            center={activeActivities.length > 0 && activeActivities[0].lat ? [activeActivities[0].lat, activeActivities[0].lon] : [25.2048, 55.2708]} 
                            zoom={12} 
                            scrollWheelZoom={isMapExpanded} 
                            style={{ height: '100%', width: '100%', zIndex: 0 }}
                        >
                            <ChangeView center={activeActivities.length > 0 && activeActivities[0].lat ? [activeActivities[0].lat, activeActivities[0].lon] : [25.2048, 55.2708]} />
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {activeActivities.map(act => act.lat && act.lon ? (
                                <Marker key={act.id} position={[act.lat, act.lon]}>
                                    <Popup><strong>{act.name}</strong><br/>{act.time}</Popup>
                                </Marker>
                            ) : null)}
                        </MapContainer>
                    </div>

                    {/* Activities List */}
                    <div className="flex flex-col gap-3">
                        {activeActivities.length === 0 && (
                            <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-3xl">
                                <p className="text-gray-500 font-medium mb-4">No activities planned for this day.</p>
                            </div>
                        )}
                        {activeActivities.map((act, i) => (
                            <div 
                                key={`${act.id}-${i}`} 
                                draggable 
                                onDragStart={() => handleDragStart(i)} 
                                onDragOver={e => handleDragOver(e, i)} 
                                onDrop={() => setDragIdx(null)}
                                className={`flex items-center gap-4 bg-white rounded-2xl border p-4 cursor-grab active:cursor-grabbing transition-all duration-200 select-none ${dragIdx === i ? "border-blue-400 shadow-xl shadow-blue-100 scale-[1.02] z-10" : "border-gray-100 hover:border-blue-200 hover:shadow-md"}`}
                            >
                                <div className="text-gray-300 flex-shrink-0 w-6 flex justify-center cursor-grab active:cursor-grabbing">
                                    <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor"><circle cx="2" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/><circle cx="2" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="2" cy="14" r="1.5"/><circle cx="8" cy="14" r="1.5"/></svg>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">{act.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-base font-bold text-gray-800 truncate">{act.name}</p>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${typeColors[act.type] || "bg-gray-100 text-gray-600"}`}>{act.type}</span>
                                        <span className="text-xs text-gray-500 font-medium">⏱ {act.duration}</span>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0 pl-4 border-l border-gray-100 flex flex-col justify-between items-end h-full">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDeleteActivity(act.id); }} 
                                        className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                                        title="Remove Stop"
                                    >
                                        🗑️
                                    </button>
                                    <div>
                                        <p className="text-lg font-bold text-blue-600 leading-none">{act.time}</p>
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase mt-1">Start</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button 
                            onClick={() => setShowActivitySearch(true)}
                            className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl p-4 text-gray-500 font-semibold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                        >
                            + Find & Add Activity
                        </button>
                    </div>
                </div>
            )}

            {/* TIMELINE VIEW MODE */}
            {viewMode === "timeline" && (
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white">
                    <div className="max-w-2xl mx-auto">
                        <h3 className="text-center font-bold text-gray-400 uppercase tracking-widest text-sm mb-8">Full Itinerary Overview</h3>
                        
                        <div className="relative border-l-2 border-blue-100 ml-4 md:ml-6 space-y-10 pb-8">
                            {days.map(d => (
                                <div key={d.id} className="relative">
                                    <div className="absolute w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center text-sm font-bold shadow-md -left-[17px] top-0 border-4 border-white">
                                        {d.day}
                                    </div>
                                    <div className="pl-8 pt-1">
                                        <h4 className="text-xl font-bold text-gray-800">{d.city}</h4>
                                        <p className="text-xs text-gray-400 font-medium mb-4">DAY {d.day}</p>
                                        
                                        <div className="space-y-4">
                                            {d.activities.length === 0 && <p className="text-sm text-gray-400 italic">No activities planned.</p>}
                                            {d.activities.map(act => (
                                                <div key={act.id} className="flex gap-4">
                                                    <div className="w-12 text-right flex-shrink-0 pt-1">
                                                        <span className="text-sm font-bold text-gray-600">{act.time}</span>
                                                    </div>
                                                    <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-start gap-3">
                                                        <span className="text-xl">{act.icon}</span>
                                                        <div>
                                                            <p className="font-semibold text-gray-800 text-sm">{act.name}</p>
                                                            <p className="text-xs text-gray-500">{act.duration} • {act.type}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* MODALS */}
            
            {/* City Search Modal */}
            {showCitySearch && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 text-lg">Search Destination</h3>
                            <button onClick={() => setShowCitySearch(false)} className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300">✕</button>
                        </div>
                        <div className="p-5">
                            <div className="relative mb-5">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                                <input 
                                    autoFocus
                                    value={cityQuery}
                                    onChange={e => setCityQuery(e.target.value)}
                                    placeholder="Search global cities (Open-Meteo API)..." 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                />
                            </div>
                            <div className="overflow-y-auto max-h-80 flex flex-col gap-3">
                                {isSearchingCities && <p className="text-center text-sm text-gray-400 py-4">Searching...</p>}
                                {!isSearchingCities && cityResults.length === 0 && cityQuery.length >= 2 && <p className="text-center text-sm text-gray-400 py-4">No cities found.</p>}
                                {!isSearchingCities && cityResults.map(city => (
                                    <div key={city.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-colors group cursor-pointer" onClick={() => handleAddCity(city)}>
                                        <img src={city.image} alt={city.name} className="w-14 h-14 rounded-xl object-cover shadow-sm" />
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-800">{city.name}</p>
                                            <p className="text-xs text-gray-500">{city.country} • Popularity: {city.popularity}</p>
                                        </div>
                                        <button className="px-4 py-2 bg-blue-100 text-blue-600 font-semibold text-xs rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">Select</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Activity Search Modal */}
            {showActivitySearch && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 text-lg">Find Activities in {days[activeDay].city}</h3>
                            <button onClick={() => setShowActivitySearch(false)} className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300">✕</button>
                        </div>
                        <div className="p-5">
                            <div className="relative mb-5">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                                <input 
                                    autoFocus
                                    value={activityQuery}
                                    onChange={e => setActivityQuery(e.target.value)}
                                    placeholder="Search specific places (Open-Meteo API)..." 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                />
                            </div>
                            <div className="overflow-y-auto max-h-80 flex flex-col gap-3">
                                {isSearchingActivities && <p className="text-center text-sm text-gray-400 py-4">Searching...</p>}
                                {!isSearchingActivities && activityResults.length === 0 && activityQuery.length >= 2 && <p className="text-center text-sm text-gray-400 py-4">No places found.</p>}
                                {!isSearchingActivities && activityResults.map(act => (
                                    <div key={act.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-colors group cursor-pointer" onClick={() => handleAddActivity(act)}>
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl group-hover:bg-white">{act.icon}</div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-800 text-sm">{act.name}</p>
                                            <div className="flex gap-2 text-[10px] mt-1 text-gray-500 font-medium">
                                                <span className="truncate">{act.desc}</span>
                                            </div>
                                        </div>
                                        <button className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">+</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
