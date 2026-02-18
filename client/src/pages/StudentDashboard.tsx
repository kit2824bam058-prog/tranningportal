import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useStore, Task } from "@/lib/store";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { GlassCard, GlassButton } from "@/components/ui/glass";
import { 
  LayoutDashboard, CheckSquare, BarChart2, Settings, User, CheckCircle, Circle, X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import * as Progress from '@radix-ui/react-progress';

// --- COMPONENTS ---

const TaskCard = ({ task, onClick, progressPercent }: { task: Task; onClick: () => void; progressPercent: number }) => {
  return (
    <GlassCard 
      onClick={onClick}
      className="cursor-pointer group hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
           <span className="text-xs font-bold text-primary mb-1 block uppercase tracking-wider">Task</span>
           <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{task.title}</h3>
        </div>
        <div className="text-xs font-mono text-muted-foreground bg-white/5 px-2 py-1 rounded">
          {task.stages.length} Steps
        </div>
      </div>
      
      <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{task.description}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-white/70">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <Progress.Root className="relative overflow-hidden bg-white/10 rounded-full w-full h-2" value={progressPercent}>
          <Progress.Indicator 
            className="bg-primary w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.65, 0, 0.35, 1)]" 
            style={{ transform: `translateX(-${100 - progressPercent}%)` }} 
          />
        </Progress.Root>
      </div>
    </GlassCard>
  );
};

const TaskModal = ({ task, isOpen, onClose, studentUsername }: { task: Task | null, isOpen: boolean, onClose: () => void, studentUsername: string }) => {
  if (!isOpen || !task) return null;

  const progress = useStore(state => state.progress);
  const updateProgress = useStore(state => state.updateProgress);
  
  const myProgress = progress.find(p => p.studentUsername === studentUsername && p.taskId === task.id);
  const completedStages = myProgress?.completedStages || [];

  const handleToggleStage = (stageId: string) => {
    const isCompleted = completedStages.includes(stageId);
    updateProgress(studentUsername, task.id, stageId, !isCompleted);
  };

  const percent = task.stages.length > 0 ? Math.round((completedStages.length / task.stages.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-start bg-white/5">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{task.title}</h2>
            <p className="text-muted-foreground">{task.description}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
           <div className="flex items-center gap-4 mb-6 p-4 bg-primary/10 rounded-xl border border-primary/20">
             <div className="flex-1">
               <div className="flex justify-between mb-2">
                 <span className="font-bold text-primary">Total Progress</span>
                 <span className="text-white font-mono">{percent}%</span>
               </div>
               <Progress.Root className="relative overflow-hidden bg-black/20 rounded-full w-full h-3" value={percent}>
                <Progress.Indicator 
                  className="bg-primary w-full h-full transition-transform duration-500" 
                  style={{ transform: `translateX(-${100 - percent}%)` }} 
                />
              </Progress.Root>
             </div>
           </div>

           <div className="space-y-3">
             <h3 className="text-lg font-bold text-white mb-4">Task Stages</h3>
             {task.stages.map(stage => {
               const isDone = completedStages.includes(stage.id);
               return (
                 <div 
                   key={stage.id}
                   onClick={() => handleToggleStage(stage.id)}
                   className={`
                     group flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200
                     ${isDone 
                       ? 'bg-primary/20 border-primary/50' 
                       : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}
                   `}
                 >
                   <div className={`
                     w-6 h-6 rounded-full flex items-center justify-center border transition-colors
                     ${isDone ? 'bg-primary border-primary text-white' : 'border-white/30 text-transparent group-hover:border-white/50'}
                   `}>
                     <CheckCircle className="w-4 h-4" />
                   </div>
                   <span className={`font-medium ${isDone ? 'text-white line-through opacity-70' : 'text-white'}`}>
                     {stage.name}
                   </span>
                 </div>
               );
             })}
           </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- SECTIONS ---

const MyTasksSection = ({ tasks, studentUsername, onOpenTask }: { tasks: Task[], studentUsername: string, onOpenTask: (task: Task) => void }) => {
  const progress = useStore(state => state.progress);
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">My Assignments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => {
           const myProgress = progress.find(p => p.studentUsername === studentUsername && p.taskId === task.id);
           const completedCount = myProgress?.completedStages.length || 0;
           const percent = task.stages.length > 0 ? Math.round((completedCount / task.stages.length) * 100) : 0;
           
           return (
             <TaskCard 
               key={task.id} 
               task={task} 
               progressPercent={percent}
               onClick={() => onOpenTask(task)}
             />
           );
        })}
        {tasks.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No tasks assigned yet.
          </div>
        )}
      </div>
    </div>
  );
};

