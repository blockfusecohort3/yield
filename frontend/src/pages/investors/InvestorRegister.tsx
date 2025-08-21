import { useState } from "react";
import { User, Mail, Phone, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function InvestorRegister() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    fullName: false,
    email: false,
    phone: false,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const validate = () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
    const phoneOk = /^[0-9+\-\s()]{7,}$/.test(formData.phone.trim());

    const newErrors = {
      fullName: formData.fullName.trim() === "",
      email: !emailOk,
      phone: !phoneOk,
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) {
      toast.error("Please fix the highlighted fields.", {
        icon: <XCircle className="text-red-500" />,
      });
    }

    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const pendingInvestor = {
        id: Date.now(),
        ...formData,
        investments: [],
        verified: false,
      };

      await new Promise((r) => setTimeout(r, 1200));

      localStorage.setItem("pendingInvestor", JSON.stringify(pendingInvestor));

      toast.success("Investor registered successfully!", {
        icon: <CheckCircle className="text-green-600" />,
      });

      navigate("/investors/investorkyc");

    } catch (err) {
      console.error(err);
      toast.error("Registration failed. Please try again.", {
        icon: <XCircle className="text-red-500" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const shake = {
    initial: { x: 0 },
    animate: {
      x: [0, -6, 6, -6, 6, 0],
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl md:max-w-3xl lg:max-w-4xl p-4 sm:p-6 md:p-8 max-h-screen overflow-auto">

        {/* 🔙 Fixed back button */}
        <Link
          to="/farmers-register"
          className="flex w-60 items-center group space-x-2 bg-white border border-green-400 text-green-700 px-5 py-1 rounded-full font-medium"
        >
          <ArrowLeft className="transition-transform group-hover:-translate-x-3 duration-500" />
          <span>Farmer Registry</span>
        </Link>

        <h1 className="text-2xl py-4 font-bold text-green-800 text-left lg:text-center">
          Register as an Investor
        </h1>
        <p className="mt-2 text-gray-600 text-left lg:text-center">
          Join our platform and start investing in sustainable farms.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Full Name */}
          <motion.div
            variants={shake}
            initial="initial"
            animate={errors.fullName ? "animate" : "initial"}
            className="relative"
          >
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring outline-none ${
                errors.fullName
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-green-500"
              }`}
            />
          </motion.div>

          {/* Email */}
          <motion.div
            variants={shake}
            initial="initial"
            animate={errors.email ? "animate" : "initial"}
            className="relative"
          >
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring outline-none ${
                errors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-green-500"
              }`}
            />
          </motion.div>

          {/* Phone */}
          <motion.div
            variants={shake}
            initial="initial"
            animate={errors.phone ? "animate" : "initial"}
            className="relative"
          >
            <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring outline-none ${
                errors.phone
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-green-500"
              }`}
            />
          </motion.div>

         <button
  type="submit"
  disabled={loading}
  className={`w-full py-3 rounded-full cursor-pointer font-semibold shadow-md flex items-center justify-center gap-2 transition-all ${
    loading
      ? "bg-green-600 cursor-not-allowed text-gray-100"
      : "bg-green-600 hover:bg-green-700 transition-all ease-in-out duration-300 text-white"
  }`}
>
  {loading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
        />
      </svg>
      Registering...
    </>
  ) : (
    "Register Investor"
  )}
</button>


        </form>
      </div>
    </div>
  );
}
