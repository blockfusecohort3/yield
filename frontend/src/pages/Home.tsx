import FarmerRegister from "./farmers/Register";
import Browse from "./investors/Browse";
import Farmerkyc from "./farmers/FarmerKyc";

export default function Home() {
  return (
    <div>
      <FarmerRegister />
      <Browse />
      <Farmerkyc />
    </div>
  );
}
