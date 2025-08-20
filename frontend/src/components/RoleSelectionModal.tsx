import React, { useState, useEffect } from 'react';
import { Wallet, Leaf, X, ArrowRight } from 'lucide-react';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelect: (role: 'investor' | 'farmer') => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onClose,
  onRoleSelect
}) => {
  const [selectedRole, setSelectedRole] = useState<'investor' | 'farmer' | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (isOpen) setIsVisible(true);
    else setSelectedRole(null);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const handleContinue = () => {
    if (!selectedRole) return;

    // animate button arrow
    setIsClicked(true);
    setTimeout(() => {
      onRoleSelect(selectedRole);
      setIsClicked(false);
      handleClose();
    }, 500);
  };

  const handleRoleSelect = (role: 'investor' | 'farmer') => setSelectedRole(role);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">
              Choose Your Role
            </h2>
            <p className="text-gray-600 text-lg">
              Customize your Yield experience
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Investor */}
            <button
              onClick={() => handleRoleSelect('investor')}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                selectedRole === 'investor'
                  ? 'bg-green-100 border-green-500 shadow-lg'
                  : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-4 rounded-full mb-4 ${
                  selectedRole === 'investor' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-700'
                }`}>
                  <Wallet className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-1 text-gray-900">
                  Investor
                </h3>
                <p className="text-sm text-gray-600">
                  Invest in sustainable farming projects
                </p>
              </div>
              {selectedRole === 'investor' && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>

            {/* Farmer */}
            <button
              onClick={() => handleRoleSelect('farmer')}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                selectedRole === 'farmer'
                  ? 'bg-green-100 border-green-500 shadow-lg'
                  : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-4 rounded-full mb-4 ${
                  selectedRole === 'farmer' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-700'
                }`}>
                  <Leaf className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-1 text-gray-900">
                  Farmer
                </h3>
                <p className="text-sm text-gray-600">
                  Access funding and resources to grow your farm
                </p>
              </div>
              {selectedRole === 'farmer' && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          </div>

          {/* Continue Button with arrow animation */}
          <button
            onClick={handleContinue}
            disabled={!selectedRole || isClicked}
            className={`mt-8 w-full py-4 rounded-2xl font-semibold text-lg relative overflow-hidden transition-all duration-300 ${
              selectedRole
                ? 'bg-green-600 text-white shadow hover:shadow-lg hover:scale-[1.02]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span
              className={`inline-block transition-all duration-300 ${
                isClicked ? 'translate-x-8 opacity-0' : 'translate-x-0 opacity-100'
              }`}
            >
              Continue
            </span>
            <ArrowRight
              className={`absolute right-4 top-1/2 -translate-y-1/2 text-white transition-all duration-300 ${
                isClicked ? 'translate-x-6 opacity-100' : '-translate-x-4 opacity-0'
              }`}
              size={20}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
