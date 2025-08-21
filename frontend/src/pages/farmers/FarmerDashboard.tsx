import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";
import { Wallet, Leaf, CheckCircle, AlertCircle, Star, Plus } from "lucide-react";

interface Farmer {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  rating: number;
  kycCompleted: boolean;
  walletAddress: string;
}

interface Farm {
  id: number;
  farmerName: string;
  farmLocation: string;
  farmSize: string;
  valuePerShare: string;
  totalShares: string;
  availableShares: string;
  farmImage: string;
}

export default function FarmerDashboard() {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [showAddFarm, setShowAddFarm] = useState(false);

useEffect(() => {
  const currentUserRaw = localStorage.getItem("currentUser");
  if (currentUserRaw) {
    const currentUser = JSON.parse(currentUserRaw);
    setFarmer({
      ...currentUser,
      walletAddress: currentUser.walletAddress || "",
    });
    const storedFarms = JSON.parse(localStorage.getItem("farms") || "[]");
    setFarms(storedFarms);
  } else {
    setFarmer(null); // important to avoid crash
    toast.error("No farmer found! Please register first.");
  }
}, []);


  const initials = farmer
    ? `${farmer.firstName[0]}${farmer.lastName[0]}`.toUpperCase()
    : "";

  return (
    <>
      <Toaster richColors position="top-center" closeButton />
      <div className="min-h-screen bg-green-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow">
            <h1 className="text-2xl font-bold text-green-700">
              🌾 Welcome, {farmer?.firstName} {farmer?.lastName}
            </h1>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-gray-200 rounded-full font-semibold text-gray-700">
                {farmer?.walletAddress || "No Wallet Address"}
              </div>
            </div>
          </div>

          {/* Profile & KYC */}
          <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold">
                {initials}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{farmer?.firstName} {farmer?.lastName}</h2>
                <p className="text-gray-600">{farmer?.address}</p>
                <div className="flex items-center gap-2 mt-2">
                  {farmer?.kycCompleted ? (
                    <>
                      <CheckCircle className="text-green-600" size={18} />
                      <span className="text-green-600 font-medium">KYC Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="text-yellow-600" size={18} />
                      <span className="text-yellow-600 font-medium">KYC Pending</span>
                    </>
                  )}
                </div>
                <div className="flex items-center mt-2">
                  {[...Array(farmer?.rating || 0)].map((_, i) => (
                    <Star key={i} className="text-yellow-500" size={18} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Add Farm Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddFarm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition"
            >
              <Plus size={18} /> Add New Farm
            </button>
          </div>

          {/* Farms */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Leaf size={24} /> My Farms
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {farms.length === 0 && <p className="text-gray-500">No farms listed yet.</p>}
              {farms.map((farm) => (
                <div key={farm.id} className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Leaf size={18} /> {farm.farmLocation}
                  </h3>
                  <p className="text-gray-500">Size: {farm.farmSize}</p>
                  <p className="text-gray-500">Value per Share: ₦{farm.valuePerShare}</p>
                  <p className="text-gray-500">Total Shares: {farm.totalShares}</p>
                  <p className="text-gray-500">Available Shares: {farm.availableShares}</p>
                  {farm.farmImage && (
                    <img
                      src={farm.farmImage}
                      alt={`Farm at ${farm.farmLocation}`}
                      className="mt-2 h-48 w-full object-cover rounded-xl shadow-md"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AddFarm Modal */}
      {showAddFarm && (
        <AddFarm
          closeModal={() => setShowAddFarm(false)}
          onFarmAdded={(newFarm: Farm) => setFarms([...farms, newFarm])}
        />
      )}
    </>
  );
}

// ------------------- AddFarm Component -------------------
interface AddFarmProps {
  closeModal: () => void;
  onFarmAdded: (farm: Farm) => void;
}

function AddFarm({ closeModal, onFarmAdded }: AddFarmProps) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [valuePerShare, setValuePerShare] = useState("");
  const [totalShares, setTotalShares] = useState("");
  const [availableShares, setAvailableShares] = useState("");
  const [farmImage, setFarmImage] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState(Date.now());
  const [errors, setErrors] = useState<any>({});

  const shake = {
    initial: { x: 0 },
    animate: {
      x: [0, -6, 6, -6, 6, 0],
      transition: { duration: 0.4 },
    },
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFarmImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return toast.error("You must be logged in!");

    const newErrors = {
      farmLocation: !farmLocation.trim(),
      farmSize: !farmSize.trim(),
      valuePerShare: !valuePerShare.trim(),
      totalShares: !totalShares.trim(),
      availableShares: !availableShares.trim(),
      farmImage: !farmImage,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return toast.error("Please fill all fields.");

    const newFarm: Farm = {
      id: Date.now(),
      farmerName: `${currentUser.firstName} ${currentUser.lastName}`,
      farmLocation,
      farmSize,
      valuePerShare,
      totalShares,
      availableShares,
      farmImage: farmImage!,
    };

    const existingFarms = JSON.parse(localStorage.getItem("farms") || "[]");
    localStorage.setItem("farms", JSON.stringify([...existingFarms, newFarm]));
    onFarmAdded(newFarm);

    // Reset
    setFarmLocation("");
    setFarmSize("");
    setValuePerShare("");
    setTotalShares("");
    setAvailableShares("");
    setFarmImage(null);
    setFileKey(Date.now());
    setErrors({});
    toast.success("Farm added successfully! 🌱");
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6 relative"
      >
        <button
          type="button"
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 font-bold"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-green-800 text-center">
          Add a New Farm
        </h2>
        <p className="text-gray-500 text-center">Fill in your farm details below</p>

        {["farmLocation", "farmSize", "valuePerShare", "totalShares", "availableShares"].map((field) => {
          const placeholders: any = {
            farmLocation: "Farm Location",
            farmSize: "Farm Size (e.g., 2 acres)",
            valuePerShare: "Value per Share (₦)",
            totalShares: "Total Shares",
            availableShares: "Available Shares",
          };
          const setters: any = {
            farmLocation: setFarmLocation,
            farmSize: setFarmSize,
            valuePerShare: setValuePerShare,
            totalShares: setTotalShares,
            availableShares: setAvailableShares,
          };
          const values: any = {
            farmLocation,
            farmSize,
            valuePerShare,
            totalShares,
            availableShares,
          };
          return (
            <motion.input
              key={field}
              type={field.includes("Share") ? "number" : "text"}
              placeholder={placeholders[field]}
              value={values[field]}
              onChange={(e) => setters[field](e.target.value)}
              variants={shake}
              initial="initial"
              animate={errors[field] ? "animate" : "initial"}
              className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${
                errors[field]
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-green-400"
              }`}
            />
          );
        })}

        <motion.input
          key={fileKey}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          variants={shake}
          initial="initial"
          animate={errors.farmImage ? "animate" : "initial"}
          className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${
            errors.farmImage
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-green-400"
          }`}
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
          className="bg-green-700 text-white py-3 rounded-full font-semibold hover:bg-green-800 transition-all shadow-md"
        >
          Add Farm
        </button>
      </form>
    </div>
  );
}
