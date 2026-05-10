import { useState } from "react";

export default function Notes() {
    const [notes, setNotes] = useState([
        { id: 1, title: "Hotel Check-in Details", content: "Confirmation #492810. Need to provide passport at front desk. Late check-in requested for 11 PM.", date: "Oct 12, 2024", tag: "Logistics" },
        { id: 2, title: "Places to eat in Paris", content: "1. Le Relais de l'Entrecôte (Steak)\n2. L'As du Fallafel (Cheap eats)\n3. Angelina (Hot chocolate!)", date: "Oct 15, 2024", tag: "Food" },
        { id: 3, title: "Emergency Contacts", content: "Local Police: 112\nEmbassy: +33 1 43 12 22 22\nTravel Insurance Hotline: +1 800 555 0199", date: "Oct 10, 2024", tag: "Important" }
    ]);

    const [isEditing, setIsEditing] = useState(false);
    const [currentNote, setCurrentNote] = useState({ title: "", content: "", tag: "General" });

    const handleSave = () => {
        if (!currentNote.title.trim() && !currentNote.content.trim()) {
            setIsEditing(false);
            return;
        }

        if (currentNote.id) {
            setNotes(notes.map(n => n.id === currentNote.id ? { ...currentNote, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } : n));
        } else {
            setNotes([{ ...currentNote, id: Date.now(), date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }, ...notes]);
        }
        setIsEditing(false);
        setCurrentNote({ title: "", content: "", tag: "General" });
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this note?")) {
            setNotes(notes.filter(n => n.id !== id));
            if (currentNote.id === id) {
                setIsEditing(false);
                setCurrentNote({ title: "", content: "", tag: "General" });
            }
        }
    };

    const getTagColor = (tag) => {
        switch(tag) {
            case "Important": return "bg-red-100 text-red-700 border-red-200";
            case "Logistics": return "bg-blue-100 text-blue-700 border-blue-200";
            case "Food": return "bg-orange-100 text-orange-700 border-orange-200";
            default: return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    return (
        <div className="flex-1 p-4 sm:p-6 overflow-hidden flex flex-col bg-gray-50/50 h-full">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Trip Journal & Notes</h2>
                    <p className="text-sm text-gray-500 mt-1">Jot down important details, memories, and contacts.</p>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => { setCurrentNote({ title: "", content: "", tag: "General" }); setIsEditing(true); }}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-colors"
                    >
                        + New Note
                    </button>
                )}
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Notes List */}
                <div className={`w-full ${isEditing ? 'hidden lg:flex lg:w-1/3' : 'flex'} flex-col gap-4 overflow-y-auto pr-2`}>
                    {notes.length === 0 && !isEditing && (
                        <div className="text-center p-10 bg-white rounded-3xl border border-dashed border-gray-300">
                            <p className="text-4xl mb-4">📝</p>
                            <p className="text-gray-500 font-medium">Your journal is empty.</p>
                        </div>
                    )}
                    {notes.map(note => (
                        <div 
                            key={note.id} 
                            onClick={() => { setCurrentNote(note); setIsEditing(true); }}
                            className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all ${isEditing && currentNote.id === note.id ? "border-blue-500 shadow-md ring-2 ring-blue-100" : "border-gray-200 hover:border-blue-300 hover:shadow-sm"}`}
                        >
                            <div className="flex justify-between items-start mb-2 gap-2">
                                <h3 className="font-bold text-gray-800 line-clamp-1">{note.title || "Untitled Note"}</h3>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getTagColor(note.tag)} flex-shrink-0`}>
                                    {note.tag}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{note.content}</p>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{note.date}</p>
                        </div>
                    ))}
                </div>

                {/* Note Editor */}
                {isEditing && (
                    <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col overflow-hidden h-full">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setIsEditing(false)} className="lg:hidden w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-600">←</button>
                                <select 
                                    value={currentNote.tag} 
                                    onChange={e => setCurrentNote({...currentNote, tag: e.target.value})}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer ${getTagColor(currentNote.tag)}`}
                                >
                                    <option value="General">General</option>
                                    <option value="Important">Important</option>
                                    <option value="Logistics">Logistics</option>
                                    <option value="Food">Food</option>
                                    <option value="Ideas">Ideas</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                {currentNote.id && (
                                    <button onClick={() => handleDelete(currentNote.id)} className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                        Delete
                                    </button>
                                )}
                                <button onClick={handleSave} className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                                    Save Note
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                            <input 
                                type="text"
                                value={currentNote.title}
                                onChange={e => setCurrentNote({...currentNote, title: e.target.value})}
                                placeholder="Note Title..."
                                className="text-2xl font-bold text-gray-800 placeholder-gray-300 w-full outline-none mb-6 bg-transparent"
                            />
                            <textarea
                                value={currentNote.content}
                                onChange={e => setCurrentNote({...currentNote, content: e.target.value})}
                                placeholder="Start typing your notes here..."
                                className="flex-1 w-full text-gray-600 leading-relaxed outline-none resize-none bg-transparent"
                                autoFocus
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
