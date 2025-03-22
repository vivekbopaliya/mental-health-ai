'use client'
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoodTracker } from '@/components/MoodTracker';
import { WelcomeHero } from '@/components/WelcomeHero';
import { MessageCircle, BarChart2, BookOpen, X } from "lucide-react";
import { DashboardStats, RecommendationsCard } from "@/components/HomeCards";


export default function Home() {
  const [activeCard, setActiveCard] = useState("");
  const [isTalkingWithAI, setIsTalkingWithAI] = useState(false);

  const handleCardClick = (cardType : unknown) => {
    setActiveCard(cardType as unknown as string);
  };

  const handleClose = () => {
    setActiveCard("");
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
      
     
    </main>
  );
}