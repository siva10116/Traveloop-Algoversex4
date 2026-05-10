export const destinations = [
    { id: 1, name: "Dubai", country: "UAE", rating: 4.8, price: 320, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80", tag: "Trending" },
    { id: 2, name: "Santorini", country: "Greece", rating: 4.7, price: 280, img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", tag: "Popular" },
    { id: 3, name: "Bali", country: "Indonesia", rating: 4.5, price: 150, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", tag: "Budget" },
];

export const allFavourites = [
    { id: 1, name: "Dubai", country: "UAE", rating: 4.8, price: 320, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80", tag: "Trending", category: "City" },
    { id: 2, name: "Santorini", country: "Greece", rating: 4.7, price: 280, img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80", tag: "Popular", category: "Island" },
    { id: 3, name: "Bali", country: "Indonesia", rating: 4.5, price: 150, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80", tag: "Budget", category: "Island" },
    { id: 4, name: "Kyoto", country: "Japan", rating: 4.8, price: 210, img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80", tag: "Cultural", category: "City" },
    { id: 5, name: "Marrakesh", country: "Morocco", rating: 4.6, price: 140, img: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=400&q=80", tag: "Exotic", category: "City" },
    { id: 6, name: "Maldives", country: "Maldives", rating: 4.9, price: 450, img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80", tag: "Luxury", category: "Island" },
];

export const tickets = [
    { id: "TK-2024-001", from: "Mumbai", fromCode: "BOM", to: "Dubai", toCode: "DXB", date: "12 Oct 2024", time: "08:30", arrival: "10:45", airline: "Emirates", seat: "12A", cls: "Business", status: "confirmed", price: 1240, duration: "3h 15m", img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80" },
    { id: "TK-2024-002", from: "Dubai", fromCode: "DXB", to: "Santorini", toCode: "JTR", date: "20 Oct 2024", time: "14:20", arrival: "17:05", airline: "Aegean", seat: "6C", cls: "Economy", status: "upcoming", price: 680, duration: "4h 45m", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80" },
    { id: "TK-2024-003", from: "Bali", fromCode: "DPS", to: "Mumbai", toCode: "BOM", date: "5 Nov 2024", time: "22:00", arrival: "01:30+1", airline: "IndiGo", seat: "24F", cls: "Economy", status: "completed", price: 420, duration: "5h 30m", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80" },
    { id: "TK-2024-004", from: "Mumbai", fromCode: "BOM", to: "Kyoto", toCode: "KIX", date: "15 Dec 2024", time: "11:15", arrival: "20:40", airline: "ANA", seat: "3B", cls: "Business", status: "upcoming", price: 1890, duration: "9h 25m", img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80" },
];

export const bestDestinations = [
    { id: 1, name: "Bali", country: "Indonesia", price: 150, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=80&q=80", rating: 4.5 },
    { id: 2, name: "Kerry", country: "Ireland", price: 180, img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&q=80", rating: 4.3 },
    { id: 3, name: "Marrakesh", country: "Morocco", price: 140, img: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=80&q=80", rating: 4.6 },
    { id: 4, name: "Kyoto", country: "Japan", price: 210, img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=80&q=80", rating: 4.8 },
    { id: 5, name: "Cape Town", country: "South Africa", price: 160, img: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=80&q=80", rating: 4.4 },
];

export const schedule = [
    { city: "Bangkok", country: "Thailand", dates: "12 Oct - 28 Oct", travelers: 3, img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=60&q=80" },
    { city: "India", country: "New Delhi", dates: "12 Nov - 28 Nov", travelers: 5, img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=60&q=80" },
    { city: "Mexico", country: "Mexico City", dates: "5 Dec - 20 Dec", travelers: 8, img: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=60&q=80" },
];

export const spendingData = [
    { month: "Jul", amount: 820 }, { month: "Aug", amount: 1240 }, { month: "Sep", amount: 640 },
    { month: "Oct", amount: 1890 }, { month: "Nov", amount: 420 }, { month: "Dec", amount: 2100 },
];

export const txList = [
    { id: 1, desc: "Dubai Flight — Emirates", date: "12 Oct 2024", amount: -1240, category: "Flight", icon: "✈️" },
    { id: 2, desc: "Burj Khalifa Hotel", date: "13 Oct 2024", amount: -890, category: "Hotel", icon: "🏨" },
    { id: 3, desc: "Santorini Tour Package", date: "20 Oct 2024", amount: -680, category: "Tour", icon: "🗺️" },
    { id: 4, desc: "Travel Insurance Refund", date: "22 Oct 2024", amount: +240, category: "Refund", icon: "💰" },
    { id: 5, desc: "Bali Return Flight", date: "5 Nov 2024", amount: -420, category: "Flight", icon: "✈️" },
    { id: 6, desc: "Kyoto Business Class", date: "15 Dec 2024", amount: -1890, category: "Flight", icon: "✈️" },
];

export const notifList = [
    { id: 1, title: "Flight Reminder", msg: "Your Dubai flight departs in 48 hours. Check in now!", time: "2h ago", icon: "✈️", color: "bg-blue-100 text-blue-600", unread: true },
    { id: 2, title: "50% Off Deal!", msg: "Exclusive offer on Maldives packages this weekend only.", time: "5h ago", icon: "🏷️", color: "bg-green-100 text-green-600", unread: true },
    { id: 3, title: "Booking Confirmed", msg: "Your Kyoto Business Class ticket TK-2024-004 is confirmed.", time: "1d ago", icon: "✅", color: "bg-teal-100 text-teal-600", unread: false },
    { id: 4, title: "Weather Alert", msg: "Santorini weather: Sunny 26°C on your arrival day.", time: "2d ago", icon: "🌤", color: "bg-amber-100 text-amber-700", unread: false },
    { id: 5, title: "Travel Tip", msg: "Don't forget to exchange currency before your Bali trip!", time: "3d ago", icon: "💡", color: "bg-purple-100 text-purple-600", unread: false },
];

export const itineraryDays = [
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

export const CALENDAR_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const OCTOBER = [[null, 1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12, 13], [14, 15, 16, 17, 18, 19, 20], [21, 22, 23, 24, 25, 26, 27], [28, 29, 30, 31, null, null, null]];
export const highlighted = [12, 13, 14, 15, 16, 17];

export const statusColors = { confirmed: "bg-green-100 text-green-700", upcoming: "bg-blue-100 text-blue-700", completed: "bg-gray-100 text-gray-500" };
export const typeColors = { Attraction: "bg-purple-100 text-purple-700", Shopping: "bg-pink-100 text-pink-700", Adventure: "bg-orange-100 text-orange-700", Dining: "bg-red-100 text-red-700", Leisure: "bg-teal-100 text-teal-700", Cultural: "bg-amber-100 text-amber-700" };
