import { useState, useEffect } from "react";
import { bestDestinations, destinations } from "../data/mockData";

export default function Dashboard({ setPage, searchQuery, savedIds, toggleSave, transactions = [], itineraryDays = [] }) {

    const [recentTrips, setRecentTrips] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [budget, setBudget] = useState({ total: 5000, spent: 0, remaining: 5000 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch saved trips from local storage
        const existingTrips = JSON.parse(localStorage.getItem('traveloop_trips') || '[]');
        
        // Sort by newest first and take top 2
        const sortedTrips = existingTrips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 2);
        setRecentTrips(sortedTrips);
        
        setRecommended(destinations);

        // Compute actual budget from props
        const totalBudget = 5000;
        const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        
        setBudget({
            total: totalBudget,
            spent: totalSpent,
            remaining: totalBudget - totalSpent
        });

        setLoading(false);
    }, [transactions]);

    const filtered = bestDestinations.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Find the most relevant day for the itinerary preview
    const activeDay = itineraryDays.find(d => d.activities && d.activities.length > 0) || itineraryDays[0];
    const previewActivities = activeDay ? activeDay.activities.slice(0, 3) : [];

    const formatCurrency = (amt) => `$${amt.toLocaleString()}`;

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-full space-y-4 bg-gray-50/50">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="text-sm font-bold text-gray-500 animate-pulse tracking-widest uppercase">
                    Syncing Dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50/50">
            {/* Top Carousel: Recommended */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {recommended.map(dest => (
                    <div key={dest.id} className="relative rounded-3xl overflow-hidden h-48 sm:h-56 group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 border border-white">
                        <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-sm">
                            {dest.tag}
                        </span>
                        <button onClick={(e) => { e.stopPropagation(); toggleSave(dest.id); }} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-sm hover:bg-white/40 transition-all shadow-sm border border-white/20 z-10">
                            {savedIds.includes(dest.id) ? "❤️" : "🤍"}
                        </button>
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                            <div>
                                <p className="text-white font-bold text-lg leading-tight group-hover:text-blue-200 transition-colors">{dest.name}</p>
                                <p className="text-white/70 text-xs mt-1 flex items-center gap-1">
                                    <span className="opacity-80">📍</span> {dest.country}
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20">
                                <span className="text-yellow-400 text-xs">⭐</span>
                                <span className="text-white text-xs font-bold">{dest.rating}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                
                {/* Left Column (Budget & Schedule) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    
                    {/* Live Budget Card */}
                    <div 
                        onClick={() => setPage("Budget")}
                        className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-200 cursor-pointer group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500 opacity-20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
                        
                        <div className="relative z-10 flex items-start justify-between mb-8">
                            <div>
                                <p className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-1">Live Budget Tracker</p>
                                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                                    {formatCurrency(budget.total)}
                                </h2>
                            </div>
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl border border-white/20 group-hover:bg-white/20 transition-colors shadow-inner">
                                💳
                            </div>
                        </div>
                        
                        <div className="relative z-10 grid grid-cols-2 gap-4">
                            <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                    <p className="text-xs text-white/70 uppercase tracking-wider font-semibold">Spent</p>
                                </div>
                                <p className="text-2xl font-bold">{formatCurrency(budget.spent)}</p>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/20 shadow-inner">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                    <p className="text-xs text-white/90 uppercase tracking-wider font-semibold">Remaining</p>
                                </div>
                                <p className="text-2xl font-bold">{formatCurrency(budget.remaining)}</p>
                            </div>
                        </div>
                        <div className="absolute bottom-6 right-6 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-sm font-semibold">
                            Manage Budget <span>→</span>
                        </div>
                    </div>

                    {/* Today's Schedule Snapshot */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                    📍 Day {activeDay?.day || "1"} Itinerary
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">{activeDay?.city || "Plan your next move"}</p>
                            </div>
                            <button 
                                onClick={() => setPage("Itinerary")}
                                className="text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-xl transition-colors hover:bg-blue-100"
                            >
                                Open Builder
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {previewActivities.length === 0 && (
                                <div className="text-center py-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <p className="text-gray-500 text-sm font-medium">No activities planned yet.</p>
                                    <button onClick={() => setPage("Itinerary")} className="mt-2 text-blue-500 font-bold text-sm hover:underline">Add Stops +</button>
                                </div>
                            )}
                            {previewActivities.map((act, idx) => (
                                <div key={act.id || idx} className="flex items-center gap-4 group">
                                    <div className="w-14 flex-shrink-0 text-right">
                                        <span className="text-sm font-extrabold text-gray-700">{act.time}</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center text-xl shadow-sm flex-shrink-0 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                                        {act.icon}
                                    </div>
                                    <div className="flex-1 bg-gray-50 rounded-2xl p-3 border border-gray-100 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors">
                                        <p className="font-bold text-gray-800 text-sm leading-tight">{act.name}</p>
                                        <p className="text-xs text-gray-500 font-medium mt-1">{act.duration} • {act.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (Upcoming Trips & Explore) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    
                    {/* Upcoming Trips Card */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-800 text-lg">
                                Upcoming Trips
                            </h3>
                            <button 
                                onClick={() => setPage("Create Trip")}
                                className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all hover:shadow-md hover:-translate-y-0.5"
                            >
                                + New
                            </button>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            {recentTrips.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 text-sm mb-3">You don't have any upcoming trips.</p>
                                    <button onClick={() => setPage("Create Trip")} className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl">Start Planning</button>
                                </div>
                            )}
                            {recentTrips.map(trip => (
                                <div
                                    key={trip.id}
                                    onClick={() => setPage("My Trips")}
                                    className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-3 cursor-pointer hover:border-blue-300 hover:shadow-md hover:shadow-blue-50 transition-all group"
                                >
                                    <img src={trip.coverPhoto || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&q=80"} className="w-16 h-16 rounded-xl object-cover shadow-sm border border-gray-100" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                                            {trip.name || trip.destination}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 font-medium">
                                            {new Date(trip.startDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - {new Date(trip.endDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                                        </p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity -ml-2">
                                        ›
                                    </div>
                                </div>
                            ))}
                            {recentTrips.length > 0 && (
                                <button onClick={() => setPage("My Trips")} className="text-center text-sm font-bold text-gray-400 hover:text-blue-600 mt-2 transition-colors">
                                    View all trips
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Explore Destinations List */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">Explore</h3>
                                <p className="text-xs text-gray-400 font-medium">Top global destinations</p>
                            </div>
                            <button className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                🔍
                            </button>
                        </div>
                        <div className="flex flex-col gap-3 overflow-y-auto pr-2 flex-1">
                            {filtered.slice(0, 5).map(dest => (
                                <div key={dest.id} className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-2xl hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm">
                                            <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{dest.name}</p>
                                            <p className="text-xs text-gray-500 font-medium">{dest.country}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-extrabold text-blue-600">${dest.price}</p>
                                        <p className="text-[10px] uppercase font-bold text-gray-400">/ day</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
