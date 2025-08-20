import { useState } from "react";
import { Menu, X, Wallet, Wrench, Leaf, BookOpen } from "lucide-react"; 

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

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8 text-green-800 font-medium">
          {/* Services */}
          <a href="#" className="group flex items-center relative transition-all duration-300 ease-in-out">
            <div className="flex items-center overflow-hidden bg-green-600/20 group-hover:bg-green-600/30 rounded-full px-3 py-3 transition-all duration-500 ease-in-out group-hover:pr-20">
              <Wrench size={20} className="text-green-800 transition-all duration-500" />
              <span className="ml-2 whitespace-nowrap text-green-800 transition-all duration-500">
                Services
              </span>
            </div>
          </a>

          {/* Solutions */}
          <a href="#" className="group flex items-center relative transition-all duration-300 ease-in-out">
            <div className="flex items-center overflow-hidden bg-green-600/20 group-hover:bg-green-600/30 rounded-full px-3 py-3 transition-all duration-500 ease-in-out group-hover:pr-20">
              <Leaf size={20} className="text-green-800 transition-all duration-500" />
              <span className="ml-2 whitespace-nowrap text-green-800 transition-all duration-500">
                Solutions
              </span>
            </div>
          </a>

          {/* Resources */}
          <a href="#" className="group flex items-center relative transition-all duration-300 ease-in-out">
            <div className="flex items-center overflow-hidden bg-green-600/20 group-hover:bg-green-600/30 rounded-full px-3 py-3 transition-all duration-500 ease-in-out group-hover:pr-20">
              <BookOpen size={20} className="text-green-800 transition-all duration-500" />
              <span className="ml-2 whitespace-nowrap text-green-800 transition-all duration-500">
                Resources
              </span>
            </div>
          </a>
        </div>

        {/* Connect Wallet (desktop) */}
        <div className="hidden md:block">
          <button className="relative overflow-hidden bg-green-800 text-white px-6 py-3 rounded-full transition-all duration-500 flex items-center space-x-2 group shadow-lg">
            {/* Glow effect */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 via-emerald-500 to-green-400 opacity-70 blur-xl group-hover:opacity-100 group-hover:blur-2xl transition-all duration-700"></span>
            {/* Shine overlay */}
            <span className="absolute -left-20 top-0 h-full w-20 bg-white/20 rotate-12 group-hover:left-[120%] transition-all duration-700 ease-in-out"></span>
            <Wallet size={22} className="relative z-10 group-hover:rotate-12 transition-transform duration-500" />
            <span className="relative z-10 font-semibold tracking-wide group-hover:tracking-widest transition-all duration-500">
              Connect Wallet
            </span>
          </button>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-md p-4 space-y-4">
          <a href="#" className="group flex items-center">
            <div className="flex items-center overflow-hidden bg-green-600/20 group-hover:bg-green-600/30 rounded-full px-3 py-3 transition-all duration-500 ease-in-out group-hover:pr-20 w-full">
              <Wrench size={18} className="text-green-800 transition-all duration-500" />
              <span className="ml-2 whitespace-nowrap text-green-800 transition-all duration-500">
                Services
              </span>
            </div>
          </a>

          <a href="#" className="group flex items-center">
            <div className="flex items-center overflow-hidden bg-green-600/20 group-hover:bg-green-600/30 rounded-full px-3 py-3 transition-all duration-500 ease-in-out group-hover:pr-20 w-full">
              <Leaf size={18} className="text-green-800 transition-all duration-500" />
              <span className="ml-2 whitespace-nowrap text-green-800 transition-all duration-500">
                Solutions
              </span>
            </div>
          </a>

          {/* Resources */}
          <a href="#" className="group flex items-center">
            <div className="flex items-center overflow-hidden bg-green-600/20 group-hover:bg-green-600/30 rounded-full px-3 py-3 transition-all duration-500 ease-in-out group-hover:pr-20 w-full">
              <BookOpen size={18} className="text-green-800 transition-all duration-500" />
              <span className="ml-2 whitespace-nowrap text-green-800 transition-all duration-500">
                Resources
              </span>
            </div>
          </a>

          {/* Connect Wallet (mobile) */}
          <button className="relative overflow-hidden bg-green-800 text-white px-6 py-3 rounded-full transition-all duration-500 flex items-center justify-center space-x-2 group shadow-lg w-full">
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 via-emerald-500 to-green-400 opacity-70 blur-xl group-hover:opacity-100 group-hover:blur-2xl transition-all duration-700"></span>
            <span className="absolute -left-20 top-0 h-full w-20 bg-white/20 rotate-12 group-hover:left-[120%] transition-all duration-700 ease-in-out"></span>
            <Wallet size={20} className="relative z-10 group-hover:rotate-12 transition-transform duration-500" />
            <span className="relative z-10 font-semibold tracking-wide group-hover:tracking-widest transition-all duration-500">
              Connect Wallet
            </span>
          </button>
        </div>
      )}
    </nav>
  );
}
