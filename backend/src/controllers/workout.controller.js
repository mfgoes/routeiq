import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Validation schemas
const setSchema = z.object({
  set: z.number().int().positive(),
  reps: z.number().int().positive(),
  weight: z.number().optional(),
  restSeconds: z.number().int().optional(),
  rpe: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
});

const workoutExerciseSchema = z.object({
  exerciseId: z.string().uuid(),
  exerciseOrder: z.number().int().positive(),
  sets: z.array(setSchema).min(1),
  notes: z.string().optional(),
});

const createWorkoutSchema = z.object({
  name: z.string().optional(),
  workoutType: z.string().optional(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  perceivedEffort: z.number().min(1).max(10).optional(),
  energyLevel: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
  location: z.string().optional(),
  exercises: z.array(workoutExerciseSchema).min(1),
});

const updateWorkoutSchema = z.object({
  name: z.string().optional(),
  workoutType: z.string().optional(),
  perceivedEffort: z.number().min(1).max(10).optional(),
  energyLevel: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
  location: z.string().optional(),
});

// List all exercises
export async function listExercises(req, res, next) {
  try {
    const { category, muscleGroup, search } = req.query;

    const where = {
      OR: [
        { isCustom: false },
        { createdByUserId: req.user.id },
      ],
      ...(category && { category }),
      ...(muscleGroup && { muscleGroups: { has: muscleGroup } }),
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: [
        { isCustom: 'asc' },
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    res.json({ exercises });
  } catch (error) {
    next(error);
  }
}

// List user's workouts
export async function listWorkouts(req, res, next) {
  try {
    const {
      workoutType,
      startDate,
      endDate,
      limit = 20,
      offset = 0,
    } = req.query;

    const where = {
      userId: req.user.id,
      isTemplate: false,
      ...(workoutType && { workoutType }),
      ...(startDate && {
        startedAt: {
          gte: new Date(startDate),
          ...(endDate && { lte: new Date(endDate) }),
        },
      }),
    };

    const [workouts, total] = await Promise.all([
      prisma.workout.findMany({
        where,
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { startedAt: 'desc' },
        include: {
          exercises: {
            include: {
              exercise: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                },
              },
            },
            orderBy: { exerciseOrder: 'asc' },
          },
        },
      }),
      prisma.workout.count({ where }),
    ]);

    res.json({
      workouts,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    next(error);
  }
}

// Create workout
export async function createWorkout(req, res, next) {
  try {
    const data = createWorkoutSchema.parse(req.body);

    // Verify all exercises exist
    const exerciseIds = data.exercises.map(e => e.exerciseId);
    const existingExercises = await prisma.exercise.findMany({
      where: {
        id: { in: exerciseIds },
        OR: [
          { isCustom: false },
          { createdByUserId: req.user.id },
        ],
      },
    });

    if (existingExercises.length !== exerciseIds.length) {
      return res.status(404).json({
        error: 'Exercise not found',
        message: 'One or more exercises do not exist or are not accessible',
      });
    }

    // Calculate workout totals and duration
    const startedAt = new Date(data.startedAt);
    const completedAt = data.completedAt ? new Date(data.completedAt) : null;
    const totalDuration = completedAt
      ? Math.floor((completedAt - startedAt) / 1000)
      : null;

    let workoutTotalVolume = 0;
    let workoutTotalReps = 0;

    // Calculate totals for each exercise
    const exercisesData = data.exercises.map(ex => {
      const sets = ex.sets;
      const totalSets = sets.length;
      const totalReps = sets.reduce((sum, set) => sum + set.reps, 0);
      const totalVolume = sets.reduce((sum, set) => sum + ((set.weight || 0) * set.reps), 0);
      const maxWeight = Math.max(...sets.map(set => set.weight || 0), 0);

      workoutTotalVolume += totalVolume;
      workoutTotalReps += totalReps;

      return {
        exerciseId: ex.exerciseId,
        exerciseOrder: ex.exerciseOrder,
        sets: sets,
        totalSets,
        totalReps,
        totalVolume,
        maxWeight: maxWeight > 0 ? maxWeight : null,
        notes: ex.notes,
        isPersonalRecord: false, // TODO: Check against previous PRs
      };
    });

    // Create workout with exercises
    const workout = await prisma.workout.create({
      data: {
        userId: req.user.id,
        name: data.name,
        workoutType: data.workoutType,
        startedAt,
        completedAt,
        totalDuration,
        totalVolume: workoutTotalVolume,
        totalReps: workoutTotalReps,
        perceivedEffort: data.perceivedEffort,
        energyLevel: data.energyLevel,
        notes: data.notes,
        location: data.location,
        exercises: {
          create: exercisesData,
        },
      },
      include: {
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                category: true,
                muscleGroups: true,
              },
            },
          },
          orderBy: { exerciseOrder: 'asc' },
        },
      },
    });

    res.status(201).json({
      message: 'Workout logged successfully',
      workout,
    });
  } catch (error) {
    next(error);
  }
}

// Get workout by ID
export async function getWorkout(req, res, next) {
  try {
    const { id } = req.params;

    const workout = await prisma.workout.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: { exerciseOrder: 'asc' },
        },
      },
    });

    if (!workout) {
      return res.status(404).json({
        error: 'Workout not found',
        message: 'The requested workout does not exist',
      });
    }

    res.json({ workout });
  } catch (error) {
    next(error);
  }
}

