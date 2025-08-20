import { useEffect, useState } from "react";
import { MapPin, User, Star } from "lucide-react";

export default function FarmsList() {
  const [farms, setFarms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadFarms = () => {
    const storedFarms = JSON.parse(localStorage.getItem("farms")) || [];
    setFarms(storedFarms);
  };

  useEffect(() => {
    loadFarms();

    // Update farms if localStorage changes in another tab
    const handleStorageChange = () => loadFarms();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const filteredFarms = farms.filter((farm) => {
    const search = searchTerm.toLowerCase();

    const locationMatch = farm.farmLocation.toLowerCase().includes(search);
    const ratingMatch = farm.rating && farm.rating.toString().includes(search);
    const sizeMatch = farm.farmSize && farm.farmSize.toLowerCase().includes(search);
    const valuationMatch =
      farm.farmValuation && farm.farmValuation.toString().includes(search);

    return locationMatch || ratingMatch || sizeMatch || valuationMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 text-center mb-6">
          🌾 Listed Farms
        </h1>

        <div className="mb-6 text-center">
          <input
            type="text"
            placeholder="Search by location, rating, size, or valuation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full max-w-md"
          />
        </div>

        {filteredFarms.length === 0 ? (
          <p className="text-center text-gray-600 bg-white p-6 rounded-xl shadow-md">
            No farms found.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredFarms.map((farm) => (
              <div
                key={farm.id}
                className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-3 border border-gray-100"
              >
                <img
                  src={farm.farmImage}
                  alt={`Farm at ${farm.farmLocation}`}
                  className="h-40 w-full object-cover rounded-xl"
                />
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={18} />
                  <span>{farm.farmLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <User size={18} />
                  <span>{farm.farmerName}</span>
                </div>
                {farm.farmSize && (
                  <div className="text-gray-700">
                    🌱 Size: {farm.farmSize}
                  </div>
                )}
                {farm.farmValuation && (
                  <div className="text-gray-700">
                    💰 Valuation: ₦{farm.farmValuation}
                  </div>
                )}
                {farm.rating && (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <Star size={18} />
                    <span>Rating: {farm.rating}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
