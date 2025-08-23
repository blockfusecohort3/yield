import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";
import { Leaf, Plus, CheckCircle, XCircle } from "lucide-react";

interface Farm {
  id: number;
  name: string;
  crop: string;
  growth: number;
  status: "active" | "pending" | "completed";
  image?: string;
  pricePerShare: number;
}

interface Investment {
  id: number;
  farm: Farm;
  shares: number;
}

interface Investor {
  id: number;
  fullName: string;
  email: string;
  kycCompleted: boolean;
  investments: Investment[];
}

export default function InvestorDashboard() {
  // Hardcoded investor info
  const [investor, setInvestor] = useState<Investor>({
    id: 1,
    fullName: "Clement Raymond",
    email: "clems@gmail.com",
    kycCompleted: true,
    investments: [],
  });

  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [shares, setShares] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch farms from localStorage if any
    const storedFarms = JSON.parse(localStorage.getItem("allFarms") || "[]");
    if (storedFarms) {
      const mappedFarms = storedFarms.map((f: any) => ({
        ...f,
        pricePerShare: f.sharePrice || Math.floor(f.budget / f.totalShares || 10),
      }));
      setFarms(mappedFarms);
    }
  }, []);

  const handleInvest = () => {
    if (!selectedFarm || shares <= 0) {
      toast.error("Enter valid shares!", { icon: <XCircle className="text-red-500" /> });
      return;
    }

    const newInvestment: Investment = {
      id: Date.now(),
      farm: selectedFarm,
      shares,
    };

    const updatedInvestor: Investor = {
      ...investor,
      investments: [...investor.investments, newInvestment],
    };

    setInvestor(updatedInvestor);
    localStorage.setItem("investor", JSON.stringify(updatedInvestor));
    toast.success(`Invested ${shares} shares in ${selectedFarm.name} 🌱`, {
      icon: <CheckCircle className="text-green-500" />,
    });
    setShowModal(false);
    setShares(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex flex-col lg:flex-row items-start justify-start max-w-7xl mx-auto p-6 gap-6">
      <Toaster richColors position="top-center" closeButton />

      {/* Investor Sidebar */}
      <motion.div
        className="lg:w-80  rounded-2xl gap-4 w-80 bg-white shadow-xl p-6 flex flex-col  h-screen relative right-44 bottom-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-green-700 text-center">Investor Dashboard</h2>

        <div className="text-left ml-6">
          <p className="text-gray-700 font-medium">{investor.fullName}</p>
          <p className="text-gray-500 text-sm">{investor.email}</p>
          <p className="text-gray-500 text-sm mt-1">
            KYC: {investor.kycCompleted ? "✅ Completed" : "❌ Pending"}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Total Investments: {investor.investments.length}
          </p>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 mb-2 text-center">My Investments</h3>
          {investor.investments.length === 0 ? (
            <div className="bg-green-50 p-4 rounded-xl text-center text-gray-500">
              You haven’t invested yet. 🌱
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
              {investor.investments.map((inv) => (
                <motion.div
                  key={inv.id}
                  className="bg-green-50 p-3 rounded-xl flex justify-between items-center shadow hover:shadow-md transition"
                  whileHover={{ scale: 1.03 }}
                >
                  <div>
                    <p className="font-semibold">{inv.farm.name}</p>
                    <p className="text-sm text-gray-600">Crop: {inv.farm.crop}</p>
                  </div>
                  <span className="font-bold">{inv.shares} shares</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Marketplace */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.length === 0 ? (
          <motion.div
            className="col-span-full flex flex-col items-center justify-center mt-10 p-6 bg-white rounded-2xl shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Leaf size={48} className="text-green-500 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-green-700 mb-2">No Farms Available!</h3>
            <p className="text-gray-500 text-center mb-4">
              Farms will appear here once farmers add them. Keep an eye out for new investment opportunities! 🌱
            </p>
          </motion.div>
        ) : (
          farms.map((farm) => (
            <motion.div
              key={farm.id}
              className="bg-white p-4 rounded-2xl shadow hover:shadow-md transition flex flex-col gap-2 cursor-pointer"
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Leaf size={18} /> {farm.name}
              </h3>
              <p className="text-gray-600 text-sm">Crop: {farm.crop}</p>
              {farm.image && (
                <img
                  src={farm.image}
                  alt={farm.name}
                  className="w-full h-40 object-cover rounded-lg shadow mt-2"
                />
              )}
              <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full ${
                    farm.growth >= 75
                      ? "bg-green-600"
                      : farm.growth >= 50
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                  }`}
                  style={{ width: `${farm.growth}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1 font-medium">Growth: {farm.growth}%</p>
              <p className="text-sm mt-1 font-medium">Price/Share: ₦{farm.pricePerShare}</p>
              <p
                className={`text-sm mt-1 font-medium ${
                  farm.status === "active"
                    ? "text-green-600"
                    : farm.status === "pending"
                    ? "text-yellow-600"
                    : "text-gray-500"
                }`}
              >
                Status: {farm.status}
              </p>

              <button
                onClick={() => {
                  setSelectedFarm(farm);
                  setShowModal(true);
                }}
                className="mt-2 bg-green-700 text-white py-2 rounded-full hover:bg-green-800 transition flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Invest
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Investment Modal */}
      {showModal && selectedFarm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-green-700 text-center">
              Invest in {selectedFarm.name}
            </h2>
            <p className="text-gray-500 text-sm text-center">
              Crop: {selectedFarm.crop} | Growth: {selectedFarm.growth}% | Price/Share: ₦{selectedFarm.pricePerShare}
            </p>
            <input
              type="number"
              placeholder="Number of shares"
              value={shares}
              onChange={(e) => setShares(Number(e.target.value))}
              className="border p-3 rounded-xl w-full focus:outline-none focus:ring focus:ring-green-400"
            />
            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-400 text-white py-2 rounded-full hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleInvest}
                className="flex-1 bg-green-700 text-white py-2 rounded-full hover:bg-green-800 transition"
              >
                Invest
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
