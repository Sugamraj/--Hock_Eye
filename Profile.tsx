import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Weight, Ruler, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { user, isAuthenticated } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user) {
      setWeight(user.weight.toString());
      setHeight(user.height.toString());
      setAge(user.age.toString());
    }
  }, [isAuthenticated, user, navigate]);

  if (!user) {
    return null; // Or a loading spinner
  }

  const calculateBMI = () => {
    const weightKg = user.weight;
    const heightM = user.height / 100;
    const bmi = weightKg / (heightM * heightM);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-500" };
    if (bmi < 25) return { category: "Normal weight", color: "text-green-500" };
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-500" };
    return { category: "Obesity", color: "text-red-500" };
  };

  const bmi = Number(calculateBMI());
  const bmiCategory = getBMICategory(bmi);

  const handleUpdateProfile = () => {
    // In a real app, this would update the user profile
    // For our mock app, we'll just show a toast
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">My Profile</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-fitness-blue flex items-center justify-center text-white text-2xl font-bold mb-2">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="font-bold text-xl">{user.name}</h2>
                <p className="text-muted-foreground">{user.mobile}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                    <User className="h-5 w-5 text-fitness-blue" />
                    <div>
                      <p className="text-xs text-muted-foreground">Gender</p>
                      <p className="font-medium capitalize">{user.gender}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                    <Calendar className="h-5 w-5 text-fitness-green" />
                    <div>
                      <p className="text-xs text-muted-foreground">Age</p>
                      <p className="font-medium">{user.age} years</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                    <Weight className="h-5 w-5 text-fitness-blue" />
                    <div>
                      <p className="text-xs text-muted-foreground">Weight</p>
                      <p className="font-medium">{user.weight} kg</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                    <Ruler className="h-5 w-5 text-fitness-green" />
                    <div>
                      <p className="text-xs text-muted-foreground">Height</p>
                      <p className="font-medium">{user.height} cm</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Body Mass Index (BMI)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-muted flex flex-col items-center justify-center">
                  <span className={`text-2xl font-bold ${bmiCategory.color}`}>{bmi}</span>
                  <span className="text-xs text-muted-foreground">BMI</span>
                </div>
              </div>
              <p className="text-center font-medium mb-2">
                Category: <span className={bmiCategory.color}>{bmiCategory.category}</span>
              </p>
              <p className="text-center text-sm text-muted-foreground">
                BMI is a measure of body fat based on height and weight.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Update Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input 
                    id="weight" 
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input 
                    id="height" 
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleUpdateProfile} 
                  className="w-full fitness-gradient"
                >
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