// Update workout
export async function updateWorkout(req, res, next) {
  try {
    const { id } = req.params;
    const data = updateWorkoutSchema.parse(req.body);

    const existingWorkout = await prisma.workout.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existingWorkout) {
      return res.status(404).json({
        error: 'Workout not found',
        message: 'Workout not found or you do not have permission to update it',
      });
    }

    const workout = await prisma.workout.update({
      where: { id },
      data,
      include: {
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
          orderBy: { exerciseOrder: 'asc' },
        },
      },
    });

    res.json({
      message: 'Workout updated successfully',
      workout,
    });
  } catch (error) {
    next(error);
  }
}

// Delete workout
export async function deleteWorkout(req, res, next) {
  try {
    const { id } = req.params;

    const existingWorkout = await prisma.workout.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existingWorkout) {
      return res.status(404).json({
        error: 'Workout not found',
        message: 'Workout not found or you do not have permission to delete it',
      });
    }

    await prisma.workout.delete({
      where: { id },
    });

    res.json({
      message: 'Workout deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

// Get last exercise weight for progressive overload
export async function getLastExerciseWeight(req, res, next) {
  try {
    const { exerciseId } = req.params;

    // Find the most recent workout containing this exercise
    const lastWorkout = await prisma.workout.findFirst({
      where: {
        userId: req.user.id,
        exercises: {
          some: { exerciseId },
        },
      },
      orderBy: { startedAt: 'desc' },
      include: {
        exercises: {
          where: { exerciseId },
          select: {
            sets: true,
          },
        },
      },
    });

    if (!lastWorkout || lastWorkout.exercises.length === 0) {
      return res.json({
        exerciseId,
        lastWeight: 0,
        lastWorkoutDate: null,
      });
    }

    // Calculate average weight from last workout
    const sets = lastWorkout.exercises[0].sets;
    const weightsWithValues = sets
      .map(set => parseFloat(set.weight) || 0)
      .filter(w => w > 0);

    const avgWeight = weightsWithValues.length > 0
      ? weightsWithValues.reduce((sum, w) => sum + w, 0) / weightsWithValues.length
      : 0;

    res.json({
      exerciseId,
      lastWeight: Math.round(avgWeight * 2) / 2, // Round to nearest 0.5kg
      lastWorkoutDate: lastWorkout.startedAt,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// WORKOUT TEMPLATES
// ============================================================================

// List user's workout templates
export async function listTemplates(req, res, next) {
  try {
    const templates = await prisma.workout.findMany({
      where: {
        userId: req.user.id,
        isTemplate: true,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: {
            exerciseOrder: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ templates });
  } catch (error) {
    next(error);
  }
}

// Create workout template
export async function createTemplate(req, res, next) {
  try {
    const validatedData = createWorkoutSchema.omit({ startedAt: true, completedAt: true }).parse(req.body);

    // Calculate totals
    let totalSets = 0;
    let totalReps = 0;
    let totalVolume = 0;

    const exercisesWithTotals = validatedData.exercises.map((exercise) => {
      const exerciseTotalSets = exercise.sets.length;
      const exerciseTotalReps = exercise.sets.reduce((sum, set) => sum + set.reps, 0);
      const exerciseTotalVolume = exercise.sets.reduce(
        (sum, set) => sum + (set.weight || 0) * set.reps,
        0
      );
      const exerciseMaxWeight = Math.max(...exercise.sets.map((s) => s.weight || 0), 0);

      totalSets += exerciseTotalSets;
      totalReps += exerciseTotalReps;
      totalVolume += exerciseTotalVolume;

      return {
        exerciseId: exercise.exerciseId,
        exerciseOrder: exercise.exerciseOrder,
        sets: exercise.sets,
        notes: exercise.notes,
        totalSets: exerciseTotalSets,
        totalReps: exerciseTotalReps,
        totalVolume: exerciseTotalVolume,
        maxWeight: exerciseMaxWeight,
      };
    });

    const template = await prisma.workout.create({
      data: {
        userId: req.user.id,
        name: validatedData.name,
        workoutType: validatedData.workoutType,
        isTemplate: true,
        notes: validatedData.notes,
        totalVolume,
        totalReps,
        exercises: {
          create: exercisesWithTotals,
        },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: {
            exerciseOrder: 'asc',
          },
        },
      },
    });

    res.status(201).json({ template });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid template data',
        errors: error.errors,
      });
    }
    next(error);
  }
}

// Get single template
export async function getTemplate(req, res, next) {
  try {
    const { id } = req.params;

    const template = await prisma.workout.findFirst({
      where: {
        id,
        userId: req.user.id,
        isTemplate: true,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: {
            exerciseOrder: 'asc',
          },
        },
      },
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json({ template });
  } catch (error) {
    next(error);
  }
}

// Delete template
export async function deleteTemplate(req, res, next) {
  try {
    const { id } = req.params;

    const template = await prisma.workout.findFirst({
      where: {
        id,
        userId: req.user.id,
        isTemplate: true,
      },
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    await prisma.workout.delete({
      where: { id },
    });

    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    next(error);
  }
}
