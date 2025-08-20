import React, { useEffect, useState } from "react";
import RoleSelectionModal from "./RoleSelectionModal";
import ConnectButton from "./ConnectButton";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { Wallet } from "lucide-react";

export default function WalletWithRole() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (isConnected) setModalOpen(true);
  }, [isConnected]);

  const handleRoleSelect = (role: "investor" | "farmer") => {
    console.log("Selected role:", role);
    setModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6 relative">
        {!isConnected ? (
          <ConnectButton />
        ) : (
          <div className="relative overflow-hidden group flex items-center space-x-3 bg-green-600 text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(0,255,120,0.6)] transition-all duration-500 hover:shadow-[0_0_35px_rgba(0,255,120,0.9)] cursor-pointer">
            {/* Neon Gradient Glow */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 via-emerald-500 to-green-400 opacity-70 blur-xl group-hover:opacity-100 group-hover:blur-2xl transition-all duration-700"></span>
            
            {/* Sliding shine effect */}
            <span className="absolute -left-20 top-0 h-full w-20 bg-white/20 rotate-12 group-hover:left-[120%] transition-all duration-700 ease-in-out"></span>
            
            {/* Wallet Icon */}
            <Wallet className="relative z-10 w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-500" />
            
            {/* Address + Balance */}
            <div className="relative z-10 flex items-center space-x-2">
              <span className="font-semibold">
                {address
                  ? `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`
                  : "Connecting..."}
              </span>
              {balance && (
                <span className="text-sm bg-green-900/80 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(0,255,120,0.5)]">
                  {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                </span>
              )}
              {/* Disconnect Button */}
              <button
                onClick={() => disconnect()}
                className="ml-2 px-3 py-1 bg-white text-green-700 font-semibold rounded-full shadow hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onRoleSelect={handleRoleSelect}
      />
    </>
  );
}
