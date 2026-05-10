import { useState, useEffect } from "react";
import { bestDestinations, destinations } from "../data/mockData";

export default function Dashboard({ searchQuery, savedIds, toggleSave }) {

    const [recentTrips, setRecentTrips] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [budget, setBudget] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setRecentTrips([
                {
                    id: 1,
                    city: "Dubai",
                    date: "12 Oct - 18 Oct",
                    status: "Upcoming"
                },
                {
                    id: 2,
                    city: "Bali",
                    date: "22 Nov - 29 Nov",
                    status: "Planned"
                }
            ]);

            setRecommended(destinations);

            setBudget({
                total: 7000,
                spent: 5200,
                remaining: 1800
            });

            setLoading(false);

        }, 1000);
    }, []);

    const filtered = bestDestinations.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="text-lg font-bold text-gray-500 animate-pulse">
                    Loading Dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {recommended.map(dest => (
                    <div key={dest.id} className="relative rounded-2xl overflow-hidden h-48 sm:h-52 group cursor-pointer">
                        <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <span className="absolute top-3 left-3 bg-white/90 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">{dest.tag}</span>
                        <button onClick={() => toggleSave(dest.id)} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs hover:bg-white/40 transition-all">
                            {savedIds.includes(dest.id) ? "❤️" : "🤍"}
                        </button>
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                            <div>
                                <p className="text-white font-bold text-base">{dest.name}</p>
                                <p className="text-white/80 text-xs">📍 {dest.country}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                <span className="text-yellow-300 text-xs">⭐</span>
                                <span className="text-white text-xs font-medium">{dest.rating}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl p-4 mb-5 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800">
                        Upcoming Trips
                    </h3>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-600 transition-colors">
                        Plan New Trip
                    </button>
                </div>
                <div className="flex flex-col gap-3">
                    {recentTrips.map(trip => (
                        <div
                            key={trip.id}
                            className="flex items-center justify-between bg-blue-50 rounded-xl p-3"
                        >
                            <div>
                                <p className="font-semibold text-gray-800">
                                    {trip.city}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {trip.date}
                                </p>
                            </div>
                            <span className="text-sm font-semibold text-blue-600">
                                {trip.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-5 text-white mb-4 shadow-lg shadow-blue-200">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm opacity-90">
                            Budget Highlights
                        </p>
                        <h2 className="text-3xl font-bold mt-1">
                            ${budget.total}
                        </h2>
                    </div>
                    <div className="text-4xl bg-white/20 w-12 h-12 flex items-center justify-center rounded-xl backdrop-blur-sm">
                        💰
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                        <p className="text-xs opacity-90 mb-1">
                            Spent
                        </p>
                        <p className="text-xl font-bold">
                            ${budget.spent}
                        </p>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                        <p className="text-xs opacity-90 mb-1">
                            Remaining
                        </p>
                        <p className="text-xl font-bold">
                            ${budget.remaining}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm">Best Destinations</h3>
                            <p className="text-xs text-gray-400">50 Destinations found</p>
                        </div>
                        <button className="text-xs text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm">🔽 Filters</button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {filtered.slice(0, 4).map(dest => (
                            <div key={dest.id} className="flex items-center gap-3 bg-white rounded-xl p-3 hover:shadow-md hover:shadow-blue-50 transition-all cursor-pointer border border-transparent hover:border-blue-100">
                                <img src={dest.img} alt={dest.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{dest.name}</p>
                                    <p className="text-xs text-gray-400">📍 {dest.country}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-blue-600">${dest.price}</p>
                                    <p className="text-[10px] text-gray-400">/day</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 flex flex-col items-center justify-center text-center border border-blue-100">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                        <img src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=200&q=80" alt="Group travel" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-base leading-tight">Travelling is so much<br />fun with friends!</h3>
                    <p className="text-xs text-gray-500 mt-2 mb-4">Exclusive discount and offers on group tickets.</p>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-8 py-2.5 rounded-full shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:-translate-y-0.5">Book Now</button>
                </div>
            </div>
        </div>
    );
}
