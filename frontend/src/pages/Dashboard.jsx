import { bestDestinations, destinations } from "../data/mockData";

export default function Dashboard({ searchQuery, savedIds, toggleSave }) {
    const filtered = bestDestinations.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {destinations.map(dest => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm">Best Destinations</h3>
                            <p className="text-xs text-gray-400">50 Destinations found</p>
                        </div>
                        <button className="text-xs text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors">🔽 Filters</button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {filtered.slice(0, 4).map(dest => (
                            <div key={dest.id} className="flex items-center gap-3 bg-white rounded-xl p-3 hover:shadow-md hover:shadow-blue-50 transition-all cursor-pointer">
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
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
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
