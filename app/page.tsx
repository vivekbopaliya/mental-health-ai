"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoodTracker } from '@/components/MoodTracker';
import { WelcomeHero } from '@/components/WelcomeHero';
import { MessageCircle, BarChart2, BookOpen, X } from "lucide-react";

// Placeholder components that you'll need to create
const DashboardStats = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="bg-gradient-to-br from-blue-50 to-purple-100 p-6 rounded-lg shadow-lg h-full"
  >
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">Your Stats</h2>
      <BarChart2 className="w-6 h-6 text-blue-500" />
    </div>
    <div className="space-y-4">
      <div className="bg-white/80 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Weekly Mood Average</h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-500">7.2</span>
          <span className="text-green-500 text-sm">↑ 0.5</span>
        </div>
      </div>
      <div className="bg-white/80 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Most Common Activity</h3>
        <p className="font-medium">Exercise (4 days)</p>
      </div>
      <div className="bg-white/80 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Streak</h3>
        <p className="font-medium">5 days 🔥</p>
      </div>
    </div>
  </motion.div>
);

const RecommendationsCard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="bg-gradient-to-br from-yellow-50 to-amber-100 p-6 rounded-lg shadow-lg h-full"
  >
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">Recommendations</h2>
      <BookOpen className="w-6 h-6 text-amber-500" />
    </div>
    <div className="space-y-4">
      <div className="bg-white/80 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Mindfulness</h3>
        <p className="text-sm">Try this 5-minute breathing exercise to center yourself.</p>
      </div>
      <div className="bg-white/80 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Self-Care</h3>
        <p className="text-sm">Going for a walk in nature can improve your mood.</p>
      </div>
      <div className="bg-white/80 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Reading</h3>
        <p className="text-sm">"The Happiness Trap" - Learn to manage difficult emotions.</p>
      </div>
    </div>
  </motion.div>
);

export default function Home() {
  const [activeCard, setActiveCard] = useState(null);
  const [isTalkingWithAI, setIsTalkingWithAI] = useState(false);

  const handleCardClick = (cardType) => {
    setActiveCard(cardType);
  };

  const handleClose = () => {
    setActiveCard(null);
    setIsTalkingWithAI(false);
  };

  return (
    <main className="h-screen bg-background overflow-hidden relative">
      <WelcomeHero />
      
      {/* Cards Grid - Fixed at bottom of screen */}
      <div className="absolute bottom-8 left-0 right-0 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
              className="cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => handleCardClick('mood')}
              whileHover={{ y: -5 }}
            >
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md flex items-center justify-between">
                <h3 className="font-medium">Track Your Mood</h3>
                <div className="flex space-x-2">
                  <span className="block h-3 w-3 rounded-full bg-purple-500"></span>
                  <span className="block h-3 w-3 rounded-full bg-blue-500"></span>
                  <span className="block h-3 w-3 rounded-full bg-yellow-500"></span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => handleCardClick('stats')}
              whileHover={{ y: -5 }}
            >
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md flex items-center justify-between">
                <h3 className="font-medium">Your Stats</h3>
                <BarChart2 className="w-5 h-5 text-blue-500" />
              </div>
            </motion.div>
            
            <motion.div 
              className="cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => handleCardClick('recommendations')}
              whileHover={{ y: -5 }}
            >
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md flex items-center justify-between">
                <h3 className="font-medium">Get Recommendations</h3>
                <BookOpen className="w-5 h-5 text-amber-500" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Prominent AI chat button */}
      <motion.button
        className="fixed bottom-24 right-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium p-4 rounded-full shadow-lg z-50 flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsTalkingWithAI(true)}
      >
        <MessageCircle className="w-5 h-5" />
        <span>Talk with AI</span>
      </motion.button>
      
      {/* Fullscreen modal for active card */}
      <AnimatePresence>
        {activeCard && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg w-full max-w-3xl relative max-h-[80vh] overflow-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <button 
                className="absolute top-4 right-4 bg-white/90 rounded-full p-1 z-10"
                onClick={handleClose}
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="p-6">
                {activeCard === 'mood' && <MoodTracker />}
                {activeCard === 'stats' && <DashboardStats />}
                {activeCard === 'recommendations' && <RecommendationsCard />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* AI Chat Overlay */}
      <AnimatePresence>
        {isTalkingWithAI && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg w-full max-w-xl h-[70vh] relative overflow-hidden"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="font-bold text-lg">AI Wellness Assistant</h2>
                  <button onClick={handleClose}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-auto p-4">
                  <div className="bg-blue-100 p-3 rounded-lg rounded-tl-none max-w-[80%] mb-4">
                    <p>Hi there! I'm your wellness assistant. How are you feeling today?</p>
                  </div>
                </div>
                
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type your message..."
                    />
                    <button className="bg-blue-500 text-white rounded-full p-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}