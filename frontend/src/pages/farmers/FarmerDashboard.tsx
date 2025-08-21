import { useState, useEffect } from "react";
import { Wallet, Leaf, CheckCircle, AlertCircle, Star, Plus } from "lucide-react";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";

interface Farm {
  id: number;
  name: string;
  crop: string;
  growth: number; // 0-100%
  status: "active" | "pending" | "completed";
}

interface Farmer {
  firstName: string;
  lastName: string;
  address: string;
  rating: number;
  kycCompleted: boolean;
  walletAddress: string;
}

export default function FarmerApp() {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [showAddFarm, setShowAddFarm] = useState(false);
  const [step, setStep] = useState<"register" | "kyc" | "dashboard">("register");

  const shake = {
    initial: { x: 0 },
    animate: { x: [0, -6, 6, -6, 6, 0], transition: { duration: 0.4 } },
  };

  useEffect(() => {
    const storedFarmer = localStorage.getItem("currentUser");
    const storedFarms = JSON.parse(localStorage.getItem("farms") || "[]");
    if (storedFarmer) {
      const f: Farmer = JSON.parse(storedFarmer);
      setFarmer(f);
      setFarms(storedFarms);
      setStep(f.kycCompleted ? "dashboard" : "kyc");
    }
  }, []);

  const handleRegister = (newFarmer: Farmer) => {
    localStorage.setItem("currentUser", JSON.stringify(newFarmer));
    setFarmer(newFarmer);
    setStep("kyc"); // automatically go to KYC
    toast.success("Registered successfully! Complete your KYC 🌱");
  };

  const handleKycComplete = (updatedFarmer: Farmer) => {
    localStorage.setItem("currentUser", JSON.stringify(updatedFarmer));
    setFarmer(updatedFarmer);
    setStep("dashboard");
    toast.success("KYC completed! ✅ Welcome to your dashboard");
  };

  const handleAddFarm = (newFarm: Farm) => {
    const updatedFarms = [...farms, newFarm];
    setFarms(updatedFarms);
    localStorage.setItem("farms", JSON.stringify(updatedFarms));
    toast.success("Farm added successfully! 🌱");
  };

  if (step === "register") return <RegisterFarmer onRegister={handleRegister} shake={shake} />;
  if (step === "kyc") return <KycForm farmer={farmer!} onComplete={handleKycComplete} shake={shake} />;
  return <Dashboard farmer={farmer!} farms={farms} showAddFarm={showAddFarm} setShowAddFarm={setShowAddFarm} onAddFarm={handleAddFarm} shake={shake} />;
}

// ---------- Registration ----------
function RegisterFarmer({ onRegister, shake }: any) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newErrors = {
      firstName: firstName.trim() === "",
      lastName: lastName.trim() === "",
      address: address.trim() === "",
      walletAddress: walletAddress.trim() === "",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      toast.error("Please fill all fields!");
      return;
    }

    onRegister({
      firstName,
      lastName,
      address,
      rating: 3,
      kycCompleted: false,
      walletAddress,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
      <form className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold text-green-700 text-center">Register Farmer</h2>
        <motion.input placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} variants={shake} initial="initial" animate={errors.firstName?"animate":"initial"} className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${errors.firstName?"border-red-500 focus:ring-red-400":"border-gray-300 focus:ring-green-400"}`} />
        <motion.input placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} variants={shake} initial="initial" animate={errors.lastName?"animate":"initial"} className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${errors.lastName?"border-red-500 focus:ring-red-400":"border-gray-300 focus:ring-green-400"}`} />
        <motion.input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} variants={shake} initial="initial" animate={errors.address?"animate":"initial"} className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${errors.address?"border-red-500 focus:ring-red-400":"border-gray-300 focus:ring-green-400"}`} />
        <motion.input placeholder="Wallet Address" value={walletAddress} onChange={e => setWalletAddress(e.target.value)} variants={shake} initial="initial" animate={errors.walletAddress?"animate":"initial"} className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${errors.walletAddress?"border-red-500 focus:ring-red-400":"border-gray-300 focus:ring-green-400"}`} />
        <button type="submit" className="bg-green-700 text-white py-3 rounded-full font-semibold hover:bg-green-800 transition-all shadow-md mt-2">Register</button>
      </form>
      <Toaster richColors position="top-center" closeButton />
    </div>
  );
}

// ---------- KYC ----------
function KycForm({ farmer, onComplete, shake }: any) {
  const [kyc, setKyc] = useState(farmer.kycCompleted);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!kyc) {
      toast.error("Please complete KYC to proceed!");
      return;
    }
    onComplete({ ...farmer, kycCompleted: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-6">
      <form className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold text-yellow-700 text-center">KYC Verification</h2>
        <p className="text-gray-600 text-center">Please confirm your KYC to continue to the dashboard.</p>
        <motion.input type="checkbox" checked={kyc} onChange={e => setKyc(e.target.checked)} className="h-5 w-5" />
        <span>I confirm my KYC is complete</span>
        <button type="submit" className="bg-yellow-600 text-white py-3 rounded-full font-semibold hover:bg-yellow-700 transition-all shadow-md mt-2">Submit KYC</button>
      </form>
      <Toaster richColors position="top-center" closeButton />
    </div>
  );
}

