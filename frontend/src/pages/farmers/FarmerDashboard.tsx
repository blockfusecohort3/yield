import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";
import { Leaf, Plus, Trash2, User, DollarSign, Layers, MapPin } from "lucide-react";

// -------------------- Types --------------------
interface Farm {
  id: number;
  farmerId: number;
  name: string;
  crop: string;
  budget: number;
  farmSize: number;
  totalShares: number;
  sharePrice: number;
  durationDays: number;
  description: string;
  growth: number;
  image?: string;
  status: "active" | "pending" | "completed";
}

interface Farmer {
  id: number;
  firstName: string;
  lastName: string;
  kycCompleted: boolean;
  location?: string;
  phone?: string;
}

// -------------------- Farmer Dashboard --------------------
export default function FarmerDashboard() {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [showAddFarm, setShowAddFarm] = useState(false);

  // Modal inputs
  const [budget, setBudget] = useState<number>(0);
  const [farmSize, setFarmSize] = useState<number>(0);
  const [totalShares, setTotalShares] = useState<number>(0);
  const [durationDays, setDurationDays] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // Load data
  useEffect(() => {
    const storedFarmer = localStorage.getItem("currentFarmer");
    if (storedFarmer) setFarmer(JSON.parse(storedFarmer));

    const storedFarms = JSON.parse(localStorage.getItem("allFarms") || "[]");
    if (storedFarms && storedFarmer) {
      const f: Farmer = JSON.parse(storedFarmer);
      setFarms(storedFarms.filter((farm: Farm) => farm.farmerId === f.id));
    }
  }, []);

  const handleAddFarm = () => {
    if (!budget || !farmSize || !totalShares || !durationDays || !description) {
      setShake(true);
      toast.error("Please fill all fields correctly!");
      setTimeout(() => setShake(false), 600);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const sharePrice = Math.floor(budget / totalShares);
      const newFarm: Farm = {
        id: Date.now(),
        farmerId: farmer!.id,
        name: description.split(" ")[0] + " Farm",
        crop: description.split(" ")[1] || "Unknown",
        budget,
        farmSize,
        totalShares,
        sharePrice,
        durationDays,
        description,
        growth: Math.floor(Math.random() * 50) + 10,
        status: "active",
      };

      const updatedFarms = [...farms, newFarm];
      setFarms(updatedFarms);

      const allFarms: Farm[] = JSON.parse(localStorage.getItem("allFarms") || "[]");
      localStorage.setItem("allFarms", JSON.stringify([...allFarms, newFarm]));

      setBudget(0);
      setFarmSize(0);
      setTotalShares(0);
      setDurationDays(0);
      setDescription("");
      setShowAddFarm(false);
      setLoading(false);

      toast.success("Farm added successfully! 🌱");
    }, 5000);
  };

  const handleDeleteFarm = (id: number) => {
    const updated = farms.filter(f => f.id !== id);
    setFarms(updated);
    const allFarms: Farm[] = JSON.parse(localStorage.getItem("allFarms") || "[]");
    localStorage.setItem("allFarms", JSON.stringify(allFarms.filter(f => f.id !== id)));
    toast.success("Farm deleted successfully!");
  };

  if (!farmer) return <p className="text-center mt-20 text-gray-500">No farmer logged in!</p>;

  return (
    <div className="min-h-screen flex">
      <Toaster richColors position="top-center" closeButton />

      {/* Sidebar */}
      <aside className="w-80 bg-white shadow-xl p-6 flex flex-col justify-between h-screen relative left-20">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-700 text-white w-12 h-12 flex items-center justify-center rounded-full font-bold text-xl">
              {farmer.firstName[0]}{farmer.lastName[0]}
            </div>
            <div>
              <h2 className="font-bold text-lg text-green-700">{farmer.firstName} {farmer.lastName}</h2>
              <p className="text-gray-500 text-sm">{farmer.location || "Unknown location"}</p>
              <p className="text-gray-500 text-sm">{farmer.phone || "No phone"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p>Total Farms: {farms.length}</p>
            <p>Total Shares: {farms.reduce((acc, f) => acc + f.totalShares, 0)}</p>
            <p>Price per Share: ₦{farms.length ? farms[farms.length - 1].sharePrice : 0}</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-16 mx-20 rounded-xl bg-green-100 p-6 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-700">🌾 My Farms Dashboard</h1>
          <button 
            onClick={() => setShowAddFarm(true)}
            className="flex items-center gap-2 bg-green-700 text-white py-2 px-4 rounded-full hover:bg-green-800 transition"
          >
            <Plus size={16} /> Add Farm
          </button>
        </div>

        {/* Farms Grid */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {farms.length === 0 &&
          <motion.div
  className="col-span-full flex flex-col items-center justify-center mt-10 p-6 bg-green-50 rounded-2xl shadow-md"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <Leaf size={48} className="text-green-500 mb-4 animate-bounce" />
  <h3 className="text-xl font-bold text-green-700 mb-2">No Farms Yet!</h3>
  <p className="text-gray-500 text-center mb-4">
    🌱 Start by adding your first farm to track growth, investors, and shares. Your farm dashboard will come alive here!
  </p>
  <button
    onClick={() => setShowAddFarm(true)}
    className="flex items-center gap-2 bg-green-700 text-white py-2 px-4 rounded-full hover:bg-green-800 transition"
  >
    <Plus size={16} /> Add First Farm
  </button>
</motion.div>

        }
          {farms.map(farm => (
            <motion.div
              key={farm.id}
              className="bg-white p-4 rounded-2xl shadow-lg flex flex-col gap-3 hover:scale-105 transition-all cursor-pointer relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-green-700 flex items-center gap-2"><Leaf size={18} /> {farm.name}</h3>
                <button onClick={() => handleDeleteFarm(farm.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-gray-600">{farm.description}</p>

              <motion.div className="w-full bg-gray-200 h-3 rounded-full mt-2 overflow-hidden">
                <motion.div
                  className={`h-3 rounded-full ${farm.growth >= 75 ? "bg-green-500 shadow-lg" : farm.growth >= 50 ? "bg-yellow-500" : "bg-gray-400"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${farm.growth}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </motion.div>
              <p className="text-sm text-gray-500 mt-1">{farm.growth}% grown</p>
              <p className="text-sm text-gray-500 mt-1">Price per Share: ₦{farm.sharePrice}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Add Farm Modal */}
      {showAddFarm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className={`bg-white p-6 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4 ${shake ? "animate-shake border-2 border-red-500" : ""}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-green-700 text-center">Add New Farm</h2>

            <div className="flex flex-col gap-4">
              {/* Budget */}
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-500">Set the total budget you plan to invest in this farm (in Naira).</p>
                <div className="relative">
                  <DollarSign size={16} className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Budget (₦)"
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value))}
                    className="w-full pl-10 p-2 border rounded-xl focus:outline-none focus:ring focus:ring-green-400"
                  />
                </div>
              </div>

              {/* Farm Size */}
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-500">Enter the size of your farm in hectares.</p>
                <div className="relative">
                  <Layers size={16} className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Farm Size (hectares)"
                    value={farmSize}
                    onChange={e => setFarmSize(Number(e.target.value))}
                    className="w-full pl-10 p-2 border rounded-xl focus:outline-none focus:ring focus:ring-green-400"
                  />
                </div>
              </div>

              {/* Total Shares */}
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-500">Number of shares you want to divide your farm into for investors.</p>
                <div className="relative">
                  <DollarSign size={16} className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Total Shares"
                    value={totalShares}
                    onChange={e => setTotalShares(Number(e.target.value))}
                    className="w-full pl-10 p-2 border rounded-xl focus:outline-none focus:ring focus:ring-green-400"
                  />
                </div>
              </div>

              {/* Duration Days */}
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-500">Duration of your farm project in days.</p>
                <div className="relative">
                  <MapPin size={16} className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Duration (Days)"
                    value={durationDays}
                    onChange={e => setDurationDays(Number(e.target.value))}
                    className="w-full pl-10 p-2 border rounded-xl focus:outline-none focus:ring focus:ring-green-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-500">Write a brief description of your farm, crops, or special notes for investors.</p>
                <div className="relative">
                  <User size={16} className="absolute top-3 left-3 text-gray-400" />
                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full pl-10 p-2 border rounded-xl focus:outline-none focus:ring focus:ring-green-400"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => setShowAddFarm(false)}
                className="flex-1 bg-gray-400 text-white py-2 rounded-xl hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFarm}
                className="flex-1 bg-green-700 text-white py-2 rounded-xl hover:bg-green-800 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"/>
                    </svg>
                    Evaluating...
                  </>
                ) : "Add Farm"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
