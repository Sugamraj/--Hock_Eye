mport React, { createContext, useContext, useState, useEffect } from "react";
import { User, WaterIntake, Exercise, CalorieIntake, WeeklyGoal } from "@/types";

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  waterIntakes: WaterIntake[];
  exercises: Exercise[];
  calorieIntakes: CalorieIntake[];
  weeklyGoals: WeeklyGoal[];
  login: (mobile: string) => Promise<boolean>;
  register: (userData: Omit<User, "id">) => Promise<boolean>;
  logout: () => void;
  addWaterIntake: (amount: number) => void;
  addExercise: (exercise: Omit<Exercise, "id" | "date">) => void;
  addCalorieIntake: (calorieIntake: Omit<CalorieIntake, "id" | "date">) => void;
  setWeeklyGoal: (goal: Omit<WeeklyGoal, "id" | "startDate" | "endDate">) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock database for demo purposes
const mockUsers: User[] = [];
const mockWaterIntakes: WaterIntake[] = [];
const mockExercises: Exercise[] = [];
const mockCalorieIntakes: CalorieIntake[] = [];
const mockWeeklyGoals: WeeklyGoal[] = [];

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [waterIntakes, setWaterIntakes] = useState<WaterIntake[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [calorieIntakes, setCalorieIntakes] = useState<CalorieIntake[]>([]);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("befit_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      
      // Load user data
      const storedWaterIntakes = localStorage.getItem(`befit_water_${JSON.parse(storedUser).id}`);
      const storedExercises = localStorage.getItem(`befit_exercises_${JSON.parse(storedUser).id}`);
      const storedCalorieIntakes = localStorage.getItem(`befit_calories_${JSON.parse(storedUser).id}`);
      const storedWeeklyGoals = localStorage.getItem(`befit_goals_${JSON.parse(storedUser).id}`);
      
      if (storedWaterIntakes) setWaterIntakes(JSON.parse(storedWaterIntakes));
      if (storedExercises) setExercises(JSON.parse(storedExercises));
      if (storedCalorieIntakes) setCalorieIntakes(JSON.parse(storedCalorieIntakes));
      if (storedWeeklyGoals) setWeeklyGoals(JSON.parse(storedWeeklyGoals));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`befit_water_${user.id}`, JSON.stringify(waterIntakes));
      localStorage.setItem(`befit_exercises_${user.id}`, JSON.stringify(exercises));
      localStorage.setItem(`befit_calories_${user.id}`, JSON.stringify(calorieIntakes));
      localStorage.setItem(`befit_goals_${user.id}`, JSON.stringify(weeklyGoals));
    }
  }, [user, waterIntakes, exercises, calorieIntakes, weeklyGoals]);

  const register = async (userData: Omit<User, "id">): Promise<boolean> => {
    // Check if mobile already exists
    const existingUser = mockUsers.find(u => u.mobile === userData.mobile);
    if (existingUser) {
      return false;
    }

    // Create new user
    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };
    
    // Add to mock database
    mockUsers.push(newUser);
    
    // Save to localStorage
    localStorage.setItem("befit_users", JSON.stringify(mockUsers));
    localStorage.setItem("befit_user", JSON.stringify(newUser));
    
    setUser(newUser);
    return true;
  };

  const login = async (mobile: string): Promise<boolean> => {
    // Load users from localStorage
    const storedUsers = localStorage.getItem("befit_users");
    const users = storedUsers ? JSON.parse(storedUsers) : mockUsers;
    
    // Find user by mobile
    const foundUser = users.find((u: User) => u.mobile === mobile);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("befit_user", JSON.stringify(foundUser));
      
      // Load user data
      const storedWaterIntakes = localStorage.getItem(`befit_water_${foundUser.id}`);
      const storedExercises = localStorage.getItem(`befit_exercises_${foundUser.id}`);
      const storedCalorieIntakes = localStorage.getItem(`befit_calories_${foundUser.id}`);
      const storedWeeklyGoals = localStorage.getItem(`befit_goals_${foundUser.id}`);
      
      if (storedWaterIntakes) setWaterIntakes(JSON.parse(storedWaterIntakes));
      if (storedExercises) setExercises(JSON.parse(storedExercises));
      if (storedCalorieIntakes) setCalorieIntakes(JSON.parse(storedCalorieIntakes));
      if (storedWeeklyGoals) setWeeklyGoals(JSON.parse(storedWeeklyGoals));
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setWaterIntakes([]);
    setExercises([]);
    setCalorieIntakes([]);
    setWeeklyGoals([]);
    localStorage.removeItem("befit_user");
  };

  const addWaterIntake = (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if there's already an entry for today
    const existingIndex = waterIntakes.findIndex(w => w.date === today);
    
    if (existingIndex >= 0) {
      const updatedIntakes = [...waterIntakes];
      updatedIntakes[existingIndex] = {
        ...updatedIntakes[existingIndex],
        amount: updatedIntakes[existingIndex].amount + amount
      };
      setWaterIntakes(updatedIntakes);
    } else {
      setWaterIntakes([...waterIntakes, { date: today, amount }]);
    }
  };

  const addExercise = (exercise: Omit<Exercise, "id" | "date">) => {
    const newExercise: Exercise = {
      ...exercise,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setExercises([...exercises, newExercise]);
  };

  const addCalorieIntake = (calorieIntake: Omit<CalorieIntake, "id" | "date">) => {
    const newCalorieIntake: CalorieIntake = {
      ...calorieIntake,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setCalorieIntakes([...calorieIntakes, newCalorieIntake]);
  };

  const setWeeklyGoal = (goal: Omit<WeeklyGoal, "id" | "startDate" | "endDate">) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // End of the week (Saturday)
    
    const newGoal: WeeklyGoal = {
      ...goal,
      id: Date.now().toString(),
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
    
    // Remove previous goals for this week if any
    const filteredGoals = weeklyGoals.filter(g => 
      g.startDate !== newGoal.startDate || g.endDate !== newGoal.endDate
    );
    
    setWeeklyGoals([...filteredGoals, newGoal]);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        waterIntakes,
        exercises,
        calorieIntakes,
        weeklyGoals,
        login,
        register,
        logout,
        addWaterIntake,
        addExercise,
        addCalorieIntake,
        setWeeklyGoal
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
