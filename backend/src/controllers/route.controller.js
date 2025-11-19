import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Validation schemas
const createRouteSchema = z.object({
  name: z.string().min(1, 'Route name is required'),
  description: z.string().optional(),
  distance: z.number().positive('Distance must be positive'),
  elevationGain: z.number().optional(),
  elevationLoss: z.number().optional(),
  routeGeometry: z.object({
    type: z.literal('LineString'),
    coordinates: z.array(z.array(z.number())).min(2, 'Route must have at least 2 points'),
  }),
  routeType: z.enum(['loop', 'out_and_back', 'point_to_point']).default('loop'),
  surfaceTypes: z.array(z.string()).optional(),
  difficultyRating: z.enum(['easy', 'moderate', 'hard', 'expert']).optional(),
  estimatedTime: z.number().optional(),
  isPublic: z.boolean().default(false),
  isFavorite: z.boolean().default(false),
});

const updateRouteSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isFavorite: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});

// List user's routes
export async function listRoutes(req, res, next) {
  try {
    const { favorite, public: isPublic, sort = 'createdAt', order = 'desc' } = req.query;

    const where = {
      userId: req.user.id,
      ...(favorite === 'true' && { isFavorite: true }),
      ...(isPublic === 'true' && { isPublic: true }),
    };

    const routes = await prisma.route.findMany({
      where,
      orderBy: { [sort]: order },
      select: {
        id: true,
        name: true,
        description: true,
        distance: true,
        elevationGain: true,
        routeType: true,
        difficultyRating: true,
        estimatedTime: true,
        isFavorite: true,
        isPublic: true,
        timesCompleted: true,
        createdAt: true,
        startPointLat: true,
        startPointLng: true,
      },
    });

    res.json({
      routes,
      total: routes.length,
    });
  } catch (error) {
    next(error);
  }
}

// Create new route
export async function createRoute(req, res, next) {
  try {
    const data = createRouteSchema.parse(req.body);

    // Extract start and end points from geometry
    const coordinates = data.routeGeometry.coordinates;
    const startPoint = coordinates[0];
    const endPoint = coordinates[coordinates.length - 1];

    const route = await prisma.route.create({
      data: {
        userId: req.user.id,
        name: data.name,
        description: data.description,
        distance: data.distance,
        elevationGain: data.elevationGain,
        elevationLoss: data.elevationLoss,
        routeGeometry: data.routeGeometry,
        startPointLat: startPoint[1], // latitude
        startPointLng: startPoint[0], // longitude
        endPointLat: endPoint[1],
        endPointLng: endPoint[0],
        routeType: data.routeType,
        surfaceTypes: data.surfaceTypes || [],
        difficultyRating: data.difficultyRating,
        estimatedTime: data.estimatedTime,
        isPublic: data.isPublic,
        isFavorite: data.isFavorite,
      },
      select: {
        id: true,
        name: true,
        description: true,
        distance: true,
        elevationGain: true,
        elevationLoss: true,
        routeGeometry: true,
        routeType: true,
        difficultyRating: true,
        estimatedTime: true,
        isFavorite: true,
        isPublic: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: 'Route created successfully',
      route,
    });
  } catch (error) {
    next(error);
  }
}

// Get route by ID
export async function getRoute(req, res, next) {
  try {
    const { id } = req.params;

    const route = await prisma.route.findFirst({
      where: {
        id,
        OR: [
          { userId: req.user.id }, // User's own route
          { isPublic: true },      // Or public route
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        activities: {
          select: {
            id: true,
            startedAt: true,
            duration: true,
            averagePace: true,
          },
          take: 5,
          orderBy: { startedAt: 'desc' },
        },
      },
    });

    if (!route) {
      return res.status(404).json({
        error: 'Route not found',
        message: 'The requested route does not exist or is private',
      });
    }

    res.json({ route });
  } catch (error) {
    next(error);
  }
}

// Update route
export async function updateRoute(req, res, next) {
  try {
    const { id } = req.params;
    const data = updateRouteSchema.parse(req.body);

    // Check if route belongs to user
    const existingRoute = await prisma.route.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existingRoute) {
      return res.status(404).json({
        error: 'Route not found',
        message: 'Route not found or you do not have permission to update it',
      });
    }

    const route = await prisma.route.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        description: true,
        isFavorite: true,
        isPublic: true,
        updatedAt: true,
      },
    });

    res.json({
      message: 'Route updated successfully',
      route,
    });
  } catch (error) {
    next(error);
  }
}

// Delete route
export async function deleteRoute(req, res, next) {
  try {
    const { id } = req.params;

    // Check if route belongs to user
    const existingRoute = await prisma.route.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existingRoute) {
      return res.status(404).json({
        error: 'Route not found',
        message: 'Route not found or you do not have permission to delete it',
      });
    }

    await prisma.route.delete({
      where: { id },
    });

    res.json({
      message: 'Route deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

// Browse public routes
export async function browsePublicRoutes(req, res, next) {
  try {
    const {
      distance,
      difficulty,
      routeType,
      limit = 20,
      offset = 0,
    } = req.query;

    const where = {
      isPublic: true,
      ...(distance && {
        distance: {
          gte: parseFloat(distance) * 0.9,
          lte: parseFloat(distance) * 1.1,
        },
      }),
      ...(difficulty && { difficultyRating: difficulty }),
      ...(routeType && { routeType }),
    };

    const [routes, total] = await Promise.all([
      prisma.route.findMany({
        where,
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          distance: true,
          elevationGain: true,
          routeType: true,
          difficultyRating: true,
          timesCompleted: true,
          createdAt: true,
          startPointLat: true,
          startPointLng: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.route.count({ where }),
    ]);

    res.json({
      routes,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    next(error);
  }
}
