import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Auth from "./Auth";
import Dashboard from "./pages/Dashboard";
import CreateTrip from "./pages/CreateTrip";
import MyTrips from "./pages/MyTrips";
import MyTickets from "./pages/MyTickets";
import Favourites from "./pages/Favourites";
import NotificationsPage from "./pages/NotificationsPage";
import Transactions from "./pages/Transactions";
import Itinerary from "./pages/Itinerary";
import Budget from "./pages/Budget";
import Checklist from "./pages/Checklist";
import Notes from "./pages/Notes";
import Settings from "./pages/Settings";
import { notifList, schedule, CALENDAR_DAYS, OCTOBER, highlighted } from "./data/mockData";

export default function TravelooApp() {
    const [page, setPage] = useState("Dashboard");
    const [searchQuery, setSearchQuery] = useState("");
    const [savedIds, setSavedIds] = useState([1, 3]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [userData, setUserData] = useState(null);
    const [weather, setWeather] = useState(null);
    // Global State for Persistence
    const [itineraryDays, setItineraryDays] = useState([
        {
            id: 1,
            day: 1,
            city: "Dubai",
            activities: [
                { id: 1, time: "09:00", name: "Burj Khalifa Observation", type: "Attraction", duration: "2h", icon: "🏙️", lat: 25.1972, lon: 55.2744 },
                { id: 2, time: "12:00", name: "Dubai Mall & Fountain", type: "Shopping", duration: "3h", icon: "🛍️", lat: 25.1989, lon: 55.2796 },
            ]
        }
    ]);
    const [transactions, setTransactions] = useState([
        { id: 1, title: "Emirates Flight TK-204", cat: "Flights", date: "Today", amount: 1200 },
        { id: 2, title: "Burj Al Arab Booking", cat: "Accommodation", date: "Yesterday", amount: 1500 },
        { id: 3, title: "Desert Safari Tour", cat: "Activities", date: "Oct 12", amount: 150 },
        { id: 4, title: "At.mosphere Restaurant", cat: "Food & Dining", date: "Oct 12", amount: 320 },
        { id: 5, title: "Airport Transfer", cat: "Transport", date: "Oct 10", amount: 80 }
    ]);

    useEffect(() => {
        async function fetchWeather() {
            try {
                // Berlin coordinates as default (latitude=52.52, longitude=13.41)
                const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true&daily=weathercode,temperature_2m_max&timezone=auto");
                const data = await res.json();
                setWeather(data);
            } catch (e) {
                console.error("Failed to fetch weather", e);
            }
        }
        fetchWeather();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsLoggedIn(true);
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        const nameParts = user.displayName ? user.displayName.split(' ') : [];
                        setUserData({
                            firstName: nameParts[0] || user.email.split('@')[0],
                            lastName: nameParts.slice(1).join(' ') || "",
                            email: user.email
                        });
                    }
                } catch (e) {
                    console.error("Error fetching user data:", e);
                    setUserData({ firstName: user.email.split('@')[0], lastName: "", email: user.email });
                }
            } else {
                setIsLoggedIn(false);
                setUserData(null);
            }
            setLoadingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if (loadingAuth) {
        return <div className="min-h-screen bg-[#164E3E] flex items-center justify-center text-white font-['Inter']">Loading...</div>;
    }

    if (!isLoggedIn) {
        return <Auth onLogin={() => setIsLoggedIn(true)} />;
    }

    const toggleSave = (id) => setSavedIds(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
    const unread = notifList.filter(n => n.unread).length;

    const nav = [
        { icon: "🏠", label: "Dashboard" }, { icon: "✈️", label: "My Trips" }, { icon: "🗺️", label: "Itinerary" }, 
        { icon: "💰", label: "Budget" }, { icon: "🧳", label: "Packing" }, { icon: "📝", label: "Journal" },
        { icon: "⭐", label: "Favourites" }, { icon: "⚙️", label: "Settings" },
    ];

    const renderPage = () => {
        switch (page) {
            case "Dashboard": return <Dashboard setPage={setPage} searchQuery={searchQuery} savedIds={savedIds} toggleSave={toggleSave} transactions={transactions} itineraryDays={itineraryDays} />;
            case "My Trips": return <MyTrips setPage={setPage} />;
            case "Create Trip": return <CreateTrip setPage={setPage} />;
            case "Itinerary": return <Itinerary days={itineraryDays} setDays={setItineraryDays} />;
            case "Budget": return <Budget transactions={transactions} setTransactions={setTransactions} />;
            case "Packing": return <Checklist />;
            case "Journal": return <Notes />;
            case "Favourites": return <Favourites savedIds={savedIds} toggleSave={toggleSave} />;
            case "Settings": return <Settings userData={userData} />;
            default: return <Dashboard searchQuery={searchQuery} savedIds={savedIds} toggleSave={toggleSave} />;
        }
    };

    const displayFirstName = userData?.firstName || "Traveler";
    const displayFullName = `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim() || userData?.email || "Traveler";
    const initials = (userData?.firstName?.[0] || "") + (userData?.lastName?.[0] || "");
    const displayInitials = initials.toUpperCase() || (userData?.email?.[0] || "T").toUpperCase();

    const getWeatherIcon = (code) => {
        if (code === 0) return "☀️";
        if (code >= 1 && code <= 3) return "🌤";
        if (code >= 45 && code <= 48) return "🌫";
        if (code >= 51 && code <= 67) return "🌧";
        if (code >= 71 && code <= 77) return "❄️";
        if (code >= 95) return "⛈";
        return "🌤";
    };

    const currentTemp = weather?.current_weather?.temperature || 28;
    const currentCode = weather?.current_weather?.weathercode || 1;
    const dailyForecast = weather?.daily ? [0, 1, 2].map(i => {
        const date = new Date(weather.daily.time[i]);
        return [
            date.toLocaleDateString('en-US', { weekday: 'short' }),
            getWeatherIcon(weather.daily.weathercode[i]),
            Math.round(weather.daily.temperature_2m_max[i])
        ];
    }) : [["Mon", "☀️", 32], ["Tue", "🌤", 29], ["Wed", "🌧", 25]];

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
                    <button onClick={handleLogout} className="mt-4 flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors"><span>🚪</span> Logout</button>
                </aside>

                {/* MAIN */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Mobile bar */}
                    <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-100 flex-shrink-0">
                        <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600">☰</button>
                        <span className="font-bold text-gray-800">Traveloo</span>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">{displayInitials}</div>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        {/* CENTER */}
                        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                            {page === "Dashboard" && (
                                <div className="px-4 sm:px-6 pt-4 sm:pt-6 flex items-center justify-between flex-wrap gap-3 flex-shrink-0">
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Hello, {displayFirstName} 👋</h1>
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
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md">{displayInitials}</div>
                                    <div><p className="text-sm font-bold text-gray-800">{displayFullName}</p><p className="text-xs text-gray-400">Traveller Enthusiast</p></div>
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
                                <div className="flex items-center justify-between mb-2"><p className="text-xs font-medium opacity-80">Live Weather</p><span className="text-2xl">{getWeatherIcon(currentCode)}</span></div>
                                <p className="text-2xl font-bold">{Math.round(currentTemp)}°C</p>
                                <p className="text-xs opacity-70 mt-1">Berlin, Germany</p>
                                <div className="flex gap-3 mt-3">
                                    {dailyForecast.map(([d, icon, temp], idx) => (
                                        <div key={idx} className="flex flex-col items-center gap-1"><span className="text-[10px] opacity-60">{d}</span><span className="text-sm">{icon}</span><span className="text-[10px] font-semibold">{temp}°</span></div>
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
