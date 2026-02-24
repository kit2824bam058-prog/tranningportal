import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import type { Student, Task } from "@shared/schema";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { GlassCard, GlassButton, GlassInput } from "@/components/ui/glass";
import {
  Users, CheckSquare, PieChart, Download, Trash2, Plus,
  Search, BarChart as BarChartIcon, MoreVertical
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell
} from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

// --- SECTIONS ---

const StudentsSection = () => {
  const students = useStore(state => state.students);
  const deleteStudent = useStore(state => state.deleteStudent);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      deleteStudent(id);
      toast({ title: "Student deleted" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Students Management</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <GlassInput
            placeholder="Search students..."
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <GlassCard className="p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 text-muted-foreground font-medium">Profile</th>
                <th className="p-4 text-muted-foreground font-medium">Name</th>
                <th className="p-4 text-muted-foreground font-medium">Username</th>
                <th className="p-4 text-muted-foreground font-medium">Email</th>
                <th className="p-4 text-muted-foreground font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">No students found.</td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                        {student.name.charAt(0)}
                      </div>
                    </td>
                    <td className="p-4 text-white font-medium">{student.name}</td>
                    <td className="p-4 text-muted-foreground">@{student.username}</td>
                    <td className="p-4 text-muted-foreground">{student.email}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="p-2 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </GlassCard>
      </div>
    </div>
  );
};

const TasksSection = () => {
  const tasks = useStore(state => state.tasks);
  const addTask = useStore(state => state.addTask);
  const deleteTask = useStore(state => state.deleteTask);
  const { toast } = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [stages, setStages] = useState<string[]>([]);
  const [currentStage, setCurrentStage] = useState("");

  const handleAddStage = () => {
    if (currentStage.trim()) {
      setStages([...stages, currentStage.trim()]);
      setCurrentStage("");
    }
  };

  const handleCreateTask = () => {
    if (!newTaskTitle || !newTaskDesc || stages.length === 0) {
      toast({ title: "Please fill all fields and add at least one stage", variant: "destructive" });
      return;
    }

    addTask({
      title: newTaskTitle,
      description: newTaskDesc,
      stages: stages.map(s => ({ id: Math.random().toString(36).substr(2, 9), name: s }))
    });

    toast({ title: "Task created successfully" });
    setIsCreating(false);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setStages([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Task Management</h2>
        <GlassButton onClick={() => setIsCreating(!isCreating)}>
          <Plus className="w-4 h-4 mr-2" /> Create Task
        </GlassButton>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <GlassCard className="mb-6 border-primary/30 bg-primary/5">
              <h3 className="text-xl font-bold text-white mb-4">New Task Details</h3>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Task Title</label>
                  <GlassInput value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="e.g. React Basics" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Description</label>
                  <GlassInput value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} placeholder="Task description..." />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Stages</label>
                  <div className="flex gap-2 mb-2">
                    <GlassInput
                      value={currentStage}
                      onChange={e => setCurrentStage(e.target.value)}
                      placeholder="Add a stage (e.g. 'Read Documentation')"
                      onKeyDown={e => e.key === 'Enter' && handleAddStage()}
                    />
                    <GlassButton onClick={handleAddStage} type="button" variant="secondary">Add</GlassButton>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {stages.map((stage: string, idx: number) => (
                      <span key={idx} className="bg-white/10 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {stage}
                        <button onClick={() => setStages(stages.filter((_: string, i: number) => i !== idx))} className="hover:text-red-400">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <GlassButton variant="ghost" onClick={() => setIsCreating(false)}>Cancel</GlassButton>
                  <GlassButton onClick={handleCreateTask}>Save Task</GlassButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <GlassCard key={task.id} className="relative group hover:border-white/30 transition-colors">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => deleteTask(task.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{task.title}</h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{task.description}</p>
            <div className="space-y-2">
              <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Stages ({task.stages.length})</p>
              <div className="flex flex-wrap gap-1">
                {task.stages.slice(0, 3).map(stage => (
                  <span key={stage.id} className="text-xs bg-black/30 px-2 py-1 rounded border border-white/5 text-muted-foreground">
                    {stage.name}
                  </span>
                ))}
                {task.stages.length > 3 && (
                  <span className="text-xs bg-black/30 px-2 py-1 rounded border border-white/5 text-muted-foreground">
                    +{task.stages.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

const AnalyticsSection = () => {
  const students = useStore(state => state.students);
  const tasks = useStore(state => state.tasks);
  const progress = useStore(state => state.progress);

  // Calculate Data
  const studentPerformance = students.map(student => {
    let totalStages = 0;
    let completedStages = 0;

    tasks.forEach(task => {
      totalStages += task.stages.length;
      const studentTaskProgress = progress.find(p => p.studentUsername === student.username && p.taskId === task.id);
      if (studentTaskProgress) {
        completedStages += studentTaskProgress.completedStages.length;
      }
    });

    const percentage = totalStages === 0 ? 0 : Math.round((completedStages / totalStages) * 100);
    return { name: student.name, completion: percentage };
  });

  const totalTasks = tasks.length;
  // This logic for completed tasks is simplified: a task is "completed" for a student if they finished all stages.
  let fullyCompletedTasksCount = 0;
  let pendingTasksCount = 0;

  tasks.forEach(task => {
    students.forEach(student => {
      const p = progress.find(pr => pr.studentUsername === student.username && pr.taskId === task.id);
      if (p && p.completedStages.length === task.stages.length) {
        fullyCompletedTasksCount++;
      } else {
        pendingTasksCount++;
      }
    });
  });

  const pieData = [
    { name: 'Completed', value: fullyCompletedTasksCount },
    { name: 'Pending', value: pendingTasksCount },
  ];

  const COLORS = ['#8b5cf6', '#334155'];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Performance Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="h-[400px] flex flex-col">
          <h3 className="text-lg font-medium text-white mb-6">Student Completion Rates</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={studentPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="completion" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="h-[400px] flex flex-col">
          <h3 className="text-lg font-medium text-white mb-6">Overall Task Status</h3>
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("students");
  const isAdminLogged = useStore(state => state.isAdminLogged);
  const logoutAdmin = useStore(state => state.logoutAdmin);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAdminLogged) {
      setLocation("/login/admin");
    }
  }, [isAdminLogged, setLocation]);

  const handleExport = () => {
    const students = useStore.getState().students;
    const csvContent = "data:text/csv;charset=utf-8,"
      + "ID,Name,Username,Email,Joined At\n"
      + students.map(s => `${s.id},${s.name},${s.username},${s.email},${s.joinedAt}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Export successful", description: "students_export.csv downloaded" });
  };

  if (!isAdminLogged) return null;

  const renderSection = () => {
    switch (activeSection) {
      case 'students': return <StudentsSection />;
      case 'tasks': return <TasksSection />;
      case 'analytics': return <AnalyticsSection />;
      default: return <StudentsSection />;
    }
  };

  return (
    <DashboardLayout
      userType="Admin"
      userName="Administrator"
      onLogout={() => {
        logoutAdmin();
        setLocation("/");
      }}
      sidebarItems={[
        { label: "Students", icon: Users, action: () => setActiveSection('students'), active: activeSection === 'students' },
        { label: "Tasks", icon: CheckSquare, action: () => setActiveSection('tasks'), active: activeSection === 'tasks' },
        { label: "Analytics", icon: PieChart, action: () => setActiveSection('analytics'), active: activeSection === 'analytics' },
        { label: "Export Excel", icon: Download, action: handleExport },
      ]}
    >
      <div className="pt-6">
        {renderSection()}
      </div>
    </DashboardLayout>
  );
}
