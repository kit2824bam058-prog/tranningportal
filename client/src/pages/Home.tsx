import { Link } from "wouter";
import { motion } from "framer-motion";
import { Shield, User, ChevronRight } from "lucide-react";
import { GlassCard, GlassButton } from "@/components/ui/glass";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay -z-10" />
      
      {/* Floating Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/30 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, 50, 0],
          opacity: [0.2, 0.4, 0.2] 
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-1/4 -right-20 w-[30rem] h-[30rem] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="max-w-4xl w-full text-center space-y-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-4 tracking-wider uppercase">
            LMS Platform v1.0
          </span>
          <h1 className="text-6xl md:text-8xl font-bold font-display tracking-tight text-white mb-6">
            Future <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400">Learning</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Manage students, track progress, and organize tasks with a next-generation dashboard experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link href="/login/admin">
            <GlassCard className="group cursor-pointer hover:border-primary/50 transition-all duration-300 h-full flex flex-col items-center justify-center text-center p-10 hover:bg-white/5">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
              <p className="text-muted-foreground mb-6">Manage students, tasks, and view analytics.</p>
              <GlassButton variant="ghost" className="group-hover:bg-primary group-hover:text-white w-full">
                Login as Admin <ChevronRight className="w-4 h-4 ml-1" />
              </GlassButton>
            </GlassCard>
          </Link>

          <Link href="/login/student">
            <GlassCard className="group cursor-pointer hover:border-cyan-400/50 transition-all duration-300 h-full flex flex-col items-center justify-center text-center p-10 hover:bg-white/5">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Student Portal</h2>
              <p className="text-muted-foreground mb-6">View tasks, track progress, and manage your profile.</p>
              <GlassButton variant="ghost" className="group-hover:bg-cyan-500 group-hover:text-white w-full">
                Login as Student <ChevronRight className="w-4 h-4 ml-1" />
              </GlassButton>
            </GlassCard>
          </Link>
        </div>
      </div>
      
      <footer className="absolute bottom-6 text-white/20 text-sm">
        &copy; 2026 Education Systems Inc. All rights reserved.
      </footer>
    </div>
  );
}
