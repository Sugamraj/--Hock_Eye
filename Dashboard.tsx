import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import WaterTracker from "@/components/WaterTracker";
import ExerciseTracker from "@/components/ExerciseTracker";
import CalorieTracker from "@/components/CalorieTracker";
import WeeklyGoalSetting from "@/components/WeeklyGoalSetting";
import { PersonStanding, LogOut } from "lucide-react";

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null; // Or a loading spinner
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fitness-blue to-fitness-green">
              BeFit
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-700 hover:text-fitness-blue"
              onClick={() => navigate("/profile")}
            >
              <PersonStanding className="h-5 w-5 mr-2" />
              Profile
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-700 hover:text-red-500"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Message */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold">Welcome, {user.name}!</h2>
          <p className="text-muted-foreground">
            Track your fitness journey and achieve your goals.
          </p>
        </div>

        {/* Trackers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <WaterTracker />
          <ExerciseTracker />
          <CalorieTracker />
        </div>

        {/* Weekly Goals Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <WeeklyGoalSetting />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 BeFit. Your personal fitness journey tracker.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

