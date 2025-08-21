import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

export default function InvestorKyc() {
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
  const [pendingInvestor, setPendingInvestor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const investor = JSON.parse(localStorage.getItem("pendingInvestor"));
    if (!investor) {
      toast.error("No pending investor found. Please register first.", {
        icon: <XCircle className="text-red-500" />,
      });
      navigate("/register");
    } else {
      setPendingInvestor(investor);
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

    if (!pendingInvestor) return;

    const completedInvestor = {
      ...pendingInvestor,
      ...form,
      kycCompleted: true,
    };

    const existingInvestors = JSON.parse(localStorage.getItem("investors")) || [];
    localStorage.setItem(
      "investors",
      JSON.stringify([...existingInvestors, completedInvestor])
    );

    localStorage.removeItem("pendingInvestor");

    toast.success("KYC submitted successfully 🎉 Investor verified!", {
      icon: <CheckCircle className="text-green-500" />,
    });

    navigate("/dashboard");
  };

  const shake = {
    initial: { x: 0 },
    animate: { x: [0, -6, 6, -6, 6, 0], transition: { duration: 0.4 } },
  };

  return (
      
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl w-full max-w-4xl p-8 overflow-hidden"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-green-800">
            Investor KYC 🔒
          </h1>
          <p className="text-gray-600 mt-2">
            Please complete your KYC to activate your investment dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* Optional Upload */}
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

          {/* Submit */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="w-full bg-green-700 text-white py-3 rounded-full hover:bg-green-800 transition font-semibold shadow-md"
          >
            Submit KYC
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
