import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const CATEGORY_COLORS = {
    "Flights": "#3B82F6",
    "Accommodation": "#10B981",
    "Activities": "#F59E0B",
    "Food & Dining": "#EF4444",
    "Transport": "#8B5CF6",
    "Other": "#6B7280"
};

const CATEGORY_ICONS = {
    "Flights": "✈️",
    "Accommodation": "🏨",
    "Activities": "🗺️",
    "Food & Dining": "🍽️",
    "Transport": "🚕",
    "Other": "💳"
};

export default function Budget({ transactions, setTransactions }) {
    const [totalBudget, setTotalBudget] = useState(5000);

    const [currency, setCurrency] = useState("USD");
    const [rates, setRates] = useState(null);
    const [exchangeRate, setExchangeRate] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    
    // Add Expense Form State
    const [newExpTitle, setNewExpTitle] = useState("");
    const [newExpAmount, setNewExpAmount] = useState("");
    const [newExpCat, setNewExpCat] = useState("Food & Dining");

    useEffect(() => {
        async function fetchRates() {
            try {
                // Live Currency API (Free, No Key)
                const res = await fetch("https://api.frankfurter.app/latest?from=USD");
                const data = await res.json();
                setRates(data.rates);
            } catch (err) {
                console.error("Failed to fetch exchange rates", err);
            }
        }
        fetchRates();
    }, []);

    useEffect(() => {
        if (currency === "USD") setExchangeRate(1);
        else if (rates && rates[currency]) setExchangeRate(rates[currency]);
    }, [currency, rates]);

    const formatCurrency = (amount) => {
        const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "JPY" ? "¥" : "₹";
        return `${symbol}${Math.round(amount * exchangeRate).toLocaleString()}`;
    };
    
    // Dynamic Data Computation
    const expenses = Object.entries(
        transactions.reduce((acc, curr) => {
            acc[curr.cat] = (acc[curr.cat] || 0) + curr.amount;
            return acc;
        }, {})
    ).map(([category, amount], index) => ({
        id: index,
        category,
        amount,
        color: CATEGORY_COLORS[category] || CATEGORY_COLORS["Other"],
        icon: CATEGORY_ICONS[category] || CATEGORY_ICONS["Other"]
    })).sort((a, b) => b.amount - a.amount); // Sort by highest expense

    const dailyData = [
        { day: "Day 1", cost: 150 },
        { day: "Day 2", cost: 320 },
        { day: "Day 3", cost: 210 },
        { day: "Day 4", cost: 80 },
        { day: "Day 5", cost: 450 },
    ]; // Keeping static for now as it requires complex date math

    const totalSpent = transactions.reduce((sum, item) => sum + item.amount, 0);
    const remaining = totalBudget - totalSpent;
    const progressPercent = Math.min((totalSpent / totalBudget) * 100, 100);

    const handleAddExpense = (e) => {
        e.preventDefault();
        if(!newExpTitle || !newExpAmount) return;
        
        const newTx = {
            id: Date.now(),
            title: newExpTitle,
            cat: newExpCat,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            amount: parseFloat(newExpAmount)
        };
        
        setTransactions([newTx, ...transactions]);
        setShowAddModal(false);
        setNewExpTitle("");
        setNewExpAmount("");
    };

    const handleDeleteExpense = (id) => {
        setTransactions(transactions.filter(tx => tx.id !== id));
    };

    return (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50/50">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Trip Budget & Costs</h2>
                    <p className="text-sm text-gray-500 mt-1">Track your expenses and stay on budget.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select 
                        value={currency} 
                        onChange={e => setCurrency(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
                    >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="INR">INR (₹)</option>
                    </select>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-colors"
                    >
                        + Add Expense
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Overview Card */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg lg:col-span-1 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div>
                        <p className="text-blue-100 font-medium mb-1">Total Estimated Cost</p>
                        <h3 className="text-4xl font-bold mb-6">{formatCurrency(totalSpent)}</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-blue-100">Budget Limit</span>
                                    <span className="font-bold">{formatCurrency(totalBudget)}</span>
                                </div>
                                <div className="w-full bg-blue-900/40 rounded-full h-2">
                                    <div className={`h-2 rounded-full ${progressPercent > 90 ? 'bg-red-400' : 'bg-green-400'}`} style={{ width: `${progressPercent}%` }}></div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                                <div>
                                    <p className="text-xs text-blue-200 mb-1">Spent</p>
                                    <p className="font-bold text-lg">{formatCurrency(totalSpent)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-200 mb-1">Remaining</p>
                                    <p className={`font-bold text-lg ${remaining < 0 ? 'text-red-300' : 'text-green-300'}`}>{formatCurrency(remaining)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm lg:col-span-2 flex items-center">
                    <div className="w-1/2 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={expenses} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="amount">
                                    {expenses.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip formatter={(value) => `$${value}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-1/2 flex flex-col gap-3 pl-4">
                        <h4 className="font-bold text-gray-800 mb-2">Cost Breakdown</h4>
                        {expenses.length === 0 && <p className="text-sm text-gray-400">No expenses yet.</p>}
                        {expenses.map(exp => (
                            <div key={exp.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: exp.color }}></span>
                                    <span className="text-sm text-gray-600">{exp.icon} {exp.category}</span>
                                </div>
                                <span className="font-semibold text-gray-800 text-sm">{formatCurrency(exp.amount)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Spending Bar Chart */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6">Daily Spending</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={v => `$${v}`} />
                                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Bar dataKey="cost" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Expense List */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">Recent Transactions</h3>
                        <button className="text-blue-500 text-sm font-semibold hover:underline">View All</button>
                    </div>
                    <div className="flex flex-col gap-4 overflow-y-auto pr-2">
                        {transactions.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No transactions found.</p>}
                        {transactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-lg shadow-sm">
                                        {CATEGORY_ICONS[tx.cat] || "💳"}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{tx.title}</p>
                                        <p className="text-xs text-gray-500">{tx.cat} • {tx.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-800 text-sm">{formatCurrency(tx.amount)}</span>
                                    <button 
                                        onClick={() => handleDeleteExpense(tx.id)}
                                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                        title="Delete Expense"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Expense Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 text-lg">Add New Expense</h3>
                            <button onClick={() => setShowAddModal(false)} className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300">✕</button>
                        </div>
                        <form onSubmit={handleAddExpense} className="p-5 flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                                <input required autoFocus value={newExpTitle} onChange={e => setNewExpTitle(e.target.value)} placeholder="e.g. Dinner at Luigi's" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Amount (USD)</label>
                                <input required type="number" min="1" step="0.01" value={newExpAmount} onChange={e => setNewExpAmount(e.target.value)} placeholder="0.00" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                                <select value={newExpCat} onChange={e => setNewExpCat(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                                    {Object.keys(CATEGORY_ICONS).map(cat => <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>)}
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors mt-2 shadow-md">
                                Save Expense
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