const ProgressSection = ({ tasks, studentUsername }: { tasks: Task[], studentUsername: string }) => {
  const progress = useStore(state => state.progress);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">My Progress</h2>
      <div className="space-y-4">
        {tasks.map(task => {
          const myProgress = progress.find(p => p.studentUsername === studentUsername && p.taskId === task.id);
          const completedCount = myProgress?.completedStages.length || 0;
          const percent = task.stages.length > 0 ? Math.round((completedCount / task.stages.length) * 100) : 0;
          const isComplete = percent === 100;

          return (
            <GlassCard key={task.id} className="flex items-center gap-6">
               <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
                 {isComplete ? <CheckCircle className="text-green-400" /> : <Circle className="text-muted-foreground" />}
               </div>
               <div className="flex-1">
                 <div className="flex justify-between mb-2">
                   <h3 className="font-bold text-white">{task.title}</h3>
                   <span className={`text-sm font-medium ${isComplete ? 'text-green-400' : 'text-primary'}`}>
                     {isComplete ? 'Completed' : 'In Progress'}
                   </span>
                 </div>
                 <Progress.Root className="relative overflow-hidden bg-black/30 rounded-full w-full h-2" value={percent}>
                    <Progress.Indicator 
                      className={`h-full transition-transform duration-500 ${isComplete ? 'bg-green-400' : 'bg-primary'}`}
                      style={{ transform: `translateX(-${100 - percent}%)` }} 
                    />
                  </Progress.Root>
               </div>
               <div className="text-white font-mono font-bold w-12 text-right">{percent}%</div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState("tasks");
  const loggedStudent = useStore(state => state.loggedStudent);
  const tasks = useStore(state => state.tasks);
  const logoutStudent = useStore(state => state.logoutStudent);
  const [, setLocation] = useLocation();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!loggedStudent) {
      setLocation("/login/student");
    }
  }, [loggedStudent, setLocation]);

  if (!loggedStudent) return null;

  return (
    <DashboardLayout
      userType="Student"
      userName={loggedStudent.name}
      onLogout={() => {
        logoutStudent();
        setLocation("/");
      }}
      sidebarItems={[
        { label: "My Tasks", icon: LayoutDashboard, action: () => setActiveSection('tasks'), active: activeSection === 'tasks' },
        { label: "Progress", icon: BarChart2, action: () => setActiveSection('progress'), active: activeSection === 'progress' },
        { label: "Settings", icon: Settings, action: () => {}, active: activeSection === 'settings' },
      ]}
    >
      <div className="pt-6">
        {activeSection === 'tasks' && (
          <MyTasksSection 
            tasks={tasks} 
            studentUsername={loggedStudent.username} 
            onOpenTask={setSelectedTask} 
          />
        )}
        {activeSection === 'progress' && (
          <ProgressSection tasks={tasks} studentUsername={loggedStudent.username} />
        )}
      </div>

      <AnimatePresence>
        {selectedTask && (
          <TaskModal 
            task={selectedTask} 
            isOpen={!!selectedTask} 
            onClose={() => setSelectedTask(null)} 
            studentUsername={loggedStudent.username}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
