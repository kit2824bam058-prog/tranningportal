import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

export const GlassCard = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "bg-card/30 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6",
        className
      )}
      {... (props as any)}
    >
      {children}
    </motion.div>
  );
};

export const GlassInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={cn(
        "w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-200 hover:bg-black/30",
        className
      )}
      {...props}
    />
  );
};

export const GlassButton = ({ className, variant = "primary", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost" }) => {
  const variants = {
    primary: "bg-primary hover:bg-primary/80 text-white shadow-lg shadow-primary/20",
    secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/10",
    danger: "bg-destructive/80 hover:bg-destructive text-white",
    ghost: "hover:bg-white/5 text-white/70 hover:text-white",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {... (props as any)}
    />
  );
};
