import { useState } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { GlassCard, GlassInput, GlassButton } from "@/components/ui/glass";
import { User, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StudentLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // Password validation is mock for students
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const loginStudent = useStore((state) => state.loginStudent);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const success = loginStudent(username);
      
      if (success) {
        toast({
          title: "Welcome Student",
          description: "Redirecting to your dashboard...",
        });
        setLocation("/student");
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Student username not found. Ask admin to register you.",
        });
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <AuthLayout title="Student Portal" subtitle="Access Your Learning Path">
      <GlassCard>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <GlassInput 
                className="pl-10" 
                placeholder="Enter your username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <GlassInput 
                type="password" 
                className="pl-10" 
                placeholder="Enter any password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <GlassButton type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Access Dashboard"}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-1" />}
            </GlassButton>
          </div>
          
          <div className="text-center">
             <GlassButton variant="ghost" type="button" onClick={() => setLocation("/")} className="text-xs text-muted-foreground">
              <ArrowLeft className="w-3 h-3 mr-1" /> Back to Home
            </GlassButton>
          </div>
        </form>
      </GlassCard>
       <p className="text-center text-xs text-muted-foreground mt-8">
        Hint: Try username <strong>alice</strong> or <strong>bob</strong>
      </p>
    </AuthLayout>
  );
}
