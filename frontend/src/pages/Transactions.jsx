import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { spendingData, txList } from "../data/mockData";

export default function Transactions() {
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
