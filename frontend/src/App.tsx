import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import FarmerRegister from "./pages/farmers/Register";
import InvestorBrowse from "./pages/investors/Browse";
import "./App.css";


function App() {
  return (
    <div className=" p-4 ">
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/farmers/register" element={<FarmerRegister />} />
        <Route path="/investors/browse" element={<InvestorBrowse />} />
      </Routes>
    </div>
  );
}

export default App;
