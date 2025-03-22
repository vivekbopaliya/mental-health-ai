"use client"

import { Card } from '@/components/ui/card'
import { useMentalHealthData } from '@/lib/utils'
import { MoodHistoryChart } from './MoodHistoryChart'

export function MoodStatsOverview() {
  // Get mental health data from the AI service
  const { loading, stats } = useMentalHealthData()

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Your Insights</h3>
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-500">Loading your stats...</p>
        </div>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Your Insights</h3>
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-500">No stats available yet. Track your mood to see insights.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <MoodHistoryChart />
      <h3 className="text-xl font-bold mb-4">Your Insights</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Weekly Mood</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold">{stats.weeklyMoodAverage}/10</span>
            <span className={`text-sm ${stats.weeklyMoodChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.weeklyMoodChange >= 0 ? '+' : ''}{stats.weeklyMoodChange}
            </span>
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Current Streak</p>
          <p className="text-2xl font-bold">{stats.streak} days</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Top Activity</p>
          <p className="text-lg font-bold">{stats.mostCommonActivity}</p>
          <p className="text-xs text-gray-400">{stats.activityCount} times</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Total Entries</p>
          <p className="text-2xl font-bold">{stats.totalEntries}</p>
        </div>
      </div>
    </Card>
  )
}