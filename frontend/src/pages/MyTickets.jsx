import { useState } from "react";
import { tickets, statusColors } from "../data/mockData";

export default function MyTickets() {
    const [filter, setFilter] = useState("all");
    const [selected, setSelected] = useState(null);
    const shown = filter === "all" ? tickets : tickets.filter(t => t.status === filter);
    return (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">My Tickets</h2>
                    <p className="text-sm text-gray-400">{tickets.length} tickets total</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {["all", "confirmed", "upcoming", "completed"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${filter === f ? "bg-blue-500 text-white shadow-md shadow-blue-200" : "bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600"}`}>{f}</button>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-4">
                {shown.map(ticket => (
                    <div key={ticket.id} onClick={() => setSelected(selected?.id === ticket.id ? null : ticket)} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-blue-50 transition-all cursor-pointer group">
                        <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-32 h-28 sm:h-auto relative overflow-hidden flex-shrink-0">
                                <img src={ticket.img} alt={ticket.to} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 p-4">
                                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                                    <div className="flex items-center gap-3 sm:gap-6">
                                        <div className="text-center">
                                            <p className="text-xl font-bold text-gray-800">{ticket.fromCode}</p>
                                            <p className="text-xs text-gray-400">{ticket.from}</p>
                                            <p className="text-sm font-semibold text-blue-600">{ticket.time}</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-[10px] text-gray-400 mb-1">{ticket.duration}</p>
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full border-2 border-blue-400" />
                                                <div className="w-12 sm:w-20 h-px bg-blue-300" />
                                                <span className="text-blue-500 text-xs">✈</span>
                                                <div className="w-12 sm:w-20 h-px bg-blue-300" />
                                                <div className="w-2 h-2 rounded-full bg-blue-400" />
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-1">{ticket.airline}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xl font-bold text-gray-800">{ticket.toCode}</p>
                                            <p className="text-xs text-gray-400">{ticket.to}</p>
                                            <p className="text-sm font-semibold text-blue-600">{ticket.arrival}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${statusColors[ticket.status]}`}>{ticket.status}</span>
                                        <p className="text-lg font-bold text-gray-800">${ticket.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 flex-wrap text-xs text-gray-400 border-t border-dashed border-gray-200 pt-3">
                                    <span>📅 {ticket.date}</span><span>💺 {ticket.seat}</span><span>🏷️ {ticket.cls}</span>
                                    <span className="text-gray-300 text-xs ml-auto font-mono">{ticket.id}</span>
                                </div>
                            </div>
                        </div>
                        {selected?.id === ticket.id && (
                            <div className="border-t border-dashed border-gray-200 bg-blue-50 p-4">
                                <div className="flex flex-wrap gap-3">
                                    <button className="bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors">📄 Download Ticket</button>
                                    <button className="bg-white text-blue-600 border border-blue-200 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors">🔄 Change Date</button>
                                    <button className="bg-white text-red-500 border border-red-200 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-red-50 transition-colors">❌ Cancel</button>
                                    <button className="bg-white text-gray-600 border border-gray-200 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">📤 Share</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
