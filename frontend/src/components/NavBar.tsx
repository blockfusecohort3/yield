import { useState } from "react";
import { Menu, X, Wallet, Home, Leaf, BookOpen, Search } from "lucide-react";
import WalletWithRole from "./WalletWithRole";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileSearch, setIsMobileSearch] = useState(false);

  return (
    <nav className="backdrop-blur-2xl bg-white/80 shadow-md sticky top-4 z-50 mx-4 sm:mx-6 md:mx-10 lg:mx-20 rounded-xl">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img width={40} src="/src/assets/images/yield_logo.png" alt="Yield Logo" />
          <span className="text-2xl font-bold text-green-800">Yield</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-green-800 font-medium">
          {/** Services */}
          <a href="/" className="group flex items-center relative transition-all duration-300 ease-in-out">
            <div className="flex items-center overflow-hidden bg-green-600/20 group-hover:bg-green-600/30 rounded-full px-3 py-3 transition-all duration-500 ease-in-out group-hover:pr-20">
              <Home size={20} className="text-green-800 transition-all duration-500" />
              <span className="ml-2 whitespace-nowrap text-green-800 transition-all duration-500">Home</span>
            </div>
          </a>

          {/** Solutions */}
          <a href="#" className="group flex items-center relative transition-all duration-300 ease-in-out">
            <div className="flex items-center overflow-hidden bg-green-600/20 group-hover:bg-green-600/30 rounded-full px-3 py-3 transition-all duration-500 ease-in-out group-hover:pr-20">
              <Leaf size={20} className="text-green-800 transition-all duration-500" />
              <span className="ml-2 whitespace-nowrap text-green-800 transition-all duration-500">Solutions</span>
            </div>
          </a>

          {/** Resources */}
          <a href="#" className="group flex items-center relative transition-all duration-300 ease-in-out">
            <div className="flex items-center overflow-hidden bg-green-600/20 group-hover:bg-green-600/30 rounded-full px-3 py-3 transition-all duration-500 ease-in-out group-hover:pr-20">
              <BookOpen size={20} className="text-green-800 transition-all duration-500" />
              <span className="ml-2 whitespace-nowrap text-green-800 transition-all duration-500">Resources</span>
            </div>
          </a>

          {/** Search (Desktop) */}
          <div
            className="relative flex items-center group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-center bg-green-600/20 group-hover:bg-green-600/10 rounded-full px-3 py-3 transition-all duration-500 ease-in-out overflow-hidden">
              <Search size={20} className="text-green-800" />
              <input
                type="text"
                placeholder="Search..."
                className={`ml-2 bg-transparent outline-none text-green-800 transition-all duration-500 ease-in-out ${
                  isHovered ? "w-40 opacity-100" : "w-0 opacity-0"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Wallet / Connect Button */}
        <div className="hidden md:flex">
          <WalletWithRole />
        </div>

        {/* Mobile Menu & Search */}
        <div className="md:hidden flex items-center space-x-4">
          <button onClick={() => setIsMobileSearch(!isMobileSearch)}>
            <Search size={26} className="text-green-800" />
          </button>

          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      {isMobileSearch && (
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center bg-green-600/20 rounded-full px-3 py-2 transition-all duration-500 ease-in-out overflow-hidden">
            <Search size={20} className="text-green-800" />
            <input
              type="text"
              placeholder="Search..."
              className="ml-2 flex-1 bg-transparent outline-none text-green-800"
            />
          </div>
        </div>
      )}

      {/* Mobile Menu Items */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md p-4 space-y-4 rounded-xl">
          {/** Services */}
          <a href="/" className="group flex items-center w-full">
            <div className="flex items-center overflow-hidden bg-green-600/20 group-hover:bg-green-600/30 rounded-full px-3 py-3 transition-all duration-500 ease-in-out ">
              <Home size={20} className="text-green-800 transition-all duration-500" />
              <span className="ml-2 whitespace-nowrap text-green-800 transition-all duration-500">Home</span>
            </div>
          </a>

          {/** Solutions */}
          <a href="#" className="group flex items-center w-full">
            <div className="flex items-center overflow-hidden bg-green-600/20 group-hover:bg-green-600/30 rounded-full px-3 py-3 transition-all duration-500 ease-in-out w-full">
              <Leaf size={18} className="text-green-800 transition-all duration-500" />
              <span className="ml-2 whitespace-nowrap text-green-800 transition-all duration-500">Solutions</span>
            </div>
          </a>

          {/** Resources */}
          <a href="#" className="group flex items-center w-full">
            <div className="flex items-center overflow-hidden bg-green-600/20 group-hover:bg-green-600/30 rounded-full px-3 py-3 transition-all duration-500 ease-in-out w-full">
              <BookOpen size={18} className="text-green-800 transition-all duration-500" />
              <span className="ml-2 whitespace-nowrap text-green-800 transition-all duration-500">Resources</span>
            </div>
          </a>

          {/** Connect Wallet Mobile Button */}
          <button className="relative overflow-hidden bg-green-800 text-white px-6 py-3 rounded-full transition-all duration-500 flex items-center justify-center space-x-2 group shadow-lg w-full">
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 via-emerald-500 to-green-400 opacity-70 blur-xl group-hover:opacity-100 group-hover:blur-2xl transition-all duration-700"></span>
            <span className="absolute -left-20 top-0 h-full w-20 bg-white/20 rotate-12 group-hover:left-[120%] transition-all duration-700 ease-in-out"></span>
            <Wallet
              size={20}
              className="relative z-10 group-hover:rotate-12 transition-transform duration-500"
            />
            <span className="relative z-10 font-semibold tracking-wide group-hover:tracking-widest transition-all duration-500">
              Connect Wallet
            </span>
          </button>
        </div>
      )}
    </nav>
  );
}
