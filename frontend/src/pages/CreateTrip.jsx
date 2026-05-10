import { useState } from "react";

export default function CreateTrip({ setPage }) {
    const [name, setName] = useState("");
    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Simulated upload delay
            await new Promise(resolve => setTimeout(resolve, 800));

            let imageUrl = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"; // default fallback
            
            // If we had a real backend, we'd upload the file here. 
            // For localStorage, we use the default image unless it's a small data URL.
            if (image) {
                imageUrl = URL.createObjectURL(image);
            }

            const tripData = {
                id: Date.now().toString(),
                name,
                destination,
                startDate,
                endDate,
                description,
                coverPhoto: imageUrl,
                createdAt: new Date().toISOString(),
                aiPredictedCost: null // Field for AI prediction
            };

            const existingTrips = JSON.parse(localStorage.getItem('traveloop_trips') || '[]');
            existingTrips.push(tripData);
            localStorage.setItem('traveloop_trips', JSON.stringify(existingTrips));

            setLoading(false);
            setPage("My Trips"); // Redirect to My Trips page on success
        } catch (err) {
            console.error(err);
            setError("Failed to save trip. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50/50">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Create a New Trip</h2>
                    <p className="text-sm text-gray-500 mt-1">Start planning your next great adventure.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Cover Photo Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Photo</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <span className="text-3xl mb-2">📸</span>
                                        <p className="mb-2 text-sm text-gray-500 font-medium">
                                            {image ? image.name : "Click to upload a cover photo"}
                                        </p>
                                        <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Trip Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="e.g., Summer in Europe"
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3.5 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Destination City</label>
                                <input
                                    type="text"
                                    required
                                    value={destination}
                                    onChange={e => setDestination(e.target.value)}
                                    placeholder="e.g., Paris, France"
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3.5 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                                <input
                                    type="date"
                                    required
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3.5 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                                <input
                                    type="date"
                                    required
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3.5 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Trip Description</label>
                            <textarea
                                rows="4"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="What's the goal of this trip?"
                                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3.5 transition-colors resize-none"
                            ></textarea>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={() => setPage("Dashboard")}
                                className="text-gray-500 bg-white border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-semibold rounded-xl text-sm px-6 py-3 hover:bg-gray-50 transition-colors mr-3"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-xl text-sm px-8 py-3 text-center transition-colors flex items-center justify-center min-w-[140px]"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "Save Trip"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
