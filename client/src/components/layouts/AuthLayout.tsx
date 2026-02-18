import { motion } from "framer-motion";

export const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold font-display tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground mt-2"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        {children}
      </motion.div>
    </div>
  );
};
