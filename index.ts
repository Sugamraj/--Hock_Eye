export interface User {
    id: string;
    name: string;
    gender: 'male' | 'female' | 'other';
    weight: number;
    height: number;
    age: number;
    mobile: string;
  }
  
  export interface WaterIntake {
    date: string;
    amount: number; // in milliliters
  }
  
  export interface Exercise {
    id: string;
    date: string;
    name: string;
    duration: number; // in minutes
    caloriesBurned: number;
  }
  
  export interface CalorieIntake {
    id: string;
    date: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foodName: string;
    calories: number;
  }
  
  export interface WeeklyGoal {
    id: string;
    startDate: string;
    endDate: string;
    waterGoal: number; // in milliliters per day
    exerciseGoal: number; // in minutes per week
    calorieGoal: number; // per day
  }
  