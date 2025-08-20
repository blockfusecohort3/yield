import { useState } from "react";
import { Menu, X, Wrench, Leaf, BookOpen, ArrowRight } from "lucide-react"; 

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img width={40} src="/src/assets/images/yield_logo.png" alt="Yield Logo" />
          <span className="text-2xl font-bold text-green-800">Yield</span>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-green-800 font-medium">
          <a href="#" className="hover:text-green-600 group flex items-center space-x-1 transition">
           <div className="bg-green-600/20 group-hover:pr-20 transition-all duration-300 ease-in-out py-3 px-3 rounded-full">
             <Wrench   size={20} />
           </div>
            <span className="group-hover:">Services</span>
          </a>
          <a href="#" className="hover:text-green-600 flex items-center space-x-1 transition">
            <Leaf size={20} /> <span>Solutions</span>
          </a>
          <a href="#" className="hover:text-green-600 flex items-center space-x-1 transition">
            <BookOpen size={20} /> <span>Resources</span>
          </a>
        </div>

        <div className="hidden md:block">
          <button className="bg-green-800 text-white px-5 py-2 rounded-full hover:bg-green-700 transition flex items-center space-x-2">
            <span>Contact Us</span>
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden  bg-white shadow-md p-4 space-y-4">
          <a href="#" className="block text-green-800 hover:text-green-600 flex items-center space-x-2">
            <Wrench size={18} /> <span>Services</span>
          </a>
          <a href="#" className="block text-green-800 hover:text-green-600 flex items-center space-x-2">
            <Leaf size={18} /> <span>Solutions</span>
          </a>
          <a href="#" className="block text-green-800 hover:text-green-600 flex items-center space-x-2">
            <BookOpen size={18} /> <span>Resources</span>
          </a>
          <button className="w-full bg-green-800 text-white px-5 py-2 rounded-full hover:bg-green-700 transition flex items-center justify-center space-x-2">
            <span>Contact Us</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </nav>
  );
}
