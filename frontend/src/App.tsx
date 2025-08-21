import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import FarmerRegister from "./pages/farmers/Register";
import InvestorRegister from "./pages/investors/InvestorRegister";
import InvestorBrowse from "./pages/investors/Browse";
import FarmerKyc from "./pages/farmers/FarmerKyc";
import InvestorKyc from "./pages/investors/InvestorKyc";
import Footer from "./components/Footer";

import ListFarm from "./pages/farmers/ListFarm";
import "./App.css";

function App() {
  return (
    <div className="p-4">
      {/* Navbar at the top */}
      <NavBar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/farmers/register" element={<FarmerRegister />} />
        <Route path="/investors/register" element={<InvestorRegister />} />
        <Route path="/browse" element={<InvestorBrowse />} />
        <Route path="/listfarm" element={<ListFarm />} />
        <Route path="/farmers/farmerkyc" element={<FarmerKyc />} />
        <Route path="/investors/investorkyc" element={<InvestorKyc />} />
      </Routes>

      <Footer/>
    </div>
  );
}

export default App;
