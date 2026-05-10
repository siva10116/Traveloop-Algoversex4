import { useState, useEffect } from "react";

export default function MyTrips({ setPage }) {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTrips = () => {
        try {
            // Simulated network delay
            setTimeout(() => {
                const existingTrips = JSON.parse(localStorage.getItem('traveloop_trips') || '[]');
                setTrips(existingTrips);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error("Error fetching trips:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this trip?")) {
            try {
                const existingTrips = JSON.parse(localStorage.getItem('traveloop_trips') || '[]');
                const updatedTrips = existingTrips.filter(t => t.id !== id);
                localStorage.setItem('traveloop_trips', JSON.stringify(updatedTrips));
                setTrips(updatedTrips);
            } catch (error) {
                console.error("Error deleting trip:", error);
            }
        }
    };

    const handlePredictCost = async (tripId) => {
        // Find the trip
        const tripIndex = trips.findIndex(t => t.id === tripId);
        if (tripIndex === -1) return;
        
        const trip = trips[tripIndex];
        
        // Temporarily set a loading state on this trip
        const loadingTrips = [...trips];
        loadingTrips[tripIndex] = { ...trip, aiPredicting: true };
        setTrips(loadingTrips);
        
        // Simulated AI Logic: Predict cost based on length and destination
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second thinking delay
        
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
        
        // Random base cost + (days * random daily cost)
        const baseFlight = Math.floor(Math.random() * 800) + 300;
        const dailyCost = Math.floor(Math.random() * 250) + 100;
        const totalEstimate = baseFlight + (dailyCost * days);
        
        // Format to currency string
        const formattedCost = `$${totalEstimate.toLocaleString()}`;
        
        // Save back to local storage and state
        const existingTrips = JSON.parse(localStorage.getItem('traveloop_trips') || '[]');
        const storageIndex = existingTrips.findIndex(t => t.id === tripId);
        if(storageIndex !== -1) {
            existingTrips[storageIndex].aiPredictedCost = formattedCost;
            localStorage.setItem('traveloop_trips', JSON.stringify(existingTrips));
        }
        
        const updatedTrips = [...trips];
        updatedTrips[tripIndex] = { ...trip, aiPredictedCost: formattedCost, aiPredicting: false };
        setTrips(updatedTrips);
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-full space-y-4 bg-gray-50/50">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="text-lg font-bold text-gray-500 animate-pulse">Loading Your Trips...</div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50/50">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">My Trips</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and view all your planned adventures.</p>
                </div>
                <button
                    onClick={() => setPage("Create Trip")}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <span>➕</span> Create New Trip
                </button>
            </div>

            {trips.length === 0 ? (
                <div className="flex flex-col items-center justify-center bg-white rounded-3xl p-12 border border-gray-100 text-center shadow-sm">
                    <div className="text-6xl mb-4">🌍</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No trips planned yet!</h3>
                    <p className="text-gray-500 mb-6 max-w-md">You haven't created any trips. Start planning your next adventure today and keep all your itineraries in one place.</p>
                    <button
                        onClick={() => setPage("Create Trip")}
                        className="bg-blue-100 text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-200 transition-colors"
                    >
                        Start Planning
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {trips.map(trip => (
                        <div key={trip.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 group flex flex-col">
                            <div className="relative h-48 overflow-hidden flex-shrink-0">
                                <img
                                    src={trip.coverPhoto || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"}
                                    alt={trip.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <button
                                        onClick={() => handleDelete(trip.id)}
                                        className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                                        title="Delete Trip"
                                    >
                                        🗑️
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="font-bold text-white text-xl truncate">{trip.name}</h3>
                                    <p className="text-white/80 text-sm mt-0.5 truncate">📍 {trip.destination}</p>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-xl">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-gray-400">START</span>
                                        <span className="font-medium text-gray-800">{new Date(trip.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200"></div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-gray-400">END</span>
                                        <span className="font-medium text-gray-800">{new Date(trip.endDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                                    {trip.description || "No description provided."}
                                </p>
                                
                                {/* AI Prediction Banner */}
                                <div className="mb-6 h-12 flex items-center justify-center">
                                    {trip.aiPredicting ? (
                                        <div className="flex items-center gap-2 text-sm font-semibold text-purple-500 animate-pulse bg-purple-50 w-full py-2.5 rounded-xl justify-center">
                                            <span>✨</span> AI is analyzing...
                                        </div>
                                    ) : trip.aiPredictedCost ? (
                                        <div className="flex flex-col items-center justify-center w-full py-1.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl">
                                            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">AI Estimated Cost</span>
                                            <span className="font-bold text-indigo-700 text-lg">{trip.aiPredictedCost}</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handlePredictCost(trip.id)}
                                            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all text-sm flex items-center justify-center gap-2"
                                        >
                                            <span>✨</span> Predict Cost with AI
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-auto">
                                    <button
                                        onClick={() => { /* set active trip and go to Itinerary builder */ setPage("Itinerary") }}
                                        className="bg-blue-50 text-blue-600 font-semibold py-2.5 rounded-xl hover:bg-blue-100 transition-colors text-sm"
                                    >
                                        Build Itinerary
                                    </button>
                                    <button
                                        onClick={() => { /* view logic */ }}
                                        className="bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-100 transition-colors text-sm border border-gray-200"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
