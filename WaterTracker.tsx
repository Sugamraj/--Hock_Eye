import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Droplet, Plus, Minus } from "lucide-react";

const WaterTracker = () => {
  const { waterIntakes, addWaterIntake, weeklyGoals } = useUser();
  const [amount, setAmount] = useState(250); // Default 250ml

  // Get today's water intake
  const today = new Date().toISOString().split('T')[0];
  const todayIntake = waterIntakes.find(w => w.date === today)?.amount || 0;
  
  // Get current water goal
  const currentDate = new Date().toISOString().split('T')[0];
  const currentGoal = weeklyGoals.find(g => 
    g.startDate <= currentDate && g.endDate >= currentDate
  );
  const waterGoal = currentGoal?.waterGoal || 2000; // Default 2000ml if no goal set
  
  const progressPercentage = Math.min(100, (todayIntake / waterGoal) * 100);

  const handleAddWater = () => {
    addWaterIntake(amount);
  };

  const increaseAmount = () => {
    setAmount(prev => prev + 50);
  };

  const decreaseAmount = () => {
    setAmount(prev => Math.max(50, prev - 50));
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <Droplet className="h-5 w-5 text-fitness-blue mr-2" />
          Water Intake
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Today's intake</span>
          <span className="text-sm font-medium">{todayIntake}ml / {waterGoal}ml</span>
        </div>
        
        <Progress value={progressPercentage} className="h-2 mb-4" />
        
        <div className="relative mt-6 pt-6 flex items-center justify-center">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-fitness-blue flex items-center justify-center text-white">
            <span className="text-xl font-bold">{Math.round(progressPercentage)}%</span>
          </div>
          
          <div className="flex items-center space-x-2 mt-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={decreaseAmount}
              className="rounded-full"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">{amount}ml</span>
              <span className="text-xs text-muted-foreground">Amount to add</span>
            </div>
            
            <Button 
              variant="outline"
              size="icon"
              onClick={increaseAmount}
              className="rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Button 
          onClick={handleAddWater} 
          className="w-full mt-4 bg-fitness-blue hover:bg-fitness-blue-dark text-white"
        >
          Add Water
        </Button>
      </CardContent>
    </Card>
  );
};

export default WaterTracker;
