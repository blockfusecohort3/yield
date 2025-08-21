// import { useState } from "react";
// import { motion } from "framer-motion";
// import { toast } from "sonner";
// import { Leaf } from "lucide-react";

// interface AddFarmProps {
//   closeModal: () => void; // to close the modal
// }

// export default function AddFarm({ closeModal }: AddFarmProps) {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
//   const [farmLocation, setFarmLocation] = useState("");
//   const [farmSize, setFarmSize] = useState("");
//   const [valuePerShare, setValuePerShare] = useState("");
//   const [totalShares, setTotalShares] = useState("");
//   const [availableShares, setAvailableShares] = useState("");
//   const [farmImage, setFarmImage] = useState<string | null>(null);
//   const [fileKey, setFileKey] = useState(Date.now());
//   const [errors, setErrors] = useState({});

//   const shake = {
//     initial: { x: 0 },
//     animate: { x: [0, -6, 6, -6, 6, 0], transition: { duration: 0.4 } },
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setFarmImage(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
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
//       availableShares: availableShares.trim() === "",
//       farmImage: !farmImage,
//     };
//     setErrors(newErrors);

//     if (Object.values(newErrors).some((err) => err)) {
//       toast.error("Please provide all farm details before submitting.");
//       return;
//     }

//     const farms = JSON.parse(localStorage.getItem("farms") || "[]");
//     const newFarm = {
//       id: Date.now(),
//       farmerName: currentUser.fullName || `${currentUser.firstName} ${currentUser.lastName}`,
//       farmLocation,
//       farmSize,
//       valuePerShare,
//       totalShares,
//       availableShares,
//       farmImage,
//     };
//     localStorage.setItem("farms", JSON.stringify([...farms, newFarm]));

//     // Reset
//     setFarmLocation("");
//     setFarmSize("");
//     setValuePerShare("");
//     setTotalShares("");
//     setAvailableShares("");
//     setFarmImage(null);
//     setFileKey(Date.now());
//     setErrors({});

//     toast.success("Farm added successfully! 🌱");
//     closeModal(); // close modal
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4 w-full">
//       <h2 className="text-2xl font-bold text-green-800 text-center flex items-center justify-center gap-2">
//         <Leaf size={24} /> Add a New Farm
//       </h2>

//       {/* Form Inputs */}
//       <motion.input
//         type="text"
//         placeholder="Farm Location"
//         value={farmLocation}
//         onChange={(e) => setFarmLocation(e.target.value)}
//         variants={shake}
//         initial="initial"
//         animate={errors.farmLocation ? "animate" : "initial"}
//         className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${
//           errors.farmLocation
//             ? "border-red-500 focus:ring-red-400"
//             : "border-gray-300 focus:ring-green-400"
//         }`}
//       />
//       <motion.input
//         type="text"
//         placeholder="Farm Size (e.g., 2 acres)"
//         value={farmSize}
//         onChange={(e) => setFarmSize(e.target.value)}
//         variants={shake}
//         initial="initial"
//         animate={errors.farmSize ? "animate" : "initial"}
//         className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${
//           errors.farmSize
//             ? "border-red-500 focus:ring-red-400"
//             : "border-gray-300 focus:ring-green-400"
//         }`}
//       />
//       <motion.input
//         type="number"
//         placeholder="Value per Share (₦)"
//         value={valuePerShare}
//         onChange={(e) => setValuePerShare(e.target.value)}
//         variants={shake}
//         initial="initial"
//         animate={errors.valuePerShare ? "animate" : "initial"}
//         className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${
//           errors.valuePerShare
//             ? "border-red-500 focus:ring-red-400"
//             : "border-gray-300 focus:ring-green-400"
//         }`}
//       />
//       <motion.input
//         type="number"
//         placeholder="Total Shares"
//         value={totalShares}
//         onChange={(e) => setTotalShares(e.target.value)}
//         variants={shake}
//         initial="initial"
//         animate={errors.totalShares ? "animate" : "initial"}
//         className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${
//           errors.totalShares
//             ? "border-red-500 focus:ring-red-400"
//             : "border-gray-300 focus:ring-green-400"
//         }`}
//       />
//       <motion.input
//         type="number"
//         placeholder="Available Shares"
//         value={availableShares}
//         onChange={(e) => setAvailableShares(e.target.value)}
//         variants={shake}
//         initial="initial"
//         animate={errors.availableShares ? "animate" : "initial"}
//         className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${
//           errors.availableShares
//             ? "border-red-500 focus:ring-red-400"
//             : "border-gray-300 focus:ring-green-400"
//         }`}
//       />
//       <motion.input
//         key={fileKey}
//         type="file"
//         accept="image/*"
//         onChange={handleImageChange}
//         variants={shake}
//         initial="initial"
//         animate={errors.farmImage ? "animate" : "initial"}
//         className={`border p-3 rounded-xl focus:outline-none focus:ring w-full ${
//           errors.farmImage
//             ? "border-red-500 focus:ring-red-400"
//             : "border-gray-300 focus:ring-green-400"
//         }`}
//       />

//       {farmImage && (
//         <img
//           src={farmImage}
//           alt={`Farm at ${farmLocation}`}
//           className="h-48 w-full object-cover rounded-xl shadow-md"
//         />
//       )}

//       <button
//         onClick={handleSubmit}
//         className="bg-green-700 text-white py-3 rounded-full font-semibold hover:bg-green-800 transition-all shadow-md"
//       >
//         Add Farm
//       </button>
//     </div>
//   );
// }
