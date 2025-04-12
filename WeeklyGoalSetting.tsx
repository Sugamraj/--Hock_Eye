import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const WeeklyGoalSetting = () => {
  const { weeklyGoals, setWeeklyGoal } = useUser();
  const { toast } = useToast();
  const [waterGoal, setWaterGoal] = useState("2000");
  const [exerciseGoal, setExerciseGoal] = useState("150");
  const [calorieGoal, setCalorieGoal] = useState("2000");
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get current weekly goal if exists
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)
  startOfWeek.setHours(0, 0, 0, 0);
  
  const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  const endOfWeekStr = endOfWeek.toISOString().split('T')[0];
  
  const currentWeekGoal = weeklyGoals.find(g => 
    g.startDate === startOfWeekStr && g.endDate === endOfWeekStr
  );

  // Set initial values from current goal if exists
  useEffect(() => {
    if (currentWeekGoal) {
      setWaterGoal(currentWeekGoal.waterGoal.toString());
      setExerciseGoal(currentWeekGoal.exerciseGoal.toString());
      setCalorieGoal(currentWeekGoal.calorieGoal.toString());
    }
  }, [currentWeekGoal]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!waterGoal.trim()) newErrors.water = "Water goal is required";
    else if (isNaN(Number(waterGoal)) || Number(waterGoal) <= 0) 
      newErrors.water = "Water goal must be a positive number";
    
    if (!exerciseGoal.trim()) newErrors.exercise = "Exercise goal is required";
    else if (isNaN(Number(exerciseGoal)) || Number(exerciseGoal) <= 0) 
      newErrors.exercise = "Exercise goal must be a positive number";
    
    if (!calorieGoal.trim()) newErrors.calorie = "Calorie goal is required";
    else if (isNaN(Number(calorieGoal)) || Number(calorieGoal) <= 0) 
      newErrors.calorie = "Calorie goal must be a positive number";
      
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSetGoal = () => {
    if (!validateForm()) return;
    
    setWeeklyGoal({
      waterGoal: Number(waterGoal),
      exerciseGoal: Number(exerciseGoal),
      calorieGoal: Number(calorieGoal)
    });
    
    toast({
      title: "Weekly Goals Set",
      description: "Your fitness goals for this week have been updated.",
    });
    
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <Target className="h-5 w-5 text-fitness-green mr-2" />
          Weekly Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm">
            <p className="font-medium">Current Week</p>
            <p className="text-muted-foreground">{startOfWeekStr} - {endOfWeekStr}</p>
          </div>
          
          {currentWeekGoal ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Water Intake</span>
                <span className="font-medium">{currentWeekGoal.waterGoal}ml / day</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Exercise</span>
                <span className="font-medium">{currentWeekGoal.exerciseGoal} min / week</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Calorie Intake</span>
                <span className="font-medium">{currentWeekGoal.calorieGoal} kcal / day</span>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-muted-foreground">No goals set for this week</p>
            </div>
          )}
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-fitness-blue to-fitness-green text-white">
                {currentWeekGoal ? "Update Goals" : "Set Weekly Goals"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Weekly Goals</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="water-goal">Daily Water Goal (ml)</Label>
                  <Input 
                    id="water-goal" 
                    type="number"
                    value={waterGoal}
                    onChange={(e) => setWaterGoal(e.target.value)}
                    className={errors.water ? "border-destructive" : ""}
                  />
                  {errors.water && <p className="text-destructive text-xs">{errors.water}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exercise-goal">Weekly Exercise Goal (minutes)</Label>
                  <Input 
                    id="exercise-goal" 
                    type="number"
                    value={exerciseGoal}
                    onChange={(e) => setExerciseGoal(e.target.value)}
                    className={errors.exercise ? "border-destructive" : ""}
                  />
                  {errors.exercise && <p className="text-destructive text-xs">{errors.exercise}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="calorie-goal">Daily Calorie Goal (kcal)</Label>
                  <Input 
                    id="calorie-goal" 
                    type="number"
                    value={calorieGoal}
                    onChange={(e) => setCalorieGoal(e.target.value)}
                    className={errors.calorie ? "border-destructive" : ""}
                  />
                  {errors.calorie && <p className="text-destructive text-xs">{errors.calorie}</p>}
                </div>
                
                <Button 
                  onClick={handleSetGoal} 
                  className="w-full bg-gradient-to-r from-fitness-blue to-fitness-green text-white"
                >
                  Save Goals
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyGoalSetting;
