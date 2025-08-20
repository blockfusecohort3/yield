import { HeroSection } from "../components/HeroSection";
import Features from "../components/Features";
import { Badge } from "../components/Badge";
import HowItWorks from "../components/HowitWorks";

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-4 mb-6">
        <Badge variant="success" >
          Smart Features
        </Badge>
      </div>
      <div className="">
        <Features />
      </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-4 mb-6">
        <Badge variant="success" >
          How it works
        </Badge>
      </div>
      <HowItWorks/>
    </div>
  );
}
