import React from "react";
import { User, Users, FileCheck, Calendar, Banknote } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    { icon: User, text: "Sign up as a member" },
    { icon: Users, text: "Join a cooperative in your state" },
    { icon: FileCheck, text: "Select your preferred investment option and make payment" },
    { icon: Calendar, text: "Receive weekly report on the farming progress" },
    { icon: Banknote, text: "After 4 months, you get your money plus 30% interest" },
  ];

  return (
    <section className="bg-gradient-to-b from-green-50 via-green-100 to-green-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 text-center mb-12">
          HOW IT WORKS
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-6 text-center">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.15, rotate: 2 }}
              >
                {/* Icon */}
                <motion.div
                  className="w-28 h-28 flex items-center justify-center rounded-full border-2 border-green-600 bg-white shadow-sm mb-4"
                  whileHover={{
                    boxShadow: "0px 0px 12px rgba(34,197,94,0.5)",
                  }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <IconComponent className="w-8 h-8 text-green-700" strokeWidth={1.6} />
                </motion.div>

                {/* Text */}
                <p className="text-sm text-green-800 leading-snug">
                  {step.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
