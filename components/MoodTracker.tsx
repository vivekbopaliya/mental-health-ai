"use client"

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format, startOfDay, startOfWeek, startOfMonth, subDays } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Smile,
  Meh,
  Frown,
  Calendar,
  Activity,
  Music,
  Coffee,
  BookOpen,
  Users,
  Home,
  Sun,
  Moon,
  Cloud,
  CloudLightning,
} from 'lucide-react'

const activities = [
  { icon: Activity, label: 'Exercise' },
  { icon: Music, label: 'Music' },
  { icon: Coffee, label: 'Relaxation' },
  { icon: BookOpen, label: 'Reading' },
  { icon: Users, label: 'Socializing' },
  { icon: Home, label: 'Home' },
]

interface MoodEntry {
  id: string
  rating: number
  note: string
  activities: string[]
  createdAt: Date
}

async function getMoodEntries(period: 'day' | 'week' | 'month') {
  const response = await fetch(`/api/moods?period=${period}`)
  if (!response.ok) throw new Error('Failed to fetch mood entries')
  return response.json()
}

async function createMoodEntry(data: Omit<MoodEntry, 'id' | 'createdAt'>) {
  const response = await fetch('/api/moods', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create mood entry')
  return response.json()
}

// Theme configurations based on mood
const moodThemes = {
  high: {
    primaryColor: 'from-yellow-400 to-orange-500',
    secondaryColor: 'bg-orange-100',
    icon: Sun,
    message: "You're radiant today! Keep shining!",
    gradient: 'from-yellow-50 to-orange-100'
  },
  medium: {
    primaryColor: 'from-blue-400 to-sky-500',
    secondaryColor: 'bg-sky-100',
    icon: Cloud,
    message: "Steady and balanced. You're doing great!",
    gradient: 'from-blue-50 to-sky-100'
  },
  low: {
    primaryColor: 'from-indigo-400 to-purple-500',
    secondaryColor: 'bg-indigo-100',
    icon: Moon,
    message: "It's okay to have down days. Be gentle with yourself.",
    gradient: 'from-indigo-50 to-purple-100'
  },
  veryLow: {
    primaryColor: 'from-slate-400 to-slate-600',
    secondaryColor: 'bg-slate-200',
    icon: CloudLightning,
    message: "You're not alone. Reach out if you need support.",
    gradient: 'from-slate-100 to-slate-200'
  }
}

export function MoodTracker() {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [moodRating, setMoodRating] = useState(5)
  const [note, setNote] = useState('')
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day')
  const [theme, setTheme] = useState(moodThemes.medium)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: moodData, isLoading } = useQuery({
    queryKey: ['moods', period],
    queryFn: () => getMoodEntries(period),
  })

  const createMoodMutation = useMutation({
    mutationFn: createMoodEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moods'] })
      toast({
        title: "Mood tracked!",
        description: "Your mood has been recorded successfully.",
      })
      // Reset form
      setMoodRating(5)
      setNote('')
      setSelectedActivities([])
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record your mood. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Update theme based on mood rating
  useEffect(() => {
    if (moodRating >= 8) {
      setTheme(moodThemes.high)
    } else if (moodRating >= 5) {
      setTheme(moodThemes.medium)
    } else if (moodRating >= 3) {
      setTheme(moodThemes.low)
    } else {
      setTheme(moodThemes.veryLow)
    }
  }, [moodRating])

  const getMoodIcon = (rating: number) => {
    if (rating <= 3) return <Frown className="w-8 h-8 text-purple-500" />
    if (rating <= 7) return <Meh className="w-8 h-8 text-blue-500" />
    return <Smile className="w-8 h-8 text-yellow-500" />
  }

  const handleSubmit = () => {
    createMoodMutation.mutate({
      rating: moodRating,
      note,
      activities: selectedActivities,
    })
  }

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    )
  }

  const ThemeIcon = theme.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`p-6 border-0 shadow-lg overflow-hidden relative bg-gradient-to-br ${theme.gradient}`}>
        <div className="absolute p-4 top-0 right-0 opacity-10">
          <ThemeIcon className="w-20 h-20" />
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <motion.h2 
            className="text-2xl font-bold"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
          >
            Mood Tracker
          </motion.h2>
        </div>

    

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            key={`mood-message-${moodRating}`}
            className="mb-6 p-4 mt-16 rounded-lg bg-white/80 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <ThemeIcon className="w-6 h-6" />
              <p className="text-sm font-medium">{theme.message}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium mb-2">
              How are you feeling?
            </label>
            <div className="flex items-center gap-4 mb-4">
              <Frown className="w-6 h-6 text-purple-500" />
              <Slider
                value={[moodRating]}
                onValueChange={([value]) => setMoodRating(value)}
                max={10}
                step={1}
                className="flex-1"
              />
              <Smile className="w-6 h-6 text-yellow-500" />
            </div>
            <motion.div 
              className="flex justify-center"
              key={moodRating}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {getMoodIcon(moodRating)}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium mb-2">
              What have you been up to?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {activities.map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={selectedActivities.includes(label) ? "default" : "outline"}
                    className={`flex items-center gap-2 w-full transition-all duration-200 ${
                      selectedActivities.includes(label) ? 'bg-gradient-to-r ' + theme.primaryColor + ' text-white' : ''
                    }`}
                    onClick={() => toggleActivity(label)}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium mb-2">
              Any thoughts you would like to share?
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write your thoughts here..."
              className="resize-none bg-white/80"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className={`w-full bg-gradient-to-r ${theme.primaryColor} text-white`}
              onClick={handleSubmit}
              disabled={createMoodMutation.isPending}
            >
              {createMoodMutation.isPending ? "Recording..." : "Record Mood"}
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}