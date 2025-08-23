"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowUpRight, Leaf, Cpu, Droplets } from "lucide-react";

const Features = () => {
  const [activeAccordion, setActiveAccordion] = useState(0);

const features = [
  {
    title: "Verified Farmer Onboarding",
    description:
      "Farmers can register and upload NIN, BVN, government IDs, and farm records to get verified and gain investor trust.",
    icon: ArrowUpRight,
    color: "green",
  },
  {
    title: "Invest with Confidence",
    description:
      "Investors can browse verified farmers, see ratings and insurance info, and fund projects knowing smart contracts secure the process.",
    icon: Leaf,
    color: "emerald",
  },
  {
    title: "Milestone-Based Funding",
    description:
      "Funds are released in stages via smart contracts as farmers hit verified milestones, ensuring accountability and transparency.",
    icon: Cpu,
    color: "blue",
  },
  {
    title: "Build Reputation & Trust",
    description:
      "Farmers earn badges and ratings based on performance, giving investors confidence and opening doors for bigger future funding.",
    icon: Droplets,
    color: "cyan",
  },
];


  return (
    <section id="features" className="relative bg-gradient-to-b from green-50 via-green-100 to-green-50 w-full">
      <div className="max-w-7xl py-10 mb-10 mx-auto ">
       <motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="text-left mb-16"
>
 

  {/* Flex container for heading + paragraph */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    {/* Left Side (Heading) */}
    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 md:w-1/2">
      A Greener, More Productive World
    </h2>

    {/* Right Side (Paragraph) */}
    <p className="text-lg text-gray-600 leading-relaxed md:w-1/2">
      Yield is committed to supporting farmers with the tools and
      financial access they need to thrive. With sustainable practices
      and decentralized finance, we help you unlock the true impact of
      your growth journey.
    </p>
  </div>
</motion.div>


        {/* Accordion */}
        <div className="space-y-5">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isActive = activeAccordion === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                  isActive
                    ? "border-green-300 bg-green-50 shadow-xl"
                    : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-md"
                }`}
              >
                <button
                  onClick={() =>
                    setActiveAccordion(isActive ? -1 : index)
                  }
                  className="w-full px-6 py-5 flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4">
                    {/* Animated Icon */}
                    <motion.div
                      animate={{
                        rotate: isActive ? 360 : 0,
                        scale: isActive ? 1.2 : 1,
                      }}
                      transition={{ duration: 0.6 }}
                      className={`p-3 rounded-lg transition-colors ${
                        isActive ? "bg-green-600" : "bg-gray-100"
                      }`}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${
                          isActive ? "text-white" : "text-gray-600"
                        }`}
                      />
                    </motion.div>
                    <h3
                      className={`text-lg md:text-xl font-semibold ${
                        isActive ? "text-green-900" : "text-gray-900"
                      }`}
                    >
                      {feature.title}
                    </h3>
                  </div>

                  {/* Chevron with animation */}
                  <motion.div
                    animate={{
                      rotate: isActive ? 90 : 0,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <ChevronRight
                      className={`w-6 h-6 ${
                        isActive ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                  </motion.div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="px-6 pb-6"
                    >
                      <p className="ml-16 text-gray-700 leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