// ---------- Dashboard ----------
function Dashboard({ farmer, farms, showAddFarm, setShowAddFarm, onAddFarm, shake }: any) {
  const initials = `${farmer.firstName[0]}${farmer.lastName[0]}`.toUpperCase();

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow">
          <h1 className="text-2xl font-bold text-green-700">
            🌾 Welcome, {farmer.firstName} {farmer.lastName}
          </h1>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-gray-200 rounded-full font-semibold text-gray-700">{farmer.walletAddress}</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold">{initials}</div>
            <div>
              <h2 className="text-xl font-semibold">{farmer.firstName} {farmer.lastName}</h2>
              <p className="text-gray-600">{farmer.address}</p>
              <div className="flex items-center gap-2 mt-2">
                {farmer.kycCompleted ? (
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
                {[...Array(farmer.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-500" size={18} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Farms Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2"><Leaf size={22} /> My Farms</h2>
            <button onClick={() => setShowAddFarm(true)} className="flex items-center gap-1 bg-green-700 text-white px-4 py-2 rounded-xl hover:bg-green-800 transition">
              <Plus size={16} /> Add Farm
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {farms.length === 0 && <p className="text-gray-500">No farms listed yet.</p>}
            {farms.map(farm => (
              <div key={farm.id} className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
                <h3 className="font-bold text-lg flex items-center gap-2"><Leaf size={18} /> {farm.name}</h3>
                <p className="text-gray-500">Crop: {farm.crop}</p>
                <div className="mt-2 w-full bg-gray-200 h-2 rounded-full">
                  <div className={`h-2 rounded-full ${farm.growth >= 75 ? "bg-green-600" : farm.growth >= 50 ? "bg-yellow-500" : "bg-gray-400"}`} style={{width:`${farm.growth}%`}}></div>
                </div>
                <p className="mt-2 text-sm font-medium">Growth: {farm.growth}%</p>
                <p className={`mt-1 text-sm font-medium ${farm.status==="active"?"text-green-600":farm.status==="pending"?"text-yellow-600":"text-gray-500"}`}>Status: {farm.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddFarm && <AddFarmModal close={() => setShowAddFarm(false)} onAdd={onAddFarm} shake={shake} />}
      <Toaster richColors position="top-center" closeButton />
    </div>
  );
}

// ---------- Add Farm Modal ----------
function AddFarmModal({ close, onAdd, shake }: any) {
  const [name, setName] = useState("");
  const [crop, setCrop] = useState("");
  const [growth, setGrowth] = useState("");
  const [status, setStatus] = useState<"active"|"pending"|"completed">("active");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newErrors = { name:name.trim()==="", crop:crop.trim()==="", growth:growth.trim()=="" };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)){ toast.error("Please fill all fields!"); return;}
    onAdd({ id:Date.now(), name, crop, growth:parseInt(growth), status });
    setName(""); setCrop(""); setGrowth(""); setStatus("active"); close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4">
        <h2 className="text-xl font-bold text-green-700 text-center">Add Farm</h2>
        <motion.input type="text" placeholder="Farm Name" value={name} onChange={e=>setName(e.target.value)} variants={shake} initial="initial" animate={errors.name?"animate":"initial"} className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${errors.name?"border-red-500 focus:ring-red-400":"border-gray-300 focus:ring-green-400"}`} />
        <motion.input type="text" placeholder="Crop" value={crop} onChange={e=>setCrop(e.target.value)} variants={shake} initial="initial" animate={errors.crop?"animate":"initial"} className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${errors.crop?"border-red-500 focus:ring-red-400":"border-gray-300 focus:ring-green-400"}`} />
        <motion.input type="number" placeholder="Growth (%)" value={growth} onChange={e=>setGrowth(e.target.value)} variants={shake} initial="initial" animate={errors.growth?"animate":"initial"} className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${errors.growth?"border-red-500 focus:ring-red-400":"border-gray-300 focus:ring-green-400"}`} />
        <select className="border p-3 rounded-xl focus:outline-none focus:ring w-full" value={status} onChange={e=>setStatus(e.target.value as any)}>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <div className="flex justify-between gap-4 mt-2">
          <button type="button" onClick={close} className="flex-1 bg-gray-400 text-white py-2 rounded-xl hover:bg-gray-500 transition">Cancel</button>
          <button type="submit" className="flex-1 bg-green-700 text-white py-2 rounded-xl hover:bg-green-800 transition">Add Farm</button>
        </div>
      </form>
    </div>
  );
}
