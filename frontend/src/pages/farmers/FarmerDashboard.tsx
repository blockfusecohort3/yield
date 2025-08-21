import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Leaf, CheckCircle, AlertCircle, LogOut, PlusCircle } from "lucide-react";

export default function FarmerDashboard() {
  const [farmer, setFarmer] = useState(null);
  const [farms, setFarms] = useState([]);
  const navigate = useNavigate();

  
  useEffect(() => {
    const storedFarmer = JSON.parse(localStorage.getItem("currentFarmer"));
    const storedFarms = JSON.parse(localStorage.getItem("farms")) || [];
    if (storedFarmer) {
      setFarmer(storedFarmer);
      setFarms(storedFarms.filter((f) => f.farmerId === storedFarmer.id));
    } else {
      navigate("/farmers-register"); 
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentFarmer");
    navigate("/");
  };

  if (!farmer) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-5xl mx-auto">
        
      
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
          <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">
            <User className="text-green-600" /> Welcome, {farmer.fullName}
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 border border-red-400 px-4 py-2 rounded-xl hover:bg-red-50"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        <motion.div
          className="mt-6 bg-green-50 rounded-xl p-4 shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold text-green-700 mb-2">Profile</h2>
          <p><span className="font-medium">Email:</span> {farmer.email}</p>
          <p><span className="font-medium">Phone:</span> {farmer.phone}</p>
          <p className="mt-2 flex items-center gap-2">
            {farmer.verified ? (
              <>
                <CheckCircle className="text-green-600" size={18} />
                <span className="text-green-600">KYC Verified</span>
              </>
            ) : (
              <>
                <AlertCircle className="text-yellow-600" size={18} />
                <span className="text-yellow-600">KYC Pending</span>
                <Link
                  to="/farmer-kyc"
                  className="ml-2 text-sm text-blue-600 underline"
                >
                  Update KYC
                </Link>
              </>
            )}
          </p>
        </motion.div>

        
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-green-700">My Farms</h2>
            <Link
              to="/list-farm"
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
            >
              <PlusCircle size={18} /> Add Farm
            </Link>
          </div>
          {farms.length === 0 ? (
            <p className="text-gray-500 mt-3">No farms listed yet.</p>
          ) : (
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {farms.map((farm) => (
                <div
                  key={farm.id}
                  className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-green-700 flex items-center gap-2">
                    <Leaf size={18} /> {farm.name}
                  </h3>
                  <p className="text-sm text-gray-600">Location: {farm.location}</p>
                  <p className="text-sm text-gray-600">Type: {farm.type}</p>
                  <p className="text-sm text-gray-600">Yield: {farm.expectedYield}</p>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      farm.status === "active" ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    Status: {farm.status || "pending"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        
        <motion.div
          className="mt-6 bg-green-50 rounded-xl p-4 shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-green-700 mb-3">
            Investments
          </h2>
          <p className="text-gray-500">Coming soon: Track which investors funded your farm.</p>
        </motion.div>
      </div>
    </div>
  );
}
