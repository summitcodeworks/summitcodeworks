'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

// Utility function to format date as yyyy-MM-dd
const formatDate = (date: Date) => date.toISOString().split("T")[0];

const formSchema = z.object({
    workoutType: z.string({
        required_error: 'Please select a workout type.',
    }),
    date: z.date({
        required_error: 'Please select a date.',
    }),
    duration: z.string().min(1, {
        message: 'Please enter a duration.',
    }),
    caloriesBurned: z.string().min(1, {
        message: 'Please enter calories burned.',
    }),
    notes: z.string().optional(),
});

export default function WorkoutLogForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            workoutType: '',
            date: new Date(),
            duration: '',
            caloriesBurned: '',
            notes: '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        setTimeout(() => {
            console.log(values);
            toast.success('Workout logged successfully!', {
                description: `${values.workoutType} workout on ${formatDate(values.date)}`,
            });

            form.reset({
                workoutType: '',
                date: new Date(),
                duration: '',
                caloriesBurned: '',
                notes: '',
            });

            setIsSubmitting(false);
        }, 1000);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="workoutType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Workout Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a workout type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="cardio">Cardio</SelectItem>
                                    <SelectItem value="strength">Strength Training</SelectItem>
                                    <SelectItem value="flexibility">Flexibility</SelectItem>
                                    <SelectItem value="hiit">HIIT</SelectItem>
                                    <SelectItem value="yoga">Yoga</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Select the type of workout you completed.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className="w-full pl-3 text-left font-normal"
                                        >
                                            {field.value ? (
                                                formatDate(field.value) // Use our custom function
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date('1900-01-01')
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                The date you completed this workout.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration (minutes)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="30" {...field} />
                                </FormControl>
                                <FormDescription>
                                    How long was your workout?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="caloriesBurned"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Calories Burned</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="250" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Estimated calories burned.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Add any additional notes about your workout..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Optional details about your workout.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Log Workout'}
                </Button>
            </form>
        </Form>
    );
}
