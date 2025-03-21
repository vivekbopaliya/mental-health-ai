"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Brain, Heart, Sparkles, Sun, Moon, Star, Cloud, MessageCircle } from "lucide-react"

export function WelcomeHero({ userMood = 7 }) {
  const [theme, setTheme] = useState({
    gradient: "from-primary/10 via-primary/5 to-background",
    primaryColor: "text-primary",
    secondaryColor: "text-primary/60",
    buttonColor: "bg-primary",
    message: "Welcome to your mental wellness journey",
    icon: Sparkles,
    particleColor: "bg-primary/20"
  })
  
  // Update theme based on user mood
  useEffect(() => {
    if (userMood >= 8) {
      setTheme({
        gradient: "from-yellow-100 via-orange-50 to-background",
        primaryColor: "text-yellow-500",
        secondaryColor: "text-orange-400",
        buttonColor: "bg-gradient-to-r from-yellow-400 to-orange-500",
        message: "Shine on! Today is your day",
        icon: Sun,
        particleColor: "bg-yellow-300/30"
      })
    } else if (userMood >= 5) {
      setTheme({
        gradient: "from-blue-100 via-sky-50 to-background",
        primaryColor: "text-blue-500",
        secondaryColor: "text-sky-400",
        buttonColor: "bg-gradient-to-r from-blue-400 to-sky-500",
        message: "Welcome to your mental wellness journey",
        icon: Sparkles,
        particleColor: "bg-blue-300/30"
      })
    } else {
      setTheme({
        gradient: "from-indigo-100 via-purple-50 to-background",
        primaryColor: "text-indigo-500",
        secondaryColor: "text-purple-400",
        buttonColor: "bg-gradient-to-r from-indigo-400 to-purple-500",
        message: "Take it one step at a time. You're not alone",
        icon: Moon,
        particleColor: "bg-indigo-300/30"
      })
    }
  }, [userMood])
  
  const ThemeIcon = theme.icon

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  const floatingIcons = [Brain, Heart, Star, Cloud, ThemeIcon];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-b ${theme.gradient} py-20 min-h-[80vh] flex items-center justify-center`}>
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${theme.particleColor} rounded-full`}
            initial={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`
            }}
            animate={{ 
              y: [0, -50, 0, 50, 0],
              x: [0, 30, 0, -30, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 10 + Math.random() * 15,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
      
      {/* Floating icons */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => {
          const IconComponent = floatingIcons[i % floatingIcons.length];
          const size = Math.random() * 12 + 16;
          return (
            <motion.div
              key={`icon-${i}`}
              className="absolute"
              initial={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%`,
                opacity: 0.1
              }}
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
                scale: [1, 1.1, 1, 0.9, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 20 + Math.random() * 10,
                delay: Math.random() * 5
              }}
            >
              <IconComponent 
                className={i % 2 === 0 ? theme.primaryColor : theme.secondaryColor} 
                size={size} 
                strokeWidth={1.5}
              />
            </motion.div>
          );
        })}
      </div>
      
      {/* Cosmic orbit animation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-20 pointer-events-none">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-dashed"
          style={{ borderColor: `var(--${theme.primaryColor.split('-')[1]})` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-dashed"
          style={{ borderColor: `var(--${theme.secondaryColor.split('-')[1]})` }}
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-8 rounded-full border-2 border-dashed"
          style={{ borderColor: `var(--${theme.primaryColor.split('-')[1]})` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10 max-w-screen-lg">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          <motion.div
            variants={item}
            className="flex justify-center gap-8 mb-10"
          >
            {/* Hero Icons Row */}
            <motion.div 
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                delay: 0.5,
                duration: 0.8
              }}
            >
              <motion.div
                className="absolute -inset-3 rounded-full opacity-30"
                style={{ background: `var(--${theme.primaryColor.split('-')[1]})` }}
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }}
              />
              <Brain className={`w-16 h-16 ${theme.primaryColor}`} />
            </motion.div>
            
            <motion.div
              className="relative"
              whileHover={{ scale: 1.2, rotate: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
              animate={{ 
                scale: [1, 1.1, 1],
                y: [0, -5, 0, 5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              }}
            >
              <motion.div
                className="absolute -inset-4 rounded-full opacity-20"
                style={{ background: `var(--${theme.primaryColor.split('-')[1]})` }}
                animate={{ 
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              />
              <Heart className={`w-16 h-16 ${theme.primaryColor}`} />
            </motion.div>
            
            <motion.div
              className="relative"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                className="absolute -inset-3 rounded-full opacity-30"
                style={{ background: `var(--${theme.primaryColor.split('-')[1]})` }}
                animate={{ 
                  opacity: [0.2, 0.4, 0.2],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3.5,
                  ease: "easeInOut"
                }}
              />
              <ThemeIcon className={`w-16 h-16 ${theme.primaryColor}`} />
            </motion.div>
          </motion.div>
          
          <motion.h1 
            variants={item}
            className="text-5xl md:text-7xl font-bold text-foreground mb-8"
          >
            <span className={theme.primaryColor}>Your</span> Mental Wellness <span className={theme.secondaryColor}>Journey</span>
          </motion.h1>
          
          <motion.p 
            variants={item}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12"
          >
            {theme.message}. Track your moods, get personalized support, and take control of your mental well-being.
          </motion.p>
          
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
                 <motion.button
                    className="fixed bottom-24 right-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium p-4 rounded-full shadow-lg z-50 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Talk with AI</span>
                  </motion.button>
                  
          </motion.div>
          
 
        </motion.div>
      </div>
    </div>
  )
}