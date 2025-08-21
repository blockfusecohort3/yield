import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Wallet,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  LogOut,
  Leaf,
} from "lucide-react";

export default function InvestorDashboard() {
  const [investor, setInvestor] = useState(null);
  const [investments, setInvestments] = useState([]);
  const navigate = useNavigate();

  // Load investor & investments data from localStorage
  useEffect(() => {
    const storedInvestor = JSON.parse(localStorage.getItem("currentInvestor"));
    const storedInvestments = JSON.parse(localStorage.getItem("investments")) || [];
    const farms = JSON.parse(localStorage.getItem("farms")) || [];

    if (storedInvestor) {
      setInvestor(storedInvestor);

      // Join investments with farms info
      const myInvestments = storedInvestments
        .filter((i) => i.investorId === storedInvestor.id)
        .map((i) => ({
          ...i,
          farm: farms.find((f) => f.id === i.farmId),
        }));

      setInvestments(myInvestments);
    } else {
      navigate("/investors-register"); // if no investor found, go register
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentInvestor");
    navigate("/");
  };

  if (!investor) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
          <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">
            <User className="text-green-600" /> Welcome, {investor.fullName}
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 border border-red-400 px-4 py-2 rounded-xl hover:bg-red-50"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Profile Section */}
        <motion.div
          className="mt-6 bg-green-50 rounded-xl p-4 shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold text-green-700 mb-2">Profile</h2>
          <p><span className="font-medium">Email:</span> {investor.email}</p>
          <p><span className="font-medium">Phone:</span> {investor.phone}</p>
          <p className="mt-2 flex items-center gap-2">
            {investor.verified ? (
              <>
                <CheckCircle className="text-green-600" size={18} />
                <span className="text-green-600">KYC Verified</span>
              </>
            ) : (
              <>
                <AlertCircle className="text-yellow-600" size={18} />
                <span className="text-yellow-600">KYC Pending</span>
                <Link
                  to="/investor-kyc"
                  className="ml-2 text-sm text-blue-600 underline"
                >
                  Update KYC
                </Link>
              </>
            )}
          </p>
        </motion.div>

        {/* Investments Section */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold text-green-700 mb-3">
            My Investments
          </h2>
          {investments.length === 0 ? (
            <p className="text-gray-500">No investments yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {investments.map((inv) => (
                <div
                  key={inv.id}
                  className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-green-700 flex items-center gap-2">
                    <Leaf size={18} /> {inv.farm?.farmLocation || "Unknown Farm"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Amount: ₦{inv.amount}
                  </p>
                  <p className="text-sm text-gray-600">
                    Shares: {inv.sharesBought}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span
                      className={`${
                        inv.status === "active"
                          ? "text-green-600"
                          : "text-gray-500"
                      } font-medium`}
                    >
                      {inv.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Earnings Section */}
        <motion.div
          className="mt-6 bg-green-50 rounded-xl p-4 shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
            <TrendingUp /> Earnings & Returns
          </h2>
          <p className="text-gray-500">
            Coming soon: Track ROI, dividends, and payouts.
          </p>
        </motion.div>

        {/* Available Farms Shortcut */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/farms-list"
            className="block w-full text-center bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
          >
            Browse Available Farms 🌱
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
