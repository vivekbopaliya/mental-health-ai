import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { startOfDay, startOfWeek, startOfMonth } from 'date-fns'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'day'
  
  // TODO: Get actual user ID from session
  const userId = 'temp-user-id'

  let startDate = new Date()
  switch (period) {
    case 'week':
      startDate = startOfWeek(new Date())
      break
    case 'month':
      startDate = startOfMonth(new Date())
      break
    default:
      startDate = startOfDay(new Date())
  }

  try {
    const moods = await prisma.mood.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return NextResponse.json(
      moods.map(mood => ({
        rating: mood.rating,
        time: mood.createdAt,
      }))
    )
  } catch (error) {
    console.error('Failed to fetch moods:', error)
    return NextResponse.json(
      { error: 'Failed to fetch moods' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { rating, note, activities } = await request.json()
    
    // TODO: Get actual user ID from session
    const userId = 'temp-user-id'

    const mood = await prisma.mood.create({
      data: {
        rating,
        note,
        activities,
        userId,
      },
    })

    return NextResponse.json(mood)
  } catch (error) {
    console.error('Failed to create mood:', error)
    return NextResponse.json(
      { error: 'Failed to create mood' },
      { status: 500 }
    )
  }
}