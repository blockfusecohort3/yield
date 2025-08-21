import { useState } from "react";
import { User, MapPin, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";

export default function FarmerRegister() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    address: false,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // clear error when user types
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      firstName: formData.firstName.trim() === "",
      lastName: formData.lastName.trim() === "",
      address: formData.address.trim() === "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) {
      toast.error("Please fill in all fields before submitting.", {
        icon: <XCircle className="text-red-500" />,
      });
      return;
    }

    setLoading(true);

    try {
      const pendingFarmer = {
        id: Date.now(),
        ...formData,
        rating: 0,
        kycCompleted: false,
      };

      toast.loading("Registering farmer…");

      await new Promise((resolve) => setTimeout(resolve, 1500)); // fake API delay

      localStorage.setItem("pendingFarmer", JSON.stringify(pendingFarmer));

      toast.success("Farmer registered successfully!", {
        icon: <CheckCircle className="text-green-500" />,
      });

      navigate("/farmers/farmerkyc");

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
    <>
     
      <Toaster richColors position="top-center" closeButton />

     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
  <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl md:max-w-3xl lg:max-w-4xl p-4 sm:p-6 md:p-8 max-h-screen overflow-auto">

            <Link
                to="/investors/register"
                className="flex w-60 items-center group space-x-2 bg-white border border-green-400 text-green-700 px-5 py-1 rounded-full font-medium"
              >
                 <ArrowLeft
        className="transition-transform group-hover:-translate-x-3 duration-500 "
         
      />
                <span>Investor Registery</span>
              </Link>

          <h1 className="text-2xl py-4 font-bold text-green-800 text-left lg:text-center">
            Register as a Farmer
          </h1>
          <p className="mt-2 text-gray-600 text-left lg:text-center">
            Provide your basic details. More info will be added during KYC.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            
            <motion.div
              variants={shake}
              initial="initial"
              animate={errors.firstName ? "animate" : "initial"}
              className="relative"
            >
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring outline-none ${
                  errors.firstName
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-green-500"
                }`}
              />
            </motion.div>

        
            <motion.div
              variants={shake}
              initial="initial"
              animate={errors.lastName ? "animate" : "initial"}
              className="relative"
            >
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring outline-none ${
                  errors.lastName
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-green-500"
                }`}
              />
            </motion.div>

          
            <motion.div
              variants={shake}
              initial="initial"
              animate={errors.address ? "animate" : "initial"}
              className="relative"
            >
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring outline-none ${
                  errors.address
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
    "Register Farmer"
  )}
</button>

          </form>
        </div>
      </div>
    </>
  );
}
