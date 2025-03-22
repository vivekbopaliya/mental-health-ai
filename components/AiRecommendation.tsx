"use client"

import { Card } from '@/components/ui/card'
import { useMentalHealthData } from '@/lib/utils'

export function AIRecommendations() {
  // Get recommendations from the AI service
  const { loading, recommendations } = useMentalHealthData()

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">AI Recommendations</h3>
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-500">Loading your recommendations...</p>
        </div>
      </Card>
    )
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">AI Recommendations</h3>
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-500">No recommendations available yet. Track your mood to receive personalized suggestions.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">AI Recommendations</h3>
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                {rec.category}
              </span>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                Priority: {rec.priority}/10
              </span>
            </div>
            <h4 className="font-medium">{rec.title}</h4>
            <p className="text-sm text-gray-600">{rec.description}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}