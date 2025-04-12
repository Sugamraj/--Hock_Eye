mport React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Register = () => {
  const { register } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!weight.trim()) newErrors.weight = "Weight is required";
    else if (isNaN(Number(weight)) || Number(weight) <= 0) 
      newErrors.weight = "Weight must be a positive number";
    
    if (!height.trim()) newErrors.height = "Height is required";
    else if (isNaN(Number(height)) || Number(height) <= 0) 
      newErrors.height = "Height must be a positive number";
    
    if (!age.trim()) newErrors.age = "Age is required";
    else if (isNaN(Number(age)) || Number(age) <= 0 || Number(age) >= 120) 
      newErrors.age = "Age must be a valid number between 1-120";
    
    if (!mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(mobile.trim())) 
      newErrors.mobile = "Please enter a valid 10-digit mobile number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const success = await register({
      name,
      gender,
      weight: Number(weight),
      height: Number(height),
      age: Number(age),
      mobile
    });

    if (success) {
      toast({
        title: "Registration Successful",
        description: "Welcome to BeFit! Your account has been created.",
        variant: "default",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Registration Failed",
        description: "This mobile number is already registered.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fitness-blue-light to-fitness-green-light p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fitness-blue to-fitness-green">
            BeFit
          </CardTitle>
          <CardDescription>
            Start your fitness journey today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="gender">Gender</Label>
              <Select 
                value={gender} 
                onValueChange={(value) => setGender(value as "male" | "female" | "other")}
              >
                <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-destructive text-xs mt-1">{errors.gender}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input 
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className={errors.weight ? "border-destructive" : ""}
                />
                {errors.weight && <p className="text-destructive text-xs mt-1">{errors.weight}</p>}
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="height">Height (cm)</Label>
                <Input 
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className={errors.height ? "border-destructive" : ""}
                />
                {errors.height && <p className="text-destructive text-xs mt-1">{errors.height}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="age">Age</Label>
              <Input 
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={errors.age ? "border-destructive" : ""}
              />
              {errors.age && <p className="text-destructive text-xs mt-1">{errors.age}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input 
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className={errors.mobile ? "border-destructive" : ""}
                placeholder="10-digit mobile number"
              />
              {errors.mobile && <p className="text-destructive text-xs mt-1">{errors.mobile}</p>}
            </div>

            <Button type="submit" className="w-full fitness-gradient">
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button 
              variant="link" 
              className="p-0 text-fitness-blue font-semibold"
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
