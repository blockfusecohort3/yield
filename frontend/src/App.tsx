import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import FarmerRegister from "./pages/farmers/Register";
import InvestorRegister from "./pages/investors/InvestorRegister";
import InvestorBrowse from "./pages/investors/Browse";
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
        <Route path="/investors/InvestorRegister" element={<InvestorRegister />} />
        <Route path="/investors/browse" element={<InvestorBrowse />} />
      </Routes>
    </div>
  );
}

export default App;
