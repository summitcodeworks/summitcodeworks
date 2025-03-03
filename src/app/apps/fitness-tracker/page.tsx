'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import WorkoutLogForm from './components/WorkoutLogForm';
import FitnessAssessment from './components/FitnessAssessment';
import WorkoutPlanCard from './components/WorkoutPlanCard';
import DailyQuote from './components/DailyQuote';
import { getRandomQuote } from './lib/quotes';

// Add BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function FitnessTrackerApp() {
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [activeTab, setActiveTab] = useState('plans');

  useEffect(() => {
    setQuote(getRandomQuote());

    // Check if the app is installable
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Update UI to notify the user they can add to home screen
      setIsInstallable(true);
    });

    window.addEventListener('appinstalled', () => {
      // Log install to analytics
      console.log('PWA was installed');
      setIsInstallable(false);
    });
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Fitness Tracker</h1>
        <p className="text-gray-500 dark:text-gray-400">Track your workouts, monitor progress, and achieve your fitness goals</p>
        
        {isInstallable && (
          <Button 
            onClick={handleInstallClick} 
            className="mt-4"
            variant="outline"
          >
            Install App
          </Button>
        )}
      </header>

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Workouts</CardTitle>
            <CardDescription>Total workouts logged this week</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">5</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Calories</CardTitle>
            <CardDescription>Total calories burned this week</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">2,450</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Fitness Level</CardTitle>
            <CardDescription>Your current fitness assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">Good</p>
          </CardContent>
        </Card>
      </div> */}

      <DailyQuote quote={quote} />

      <div className="mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="plans">Workout Plans</TabsTrigger>
            <TabsTrigger value="log">Log Workout</TabsTrigger>
            <TabsTrigger value="assessment">Fitness Assessment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="space-y-8">
            <h2 className="text-2xl font-semibold">Choose Your Workout Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <WorkoutPlanCard
                title="Beginner Strength Training"
                description="Perfect for those new to strength training. Focus on form and building a foundation."
                level="Beginner"
                duration="4 weeks"
                frequency="3x per week"
                workoutDetails={[
                  "Full body workouts focusing on proper form",
                  "Progressive overload with bodyweight and light weights",
                  "Core strengthening exercises",
                  "Mobility work to improve flexibility",
                  "Gradual introduction to basic compound movements"
                ]}
                sampleWorkout={{
                  title: "Day 1: Full Body Foundations",
                  exercises: [
                    { name: "Bodyweight Squats", sets: "3", reps: "12-15", rest: "60 sec" },
                    { name: "Push-ups (or Modified Push-ups)", sets: "3", reps: "8-10", rest: "60 sec" },
                    { name: "Dumbbell Rows", sets: "3", reps: "10 each side", rest: "60 sec" },
                    { name: "Glute Bridges", sets: "3", reps: "15", rest: "45 sec" },
                    { name: "Plank", sets: "3", duration: "20-30 sec", rest: "45 sec" },
                    { name: "Walking or Light Cycling", duration: "10-15 min" }
                  ]
                }}
              />
              <WorkoutPlanCard
                title="HIIT Cardio Challenge"
                description="High-intensity interval training to burn calories and improve cardiovascular fitness."
                level="Intermediate"
                duration="6 weeks"
                frequency="4x per week"
                workoutDetails={[
                  "Alternating high and low intensity intervals",
                  "Tabata-style workouts (20 sec work, 10 sec rest)",
                  "Full body movements that elevate heart rate",
                  "Metabolic conditioning circuits",
                  "Active recovery days with light cardio"
                ]}
                sampleWorkout={{
                  title: "Tabata Blast Workout",
                  exercises: [
                    { name: "Warm-up", duration: "5 min" },
                    { name: "Jumping Jacks", duration: "20 sec", rest: "10 sec" },
                    { name: "Mountain Climbers", duration: "20 sec", rest: "10 sec" },
                    { name: "Squat Jumps", duration: "20 sec", rest: "10 sec" },
                    { name: "Push-up to Side Plank", duration: "20 sec", rest: "10 sec" },
                    { name: "Rest", duration: "1 min" },
                    { name: "Repeat circuit 4 times" },
                    { name: "Burpees", duration: "20 sec", rest: "10 sec" },
                    { name: "Plank Jacks", duration: "20 sec", rest: "10 sec" },
                    { name: "Speed Skaters", duration: "20 sec", rest: "10 sec" },
                    { name: "Bicycle Crunches", duration: "20 sec", rest: "10 sec" },
                    { name: "Rest", duration: "1 min" },
                    { name: "Repeat circuit 4 times" },
                    { name: "Cool down", duration: "5 min" }
                  ]
                }}
              />
              <WorkoutPlanCard
                title="Full Body Toning"
                description="Sculpt and tone your entire body with this balanced workout program."
                level="All levels"
                duration="8 weeks"
                frequency="3-5x per week"
                workoutDetails={[
                  "Resistance training with bands and light weights",
                  "Circuit-style workouts for efficiency",
                  "Focus on muscular endurance and definition",
                  "Core-focused exercises in every session",
                  "Optional cardio finishers for extra calorie burn"
                ]}
                sampleWorkout={{
                  title: "Total Body Sculpt Circuit",
                  exercises: [
                    { name: "Warm-up", duration: "5-7 min" },
                    { name: "Dumbbell Squat to Press", sets: "3", reps: "12-15", rest: "30 sec" },
                    { name: "Resistance Band Rows", sets: "3", reps: "15", rest: "30 sec" },
                    { name: "Lateral Lunges", sets: "3", reps: "10 each side", rest: "30 sec" },
                    { name: "Push-up Variations", sets: "3", reps: "10-12", rest: "30 sec" },
                    { name: "Rest", duration: "1 min" },
                    { name: "Plank with Shoulder Taps", sets: "3", reps: "10 each side", rest: "30 sec" },
                    { name: "Glute Bridges with Band", sets: "3", reps: "15-20", rest: "30 sec" },
                    { name: "Bicycle Crunches", sets: "3", reps: "20 total", rest: "30 sec" },
                    { name: "Dumbbell Lateral Raises", sets: "3", reps: "12-15", rest: "30 sec" },
                    { name: "Optional: 5 min HIIT Finisher (30 sec work/15 sec rest)" }
                  ]
                }}
              />
              <WorkoutPlanCard
                title="Advanced Strength Program"
                description="Take your strength to the next level with this intensive program."
                level="Advanced"
                duration="12 weeks"
                frequency="5x per week"
                workoutDetails={[
                  "Heavy compound lifts focusing on progressive overload",
                  "Split routine targeting specific muscle groups",
                  "Periodized training with deload weeks",
                  "Advanced techniques like drop sets and supersets",
                  "Targeted accessory work for weak points"
                ]}
                sampleWorkout={{
                  title: "Day 1: Heavy Lower Body",
                  exercises: [
                    { name: "Barbell Back Squats", sets: "5", reps: "5", rest: "2-3 min" },
                    { name: "Romanian Deadlifts", sets: "4", reps: "6-8", rest: "2 min" },
                    { name: "Bulgarian Split Squats", sets: "3", reps: "8-10 each leg", rest: "90 sec" },
                    { name: "Leg Press", sets: "3", reps: "8-10", rest: "90 sec" },
                    { name: "Superset: Leg Extensions + Leg Curls", sets: "3", reps: "12 each", rest: "60 sec" },
                    { name: "Standing Calf Raises", sets: "4", reps: "15-20", rest: "60 sec" },
                    { name: "Weighted Planks", sets: "3", duration: "45-60 sec", rest: "60 sec" }
                  ]
                }}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="log">
            <Card>
              <CardContent className="pt-6">
                <WorkoutLogForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="assessment">
            <Card>
              <CardContent className="pt-6">
                <FitnessAssessment />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 