import { useState } from "react";

export default function Settings() {
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
