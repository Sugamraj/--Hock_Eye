import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Utensils } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const CalorieTracker = () => {
  const { calorieIntakes, addCalorieIntake, weeklyGoals } = useUser();
  const { toast } = useToast();
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get today's calorie intake
  const today = new Date().toISOString().split('T')[0];
  const todayIntakes = calorieIntakes.filter(c => c.date === today);
  const totalCaloriesToday = todayIntakes.reduce((sum, intake) => sum + intake.calories, 0);
  
  // Get current calorie goal
  const currentDate = new Date().toISOString().split('T')[0];
  const currentGoal = weeklyGoals.find(g => 
    g.startDate <= currentDate && g.endDate >= currentDate
  );
  const calorieGoal = currentGoal?.calorieGoal || 2000; // Default 2000 calories if no goal set
  
  const progressPercentage = Math.min(100, (totalCaloriesToday / calorieGoal) * 100);

  // Calculate calories by meal type
  const mealTypeCalories = {
    breakfast: todayIntakes.filter(c => c.mealType === "breakfast").reduce((sum, intake) => sum + intake.calories, 0),
    lunch: todayIntakes.filter(c => c.mealType === "lunch").reduce((sum, intake) => sum + intake.calories, 0),
    dinner: todayIntakes.filter(c => c.mealType === "dinner").reduce((sum, intake) => sum + intake.calories, 0),
    snack: todayIntakes.filter(c => c.mealType === "snack").reduce((sum, intake) => sum + intake.calories, 0)
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!foodName.trim()) newErrors.foodName = "Food name is required";
    
    if (!calories.trim()) newErrors.calories = "Calories are required";
    else if (isNaN(Number(calories)) || Number(calories) <= 0) 
      newErrors.calories = "Calories must be a positive number";
      
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCalorieIntake = () => {
    if (!validateForm()) return;
    
    addCalorieIntake({
      foodName,
      calories: Number(calories),
      mealType
    });
    
    toast({
      title: "Food Added",
      description: `${foodName} has been added to your calorie log.`,
    });
    
    // Reset form
    setFoodName("");
    setCalories("");
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <Utensils className="h-5 w-5 text-fitness-blue mr-2" />
          Calorie Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Today's intake</span>
            <span className="text-sm font-medium">{totalCaloriesToday} / {calorieGoal} kcal</span>
          </div>
          
          <Progress value={progressPercentage} className="h-2 mb-4" />
          
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">Breakfast</div>
              <div className="font-medium">{mealTypeCalories.breakfast} kcal</div>
            </div>
            <div className="p-2 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">Lunch</div>
              <div className="font-medium">{mealTypeCalories.lunch} kcal</div>
            </div>
            <div className="p-2 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">Dinner</div>
              <div className="font-medium">{mealTypeCalories.dinner} kcal</div>
            </div>
            <div className="p-2 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">Snacks</div>
              <div className="font-medium">{mealTypeCalories.snack} kcal</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Recent Food Entries</h4>
            {todayIntakes.length > 0 ? (
              <div className="space-y-2">
                {todayIntakes.slice(0, 3).map((intake) => (
                  <div key={intake.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{intake.foodName}</p>
                      <p className="text-xs text-muted-foreground capitalize">{intake.mealType}</p>
                    </div>
                    <div className="text-sm font-medium">
                      {intake.calories} kcal
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No food entries logged today</p>
            )}
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-fitness-blue hover:bg-fitness-blue-dark text-white">
                Log Food
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Food Intake</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="food-name">Food Name</Label>
                  <Input 
                    id="food-name" 
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    placeholder="e.g., Chicken Salad, Apple, etc."
                    className={errors.foodName ? "border-destructive" : ""}
                  />
                  {errors.foodName && <p className="text-destructive text-xs">{errors.foodName}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="meal-type">Meal Type</Label>
                  <Select 
                    value={mealType} 
                    onValueChange={(value) => setMealType(value as "breakfast" | "lunch" | "dinner" | "snack")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input 
                    id="calories" 
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className={errors.calories ? "border-destructive" : ""}
                  />
                  {errors.calories && <p className="text-destructive text-xs">{errors.calories}</p>}
                </div>
                
                <Button 
                  onClick={handleAddCalorieIntake} 
                  className="w-full bg-fitness-blue hover:bg-fitness-blue-dark text-white"
                >
                  Save Food Entry
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalorieTracker;
