'use client'
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, BarChart2, BookOpen, X, TrendingUp, TrendingDown, Flame, Activity, Calendar } from "lucide-react";
import { calculateUserStats, useMentalHealthData, saveMoodEntry } from "@/lib/utils";

// Enhanced DashboardStats component
export const DashboardStats = () => {
  const { loading, stats } = useMentalHealthData();
  
  if (loading || !stats) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-100 p-6 rounded-lg shadow-lg h-full flex items-center justify-center">
        <div className="text-lg text-blue-500">Loading your stats...</div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gradient-to-br from-blue-50 to-purple-100 p-6 rounded-lg shadow-lg h-full"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Stats</h2>
        <BarChart2 className="w-6 h-6 text-blue-500" />
      </div>
      
      <div className="space-y-4">
        <div className="bg-white/80 p-4 rounded-lg">
          <h3 className="font-medium mb-2 text-gray-700">Weekly Mood Average</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-500">{stats.weeklyMoodAverage}</span>
            <div className="flex items-center">
              {stats.weeklyMoodChange > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : stats.weeklyMoodChange < 0 ? (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              ) : (
                <span className="w-4 h-4 mr-1">-</span>
              )}
              <span className={stats.weeklyMoodChange > 0 ? "text-green-500 text-sm" : stats.weeklyMoodChange < 0 ? "text-red-500 text-sm" : "text-gray-500 text-sm"}>
                {stats.weeklyMoodChange > 0 ? `↑ ${stats.weeklyMoodChange}` : stats.weeklyMoodChange < 0 ? `↓ ${Math.abs(stats.weeklyMoodChange)}` : "No change"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 p-4 rounded-lg">
          <h3 className="font-medium mb-2 text-gray-700">Most Common Activity</h3>
          <div className="flex items-center justify-between">
            <span className="font-medium">{stats.mostCommonActivity}</span>
            <span className="text-gray-500 text-sm">{stats.activityCount} days</span>
          </div>
        </div>
        
        <div className="bg-white/80 p-4 rounded-lg">
          <h3 className="font-medium mb-2 text-gray-700">Streak</h3>
          <div className="flex items-center">
            <Flame className="w-5 h-5 text-orange-500 mr-2" />
            <span className="font-medium">{stats.streak} days</span>
          </div>
        </div>
        
        <div className="bg-white/80 p-4 rounded-lg">
          <h3 className="font-medium mb-2 text-gray-700">Mood Insights</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Total entries:</span>
              <span className="font-medium">{stats.totalEntries}</span>
            </div>
            {stats.highestMoodDay && (
              <div className="flex items-center justify-between text-sm">
                <span>Best day:</span>
                <span className="font-medium">{new Date(stats.highestMoodDay).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced RecommendationsCard component
export const RecommendationsCard = () => {
  const { loading, recommendations } = useMentalHealthData();
  
  if (loading || !recommendations) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-amber-100 p-6 rounded-lg shadow-lg h-full flex items-center justify-center">
        <div className="text-lg text-amber-500">Preparing your recommendations...</div>
      </div>
    );
  }
  
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "mindfulness":
        return <Activity className="w-4 h-4 text-blue-500" />;
      case "physical health":
        return <Activity className="w-4 h-4 text-green-500" />;
      case "connection":
      case "social":
        return <MessageCircle className="w-4 h-4 text-purple-500" />;
      case "self-care":
      case "well-being":
        return <Flame className="w-4 h-4 text-orange-500" />;
      case "reading":
        return <BookOpen className="w-4 h-4 text-indigo-500" />;
      case "professional support":
        return <MessageCircle className="w-4 h-4 text-red-500" />;
      case "gratitude practice":
      case "reflection":
        return <Calendar className="w-4 h-4 text-green-500" />;
      default:
        return <BookOpen className="w-4 h-4 text-amber-500" />;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gradient-to-br from-yellow-50 to-amber-100 p-6 rounded-lg shadow-lg h-full"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Personalized Recommendations</h2>
        <BookOpen className="w-6 h-6 text-amber-500" />
      </div>
      
      <p className="text-sm mb-4 text-gray-600">
        Based on your recent mood entries and patterns, here are some tailored suggestions for your wellbeing.
      </p>
      
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 p-4 rounded-lg"
          >
            <div className="flex items-center mb-2">
              {getCategoryIcon(rec.category)}
              <h3 className="font-medium ml-2 text-gray-800">{rec.title}</h3>
            </div>
            <div className="flex items-center text-xs text-gray-500 mb-2">
              <span>{rec.category}</span>
              <span className="ml-2">• Priority: {rec.priority}</span>
            </div>
            <p className="text-sm text-gray-700">{rec.description}</p>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          These are AI-generated suggestions. Always prioritize what feels right for you.
        </p>
      </div>
    </motion.div>
  );
};

// Enhanced MoodTracker component with data persistence
export const MoodTracker = () => {
  const [currentMood, setCurrentMood] = useState(5);
  const [activities, setActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const activityOptions = [
    "Exercise", "Reading", "Meditation", "Time with friends/family",
    "Cooking", "Creative activity", "Work", "Rest", "Nature time"
  ];
  
  const handleSubmit = () => {
    const entry = {
      date: new Date().toISOString().split('T')[0],
      score: currentMood,
      activities,
      notes
    };
    
    // Save to localStorage using the utility function
    saveMoodEntry(entry);
    setSubmitted(true);
    
    // Reset form after animation
    setTimeout(() => {
      setSubmitted(false);
      setCurrentMood(5);
      setActivities([]);
      setNotes("");
    }, 2000);
  };
  
  const toggleActivity = (activity: string) => {
    setActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity) 
        : [...prev, activity]
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gradient-to-br from-purple-50 to-indigo-100 p-6 rounded-lg shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">How are you feeling today?</h2>
        <Calendar className="w-6 h-6 text-indigo-500" />
      </div>
      
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="submitted"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-center py-8"
          >
            <div className="inline-block p-3 rounded-full bg-green-100 mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Entry Recorded!</h3>
            <p className="text-gray-600">Thanks for checking in today.</p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700">Rate your mood (1-10)</label>
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">1</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentMood}
                  onChange={(e) => setCurrentMood(parseInt(e.target.value))}
                  className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-gray-400 ml-2">10</span>
              </div>
              <div className="mt-2 text-center">
                <span className="text-xl font-bold text-indigo-500">{currentMood}</span>
                <span className="text-gray-500 ml-2">
                  {currentMood <= 3 ? "Not great" : currentMood <= 6 ? "Okay" : "Great"}
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700">Today’s activities</label>
              <div className="flex flex-wrap gap-2">
                {activityOptions.map(activity => (
                  <button
                    key={activity}
                    onClick={() => toggleActivity(activity)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      activities.includes(activity)
                        ? "bg-indigo-500 text-white"
                        : "bg-white/70 text-gray-700 hover:bg-indigo-100"
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="How was your day? Any thoughts to jot down?"
                rows={3}
              />
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
              disabled={!activities.length}
            >
              Save Today’s Entry
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};