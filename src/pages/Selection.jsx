import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  FileText, 
  Users, 
  ChevronRight,
  BarChart3,
  Shield,
  Zap,
  CheckCircle,
  Leaf,
  Target,
  TrendingUp
} from 'lucide-react';

function SelectionSection() {
  const cards = [
    {
      id: 1,
      title: "Inventory Management",
      icon: <Package className="w-12 h-12" />,
      gradient: "from-red-50 to-red-100",
      borderColor: "border-red-200",
      accentColor: "text-red-600",
      bgColor: "bg-red-500",
      delay: 0.2,
      features: [ "Stock monitoring", ]
    },
    {
      id: 2,
      title: "Daily Sales Management",
      icon: <FileText className="w-12 h-12" />,
      gradient: "from-red-50 to-red-100",
      borderColor: "border-red-200",
      accentColor: "text-red-600",
      bgColor: "bg-red-500",
      delay: 0.4,
      features: [ "Sales tracking"]
    },
    
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -15,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-red-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        animate={floatingAnimation}
        className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-red-100 to-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
      />
      <motion.div
        animate={{ ...floatingAnimation, y: [0, -25, 0] }}
        className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-red-100 to-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />
      <motion.div
        animate={{ ...floatingAnimation, y: [0, -20, 0] }}
        className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-red-100 to-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 relative z-10 max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center justify-center gap-3 mb-8">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg"
          >
            <Leaf className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Retail <span className="text-red-600">Management</span> Suite
          </h1>
        </div>
        
       

       
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            variants={cardVariants}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            custom={card.delay}
            className="relative group"
          >
            {/* Card Container */}
            <div className={`relative bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 border ${card.borderColor} hover:shadow-2xl`}>
              
              {/* Gradient Background */}
              <div className={`absolute inset-0 ${card.gradient} opacity-50`} />
              
              {/* Card Content */}
              <div className="relative p-8">
                {/* Icon with Floating Animation */}
                <motion.div
                  animate={floatingAnimation}
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50 border ${card.borderColor} shadow-md mb-6`}
                >
                  <div className={card.accentColor}>
                    {card.icon}
                  </div>
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {card.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {card.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: card.delay + index * 0.1 }}
                      className="flex items-center text-gray-700"
                    >
                      <div className="p-1 rounded-full bg-emerald-100 mr-3">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      </div>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-4 px-6 rounded-xl bg-gradient-to-r ${card.bgColor} to-red-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 group/btn relative overflow-hidden`}
                >
                  <span className="relative z-10">Get Started</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="relative z-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.span>
                  
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                </motion.button>
              </div>

              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 -translate-y-1/2 translate-x-1/2 rotate-45 ${card.bgColor} opacity-10`} />
              </div>
            </div>

            {/* Floating Particles */}
            <motion.div
              animate={{ 
                y: [0, -80],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              className="absolute w-1.5 h-1.5 bg-gradient-to-r from-red-400 to-red-500 rounded-full top-6 right-6"
            />
            <motion.div
              animate={{ 
                y: [0, -60],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                delay: Math.random() * 2 + 0.5
              }}
              className="absolute w-1 h-1 bg-gradient-to-r from-red-400 to-red-500 rounded-full top-10 right-10"
            />
          </motion.div>
        ))}
      </motion.div>

      

      {/* Decorative Elements */}
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute -left-20 -bottom-20 w-64 h-64 border-4 border-emerald-100/30 rounded-full"
      />
      <motion.div
        animate={{
          rotate: -360,
          scale: [1.1, 1, 1.1]
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute -right-20 -top-20 w-80 h-80 border-4 border-lime-100/20 rounded-full"
      />
    </div>
  );
}

export default SelectionSection;