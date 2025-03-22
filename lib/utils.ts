import { clsx, type ClassValue } from 'clsx';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface MoodEntry {
  date: string;
  score: number;
  activities: string[];
  notes: string;
}

interface UserStats {
  weeklyMoodAverage: number;
  weeklyMoodChange: number;
  mostCommonActivity: string;
  activityCount: number;
  streak: number;
  totalEntries: number;
  lowestMoodDay: string;
  highestMoodDay: string;
}

interface Recommendation {
  category: string;
  title: string;
  description: string;
  priority: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

class MentalHealthAIService {
  private model: ChatOpenAI;
  
  constructor() {
    this.model = new ChatOpenAI({
      model: "gpt-4-turbo",
      apiKey: process.env.OPENAI_API_KEY,
      temperature: 0.7,
    });
  }

  private getChatMessages(): ChatMessage[] {
    const storedMessages = localStorage.getItem(`chat_history`);
    console.log(storedMessages); // Debugging
    return storedMessages ? JSON.parse(storedMessages) : [];
  }

  private async getConversationSummary(): Promise<string> {
    const recentMessages = this.getChatMessages().slice(-10);
    
    if (recentMessages.length === 0) {
      return "No previous conversation history available.";
    }

    const summaryPrompt = new SystemMessage({
      content: "Summarize the following conversation concisely, focusing on key emotional themes and mood-related insights:"
    });

    const conversationText = recentMessages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join("\n");

    const response = await this.model.invoke([
      summaryPrompt,
      new HumanMessage({ content: conversationText }),
    ]);

    return response.content as string;
  }

  async generateAIRecommendations(stats: UserStats, moodEntries: MoodEntry[]): Promise<Recommendation[]> {
    const summary = await this.getConversationSummary();
    
    const promptTemplate = `
      You are an empathetic mental health AI assistant. Based on the following data, generate 5 personalized recommendations:
      
      Conversation Summary: ${summary}
      User Stats: ${JSON.stringify(stats)}
      Recent Mood Entries: ${JSON.stringify(moodEntries.slice(-5))}
      
      Each recommendation must include:
      - category (string)
      - title (string)
      - description (string)
      - priority (number between 1-10)
      
      Return the response as a PLAIN JSON array string (e.g., '[{"category":"Mindfulness","title":"Meditation","description":"Try a 5-minute session","priority":8}, ...]'). 
      Do NOT include Markdown, code blocks (like json), or any additional text outside the JSON array. Ensure the output is valid JSON that can be directly parsed.
    `;

    try {
      const response = await this.model.invoke([
        new SystemMessage({ content: promptTemplate }),
      ]);

      const rawContent = response.content as string;
      console.log("Raw AI response:", rawContent); // Debugging

      let recommendations: Recommendation[];
      try {
        recommendations = JSON.parse(rawContent);
      } catch (parseError) {
        console.error("Initial parse failed:", parseError);
        const jsonMatch = rawContent.match('/$$ .* $$/s');
        if (jsonMatch) {
          recommendations = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No valid JSON found in response");
        }
      }

      if (!Array.isArray(recommendations)) {
        throw new Error("Response is not an array");
      }

      recommendations.forEach(rec => {
        if (!rec.category || !rec.title || !rec.description || typeof rec.priority !== 'number') {
          throw new Error("Invalid recommendation format");
        }
      });

      return recommendations;
    } catch (error) {
      console.error("Error generating AI recommendations:", error);
      return [
        {
          category: "Self-Care",
          title: "Take a Moment",
          description: "Take a brief pause to breathe and reset.",
          priority: 5
        }
      ];
    }
  }
}

export function calculateUserStats(moodEntries: MoodEntry[]): UserStats {
  if (!moodEntries.length) {
    return {
      weeklyMoodAverage: 0,
      weeklyMoodChange: 0,
      mostCommonActivity: "None",
      activityCount: 0,
      streak: 0,
      totalEntries: 0,
      lowestMoodDay: "",
      highestMoodDay: ""
    };
  }

  const sortedEntries = [...moodEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const currentWeekEntries = sortedEntries.filter(entry => 
    new Date(entry.date) >= oneWeekAgo
  );
  
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const previousWeekEntries = sortedEntries.filter(entry => 
    new Date(entry.date) >= twoWeeksAgo && new Date(entry.date) < oneWeekAgo
  );

  const currentWeekAverage = currentWeekEntries.length 
    ? currentWeekEntries.reduce((sum, entry) => sum + entry.score, 0) / currentWeekEntries.length
    : 0;
  
  const previousWeekAverage = previousWeekEntries.length 
    ? previousWeekEntries.reduce((sum, entry) => sum + entry.score, 0) / previousWeekEntries.length
    : 0;
  
  const weeklyMoodChange = previousWeekAverage ? currentWeekAverage - previousWeekAverage : 0;
  
  const activityCounts: { [key: string]: number } = {};
  sortedEntries.forEach(entry => {
    entry.activities.forEach(activity => {
      activityCounts[activity] = (activityCounts[activity] || 0) + 1;
    });
  });
  
  let mostCommonActivity = "None";
  let maxCount = 0;
  Object.entries(activityCounts).forEach(([activity, count]) => {
    if (count > maxCount) {
      mostCommonActivity = activity;
      maxCount = count;
    }
  });
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 100; i++) {
    const dateString = currentDate.toISOString().split('T')[0];
    const hasEntryForDate = sortedEntries.some(entry => entry.date.startsWith(dateString));
    
    if (hasEntryForDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  const highestMoodEntry = [...sortedEntries].sort((a, b) => b.score - a.score)[0];
  const lowestMoodEntry = [...sortedEntries].sort((a, b) => a.score - b.score)[0];
  
  return {
    weeklyMoodAverage: parseFloat(currentWeekAverage.toFixed(1)),
    weeklyMoodChange: parseFloat(weeklyMoodChange.toFixed(1)),
    mostCommonActivity,
    activityCount: maxCount,
    streak,
    totalEntries: sortedEntries.length,
    lowestMoodDay: lowestMoodEntry?.date || "",
    highestMoodDay: highestMoodEntry?.date || ""
  };
}

export function useMentalHealthData() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const aiService = new MentalHealthAIService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let moodEntries: MoodEntry[] = [];
        try {
          const storedEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
          moodEntries = storedEntries;
        } catch (e) {
          console.error("Error parsing mood entries:", e);
        }
        
        const calculatedStats = calculateUserStats(moodEntries);
        const aiRecommendations = await aiService.generateAIRecommendations(calculatedStats, moodEntries);
      
        setStats(calculatedStats);
        setRecommendations(aiRecommendations);
      } catch (error) {
        console.error("Error fetching mental health data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return { loading, stats, recommendations };
}

export function saveMoodEntry(entry: MoodEntry) {
  const entries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
  entries.push(entry);
  localStorage.setItem('moodEntries', JSON.stringify(entries));
}
export function saveChatMessage(message: ChatMessage) {
  const messages = JSON.parse(localStorage.getItem('chat_history') || '[]');
  messages.push(message);
  localStorage.setItem('chat_history', JSON.stringify(messages));
}