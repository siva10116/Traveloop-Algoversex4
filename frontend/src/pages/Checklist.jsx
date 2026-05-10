import { useState } from "react";

export default function Checklist() {
    const [items, setItems] = useState([
        { id: 1, text: "Passport & ID", category: "Documents", packed: false },
        { id: 2, text: "Flight Tickets", category: "Documents", packed: true },
        { id: 3, text: "Travel Insurance", category: "Documents", packed: false },
        { id: 4, text: "Phone Charger", category: "Electronics", packed: true },
        { id: 5, text: "Power Bank", category: "Electronics", packed: false },
        { id: 6, text: "Camera & Lenses", category: "Electronics", packed: false },
        { id: 7, text: "T-Shirts (x5)", category: "Clothing", packed: false },
        { id: 8, text: "Jeans (x2)", category: "Clothing", packed: false },
        { id: 9, text: "Jacket", category: "Clothing", packed: true },
        { id: 10, text: "Toothbrush & Paste", category: "Toiletries", packed: false },
        { id: 11, text: "Sunscreen", category: "Toiletries", packed: true },
    ]);
    const [newItem, setNewItem] = useState("");
    const [newCategory, setNewCategory] = useState("Clothing");

    const categories = ["Documents", "Electronics", "Clothing", "Toiletries", "Miscellaneous"];

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.trim()) return;
        setItems([
            ...items, 
            { id: Date.now(), text: newItem, category: newCategory, packed: false }
        ]);
        setNewItem("");
    };

    const togglePack = (id) => {
        setItems(items.map(i => i.id === id ? { ...i, packed: !i.packed } : i));
    };

    const deleteItem = (id) => {
        setItems(items.filter(i => i.id !== id));
    };

    const totalItems = items.length;
    const packedItems = items.filter(i => i.packed).length;
    const progress = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100);

    return (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50/50">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Packing Checklist</h2>
                        <p className="text-sm text-gray-500 mt-1">Make sure you don't forget the essentials.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm w-full sm:w-auto">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: `conic-gradient(#3B82F6 ${progress}%, #EFF6FF ${progress}%)` }}>
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                                {progress}%
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Packed</p>
                            <p className="font-bold text-gray-800 text-sm">{packedItems} / {totalItems} Items</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Add Item Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-6">
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">Add New Item</h3>
                            <form onSubmit={handleAddItem} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Item Name</label>
                                    <input 
                                        type="text" 
                                        value={newItem}
                                        onChange={(e) => setNewItem(e.target.value)}
                                        placeholder="e.g. Sunglasses" 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Category</label>
                                    <select 
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors mt-2 shadow-md shadow-blue-200">
                                    + Add to List
                                </button>
                            </form>
                            
                            <div className="mt-8 border-t border-gray-100 pt-6">
                                <button 
                                    onClick={() => setItems(items.map(i => ({...i, packed: false})))}
                                    className="w-full py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Reset All Checkmarks
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Checklist Groups */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {categories.map(category => {
                            const catItems = items.filter(i => i.category === category);
                            if (catItems.length === 0) return null;
                            
                            const catPacked = catItems.filter(i => i.packed).length;
                            
                            return (
                                <div key={category} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">
                                                {category === "Documents" ? "🛂" : category === "Electronics" ? "💻" : category === "Clothing" ? "👕" : category === "Toiletries" ? "🧴" : "🧳"}
                                            </span>
                                            <h3 className="font-bold text-gray-800 text-lg">{category}</h3>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                                            {catPacked}/{catItems.length}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1">
                                        {catItems.map(item => (
                                            <div 
                                                key={item.id} 
                                                className={`flex items-center justify-between p-3 rounded-xl transition-all group ${item.packed ? "bg-gray-50/50" : "hover:bg-blue-50/50"}`}
                                            >
                                                <label className="flex items-center gap-3 cursor-pointer flex-1">
                                                    <div className="relative flex items-center justify-center w-6 h-6">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={item.packed}
                                                            onChange={() => togglePack(item.id)}
                                                            className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-blue-500 checked:border-blue-500 transition-colors cursor-pointer"
                                                        />
                                                        <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className={`text-sm font-medium transition-colors ${item.packed ? "text-gray-400 line-through" : "text-gray-700"}`}>
                                                        {item.text}
                                                    </span>
                                                </label>
                                                <button 
                                                    onClick={() => deleteItem(item.id)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
