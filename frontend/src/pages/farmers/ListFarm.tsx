// import { useState } from "react";
// import { motion } from "framer-motion";
// import { toast } from "sonner";

// export default function AddFarm() {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const [farmLocation, setFarmLocation] = useState("");
//   const [farmSize, setFarmSize] = useState("");
//   const [valuePerShare, setValuePerShare] = useState("");
//   const [totalShares, setTotalShares] = useState("");
//   const [farmImage, setFarmImage] = useState(null);
//   const [fileKey, setFileKey] = useState(Date.now());
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   // Framer Motion shake animation
//   const shake = {
//     initial: { x: 0 },
//     animate: {
//       x: [0, -6, 6, -6, 6, 0],
//       transition: { duration: 0.4 },
//     },
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setFarmImage(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!currentUser) {
//       toast.error("You must be logged in!");
//       return;
//     }

//     const newErrors = {
//       farmLocation: farmLocation.trim() === "",
//       farmSize: farmSize.trim() === "",
//       valuePerShare: valuePerShare.trim() === "",
//       totalShares: totalShares.trim() === "",
//       farmImage: !farmImage,
//     };

//     setErrors(newErrors);

//     if (Object.values(newErrors).some((err) => err)) {
//       toast.error("Please provide all farm details before submitting.");
//       return;
//     }

//     try {
//       setLoading(true);

//       // Simulate async saving (like API call)
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       const farms = JSON.parse(localStorage.getItem("farms")) || [];

//       const newFarm = {
//         id: Date.now(),
//         farmerName: currentUser.fullName,
//         farmLocation,
//         farmSize,
//         valuePerShare,
//         totalShares,
//         availableShares: totalShares, 
//         farmImage,
//       };

//       localStorage.setItem("farms", JSON.stringify([...farms, newFarm]));

//       // Reset
//       setFarmLocation("");
//       setFarmSize("");
//       setValuePerShare("");
//       setTotalShares("");
//       setFarmImage(null);
//       setFileKey(Date.now());
//       setErrors({});

//       toast.success("Farm added successfully! 🌱");
//     } catch (err) {
//       console.error(err);
//       toast.error("Something went wrong, please try again ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6"
//       >
//         <h2 className="text-2xl font-bold text-green-800 text-center">
//           Add a New Farm
//         </h2>
//         <p className="text-gray-500 text-center">
//           Fill in your farm details below
//         </p>

//         {/* Farm Location */}
//         <motion.input
//           type="text"
//           placeholder="Farm Location"
//           value={farmLocation}
//           onChange={(e) => setFarmLocation(e.target.value)}
//           variants={shake}
//           initial="initial"
//           animate={errors.farmLocation ? "animate" : "initial"}
//           className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${
//             errors.farmLocation
//               ? "border-red-500 focus:ring-red-400"
//               : "border-gray-300 focus:ring-green-400"
//           }`}
//         />

//         {/* Farm Size */}
//         <motion.input
//           type="text"
//           placeholder="Farm Size (e.g., 2 acres)"
//           value={farmSize}
//           onChange={(e) => setFarmSize(e.target.value)}
//           variants={shake}
//           initial="initial"
//           animate={errors.farmSize ? "animate" : "initial"}
//           className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${
//             errors.farmSize
//               ? "border-red-500 focus:ring-red-400"
//               : "border-gray-300 focus:ring-green-400"
//           }`}
//         />

//         {/* Value per Share */}
//         <motion.input
//           type="number"
//           placeholder="Value per Share (₦)"
//           value={valuePerShare}
//           onChange={(e) => setValuePerShare(e.target.value)}
//           variants={shake}
//           initial="initial"
//           animate={errors.valuePerShare ? "animate" : "initial"}
//           className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${
//             errors.valuePerShare
//               ? "border-red-500 focus:ring-red-400"
//               : "border-gray-300 focus:ring-green-400"
//           }`}
//         />

//         {/* Total Shares */}
//         <motion.input
//           type="number"
//           placeholder="Total Shares"
//           value={totalShares}
//           onChange={(e) => setTotalShares(e.target.value)}
//           variants={shake}
//           initial="initial"
//           animate={errors.totalShares ? "animate" : "initial"}
//           className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${
//             errors.totalShares
//               ? "border-red-500 focus:ring-red-400"
//               : "border-gray-300 focus:ring-green-400"
//           }`}
//         />

//         {/* Farm Image */}
//         <motion.input
//           key={fileKey}
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           variants={shake}
//           initial="initial"
//           animate={errors.farmImage ? "animate" : "initial"}
//           className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${
//             errors.farmImage
//               ? "border-red-500 focus:ring-red-400"
//               : "border-gray-300 focus:ring-green-400"
//           }`}
//         />

//         {farmImage && (
//           <img
//             src={farmImage}
//             alt={`Farm at ${farmLocation}`}
//             className="h-48 w-full object-cover rounded-xl shadow-md"
//           />
//         )}

//         <button
//           type="submit"
//           className="bg-green-700 text-white py-3 rounded-full font-semibold hover:bg-green-800 transition-all shadow-md"

//         >
//           {loading && (
//             <svg
//               className="animate-spin h-5 w-5 text-white"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8v8H4z"
//               ></path>
//             </svg>
//           )}
//           {loading ? "Adding Farm..." : "Add Farm"}
//         </button>
//       </form>
//     </div>
//   );
// }
