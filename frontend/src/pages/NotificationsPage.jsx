import { useState } from "react";
import { notifList } from "../data/mockData";

export default function NotificationsPage() {
    const [items, setItems] = useState(notifList);
    return (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
                    <p className="text-sm text-gray-400">{items.filter(n => n.unread).length} unread</p>
                </div>
                <button onClick={() => setItems(prev => prev.map(n => ({ ...n, unread: false })))} className="text-xs text-blue-500 font-semibold hover:underline">Mark all as read</button>
            </div>
            <div className="flex flex-col gap-3">
                {items.map(n => (
                    <div key={n.id} className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${n.unread ? "bg-blue-50 border-blue-100" : "bg-white border-gray-100"}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${n.color}`}>{n.icon}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-bold text-gray-800">{n.title}</p>
                                <span className="text-[10px] text-gray-400 flex-shrink-0">{n.time}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{n.msg}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {n.unread && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                            <button onClick={() => setItems(prev => prev.filter(x => x.id !== n.id))} className="text-gray-300 hover:text-red-400 transition-colors text-xl leading-none">×</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
