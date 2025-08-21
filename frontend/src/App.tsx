import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import FarmerRegister from "./pages/farmers/Register";
import InvestorRegister from "./pages/investors/InvestorRegister";
import InvestorBrowse from "./pages/investors/Browse";
import FarmerKyc from "./pages/farmers/FarmerKyc";
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
        <Route path="/farmer-register" element={<FarmerRegister />} />
        <Route path="/investor-register" element={<InvestorRegister />} />
        <Route path="/browse" element={<InvestorBrowse />} />
        <Route path="/list-farm" element={<ListFarm />} />
        <Route path="/farmer-kyc" element={<FarmerKyc />} />
      </Routes>
    </div>
  );
}

export default App;
