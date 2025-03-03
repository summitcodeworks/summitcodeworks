'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ActivityIcon, HeartIcon, DumbbellIcon, TimerIcon } from 'lucide-react';
import { calculateFitnessLevel } from '../lib/fitness';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  age: z.string().min(1, {
    message: 'Please enter your age.',
  }),
  gender: z.string({
    required_error: 'Please select your gender.',
  }),
  weight: z.string().min(1, {
    message: 'Please enter your weight.',
  }),
  height: z.string().min(1, {
    message: 'Please enter your height.',
  }),
  restingHeartRate: z.string().min(1, {
    message: 'Please enter your resting heart rate.',
  }),
  pushUps: z.string().min(1, {
    message: 'Please enter the number of push-ups.',
  }),
  sitUps: z.string().min(1, {
    message: 'Please enter the number of sit-ups.',
  }),
  runTime: z.string().min(1, {
    message: 'Please enter your 1-mile run time (minutes).',
  }),
});

// Fitness recommendations based on fitness level
const fitnessRecommendations = {
  'Excellent': {
    workout: 'Advanced Strength Program',
    cardio: 'High-intensity interval training (HIIT) 3-4 times per week',
    nutrition: 'Focus on nutrient timing and macronutrient optimization',
    recovery: 'Implement periodization with planned deload weeks',
    nextSteps: 'Consider specialized training for specific goals (competition, sports performance)'
  },
  'Very Good': {
    workout: 'Mix of Advanced Strength and HIIT Cardio Challenge',
    cardio: 'Alternate between HIIT and steady-state cardio',
    nutrition: 'Maintain high protein intake and nutrient-dense foods',
    recovery: 'Ensure adequate recovery between intense sessions',
    nextSteps: 'Work on any specific weaknesses identified in your assessment'
  },
  'Good': {
    workout: 'HIIT Cardio Challenge or Full Body Toning',
    cardio: 'Include both interval training and moderate cardio sessions',
    nutrition: 'Focus on whole foods and proper pre/post workout nutrition',
    recovery: 'Incorporate active recovery days',
    nextSteps: 'Gradually increase workout intensity to reach the next level'
  },
  'Above Average': {
    workout: 'Full Body Toning with progressive overload',
    cardio: 'Mix of moderate intensity cardio and beginning HIIT',
    nutrition: 'Balanced macronutrients with emphasis on protein intake',
    recovery: 'Ensure 1-2 full rest days per week',
    nextSteps: 'Begin tracking workouts more closely to ensure progression'
  },
  'Average': {
    workout: 'Full Body Toning or Beginner Strength Training',
    cardio: 'Moderate intensity cardio 3-4 times per week',
    nutrition: 'Focus on consistent meal timing and balanced nutrition',
    recovery: 'Prioritize sleep quality and stress management',
    nextSteps: 'Establish consistent workout routine before increasing intensity'
  },
  'Below Average': {
    workout: 'Beginner Strength Training',
    cardio: 'Start with walking and gradually add light jogging',
    nutrition: 'Focus on increasing protein intake and reducing processed foods',
    recovery: 'Ensure adequate rest between workouts (48 hours for beginners)',
    nextSteps: 'Build consistency with 3 workouts per week before adding more'
  },
  'Poor': {
    workout: 'Beginner Strength Training (modified if needed)',
    cardio: 'Start with walking and gradually increase duration',
    nutrition: 'Focus on establishing regular eating patterns with whole foods',
    recovery: 'Prioritize sleep and stress management alongside exercise',
    nextSteps: 'Consult with a fitness professional for personalized guidance'
  },
  'Very Poor': {
    workout: 'Modified Beginner program with focus on mobility',
    cardio: 'Start with short walking sessions and gradually build up',
    nutrition: 'Focus on hydration and adding more whole foods',
    recovery: 'Consider working with a professional for proper form guidance',
    nextSteps: 'Consult with healthcare provider before beginning intensive exercise'
  }
};

