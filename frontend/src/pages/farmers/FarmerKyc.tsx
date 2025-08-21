import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner"; 
import { CheckCircle, XCircle } from "lucide-react"; 

export default function FarmerKyc() {
  const [form, setForm] = useState({
    dob: "",
    nationalId: "",
    address: "",
    idDocument: null,
  });
  const [errors, setErrors] = useState({
    dob: false,
    nationalId: false,
    address: false,
  });
  const [pendingFarmer, setPendingFarmer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const farmer = JSON.parse(localStorage.getItem("pendingFarmer"));
    if (!farmer) {
      toast.error("No pending farmer found. Please register first.", {
        icon: <XCircle className="text-red-500" />,
      });
      navigate("/farmers/register");
    } else {
      setPendingFarmer(farmer);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      dob: form.dob.trim() === "",
      nationalId: form.nationalId.trim() === "",
      address: form.address.trim() === "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) {
      toast.error("Please fill in all required fields.", {
        icon: <XCircle className="text-red-500" />,
      });
      return;
    }

    if (!pendingFarmer) return;

    const completedFarmer = {
      ...pendingFarmer,
      ...form,
      kycCompleted: true,
      role: "farmer",
    };

    const existingFarmers = JSON.parse(localStorage.getItem("farmers")) || [];
    localStorage.setItem(
      "farmers",
      JSON.stringify([...existingFarmers, completedFarmer])
    );

    localStorage.removeItem("pendingFarmer");

    toast.success("KYC submitted successfully 🌾 Farmer verified!", {
      icon: <CheckCircle className="text-green-500" />,
    });

    // Redirect to farmer dashboard
    navigate("/farmers/farmerDashboard");
  };

  const shake = {
    initial: { x: 0 },
    animate: {
      x: [0, -6, 6, -6, 6, 0],
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-green-800 flex items-center justify-center gap-2">
            🌾 Farmer KYC Verification

          </h1>
          <p className="text-gray-600 mt-2">
            Please complete your KYC to access the Farmer Dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* DOB */}
          <motion.div
            variants={shake}
            initial="initial"
            animate={errors.dob ? "animate" : "initial"}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg outline-none focus:ring ${
                errors.dob
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-green-500"
              }`}
            />
          </motion.div>

          {/* National ID */}
          <motion.div
            variants={shake}
            initial="initial"
            animate={errors.nationalId ? "animate" : "initial"}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              National ID / BVN / Passport No.
            </label>
            <input
              type="text"
              name="nationalId"
              value={form.nationalId}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg outline-none focus:ring ${
                errors.nationalId
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-green-500"
              }`}
            />
          </motion.div>

          {/* Address */}
          <motion.div
            variants={shake}
            initial="initial"
            animate={errors.address ? "animate" : "initial"}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Residential Address
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg outline-none focus:ring ${
                errors.address
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-green-500"
              }`}
            />
          </motion.div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload ID Document (optional)
            </label>
            <input
              type="file"
              name="idDocument"
              onChange={handleChange}
              className="w-full text-sm text-gray-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-full hover:bg-green-800 transition font-semibold"
          >
            Submit KYC
          </button>
        </form>
      </div>
    </div>
  );
}
