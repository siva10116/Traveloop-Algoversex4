import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ── DATA ─────────────────────────────────────────────────────────────────────

const destinations = [
    { id: 1, name: "Dubai", country: "UAE", rating: 4.8, price: 320, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80", tag: "Trending" },
    { id: 2, name: "Santorini", country: "Greece", rating: 4.7, price: 280, img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", tag: "Popular" },
    { id: 3, name: "Bali", country: "Indonesia", rating: 4.5, price: 150, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", tag: "Budget" },
];

const allFavourites = [
    { id: 1, name: "Dubai", country: "UAE", rating: 4.8, price: 320, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80", tag: "Trending", category: "City" },
    { id: 2, name: "Santorini", country: "Greece", rating: 4.7, price: 280, img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80", tag: "Popular", category: "Island" },
    { id: 3, name: "Bali", country: "Indonesia", rating: 4.5, price: 150, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80", tag: "Budget", category: "Island" },
    { id: 4, name: "Kyoto", country: "Japan", rating: 4.8, price: 210, img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80", tag: "Cultural", category: "City" },
    { id: 5, name: "Marrakesh", country: "Morocco", rating: 4.6, price: 140, img: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=400&q=80", tag: "Exotic", category: "City" },
    { id: 6, name: "Maldives", country: "Maldives", rating: 4.9, price: 450, img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80", tag: "Luxury", category: "Island" },
];

const tickets = [
    { id: "TK-2024-001", from: "Mumbai", fromCode: "BOM", to: "Dubai", toCode: "DXB", date: "12 Oct 2024", time: "08:30", arrival: "10:45", airline: "Emirates", seat: "12A", cls: "Business", status: "confirmed", price: 1240, duration: "3h 15m", img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80" },
    { id: "TK-2024-002", from: "Dubai", fromCode: "DXB", to: "Santorini", toCode: "JTR", date: "20 Oct 2024", time: "14:20", arrival: "17:05", airline: "Aegean", seat: "6C", cls: "Economy", status: "upcoming", price: 680, duration: "4h 45m", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80" },
    { id: "TK-2024-003", from: "Bali", fromCode: "DPS", to: "Mumbai", toCode: "BOM", date: "5 Nov 2024", time: "22:00", arrival: "01:30+1", airline: "IndiGo", seat: "24F", cls: "Economy", status: "completed", price: 420, duration: "5h 30m", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80" },
    { id: "TK-2024-004", from: "Mumbai", fromCode: "BOM", to: "Kyoto", toCode: "KIX", date: "15 Dec 2024", time: "11:15", arrival: "20:40", airline: "ANA", seat: "3B", cls: "Business", status: "upcoming", price: 1890, duration: "9h 25m", img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80" },
];

const bestDestinations = [
    { id: 1, name: "Bali", country: "Indonesia", price: 150, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=80&q=80", rating: 4.5 },
    { id: 2, name: "Kerry", country: "Ireland", price: 180, img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&q=80", rating: 4.3 },
    { id: 3, name: "Marrakesh", country: "Morocco", price: 140, img: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=80&q=80", rating: 4.6 },
    { id: 4, name: "Kyoto", country: "Japan", price: 210, img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=80&q=80", rating: 4.8 },
    { id: 5, name: "Cape Town", country: "South Africa", price: 160, img: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=80&q=80", rating: 4.4 },
];

const schedule = [
    { city: "Bangkok", country: "Thailand", dates: "12 Oct - 28 Oct", travelers: 3, img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=60&q=80" },
    { city: "India", country: "New Delhi", dates: "12 Nov - 28 Nov", travelers: 5, img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=60&q=80" },
    { city: "Mexico", country: "Mexico City", dates: "5 Dec - 20 Dec", travelers: 8, img: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=60&q=80" },
];

const spendingData = [
    { month: "Jul", amount: 820 }, { month: "Aug", amount: 1240 }, { month: "Sep", amount: 640 },
    { month: "Oct", amount: 1890 }, { month: "Nov", amount: 420 }, { month: "Dec", amount: 2100 },
];

const txList = [
    { id: 1, desc: "Dubai Flight — Emirates", date: "12 Oct 2024", amount: -1240, category: "Flight", icon: "✈️" },
    { id: 2, desc: "Burj Khalifa Hotel", date: "13 Oct 2024", amount: -890, category: "Hotel", icon: "🏨" },
    { id: 3, desc: "Santorini Tour Package", date: "20 Oct 2024", amount: -680, category: "Tour", icon: "🗺️" },
    { id: 4, desc: "Travel Insurance Refund", date: "22 Oct 2024", amount: +240, category: "Refund", icon: "💰" },
    { id: 5, desc: "Bali Return Flight", date: "5 Nov 2024", amount: -420, category: "Flight", icon: "✈️" },
    { id: 6, desc: "Kyoto Business Class", date: "15 Dec 2024", amount: -1890, category: "Flight", icon: "✈️" },
];

const notifList = [
    { id: 1, title: "Flight Reminder", msg: "Your Dubai flight departs in 48 hours. Check in now!", time: "2h ago", icon: "✈️", color: "bg-blue-100 text-blue-600", unread: true },
    { id: 2, title: "50% Off Deal!", msg: "Exclusive offer on Maldives packages this weekend only.", time: "5h ago", icon: "🏷️", color: "bg-green-100 text-green-600", unread: true },
    { id: 3, title: "Booking Confirmed", msg: "Your Kyoto Business Class ticket TK-2024-004 is confirmed.", time: "1d ago", icon: "✅", color: "bg-teal-100 text-teal-600", unread: false },
    { id: 4, title: "Weather Alert", msg: "Santorini weather: Sunny 26°C on your arrival day.", time: "2d ago", icon: "🌤", color: "bg-amber-100 text-amber-700", unread: false },
    { id: 5, title: "Travel Tip", msg: "Don't forget to exchange currency before your Bali trip!", time: "3d ago", icon: "💡", color: "bg-purple-100 text-purple-600", unread: false },
];

const itineraryDays = [
    {
        day: 1, city: "Dubai", activities: [
            { time: "09:00", name: "Burj Khalifa Observation", type: "Attraction", duration: "2h", icon: "🏙️" },
            { time: "12:00", name: "Dubai Mall & Fountain", type: "Shopping", duration: "3h", icon: "🛍️" },
            { time: "16:00", name: "Desert Safari", type: "Adventure", duration: "4h", icon: "🐪" },
            { time: "20:00", name: "Al Fahidi Dinner Cruise", type: "Dining", duration: "2h", icon: "🍽️" },
        ]
    },
    {
        day: 2, city: "Dubai", activities: [
            { time: "09:00", name: "Palm Jumeirah Walk", type: "Leisure", duration: "2h", icon: "🌴" },
            { time: "11:00", name: "Atlantis Aquaventure", type: "Adventure", duration: "4h", icon: "🌊" },
            { time: "16:00", name: "Dubai Marina Sunset", type: "Leisure", duration: "2h", icon: "🌅" },
            { time: "19:00", name: "JBR Beach Dining", type: "Dining", duration: "2h", icon: "🍽️" },
        ]
    },
    {
        day: 3, city: "Santorini", activities: [
            { time: "08:00", name: "Oia Sunrise Walk", type: "Leisure", duration: "2h", icon: "🌅" },
            { time: "11:00", name: "Akrotiri Archaeological Site", type: "Cultural", duration: "2h", icon: "🏛️" },
            { time: "14:00", name: "Catamaran Sunset Cruise", type: "Adventure", duration: "4h", icon: "⛵" },
            { time: "20:00", name: "Ammoudi Bay Seafood", type: "Dining", duration: "2h", icon: "🦞" },
        ]
    },
];

const CALENDAR_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const OCTOBER = [[null, 1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12, 13], [14, 15, 16, 17, 18, 19, 20], [21, 22, 23, 24, 25, 26, 27], [28, 29, 30, 31, null, null, null]];
const highlighted = [12, 13, 14, 15, 16, 17];

const statusColors = { confirmed: "bg-green-100 text-green-700", upcoming: "bg-blue-100 text-blue-700", completed: "bg-gray-100 text-gray-500" };
const typeColors = { Attraction: "bg-purple-100 text-purple-700", Shopping: "bg-pink-100 text-pink-700", Adventure: "bg-orange-100 text-orange-700", Dining: "bg-red-100 text-red-700", Leisure: "bg-teal-100 text-teal-700", Cultural: "bg-amber-100 text-amber-700" };

// ── PAGES ─────────────────────────────────────────────────────────────────────

function Dashboard({ searchQuery, savedIds, toggleSave }) {
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

function MyTickets() {
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

function Favourites({ savedIds, toggleSave }) {
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

function NotificationsPage() {
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

function Transactions() {
    return (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">Transactions</h2>
                <p className="text-sm text-gray-400">Your travel spending overview</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[["💸", "Total Spent", "$5,120", "bg-red-50 text-red-600"], ["💰", "Total Saved", "$1,240", "bg-green-50 text-green-600"], ["📅", "Upcoming", "$2,570", "bg-blue-50 text-blue-600"]].map(([icon, label, val, col]) => (
                    <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${col}`}>{icon}</div>
                        <div><p className="text-xs text-gray-400">{label}</p><p className="text-xl font-bold text-gray-800">{val}</p></div>
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
                <h3 className="font-bold text-gray-800 text-sm mb-4">Monthly Spending</h3>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={spendingData} barSize={28}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                        <Tooltip formatter={v => [`$${v}`, "Spent"]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
                        <Bar dataKey="amount" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100"><h3 className="font-bold text-gray-800 text-sm">Recent Transactions</h3></div>
                {txList.map((tx, i) => (
                    <div key={tx.id} className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${i < txList.length - 1 ? "border-b border-gray-50" : ""}`}>
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-base flex-shrink-0">{tx.icon}</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{tx.desc}</p>
                            <p className="text-xs text-gray-400">{tx.date} · {tx.category}</p>
                        </div>
                        <p className={`text-sm font-bold ${tx.amount > 0 ? "text-green-600" : "text-gray-800"}`}>{tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Itinerary() {
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

function Settings() {
    const [notifs, setNotifs] = useState({ email: true, push: true, sms: false, deals: true });
    const [currency, setCurrency] = useState("USD");
    return (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="mb-6"><h2 className="text-xl font-bold text-gray-800">Settings</h2><p className="text-sm text-gray-400">Manage your preferences</p></div>
            <div className="grid grid-cols-1 gap-4 max-w-2xl">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-800 text-sm mb-4">Profile</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md">KT</div>
                        <div><p className="font-bold text-gray-800">Kashish Tripathi</p><p className="text-xs text-gray-400">kashish@email.com</p><button className="text-xs text-blue-500 font-semibold mt-1 hover:underline">Change Photo</button></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[["Full Name", "Kashish Tripathi"], ["Email", "kashish@email.com"], ["Phone", "+91 98765 43210"], ["Location", "Mumbai, India"]].map(([label, val]) => (
                            <div key={label}>
                                <p className="text-xs text-gray-400 mb-1">{label}</p>
                                <input defaultValue={val} className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                            </div>
                        ))}
                    </div>
                    <button className="mt-4 bg-blue-500 text-white text-sm font-semibold px-6 py-2 rounded-xl hover:bg-blue-600 transition-colors shadow-md shadow-blue-200">Save Changes</button>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-800 text-sm mb-4">Notifications</h3>
                    <div className="flex flex-col gap-4">
                        {Object.entries(notifs).map(([key, val]) => (
                            <div key={key} className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{key === "sms" ? "SMS Notifications" : key === "deals" ? "Deals & Offers" : key.charAt(0).toUpperCase() + key.slice(1) + " Notifications"}</p>
                                    <p className="text-xs text-gray-400">Receive {key} alerts for bookings</p>
                                </div>
                                <button onClick={() => setNotifs(prev => ({ ...prev, [key]: !prev[key] }))} className={`w-12 h-6 rounded-full transition-all duration-200 relative flex-shrink-0 ${val ? "bg-blue-500" : "bg-gray-200"}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all duration-200 ${val ? "left-6" : "left-0.5"}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-800 text-sm mb-4">Preferences</h3>
                    <div className="flex items-center justify-between">
                        <div><p className="text-sm font-medium text-gray-800">Currency</p><p className="text-xs text-gray-400">Display prices in</p></div>
                        <select value={currency} onChange={e => setCurrency(e.target.value)} className="text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200">
                            {["USD", "EUR", "GBP", "INR", "AED"].map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────

export default function TravelooApp() {
    const [page, setPage] = useState("Dashboard");
    const [searchQuery, setSearchQuery] = useState("");
    const [savedIds, setSavedIds] = useState([1, 3]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSave = (id) => setSavedIds(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
    const unread = notifList.filter(n => n.unread).length;

    const nav = [
        { icon: "🏠", label: "Dashboard" }, { icon: "🎫", label: "My Tickets" }, { icon: "⭐", label: "Favourites" },
        { icon: "🔔", label: "Notifications" }, { icon: "💳", label: "Transactions" }, { icon: "🗺️", label: "Itinerary" }, { icon: "⚙️", label: "Settings" },
    ];

    const renderPage = () => {
        switch (page) {
            case "Dashboard": return <Dashboard searchQuery={searchQuery} savedIds={savedIds} toggleSave={toggleSave} />;
            case "My Tickets": return <MyTickets />;
            case "Favourites": return <Favourites savedIds={savedIds} toggleSave={toggleSave} />;
            case "Notifications": return <NotificationsPage />;
            case "Transactions": return <Transactions />;
            case "Itinerary": return <Itinerary />;
            case "Settings": return <Settings />;
            default: return <Dashboard searchQuery={searchQuery} savedIds={savedIds} toggleSave={toggleSave} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-50 flex items-center justify-center p-2 sm:p-4">
            {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            <div className="w-full max-w-[1200px] bg-white rounded-3xl shadow-2xl shadow-blue-100 overflow-hidden flex h-[calc(100vh-1rem)] max-h-[820px]">

                {/* SIDEBAR */}
                <aside className={`fixed lg:relative top-0 left-0 h-full z-40 lg:z-auto w-56 bg-white flex flex-col py-6 px-4 flex-shrink-0 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} border-r border-gray-100`}>
                    <div className="flex items-center gap-2 mb-10 px-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"><span className="text-white text-xs font-bold">✈</span></div>
                        <span className="font-bold text-lg text-gray-800 tracking-tight">Traveloo</span>
                        <span className="text-blue-400 text-xs">···</span>
                    </div>
                    <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
                        {nav.map(item => (
                            <button key={item.label} onClick={() => { setPage(item.label); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 text-left w-full relative ${page === item.label ? "bg-blue-500 text-white shadow-md shadow-blue-200" : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"}`}>
                                <span className="text-base">{item.icon}</span>
                                {item.label}
                                {item.label === "Notifications" && unread > 0 && <span className="ml-auto bg-red-400 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{unread}</span>}
                            </button>
                        ))}
                    </nav>
                    <div className="mt-4 rounded-2xl overflow-hidden relative bg-gradient-to-br from-slate-700 to-slate-900 p-4 text-white">
                        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&q=60)" }} />
                        <div className="relative"><p className="text-xl font-bold text-yellow-300">50% off!</p><p className="text-xs mt-1 text-gray-300">Flight Bookings</p><button className="mt-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm shadow-lg">→</button></div>
                    </div>
                    <button className="mt-4 flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors"><span>🚪</span> Logout</button>
                </aside>

                {/* MAIN */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Mobile bar */}
                    <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-100 flex-shrink-0">
                        <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600">☰</button>
                        <span className="font-bold text-gray-800">Traveloo</span>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">KT</div>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        {/* CENTER */}
                        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                            {page === "Dashboard" && (
                                <div className="px-4 sm:px-6 pt-4 sm:pt-6 flex items-center justify-between flex-wrap gap-3 flex-shrink-0">
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Hello, Kashish 👋</h1>
                                        <p className="text-sm text-gray-400 mt-0.5">Welcome back. Are you ready to explore the world?</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                                            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search Destination" className="pl-9 pr-4 py-2 text-sm rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 w-44 sm:w-52 placeholder-gray-400" />
                                        </div>
                                        <button className="relative w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-blue-50 transition-colors">🔔{unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full" />}</button>
                                    </div>
                                </div>
                            )}
                            {renderPage()}
                        </div>

                        {/* RIGHT PANEL */}
                        <aside className="hidden xl:flex w-64 flex-col flex-shrink-0 p-5 border-l border-gray-100 gap-5 overflow-y-auto">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md">KT</div>
                                    <div><p className="text-sm font-bold text-gray-800">Kashish Tripathi</p><p className="text-xs text-gray-400">Traveller Enthusiast</p></div>
                                </div>
                                <button className="text-gray-400 text-xs">▾</button>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-3"><h3 className="font-bold text-gray-800 text-sm">My Schedule</h3><button className="text-gray-400 text-lg leading-none">···</button></div>
                                <div className="flex flex-col gap-2">
                                    {schedule.map((trip, i) => (
                                        <div key={i} className="bg-gray-50 rounded-xl p-3 hover:bg-blue-50 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <img src={trip.img} alt={trip.city} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-800">{trip.city}</p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">📅 {trip.dates}</p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        {[...Array(Math.min(trip.travelers, 3))].map((_, j) => (
                                                            <div key={j} className="w-4 h-4 rounded-full border border-white" style={{ background: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"][j % 4] }} />
                                                        ))}
                                                        {trip.travelers > 3 && <span className="text-[10px] text-gray-400 ml-1">+{trip.travelers - 3}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-3"><h3 className="font-bold text-gray-800 text-sm">My Calendar</h3><button className="text-gray-400 hover:text-blue-500 transition-colors text-sm">🔗</button></div>
                                <div className="bg-gray-50 rounded-2xl p-3">
                                    <p className="text-xs font-semibold text-gray-700 mb-3">October 2022</p>
                                    <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                                        {CALENDAR_DAYS.map(d => <div key={d} className="text-[9px] font-semibold text-gray-400 py-1">{d}</div>)}
                                    </div>
                                    <div className="grid grid-cols-7 gap-0.5 text-center">
                                        {OCTOBER.flat().map((day, i) => (
                                            <div key={i} className={`text-[10px] py-1 rounded-md font-medium ${!day ? "text-transparent" : ""} ${day === 28 ? "bg-blue-500 text-white rounded-full" : ""} ${day && highlighted.includes(day) && day !== 28 ? "bg-blue-100 text-blue-600" : ""} ${day && !highlighted.includes(day) && day !== 28 ? "text-gray-600 hover:bg-gray-100 cursor-pointer" : ""}`}>{day || ""}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-4 text-white">
                                <div className="flex items-center justify-between mb-2"><p className="text-xs font-medium opacity-80">Current Weather</p><span className="text-2xl">🌤</span></div>
                                <p className="text-2xl font-bold">28°C</p>
                                <p className="text-xs opacity-70 mt-1">Dubai, UAE</p>
                                <div className="flex gap-3 mt-3">
                                    {[["Mon", "☀️", 32], ["Tue", "🌤", 29], ["Wed", "🌧", 25]].map(([d, icon, temp]) => (
                                        <div key={d} className="flex flex-col items-center gap-1"><span className="text-[10px] opacity-60">{d}</span><span className="text-sm">{icon}</span><span className="text-[10px] font-semibold">{temp}°</span></div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm mb-3">Quick Access</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {[["🗺️", "Itinerary"], ["💳", "Transactions"], ["🎫", "My Tickets"], ["⭐", "Favourites"]].map(([icon, label]) => (
                                        <button key={label} onClick={() => setPage(label)} className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors text-gray-500">
                                            <span className="text-lg">{icon}</span><span className="text-[10px] font-semibold">{label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    );
}
