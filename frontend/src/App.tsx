import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import FarmerRegister from "./pages/farmers/Register";
import InvestorBrowse from "./pages/investors/Browse";
import FarmerKyc from "./pages/farmers/FarmerKyc";
import InvestorKyc from "./pages/investors/InvestorKyc";
import Footer from "./components/Footer";
import FarmerDashboard from "./pages/farmers/FarmerDashboard";
import InvestorDashboard from "./pages/investors/InvestorDashboard";


import "./App.css";


function App() {
  return (
    <div className=" p-4 ">
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/farmers/register" element={<FarmerRegister />} />
        <Route path="/investors/register" element={<InvestorRegister />} />
        <Route path="/browse" element={<InvestorBrowse />} />
        {/* <Route path="/farmers/AddFarm" element={<AddFarm />} /> */}
        <Route path="/farmers/farmerkyc" element={<FarmerKyc />} />
        <Route path="/investors/investorkyc" element={<InvestorKyc />} />
        <Route path="/farmers/farmerDashboard" element={<FarmerDashboard />} />
        <Route path="/investors/investorDashboard" element={<InvestorDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
