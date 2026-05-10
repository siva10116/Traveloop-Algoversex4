import { useState } from "react";
import { allFavourites } from "../data/mockData";

export default function Favourites({ savedIds, toggleSave }) {
    const [cat, setCat] = useState("All");
    const shown = cat === "All" ? allFavourites : allFavourites.filter(d => d.category === cat);
    return (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Favourites</h2>
                    <p className="text-sm text-gray-400">{savedIds.length} saved</p>
                </div>
                <div className="flex gap-2">
                    {["All", "City", "Island"].map(c => (
                        <button key={c} onClick={() => setCat(c)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${cat === c ? "bg-blue-500 text-white shadow-md shadow-blue-200" : "bg-gray-100 text-gray-500 hover:bg-blue-50"}`}>{c}</button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {shown.map(dest => (
                    <div key={dest.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 group">
                        <div className="relative h-40 overflow-hidden">
                            <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <button onClick={() => toggleSave(dest.id)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-sm hover:scale-110 transition-transform">{savedIds.includes(dest.id) ? "❤️" : "🤍"}</button>
                            <span className="absolute top-3 left-3 bg-white/90 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{dest.tag}</span>
                        </div>
                        <div className="p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-800">{dest.name}</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">📍 {dest.country}</p>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
                                    <span className="text-yellow-400 text-xs">⭐</span>
                                    <span className="text-xs font-bold text-yellow-700">{dest.rating}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <p className="text-blue-600 font-bold">${dest.price}<span className="text-gray-400 text-xs font-normal">/day</span></p>
                                <button className="bg-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-xl hover:bg-blue-600 transition-colors">Book Now</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
