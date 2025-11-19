import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Validation schemas
const createActivitySchema = z.object({
  name: z.string().optional(),
  activityType: z.enum(['run', 'trail_run', 'race', 'recovery_run']).default('run'),
  routeId: z.string().uuid().optional(),
  startedAt: z.string().datetime(),
  distance: z.number().positive('Distance must be positive'),
  duration: z.number().positive('Duration must be positive'),
  movingTime: z.number().optional(),
  elevationGain: z.number().optional(),
  elevationLoss: z.number().optional(),
  averagePace: z.number().optional(),
  averageSpeed: z.number().optional(),
  maxSpeed: z.number().optional(),
  averageHeartRate: z.number().optional(),
  maxHeartRate: z.number().optional(),
  calories: z.number().optional(),
  temperature: z.number().optional(),
  weatherConditions: z.string().optional(),
  perceivedEffort: z.number().min(1).max(10).optional(),
  gpsData: z.any().optional(),
  splits: z.any().optional(),
  notes: z.string().optional(),
  isRace: z.boolean().default(false),
  isPrivate: z.boolean().default(false),
});

const updateActivitySchema = z.object({
  name: z.string().optional(),
  perceivedEffort: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
  isRace: z.boolean().optional(),
  isPrivate: z.boolean().optional(),
});

// List user's activities
export async function listActivities(req, res, next) {
  try {
    const {
      type,
      routeId,
      startDate,
      endDate,
      limit = 20,
      offset = 0,
    } = req.query;

    const where = {
      userId: req.user.id,
      ...(type && { activityType: type }),
      ...(routeId && { routeId }),
      ...(startDate && {
        startedAt: {
          gte: new Date(startDate),
          ...(endDate && { lte: new Date(endDate) }),
        },
      }),
    };

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { startedAt: 'desc' },
        include: {
          route: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.activity.count({ where }),
    ]);

    res.json({
      activities,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    next(error);
  }
}

// Create activity (log a run)
export async function createActivity(req, res, next) {
  try {
    const data = createActivitySchema.parse(req.body);

    // If routeId provided, verify it exists and belongs to user or is public
    if (data.routeId) {
      const route = await prisma.route.findFirst({
        where: {
          id: data.routeId,
          OR: [
            { userId: req.user.id },
            { isPublic: true },
          ],
        },
      });

      if (!route) {
        return res.status(404).json({
          error: 'Route not found',
          message: 'The specified route does not exist or is not accessible',
        });
      }

      // Increment route completion count
      await prisma.route.update({
        where: { id: data.routeId },
        data: { timesCompleted: { increment: 1 } },
      });
    }

    const activity = await prisma.activity.create({
      data: {
        userId: req.user.id,
        name: data.name,
        activityType: data.activityType,
        routeId: data.routeId,
        startedAt: new Date(data.startedAt),
        distance: data.distance,
        duration: data.duration,
        movingTime: data.movingTime,
        elevationGain: data.elevationGain,
        elevationLoss: data.elevationLoss,
        averagePace: data.averagePace,
        averageSpeed: data.averageSpeed,
        maxSpeed: data.maxSpeed,
        averageHeartRate: data.averageHeartRate,
        maxHeartRate: data.maxHeartRate,
        calories: data.calories,
        temperature: data.temperature,
        weatherConditions: data.weatherConditions,
        perceivedEffort: data.perceivedEffort,
        gpsData: data.gpsData,
        splits: data.splits,
        notes: data.notes,
        isRace: data.isRace,
        isPrivate: data.isPrivate,
      },
      include: {
        route: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Activity logged successfully',
      activity,
    });
  } catch (error) {
    next(error);
  }
}

// Get activity by ID
export async function getActivity(req, res, next) {
  try {
    const { id } = req.params;

    const activity = await prisma.activity.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
      include: {
        route: {
          select: {
            id: true,
            name: true,
            routeGeometry: true,
          },
        },
      },
    });

    if (!activity) {
      return res.status(404).json({
        error: 'Activity not found',
        message: 'The requested activity does not exist',
      });
    }

    res.json({ activity });
  } catch (error) {
    next(error);
  }
}

