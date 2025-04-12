import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Clock, Flame } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ExerciseTracker = () => {
  const { exercises, addExercise, weeklyGoals } = useUser();
  const { toast } = useToast();
  const [exerciseName, setExerciseName] = useState("");
  const [duration, setDuration] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get this week's exercises
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);
  
  const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  const endOfWeekStr = endOfWeek.toISOString().split('T')[0];
  
  const thisWeekExercises = exercises.filter(
    e => e.date >= startOfWeekStr && e.date <= endOfWeekStr
  );
  
  // Calculate total minutes exercised this week
  const totalMinutesThisWeek = thisWeekExercises.reduce(
    (total, ex) => total + ex.duration, 0
  );
  
  // Get current exercise goal
  const currentGoal = weeklyGoals.find(g => 
    g.startDate <= today.toISOString().split('T')[0] && 
    g.endDate >= today.toISOString().split('T')[0]
  );
  const exerciseGoal = currentGoal?.exerciseGoal || 150; // Default 150 minutes if no goal set
  
  const progressPercentage = Math.min(100, (totalMinutesThisWeek / exerciseGoal) * 100);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!exerciseName.trim()) newErrors.name = "Exercise name is required";
    
    if (!duration.trim()) newErrors.duration = "Duration is required";
    else if (isNaN(Number(duration)) || Number(duration) <= 0) 
      newErrors.duration = "Duration must be a positive number";
    
    if (!caloriesBurned.trim()) newErrors.calories = "Calories burned is required";
    else if (isNaN(Number(caloriesBurned)) || Number(caloriesBurned) < 0) 
      newErrors.calories = "Calories must be a positive number";
      
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddExercise = () => {
    if (!validateForm()) return;
    
    addExercise({
      name: exerciseName,
      duration: Number(duration),
      caloriesBurned: Number(caloriesBurned)
    });
    
    toast({
      title: "Exercise Added",
      description: `${exerciseName} has been added to your log.`,
    });
    
    // Reset form
    setExerciseName("");
    setDuration("");
    setCaloriesBurned("");
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <Activity className="h-5 w-5 text-fitness-green mr-2" />
          Exercise Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">This Week</h3>
              <p className="text-sm text-muted-foreground">{startOfWeekStr} - {endOfWeekStr}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{totalMinutesThisWeek} min</p>
              <p className="text-sm text-muted-foreground">of {exerciseGoal} min goal</p>
            </div>
          </div>

          <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-fitness-green rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Recent Exercises</h4>
            {thisWeekExercises.length > 0 ? (
              <div className="space-y-2">
                {thisWeekExercises.slice(0, 3).map((exercise) => (
                  <div key={exercise.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-fitness-green" />
                      <div>
                        <p className="font-medium text-sm">{exercise.name}</p>
                        <p className="text-xs text-muted-foreground">{new Date(exercise.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span className="text-xs">{exercise.duration} min</span>
                      </div>
                      <div className="flex items-center">
                        <Flame className="h-3 w-3 mr-1 text-orange-500" />
                        <span className="text-xs">{exercise.caloriesBurned} cal</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No exercises logged this week</p>
            )}
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-fitness-green hover:bg-fitness-green-dark text-white">
                Log Exercise
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log New Exercise</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="exercise-name">Exercise Name</Label>
                  <Input 
                    id="exercise-name" 
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    placeholder="e.g., Running, Yoga, Weightlifting"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input 
                      id="duration" 
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className={errors.duration ? "border-destructive" : ""}
                    />
                    {errors.duration && <p className="text-destructive text-xs">{errors.duration}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="calories">Calories Burned</Label>
                    <Input 
                      id="calories" 
                      type="number"
                      value={caloriesBurned}
                      onChange={(e) => setCaloriesBurned(e.target.value)}
                      className={errors.calories ? "border-destructive" : ""}
                    />
                    {errors.calories && <p className="text-destructive text-xs">{errors.calories}</p>}
                  </div>
                </div>
                
                <Button 
                  onClick={handleAddExercise} 
                  className="w-full bg-fitness-green hover:bg-fitness-green-dark text-white"
                >
                  Save Exercise
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseTracker;
