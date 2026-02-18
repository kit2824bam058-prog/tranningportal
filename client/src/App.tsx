import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import AdminLogin from "@/pages/AdminLogin";
import StudentLogin from "@/pages/StudentLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import StudentDashboard from "@/pages/StudentDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login/admin" component={AdminLogin} />
      <Route path="/login/student" component={StudentLogin} />
      
      {/* Protected Routes - Logic handled inside pages or wrapper */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/:section" component={AdminDashboard} />
      
      <Route path="/student" component={StudentDashboard} />
      <Route path="/student/:section" component={StudentDashboard} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
