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

    const handleStorageChange = () => loadFarms();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const filteredFarms = farms.filter((farm) => {
    const search = searchTerm.toLowerCase();
    const locationMatch = farm.farmLocation.toLowerCase().includes(search);
    const sizeMatch = farm.farmSize && farm.farmSize.toLowerCase().includes(search);
    const valuePerShareMatch =
      farm.valuePerShare && farm.valuePerShare.toString().includes(search);
    const totalSharesMatch =
      farm.totalShares && farm.totalShares.toString().includes(search);
    const availableSharesMatch =
      farm.totalSharesAvailable && farm.totalSharesAvailable.toString().includes(search);

    return (
      locationMatch ||
      sizeMatch ||
      valuePerShareMatch ||
      totalSharesMatch ||
      availableSharesMatch
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 text-center mb-6">
          🌾 Listed Farms
        </h1>

        <div className="mb-6 text-center">
          <input
            type="text"
            placeholder="Search by location, size, value per share, or shares..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-3 rounded-xl w-full max-w-md focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
          />
        </div>

        {filteredFarms.length === 0 ? (
          <p className="text-center text-gray-600 bg-white p-6 rounded-xl shadow-md">
            No farms found.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFarms.map((farm) => (
              <div
                key={farm.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 border border-gray-100"
              >
                <div className="relative h-48">
                  <img
                    src={farm.farmImage}
                    alt={`Farm at ${farm.farmLocation}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white rounded-b-3xl">
                    <h2 className="font-bold text-lg truncate">{farm.farmLocation}</h2>
                    <p className="text-sm flex items-center gap-1">
                      <User size={14} /> {farm.farmerName}
                    </p>
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-2">
                  {farm.farmSize && (
                    <div className="text-gray-700 text-sm">🌱 Size: {farm.farmSize}</div>
                  )}
                  {farm.valuePerShare && (
                    <div className="text-gray-700 text-sm">
                      💰 Value per Share: ₦{farm.valuePerShare}
                    </div>
                  )}
                  {farm.totalShares && (
                    <div className="text-gray-700 text-sm">
                      📊 Total Shares: {farm.totalShares}
                    </div>
                  )}
                  {farm.totalSharesAvailable !== undefined && (
                    <div className="text-green-700 font-semibold text-sm">
                      🟢 Shares Available: {farm.totalSharesAvailable}
                    </div>
                  )}
                  {farm.rating && (
                    <div className="flex items-center gap-1 text-yellow-500 text-sm">
                      <Star size={16} /> {farm.rating}
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <MapPin size={16} /> {farm.farmLocation}
                  </div>
                  <button className="bg-green-600 text-white text-sm px-3 py-1 rounded-xl hover:bg-green-700 transition">
                    Invest
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
