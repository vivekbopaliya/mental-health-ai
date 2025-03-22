"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatService } from "@/lib/chat-service"; // Adjust path to your ChatService
import {  MoodEntry, saveMoodEntry } from "@/lib/utils"; // Adjust path to utils

export function ProactiveCheckIn() {
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const chatService = new ChatService();

  // Function to check for triggers and generate AI message
  const checkForTriggers = async () => {
    const moodEntries: MoodEntry[] = JSON.parse(localStorage.getItem("moodEntries") || "[]");
    const chatMessages = localStorage.getItem('chat_history') // Assuming userId is "user"

    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    // Check for inactivity (no mood entries or chats in last 3 days)
    const lastMoodEntry = moodEntries.length
      ? new Date(moodEntries[moodEntries.length - 1].date)
      : null;

    const isInactive = !lastActivity || lastActivity < threeDaysAgo;

    console.log("is in active: ", isInactive)

    console.log("LAST MOOD ENTRY: ", lastMoodEntry)
    // Check for low mood streak (2+ days with score ≤ 4)
    const sortedEntries = [...moodEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const recentEntries = sortedEntries.slice(-3); // Check last 3 entries
    const lowMoodStreak =
      recentEntries.length >= 2 &&
      recentEntries.every((entry) => entry.score <= 4);

    // Trigger popup if either condition is met and generate AI message
    if (isInactive || lowMoodStreak) {
      const triggerType = lowMoodStreak ? "lowMood" : "inactivity";
      const aiMessage = await chatService.generateProactiveMessage("user", triggerType, moodEntries);
      setMessage(aiMessage);
      setShowPopup(true);
    }
  };

  useEffect(() => {
    // Run check on component mount
    checkForTriggers();

    // Optional: Set up an interval to check periodically (e.g., every 5 minutes)
    const interval = setInterval(checkForTriggers, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleClick = () => {
    setShowPopup(false);
    router.push("/chatbot?from=checkin"); // Redirect to chatbot page with query param
  };

  if (!showPopup) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-sky-100 shadow-lg max-w-sm">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-800">{message}</p>
          <Button
            onClick={handleClick}
            className="bg-gradient-to-r from-blue-400 to-sky-500 text-white"
          >
            Chat with me
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}