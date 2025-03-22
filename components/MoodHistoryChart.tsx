"use client"

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { startOfDay, startOfWeek, startOfMonth } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export function MoodHistoryChart() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week')

  // Function to fetch mood entries from localStorage
  const getMoodEntries = () => {
    try {
      const entriesString = localStorage.getItem('moodEntries') || '[]'
      const entries = JSON.parse(entriesString)
      
      // Filter entries based on the selected period
      const now = new Date()
      let startDate
      
      if (period === 'day') {
        startDate = startOfDay(now)
      } else if (period === 'week') {
        startDate = startOfWeek(now)
      } else {
        startDate = startOfMonth(now)
      }
      
      return entries.filter((entry: any) => {
        const entryDate = new Date(entry.date)
        return entryDate >= startDate
      })
    } catch (error) {
      console.error('Failed to parse mood entries:', error)
      return []
    }
  }

  // Use React Query to manage the mood entries data
  const { data: moodData, isLoading } = useQuery({
    queryKey: ['moods', period],
    queryFn: getMoodEntries,
  })

  // Function to create chart data from mood entries
  const getChartData = () => {
    if (!moodData || moodData.length === 0) return []
    
    return moodData.map((entry: any) => ({
      date: format(new Date(entry.date), 'MMM dd'),
      score: entry.score
    }))
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Mood History</h3>
      <Tabs defaultValue="week" onValueChange={(value) => setPeriod(value as 'day' | 'week' | 'month')}>
        <TabsList className="mb-4">
          <TabsTrigger value="day">Today</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>
        
        <TabsContent value={period} className="h-64">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <p>Loading mood data...</p>
            </div>
          ) : moodData && moodData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <p className="text-gray-500">No mood data recorded yet</p>
              <p className="text-sm text-gray-400">Record your first mood to see your trends</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  )
}