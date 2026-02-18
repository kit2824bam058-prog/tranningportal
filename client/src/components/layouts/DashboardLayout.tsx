import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, LayoutDashboard, Users, CheckSquare, PieChart, Settings, User } from "lucide-react";
import { GlassButton } from "@/components/ui/glass";

interface SidebarItem {
  icon: any;
  label: string;
  href?: string;
  action?: () => void;
  active?: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  userType: "Admin" | "Student";
  userName?: string;
  onLogout: () => void;
}

export const DashboardLayout = ({ children, sidebarItems, userType, userName, onLogout }: DashboardLayoutProps) => {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 fixed inset-y-0 left-0 z-50 hidden md:flex flex-col border-r border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-2xl font-bold font-display bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            {userType} Portal
          </h2>
          {userName && <p className="text-sm text-muted-foreground mt-1">Welcome, {userName}</p>}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item, index) => (
            item.href ? (
              <Link key={index} href={item.href}>
                <a className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                  location === item.href 
                    ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--color-primary),0.1)]" 
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}>
                  {location === item.href && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 bg-primary/10 border-l-2 border-primary"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className="w-5 h-5 relative z-10" />
                  <span className="font-medium relative z-10">{item.label}</span>
                </a>
              </Link>
            ) : (
              <button
                key={index}
                onClick={item.action}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <GlassButton variant="ghost" onClick={onLogout} className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300">
            <LogOut className="w-4 h-4" />
            Logout
          </GlassButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative overflow-y-auto h-screen scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
           <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
