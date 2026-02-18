import { useState } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { GlassCard, GlassInput, GlassButton } from "@/components/ui/glass";
import { User, Lock, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentLogin() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const loginStudent = useStore((state) => state.loginStudent);
  const registerStudent = useStore((state) => state.registerStudent);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
          description: "Student username not found.",
        });
        setIsLoading(false);
      }
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !name || !email) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      registerStudent({ username, name, email });
      loginStudent(username);
      toast({
        title: "Registration Successful",
        description: "Your account has been created and logged in.",
      });
      setLocation("/student");
    }, 1000);
  };

  return (
    <AuthLayout 
      title={isRegistering ? "Create Account" : "Student Portal"} 
      subtitle={isRegistering ? "Join the learning community" : "Access Your Learning Path"}
    >
      <GlassCard>
        <AnimatePresence mode="wait">
          {!isRegistering ? (
            <motion.form 
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleLogin} 
              className="space-y-6"
            >
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

              <div className="flex flex-col gap-3 text-center">
                <button 
                  type="button" 
                  onClick={() => setIsRegistering(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Don't have an account? Register here
                </button>
                <GlassButton variant="ghost" type="button" onClick={() => setLocation("/")} className="text-xs text-muted-foreground">
                  <ArrowLeft className="w-3 h-3 mr-1" /> Back to Home
                </GlassButton>
              </div>
            </motion.form>
          ) : (
            <motion.form 
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleRegister} 
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <GlassInput 
                    className="pl-10" 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <GlassInput 
                    className="pl-10" 
                    placeholder="johndoe" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <GlassInput 
                    type="email"
                    className="pl-10" 
                    placeholder="john@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4">
                <GlassButton type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Register & Login"}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-1" />}
                </GlassButton>
              </div>

              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => setIsRegistering(false)}
                  className="text-sm text-primary hover:underline"
                >
                  Already have an account? Login
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </GlassCard>
      
      {!isRegistering && (
        <p className="text-center text-xs text-muted-foreground mt-8">
          Hint: Try username <strong>alice</strong> or <strong>bob</strong>
        </p>
      )}
    </AuthLayout>
  );
}
