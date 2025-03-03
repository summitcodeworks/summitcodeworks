'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, BarChart, ChevronDown, ChevronUp, Dumbbell, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WorkoutPlanCardProps {
  title: string;
  description: string;
  level: string;
  duration: string;
  frequency: string;
  workoutDetails?: string[];
  sampleWorkout?: {
    title: string;
    exercises: Array<{
      name: string;
      sets?: string;
      reps?: string;
      duration?: string;
      rest?: string;
    }>;
  };
}

type WorkoutLevelType = 'Beginner' | 'Intermediate' | 'Advanced' | 'All levels';

export default function WorkoutPlanCard({
  title,
  description,
  level,
  duration,
  frequency,
  workoutDetails = [],
  sampleWorkout,
}: WorkoutPlanCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showSampleWorkout, setShowSampleWorkout] = useState(false);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleStartPlan = () => {
    toast.success('Workout Plan Added', {
      description: `You've started the ${title} plan!`,
    });
  };

  // Default workout details based on the plan level if none provided
  const defaultWorkoutDetails: Record<WorkoutLevelType, string[]> = {
    'Beginner': [
      'Basic squats, lunges, and push-ups',
      'Light dumbbell exercises for major muscle groups',
      'Bodyweight exercises focusing on form',
      'Low-impact cardio like walking or cycling'
    ],
    'Intermediate': [
      'Compound movements with moderate weights',
      'Circuit training with minimal rest',
      'Interval training alternating high and low intensity',
      'Core-focused exercises like planks and Russian twists'
    ],
    'Advanced': [
      'Heavy compound lifts (squats, deadlifts, bench press)',
      'Olympic lifting variations',
      'Advanced HIIT protocols with short rest periods',
      'Specialized training splits targeting specific muscle groups'
    ],
    'All levels': [
      'Scalable exercises for different fitness levels',
      'Progressive bodyweight movements',
      'Adaptable resistance training',
      'Customizable cardio intensity'
    ]
  };

  // Default sample workouts if none provided
  const defaultSampleWorkouts: Record<WorkoutLevelType, {
    title: string;
    exercises: Array<{
      name: string;
      sets?: string;
      reps?: string;
      duration?: string;
      rest?: string;
    }>;
  }> = {
    'Beginner': {
      title: 'Day 1: Full Body Basics',
      exercises: [
        { name: 'Bodyweight Squats', sets: '3', reps: '10-12', rest: '60 sec' },
        { name: 'Push-ups (or Modified Push-ups)', sets: '3', reps: '8-10', rest: '60 sec' },
        { name: 'Dumbbell Rows', sets: '3', reps: '10 each side', rest: '60 sec' },
        { name: 'Glute Bridges', sets: '3', reps: '12-15', rest: '45 sec' },
        { name: 'Plank', sets: '3', duration: '20-30 sec', rest: '45 sec' },
        { name: 'Walking or Light Cycling', duration: '10-15 min' }
      ]
    },
    'Intermediate': {
      title: 'HIIT Session',
      exercises: [
        { name: 'Warm-up', duration: '5 min' },
        { name: 'Burpees', duration: '30 sec', rest: '15 sec' },
        { name: 'Mountain Climbers', duration: '30 sec', rest: '15 sec' },
        { name: 'Jump Squats', duration: '30 sec', rest: '15 sec' },
        { name: 'Push-ups', duration: '30 sec', rest: '15 sec' },
        { name: 'Plank Jacks', duration: '30 sec', rest: '15 sec' },
        { name: 'Rest', duration: '1 min' },
        { name: 'Repeat circuit 3-4 times' },
        { name: 'Cool down', duration: '5 min' }
      ]
    },
    'Advanced': {
      title: 'Day 1: Heavy Lower Body',
      exercises: [
        { name: 'Barbell Back Squats', sets: '5', reps: '5', rest: '2-3 min' },
        { name: 'Romanian Deadlifts', sets: '4', reps: '6-8', rest: '2 min' },
        { name: 'Walking Lunges with Dumbbells', sets: '3', reps: '10 each leg', rest: '90 sec' },
        { name: 'Leg Press', sets: '3', reps: '8-10', rest: '90 sec' },
        { name: 'Leg Curls', sets: '3', reps: '10-12', rest: '60 sec' },
        { name: 'Standing Calf Raises', sets: '4', reps: '15-20', rest: '60 sec' },
        { name: 'Weighted Planks', sets: '3', duration: '45-60 sec', rest: '60 sec' }
      ]
    },
    'All levels': {
      title: 'Full Body Toning Workout',
      exercises: [
        { name: 'Dumbbell Squat to Press', sets: '3', reps: '12-15', rest: '45 sec' },
        { name: 'Push-up Variations (choose your level)', sets: '3', reps: '10-15', rest: '45 sec' },
        { name: 'Resistance Band Rows', sets: '3', reps: '12-15', rest: '45 sec' },
        { name: 'Lateral Lunges', sets: '3', reps: '10 each side', rest: '45 sec' },
        { name: 'Bicycle Crunches', sets: '3', reps: '20 total', rest: '45 sec' },
        { name: 'Plank Shoulder Taps', sets: '3', reps: '20 total', rest: '45 sec' },
        { name: 'Optional: 5-10 min cardio finisher' }
      ]
    }
  };

  const displayWorkoutDetails = workoutDetails.length > 0 
    ? workoutDetails 
    : defaultWorkoutDetails[level as WorkoutLevelType] || defaultWorkoutDetails['All levels'];

  const displaySampleWorkout = sampleWorkout || defaultSampleWorkouts[level as WorkoutLevelType] || defaultSampleWorkouts['All levels'];

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge className={getLevelColor(level)}>{level}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-muted-foreground">Duration: {duration}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-muted-foreground">Frequency: {frequency}</span>
          </div>
          <div className="flex items-center text-sm">
            <BarChart className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-muted-foreground">
              {level === 'Beginner' 
                ? 'Focuses on form and building basic strength' 
                : level === 'Intermediate' 
                  ? 'Balanced intensity with progressive overload'
                  : 'High intensity with advanced techniques'}
            </span>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full mt-2 flex items-center justify-between p-2 h-auto text-sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            <span className="flex items-center">
              <Dumbbell className="mr-2 h-4 w-4" />
              Workout Details
            </span>
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {showDetails && (
            <div className="mt-2 pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-2">
              <p className="text-sm font-medium">What you&apos;ll be doing:</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {displayWorkoutDetails.map((detail: string, index: number) => (
                  <li key={index} className="text-muted-foreground">{detail}</li>
                ))}
              </ul>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            className="w-full mt-2 flex items-center justify-between p-2 h-auto text-sm"
            onClick={() => setShowSampleWorkout(!showSampleWorkout)}
          >
            <span className="flex items-center">
              <PlayCircle className="mr-2 h-4 w-4" />
              Sample Workout
            </span>
            {showSampleWorkout ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {showSampleWorkout && (
            <div className="mt-2 pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-3">
              <p className="text-sm font-medium">{displaySampleWorkout.title}</p>
              <div className="space-y-2">
                {displaySampleWorkout.exercises.map((exercise, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-muted-foreground text-xs flex flex-wrap gap-x-3">
                      {exercise.sets && <span>Sets: {exercise.sets}</span>}
                      {exercise.reps && <span>Reps: {exercise.reps}</span>}
                      {exercise.duration && <span>Duration: {exercise.duration}</span>}
                      {exercise.rest && <span>Rest: {exercise.rest}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleStartPlan} className="w-full">Start Plan</Button>
      </CardFooter>
    </Card>
  );
} 