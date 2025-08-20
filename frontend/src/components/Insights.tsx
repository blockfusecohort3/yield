import React from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const Insights = () => {
  const insights = [
    {
      title: "DeFi Lending Pools: A Game-Changer for Small Farms",
      description: "Discover how decentralized finance is revolutionizing agricultural lending with transparent, accessible funding options.",
      image: "https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=600",
      date: "March 15, 2024",
      readTime: "5 min read"
    },
    {
      title: "Sustainable Farming Practices That Pay Off",
      description: "Learn about eco-friendly techniques that not only protect the environment but also increase long-term profitability.",
      image: "https://images.pexels.com/photos/1268101/pexels-photo-1268101.jpeg?auto=compress&cs=tinysrgb&w=600",
      date: "March 10, 2024",
      readTime: "7 min read"
    },
    {
      title: "Smart Technology Integration in Modern Agriculture",
      description: "Explore how IoT sensors, data analytics, and precision farming tools are transforming traditional agriculture.",
      image: "https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=600",
      date: "March 8, 2024",
      readTime: "6 min read"
    }
  ];

  return (
    <section id="insights" className="py-20 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-12 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 flex-1"
          >
            Insights, Trends, and Tips for Smart Farming
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-600 flex-1 md:text-left"
          >
            Stay updated with the latest developments in agricultural finance, 
            sustainable practices, and innovative farming technologies.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insights.map((insight, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              <div className="relative overflow-hidden">
                <motion.img
                  src={insight.image}
                  alt={insight.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  whileHover={{ scale: 1.08 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{insight.date}</span>
                  <span className="mx-2">•</span>
                  <span>{insight.readTime}</span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {insight.title}
                </h3>

                <p className="text-gray-600 line-clamp-3">
                  {insight.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Insights;