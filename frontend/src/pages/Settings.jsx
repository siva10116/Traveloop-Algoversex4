import { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Settings({ userData }) {
    const [notifs, setNotifs] = useState({ email: true, push: true, sms: false, deals: true });
    const [currency, setCurrency] = useState("USD");
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (userData) {
            setFirstName(userData.firstName || "");
            setLastName(userData.lastName || "");
            setPhone(userData.phone || "");
            setLocation(userData.location || "");
            setPhotoUrl(userData.photoUrl || "");
        }
    }, [userData]);

    const handlePhotoChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
            // Preview
            const reader = new FileReader();
            reader.onload = (event) => setPhotoUrl(event.target.result);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSaveProfile = async () => {
        if (!auth.currentUser) return;
        setLoading(true);
        setMessage("");
        
        try {
            let finalPhotoUrl = photoUrl;

            // Upload image if selected
            if (imageFile) {
                const imageRef = ref(storage, `users/${auth.currentUser.uid}/profile_${Date.now()}`);
                const snapshot = await uploadBytes(imageRef, imageFile);
                finalPhotoUrl = await getDownloadURL(snapshot.ref);
            }

            const userRef = doc(db, "users", auth.currentUser.uid);
            const userSnap = await getDoc(userRef);

            const updatedData = {
                firstName,
                lastName,
                phone,
                location,
                photoUrl: finalPhotoUrl
            };

            if (userSnap.exists()) {
                await updateDoc(userRef, updatedData);
            } else {
                await setDoc(userRef, { ...updatedData, email: auth.currentUser.email });
            }

            setMessage("Profile updated successfully!");
            // Optional: You could force App.jsx to re-fetch userData here or use a Context
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const initials = (firstName?.[0] || "") + (lastName?.[0] || "");
    const displayInitials = initials.toUpperCase() || (auth.currentUser?.email?.[0] || "U").toUpperCase();

    return (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50/50">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">User Profile & Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your personal information and preferences</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 max-w-3xl">
                {/* PROFILE SECTION */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                    <h3 className="font-bold text-gray-800 text-lg mb-6 border-b border-gray-100 pb-4">Personal Information</h3>
                    
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.includes("success") ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                            {message}
                        </div>
                    )}

                    <div className="flex items-center gap-6 mb-8">
                        <div className="relative group">
                            {photoUrl ? (
                                <img src={photoUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-white" />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-md border-4 border-white">
                                    {displayInitials}
                                </div>
                            )}
                            <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg border-2 border-white hover:bg-blue-700 transition-colors">
                                <span className="text-white text-xs">📷</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                            </label>
                        </div>
                        <div>
                            <p className="font-bold text-xl text-gray-800">{firstName} {lastName}</p>
                            <p className="text-sm text-gray-500 mt-1">{auth.currentUser?.email}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">First Name</label>
                            <input value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Last Name</label>
                            <input value={lastName} onChange={e => setLastName(e.target.value)} className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Phone</label>
                            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 8900" className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Location</label>
                            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors" />
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={handleSaveProfile}
                            disabled={loading}
                            className="bg-blue-600 text-white text-sm font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 flex items-center justify-center min-w-[150px]"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Save Changes"}
                        </button>
                    </div>
                </div>

                {/* NOTIFICATIONS SECTION */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                    <h3 className="font-bold text-gray-800 text-lg mb-6 border-b border-gray-100 pb-4">Notifications</h3>
                    <div className="flex flex-col gap-5">
                        {Object.entries(notifs).map(([key, val]) => (
                            <div key={key} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{key === "sms" ? "SMS Notifications" : key === "deals" ? "Deals & Offers" : key.charAt(0).toUpperCase() + key.slice(1) + " Notifications"}</p>
                                    <p className="text-xs text-gray-500 mt-1">Receive {key} alerts for your trips and bookings</p>
                                </div>
                                <button onClick={() => setNotifs(prev => ({ ...prev, [key]: !prev[key] }))} className={`w-12 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 shadow-inner ${val ? "bg-blue-500" : "bg-gray-300"}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-all duration-300 ${val ? "left-7" : "left-1"}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* APP PREFERENCES SECTION */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                    <h3 className="font-bold text-gray-800 text-lg mb-6 border-b border-gray-100 pb-4">Preferences</h3>
                    <div className="flex items-center justify-between p-2">
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Display Currency</p>
                            <p className="text-xs text-gray-500 mt-1">Select the currency to display prices across the app</p>
                        </div>
                        <select value={currency} onChange={e => setCurrency(e.target.value)} className="text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-800 min-w-[100px] cursor-pointer">
                            {["USD", "EUR", "GBP", "INR", "AED", "AUD", "CAD"].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
