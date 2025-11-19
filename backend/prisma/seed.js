import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed exercises (runner-focused)
  const exercises = [
    // Lower Body - Compound
    {
      name: 'Back Squat',
      category: 'lower_body',
      muscleGroups: ['quadriceps', 'glutes', 'hamstrings', 'core'],
      equipment: ['barbell', 'squat_rack'],
      isCompound: true,
      difficultyLevel: 'intermediate',
      description: 'Foundation lower body exercise for building leg strength and power.',
    },
    {
      name: 'Deadlift',
      category: 'lower_body',
      muscleGroups: ['hamstrings', 'glutes', 'lower_back', 'core'],
      equipment: ['barbell'],
      isCompound: true,
      difficultyLevel: 'intermediate',
      description: 'Full posterior chain exercise, essential for running power.',
    },
    {
      name: 'Bulgarian Split Squat',
      category: 'lower_body',
      muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
      equipment: ['dumbbells', 'bench'],
      isCompound: true,
      difficultyLevel: 'intermediate',
      description: 'Unilateral leg exercise that mimics running mechanics.',
    },
    {
      name: 'Walking Lunges',
      category: 'lower_body',
      muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
      equipment: ['dumbbells', 'bodyweight'],
      isCompound: true,
      difficultyLevel: 'beginner',
      description: 'Dynamic leg exercise excellent for runners.',
    },
    {
      name: 'Romanian Deadlift',
      category: 'lower_body',
      muscleGroups: ['hamstrings', 'glutes', 'lower_back'],
      equipment: ['barbell', 'dumbbells'],
      isCompound: true,
      difficultyLevel: 'intermediate',
      description: 'Targets hamstrings and glutes for explosive running power.',
    },
    {
      name: 'Box Step-Ups',
      category: 'lower_body',
      muscleGroups: ['quadriceps', 'glutes'],
      equipment: ['box', 'dumbbells'],
      isCompound: true,
      difficultyLevel: 'beginner',
      description: 'Unilateral exercise building single-leg strength.',
    },

    // Lower Body - Isolation
    {
      name: 'Leg Press',
      category: 'lower_body',
      muscleGroups: ['quadriceps', 'glutes'],
      equipment: ['machine'],
      isCompound: false,
      difficultyLevel: 'beginner',
      description: 'Machine-based leg exercise, safer alternative to squats.',
    },
    {
      name: 'Leg Curl',
      category: 'lower_body',
      muscleGroups: ['hamstrings'],
      equipment: ['machine'],
      isCompound: false,
      difficultyLevel: 'beginner',
      description: 'Isolates hamstrings for injury prevention.',
    },
    {
      name: 'Calf Raises',
      category: 'lower_body',
      muscleGroups: ['calves'],
      equipment: ['machine', 'bodyweight', 'dumbbells'],
      isCompound: false,
      difficultyLevel: 'beginner',
      description: 'Strengthens calves for better push-off power.',
    },
    {
      name: 'Glute Bridges',
      category: 'lower_body',
      muscleGroups: ['glutes', 'hamstrings'],
      equipment: ['bodyweight', 'barbell'],
      isCompound: false,
      difficultyLevel: 'beginner',
      description: 'Activates and strengthens glutes for running power.',
    },

    // Upper Body - Compound
    {
      name: 'Bench Press',
      category: 'upper_body',
      muscleGroups: ['chest', 'triceps', 'shoulders'],
      equipment: ['barbell', 'bench'],
      isCompound: true,
      difficultyLevel: 'intermediate',
      description: 'Primary chest exercise for upper body strength.',
    },
    {
      name: 'Pull-Ups',
      category: 'upper_body',
      muscleGroups: ['lats', 'biceps', 'upper_back'],
      equipment: ['pull_up_bar'],
      isCompound: true,
      difficultyLevel: 'intermediate',
      description: 'Essential back exercise for posture and upper body strength.',
    },
    {
      name: 'Overhead Press',
      category: 'upper_body',
      muscleGroups: ['shoulders', 'triceps', 'core'],
      equipment: ['barbell', 'dumbbells'],
      isCompound: true,
      difficultyLevel: 'intermediate',
      description: 'Builds shoulder strength and stability.',
    },
    {
      name: 'Bent-Over Rows',
      category: 'upper_body',
      muscleGroups: ['lats', 'upper_back', 'biceps'],
      equipment: ['barbell', 'dumbbells'],
      isCompound: true,
      difficultyLevel: 'intermediate',
      description: 'Strengthens back for better running posture.',
    },
    {
      name: 'Dips',
      category: 'upper_body',
      muscleGroups: ['triceps', 'chest', 'shoulders'],
      equipment: ['dip_station', 'bodyweight'],
      isCompound: true,
      difficultyLevel: 'intermediate',
      description: 'Bodyweight exercise for triceps and chest.',
    },

    // Core
    {
      name: 'Plank',
      category: 'core',
      muscleGroups: ['abs', 'core', 'lower_back'],
      equipment: ['bodyweight'],
      isCompound: false,
      difficultyLevel: 'beginner',
      description: 'Essential core stability exercise for runners.',
    },
    {
      name: 'Dead Bug',
      category: 'core',
      muscleGroups: ['abs', 'core'],
      equipment: ['bodyweight'],
      isCompound: false,
      difficultyLevel: 'beginner',
      description: 'Core stability exercise that mimics running movement.',
    },
    {
      name: 'Russian Twists',
      category: 'core',
      muscleGroups: ['obliques', 'abs'],
      equipment: ['bodyweight', 'medicine_ball'],
      isCompound: false,
      difficultyLevel: 'beginner',
      description: 'Rotational core exercise for better stability.',
    },
    {
      name: 'Hanging Leg Raises',
      category: 'core',
      muscleGroups: ['abs', 'hip_flexors'],
      equipment: ['pull_up_bar'],
      isCompound: false,
      difficultyLevel: 'advanced',
      description: 'Advanced ab exercise for core strength.',
    },
    {
      name: 'Bird Dog',
      category: 'core',
      muscleGroups: ['core', 'lower_back', 'glutes'],
      equipment: ['bodyweight'],
      isCompound: false,
      difficultyLevel: 'beginner',
      description: 'Balance and stability exercise for runners.',
    },

    // Mobility & Flexibility
    {
      name: 'Hip Flexor Stretch',
      category: 'mobility',
      muscleGroups: ['hip_flexors'],
      equipment: ['bodyweight'],
      isCompound: false,
      difficultyLevel: 'beginner',
      description: 'Essential stretch for runners to prevent tightness.',
    },
    {
      name: 'Foam Rolling - IT Band',
      category: 'mobility',
      muscleGroups: ['it_band', 'quads'],
      equipment: ['foam_roller'],
      isCompound: false,
      difficultyLevel: 'beginner',
      description: 'Self-myofascial release for IT band tightness.',
    },
  ];

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise,
    });
  }

  console.log(`✅ Seeded ${exercises.length} exercises`);

  // Create a demo user (for testing)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@routeiq.com' },
    update: {},
    create: {
      email: 'demo@routeiq.com',
      passwordHash: '$2a$10$XQn0bIq3P5A8KxQ5J9Zq7eZGJ0KHHYwRjZJZk4L.L7l8L8L8L8L8L', // "password123" (bcrypt hash)
      firstName: 'Demo',
      lastName: 'User',
      emailVerified: true,
      settings: {
        create: {
          distanceUnit: 'km',
          fitnessLevel: 'intermediate',
          primaryGoal: 'half_marathon',
        },
      },
    },
  });

  console.log(`✅ Created demo user: ${demoUser.email}`);

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
