import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function KYCVerification() {
  const [form, setForm] = useState({
    dob: "",
    nationalId: "",
    address: "",
    idDocument: null,
  });
  const [pendingFarmer, setPendingFarmer] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

 
  useEffect(() => {
    const farmer = JSON.parse(localStorage.getItem("pendingFarmer"));
    if (!farmer) {
      alert("No pending farmer found. Please register first.");
      navigate("/register"); 
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
    if (error) setError(""); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.dob || !form.nationalId || !form.address) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!pendingFarmer) return;

    const completedFarmer = {
      ...pendingFarmer,
      ...form,
      kycCompleted: true,
    };

   
    const existingFarmers = JSON.parse(localStorage.getItem("farmers")) || [];
    localStorage.setItem(
      "farmers",
      JSON.stringify([...existingFarmers, completedFarmer])
    );

   
    localStorage.removeItem("pendingFarmer");

    alert("✅ KYC submitted successfully and farmer verified!");
    navigate("/dashboard"); // redirect to dashboard
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-green-800">
            KYC Verification 🔒
          </h1>
          <p className="text-gray-600 mt-2">
            Please complete your KYC to get verified on the platform.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 border border-red-300 rounded-lg p-3 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              National ID / BVN / Passport No.
            </label>
            <input
              type="text"
              name="nationalId"
              value={form.nationalId}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Residential Address
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

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
            className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition font-semibold"
          >
            Submit KYC
          </button>
        </form>
      </div>
    </div>
  );
}
