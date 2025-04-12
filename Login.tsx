import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const { login } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!mobile.trim()) {
      setError("Mobile number is required");
      return;
    }
    
    if (!/^\d{10}$/.test(mobile.trim())) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    
    setIsLoading(true);
    const success = await login(mobile);
    setIsLoading(false);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome back to BeFit!",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Mobile number not registered. Please sign up first.",
        variant: "destructive",
      });
      setError("Mobile number not registered. Please sign up first.");
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
            Welcome back! Login to continue your fitness journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input 
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className={error ? "border-destructive" : ""}
                placeholder="Enter your 10-digit mobile number"
              />
              {error && <p className="text-destructive text-xs mt-1">{error}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full fitness-gradient"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button 
              variant="link" 
              className="p-0 text-fitness-blue font-semibold"
              onClick={() => navigate("/register")}
            >
              Sign up
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
