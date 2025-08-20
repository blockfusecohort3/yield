import { useState } from "react";

export default function AddFarm() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [farmLocation, setFarmLocation] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [farmValuation, setFarmValuation] = useState("");
  const [farmImage, setFarmImage] = useState(null);
  const [fileKey, setFileKey] = useState(Date.now());

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFarmImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You must be logged in!");
      return;
    }

    if (!farmLocation || !farmImage || !farmSize || !farmValuation) {
      alert("Please provide all farm details.");
      return;
    }

    const farms = JSON.parse(localStorage.getItem("farms")) || [];

    const newFarm = {
      id: Date.now(),
      farmerName: currentUser.fullName || `${currentUser.firstName} ${currentUser.lastName}`,
      farmLocation,
      farmSize,
      farmValuation,
      farmImage,
    };

    localStorage.setItem("farms", JSON.stringify([...farms, newFarm]));

    setFarmLocation("");
    setFarmSize("");
    setFarmValuation("");
    setFarmImage(null);
    setFileKey(Date.now());
    alert("Farm added successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-green-800 text-center">
          Add a New Farm
        </h2>
        <p className="text-gray-500 text-center">
          Fill in your farm details below
        </p>

        <input
          type="text"
          placeholder="Farm Location"
          value={farmLocation}
          onChange={(e) => setFarmLocation(e.target.value)}
          required
          className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="text"
          placeholder="Farm Size (e.g., 2 acres)"
          value={farmSize}
          onChange={(e) => setFarmSize(e.target.value)}
          required
          className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="number"
          placeholder="Initial Valuation (₦)"
          value={farmValuation}
          onChange={(e) => setFarmValuation(e.target.value)}
          required
          className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          key={fileKey}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {farmImage && (
          <img
            src={farmImage}
            alt={`Farm at ${farmLocation}`}
            className="h-48 w-full object-cover rounded-xl shadow-md"
          />
        )}

        <button
          type="submit"
          className="bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition-all shadow-md"
        >
          Add Farm
        </button>
      </form>
    </div>
  );
}
