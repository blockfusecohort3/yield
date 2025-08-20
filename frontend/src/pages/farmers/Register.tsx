import { useState } from "react";
import { User, MapPin } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

export default function FarmerRegister() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "", 
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(""); // Clear error on input
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.address) {
      setError("Please fill in all fields before submitting.");
      return;
    }

    setError("");
    setLoading(true); // Start loading

    try {
      const pendingFarmer = {
        id: Date.now(),
        ...formData,
        rating: 0,
        kycCompleted: false,
      };

      // Simulate API or processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      localStorage.setItem("pendingFarmer", JSON.stringify(pendingFarmer));

      alert("Farmer registered successfully!"); // Success alert
      navigate("/kyc"); // Redirect to KYC page
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again."); // Show error
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-green-800 text-center">
          Register as a Farmer 
        </h1>
        <p className="mt-2 text-gray-600 text-center">
          Provide your basic details. More info will be added during KYC.
        </p>

        {error && (
          <p className="mt-4 text-red-600 bg-red-100 p-2 rounded-lg text-sm text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading} // disable button when loading
            className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all ${
              loading
                ? "bg-green-500 cursor-not-allowed text-gray-100"
                : "bg-green-800 hover:bg-green-600 text-white"
            }`}
          >
            {loading ? "Registering..." : "Register Farmer"}
          </button>
        </form>
      </div>
    </div>
  );
}