// Component for fitness score breakdown
function FitnessScoreBreakdown({ 
  hrScore, 
  strengthScore, 
  enduranceScore 
}: { 
  hrScore: number; 
  strengthScore: number; 
  enduranceScore: number; 
}) {
  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-medium">Fitness Score Breakdown</h3>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <HeartIcon className="h-4 w-4 mr-2 text-red-500" />
              <span className="text-sm font-medium">Cardiovascular Health</span>
            </div>
            <span className="text-sm font-medium">{hrScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div 
              className="bg-red-500 h-2 rounded-full" 
              style={{ width: `${hrScore}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <DumbbellIcon className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-sm font-medium">Strength</span>
            </div>
            <span className="text-sm font-medium">{strengthScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${strengthScore}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <TimerIcon className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-sm font-medium">Endurance</span>
            </div>
            <span className="text-sm font-medium">{enduranceScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${enduranceScore}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FitnessAssessment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fitnessResult, setFitnessResult] = useState<string | null>(null);
  const [fitnessScore, setFitnessScore] = useState<number | null>(null);
  const [scoreBreakdown, setScoreBreakdown] = useState<{
    hrScore: number;
    strengthScore: number;
    enduranceScore: number;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: '',
      gender: '',
      weight: '',
      height: '',
      restingHeartRate: '',
      pushUps: '',
      sitUps: '',
      runTime: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call and calculation
    setTimeout(() => {
      try {
        const result = calculateFitnessLevel({
          age: parseInt(values.age),
          gender: values.gender,
          restingHeartRate: parseInt(values.restingHeartRate),
          pushUps: parseInt(values.pushUps),
          sitUps: parseInt(values.sitUps),
          runTime: parseFloat(values.runTime),
        });
        
        setFitnessResult(result.level);
        setFitnessScore(result.score);
        
        // Mock breakdown scores - in a real app, these would come from the calculation
        const mockBreakdown = {
          hrScore: Math.round(result.score * (0.8 + Math.random() * 0.4)),
          strengthScore: Math.round(result.score * (0.8 + Math.random() * 0.4)),
          enduranceScore: Math.round(result.score * (0.8 + Math.random() * 0.4)),
        };
        
        // Ensure none of the scores exceed 100
        mockBreakdown.hrScore = Math.min(mockBreakdown.hrScore, 100);
        mockBreakdown.strengthScore = Math.min(mockBreakdown.strengthScore, 100);
        mockBreakdown.enduranceScore = Math.min(mockBreakdown.enduranceScore, 100);
        
        setScoreBreakdown(mockBreakdown);
        
        toast.success('Fitness Assessment Complete', {
          description: `Your fitness level: ${result.level}`,
        });
      } catch (error) {
        console.error('Assessment calculation error:', error);
        toast.error('Error calculating fitness level', {
          description: 'Please check your inputs and try again.',
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {fitnessResult && fitnessScore && (
        <div className="space-y-6">
          <Alert className="mb-6">
            <ActivityIcon className="h-4 w-4" />
            <AlertTitle>Your Fitness Assessment Result</AlertTitle>
            <AlertDescription>
              Based on your inputs, your fitness level is: <span className={`font-bold ${getScoreColor(fitnessScore)}`}>{fitnessResult}</span>
              {fitnessScore && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                    <div 
                      className={`h-2.5 rounded-full ${
                        fitnessScore >= 80 ? 'bg-green-600' : 
                        fitnessScore >= 60 ? 'bg-blue-600' : 
                        fitnessScore >= 40 ? 'bg-yellow-600' : 
                        'bg-red-600'
                      }`}
                      style={{ width: `${Math.min(fitnessScore, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Poor</span>
                    <span>Average</span>
                    <span>Excellent</span>
                  </div>
                </div>
              )}
            </AlertDescription>
          </Alert>

          {scoreBreakdown && (
            <FitnessScoreBreakdown 
              hrScore={scoreBreakdown.hrScore}
              strengthScore={scoreBreakdown.strengthScore}
              enduranceScore={scoreBreakdown.enduranceScore}
            />
          )}

          <Tabs defaultValue="recommendations" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
            </TabsList>
            <TabsContent value="recommendations" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recommended Workout Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{fitnessRecommendations[fitnessResult as keyof typeof fitnessRecommendations]?.workout || 'Beginner Strength Training'}</p>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Cardio Recommendation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{fitnessRecommendations[fitnessResult as keyof typeof fitnessRecommendations]?.cardio || 'Start with walking and gradually increase intensity'}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Nutrition Focus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{fitnessRecommendations[fitnessResult as keyof typeof fitnessRecommendations]?.nutrition || 'Focus on whole foods and proper hydration'}</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recovery Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{fitnessRecommendations[fitnessResult as keyof typeof fitnessRecommendations]?.recovery || 'Ensure adequate rest between workouts'}</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="next-steps" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Path Forward</CardTitle>
                  <CardDescription>Based on your current fitness level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{fitnessRecommendations[fitnessResult as keyof typeof fitnessRecommendations]?.nextSteps || 'Start with a consistent workout routine'}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Areas to Focus On:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {scoreBreakdown && scoreBreakdown.hrScore < 60 && (
                        <li>Improve cardiovascular health with regular cardio sessions</li>
                      )}
                      {scoreBreakdown && scoreBreakdown.strengthScore < 60 && (
                        <li>Increase strength training frequency and intensity</li>
                      )}
                      {scoreBreakdown && scoreBreakdown.enduranceScore < 60 && (
                        <li>Build endurance with longer duration, moderate intensity activities</li>
                      )}
                      <li>Reassess your fitness level every 4-6 weeks to track progress</li>
                    </ul>
                  </div>
                  
                  <Button className="w-full mt-2">View Recommended Workout Plans</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="70" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="175" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="restingHeartRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resting Heart Rate (bpm)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="65" {...field} />
                </FormControl>
                <FormDescription>
                  Your heart rate when completely at rest.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="pushUps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Push-ups (max)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sitUps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sit-ups (1 min)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="runTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>1-Mile Run (min)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="8.5" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Calculating...' : 'Calculate Fitness Level'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 