// Update activity
export async function updateActivity(req, res, next) {
  try {
    const { id } = req.params;
    const data = updateActivitySchema.parse(req.body);

    const existingActivity = await prisma.activity.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existingActivity) {
      return res.status(404).json({
        error: 'Activity not found',
        message: 'Activity not found or you do not have permission to update it',
      });
    }

    const activity = await prisma.activity.update({
      where: { id },
      data,
    });

    res.json({
      message: 'Activity updated successfully',
      activity,
    });
  } catch (error) {
    next(error);
  }
}

// Delete activity
export async function deleteActivity(req, res, next) {
  try {
    const { id } = req.params;

    const existingActivity = await prisma.activity.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existingActivity) {
      return res.status(404).json({
        error: 'Activity not found',
        message: 'Activity not found or you do not have permission to delete it',
      });
    }

    // Decrement route completion count if linked
    if (existingActivity.routeId) {
      await prisma.route.update({
        where: { id: existingActivity.routeId },
        data: { timesCompleted: { decrement: 1 } },
      });
    }

    await prisma.activity.delete({
      where: { id },
    });

    res.json({
      message: 'Activity deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

// Get activity statistics
export async function getActivityStats(req, res, next) {
  try {
    const { period = 'all', startDate, endDate } = req.query;

    // Calculate date range
    let dateFilter = {};
    const now = new Date();

    if (period === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { gte: weekAgo };
    } else if (period === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { gte: monthAgo };
    } else if (period === 'year') {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      dateFilter = { gte: yearAgo };
    } else if (startDate) {
      dateFilter = {
        gte: new Date(startDate),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }

    const where = {
      userId: req.user.id,
      ...(Object.keys(dateFilter).length > 0 && { startedAt: dateFilter }),
    };

    // Get activities
    const activities = await prisma.activity.findMany({
      where,
      select: {
        distance: true,
        duration: true,
        elevationGain: true,
        calories: true,
        averagePace: true,
        startedAt: true,
        activityType: true,
      },
    });

    // Calculate stats
    const stats = {
      totalRuns: activities.length,
      totalDistance: activities.reduce((sum, a) => sum + parseFloat(a.distance), 0),
      totalDuration: activities.reduce((sum, a) => sum + a.duration, 0),
      totalElevationGain: activities.reduce((sum, a) => sum + (parseFloat(a.elevationGain) || 0), 0),
      totalCalories: activities.reduce((sum, a) => sum + (a.calories || 0), 0),
      averagePace: activities.length > 0
        ? activities.reduce((sum, a) => sum + (parseFloat(a.averagePace) || 0), 0) / activities.length
        : 0,
      averageDistance: activities.length > 0
        ? activities.reduce((sum, a) => sum + parseFloat(a.distance), 0) / activities.length
        : 0,
    };

    // Weekly breakdown (last 4 weeks)
    const fourWeeksAgo = new Date(now);
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const weeklyActivities = await prisma.activity.findMany({
      where: {
        userId: req.user.id,
        startedAt: { gte: fourWeeksAgo },
      },
      select: {
        distance: true,
        duration: true,
        startedAt: true,
      },
      orderBy: { startedAt: 'asc' },
    });

    // Group by week
    const weeklyStats = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (7 * (i + 1)));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weekActivities = weeklyActivities.filter(
        a => a.startedAt >= weekStart && a.startedAt < weekEnd
      );

      weeklyStats.unshift({
        week: `Week ${4 - i}`,
        totalRuns: weekActivities.length,
        totalDistance: weekActivities.reduce((sum, a) => sum + parseFloat(a.distance), 0),
        totalDuration: weekActivities.reduce((sum, a) => sum + a.duration, 0),
      });
    }

    res.json({
      period,
      stats,
      weeklyBreakdown: weeklyStats,
    });
  } catch (error) {
    next(error);
  }
}
