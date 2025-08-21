import { useEffect, useState } from "react";
import { Wallet, Leaf, CheckCircle, AlertCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

interface Farmer {
  id: number;
  firstName: string;
  lastName: string;
  rating: number;
  kycCompleted: boolean;
}

interface Investment {
  id: number;
  farmer: Farmer;
  amount: number;
  status: "pending" | "active" | "completed";
}

interface Investor {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  verified: boolean;
  walletAddress: string;
  investments: Investment[];
}

export default function InvestorDashboard() {
  const [investor, setInvestor] = useState<Investor | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch investors from localStorage
    const investors: Investor[] = JSON.parse(localStorage.getItem("investors") || "[]");
    if (!investors.length) {
      toast.error("No investor data found! Please register first.");
      navigate("/investors/register");
      return;
    }
    const lastInvestor = investors[investors.length - 1];
    setInvestor({
      ...lastInvestor,
      walletAddress: lastInvestor.walletAddress || `0x${Math.random().toString(16).substr(2, 8)}...`,
      investments: lastInvestor.investments || [],
    });
  }, [navigate]);

  const handleAddInvestment = () => {
    if (!investor) return;

    const newInvestment: Investment = {
      id: Date.now(),
      farmer: {
        id: Date.now(),
        firstName: "John",
        lastName: "Doe",
        rating: 4,
        kycCompleted: true,
      },
      amount: Math.floor(Math.random() * 100000) + 10000,
      status: "active",
    };

    const updatedInvestor = {
      ...investor,
      investments: [...investor.investments, newInvestment],
    };

    setInvestor(updatedInvestor);

    // Update in localStorage
    const allInvestors: Investor[] = JSON.parse(localStorage.getItem("investors") || "[]");
    const index = allInvestors.findIndex((i) => i.id === investor.id);
    allInvestors[index] = updatedInvestor;
    localStorage.setItem("investors", JSON.stringify(allInvestors));

    toast.success("Investment added successfully!");
  };

  if (!investor) return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  const initials = investor.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const totalInvested = investor.investments.reduce((acc, inv) => acc + inv.amount, 0);

  return (
    <>
      <Toaster richColors position="top-center" closeButton />
      <div className="min-h-screen bg-green-50 p-4">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow">
            <h1 className="text-3xl font-bold text-green-700">💰 Welcome, {investor.fullName}</h1>
            <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-full font-semibold text-gray-700">
              {investor.walletAddress}
            </div>
          </div>

          {/* Profile & Verification */}
          <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold">
                {initials}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{investor.fullName}</h2>
                <p className="text-gray-600">{investor.email}</p>
                <p className="text-gray-600">{investor.phone}</p>
                <div className="flex items-center gap-2 mt-2">
                  {investor.verified ? (
                    <>
                      <CheckCircle className="text-green-600" size={18} />
                      <span className="text-green-600 font-medium">Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="text-yellow-600" size={18} />
                      <span className="text-yellow-600 font-medium">Pending Verification</span>
                    </>
                  )}
                </div>
                <div className="flex items-center mt-2">
                  {[...Array(investor.investments.length ? 5 : 0)].map((_, i) => (
                    <Star key={i} className="text-yellow-500" size={16} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Finance Summary */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
              <Wallet className="text-green-600 mb-2" size={32} />
              <h3 className="font-semibold">Total Invested</h3>
              <p className="text-green-700 text-xl font-bold">₦{totalInvested}</p>
              <button
                onClick={handleAddInvestment}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Add Investment
              </button>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
              <h3 className="font-semibold">Active Investments</h3>
              <p className="text-blue-700 text-xl font-bold">
                {investor.investments.filter((i) => i.status === "active").length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
              <h3 className="font-semibold">Completed Investments</h3>
              <p className="text-yellow-700 text-xl font-bold">
                {investor.investments.filter((i) => i.status === "completed").length}
              </p>
            </div>
          </div>

          {/* Investments List */}
          <div>
            <h2 className="text-xl font-semibold mb-4">📊 My Investments</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {investor.investments.length === 0 && (
                <p className="text-gray-500">You haven't invested in any farms yet.</p>
              )}
              {investor.investments.map((inv) => (
                <div key={inv.id} className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Leaf size={18} /> {inv.farmer.firstName} {inv.farmer.lastName}'s Farm
                  </h3>
                  <p className="text-gray-500">Amount: ₦{inv.amount}</p>
                  <p
                    className={`mt-1 font-medium ${
                      inv.status === "active"
                        ? "text-green-600"
                        : inv.status === "pending"
                        ? "text-yellow-600"
                        : "text-gray-500"
                    }`}
                  >
                    Status: {inv.status}
                  </p>
                  <div className="flex mt-1">
                    {[...Array(inv.farmer.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-500" size={16} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
