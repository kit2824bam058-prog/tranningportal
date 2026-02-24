import { create } from 'zustand';
import { type Student, type Task, type Progress } from '@shared/schema';

interface AppState {
  isAdminLogged: boolean;
  loggedStudent: Student | null;
  students: Student[];
  tasks: Task[];
  progress: Progress[];
  loading: boolean;

  // Actions
  initialize: () => Promise<void>;
  loginAdmin: () => void;
  logoutAdmin: () => void;
  loginStudent: (username: string, password?: string) => boolean;
  logoutStudent: () => void;
  addStudent: (student: Omit<Student, 'id' | 'joinedAt'>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateProgress: (studentUsername: string, taskId: string, stageId: string, completed: boolean) => Promise<void>;
  registerStudent: (student: Omit<Student, 'id' | 'joinedAt'>) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  isAdminLogged: false,
  loggedStudent: null,
  students: [],
  tasks: [],
  progress: [],
  loading: true,

  initialize: async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      set({
        students: data.students,
        tasks: data.tasks,
        progress: data.progress,
        loading: false
      });
    } catch (error) {
      console.error('Initialization error:', error);
      set({ loading: false });
    }
  },

  loginAdmin: () => set({ isAdminLogged: true }),
  logoutAdmin: () => set({ isAdminLogged: false }),

  loginStudent: (username: string, password?: string) => {
    const student = get().students.find(s => s.username === username);
    if (student && (!student.password || !password || student.password === password)) {
      set({ loggedStudent: student });
      return true;
    }
    return false;
  },

  logoutStudent: () => set({ loggedStudent: null }),

  registerStudent: async (data: Omit<Student, 'id' | 'joinedAt'>) => {
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const newStudent = await response.json();
      set((state: AppState) => ({ students: [...state.students, newStudent] }));
    }
  },

  addStudent: async (data: Omit<Student, 'id' | 'joinedAt'>) => {
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const newStudent = await response.json();
      set((state: AppState) => ({ students: [...state.students, newStudent] }));
    }
  },

  deleteStudent: async (id: string) => {
    const response = await fetch(`/api/students/${id}`, { method: 'DELETE' });
    if (response.ok) {
      set((state: AppState) => ({ students: state.students.filter(s => s.id !== id) }));
    }
  },

  addTask: async (data: Omit<Task, 'id' | 'createdAt'>) => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const newTask = await response.json();
      set((state: AppState) => ({ tasks: [...state.tasks, newTask] }));
    }
  },

  deleteTask: async (id: string) => {
    const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (response.ok) {
      set((state: AppState) => ({
        tasks: state.tasks.filter(t => t.id !== id),
        progress: state.progress.filter(p => p.taskId !== id)
      }));
    }
  },

  updateProgress: async (studentUsername: string, taskId: string, stageId: string, completed: boolean) => {
    const state = get();
    const existing = state.progress.find(p => p.studentUsername === studentUsername && p.taskId === taskId);

    let completedStages = existing ? [...existing.completedStages] : [];
    if (completed) {
      if (!completedStages.includes(stageId)) completedStages.push(stageId);
    } else {
      completedStages = completedStages.filter(id => id !== stageId);
    }

    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentUsername, taskId, completedStages }),
    });

    if (response.ok) {
      const updatedProgress = await response.json();
      set((state: AppState) => ({
        progress: state.progress.some(p => p.id === updatedProgress.id)
          ? state.progress.map(p => p.id === updatedProgress.id ? updatedProgress : p)
          : [...state.progress, updatedProgress]
      }));
    }
  },
}));
