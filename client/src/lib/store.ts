import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Student {
  id: string;
  name: string;
  email: string;
  username: string;
  password?: string; // Added password field
  avatar?: string;
  joinedAt: string;
}

export interface TaskStage {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  stages: TaskStage[];
  createdAt: string;
}

export interface StudentProgress {
  studentUsername: string;
  taskId: string;
  completedStages: string[]; // array of stage IDs
}

interface AppState {
  isAdminLogged: boolean;
  loggedStudent: Student | null;
  students: Student[];
  tasks: Task[];
  progress: StudentProgress[];
  
  // Actions
  loginAdmin: () => void;
  logoutAdmin: () => void;
  loginStudent: (username: string, password?: string) => boolean;
  logoutStudent: () => void;
  addStudent: (student: Omit<Student, 'id' | 'joinedAt'>) => void;
  deleteStudent: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  deleteTask: (id: string) => void;
  updateProgress: (studentUsername: string, taskId: string, stageId: string, completed: boolean) => void;
  registerStudent: (student: Omit<Student, 'id' | 'joinedAt'>) => void;
}

// Initial Mock Data
const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: 'Alice Walker', email: 'alice@example.com', username: 'alice', password: 'password', joinedAt: new Date().toISOString() },
  { id: '2', name: 'Bob Ross', email: 'bob@example.com', username: 'bob', password: 'password', joinedAt: new Date().toISOString() },
];

const INITIAL_TASKS: Task[] = [
  { 
    id: '1', 
    title: 'React Fundamentals', 
    description: 'Learn the basics of React components and state.', 
    createdAt: new Date().toISOString(),
    stages: [
      { id: 's1', name: 'Components' },
      { id: 's2', name: 'Props & State' },
      { id: 's3', name: 'Hooks' }
    ] 
  }
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAdminLogged: false,
      loggedStudent: null,
      students: INITIAL_STUDENTS,
      tasks: INITIAL_TASKS,
      progress: [],

      loginAdmin: () => set({ isAdminLogged: true }),
      logoutAdmin: () => set({ isAdminLogged: false }),

      loginStudent: (username, password) => {
        const student = get().students.find(s => s.username === username);
        // In a real app, we'd check the password properly. For this mockup, we check if it matches if provided.
        if (student && (!student.password || !password || student.password === password)) {
          set({ loggedStudent: student });
          return true;
        }
        return false;
      },
      
      logoutStudent: () => set({ loggedStudent: null }),

      registerStudent: (data) => set((state) => ({
        students: [...state.students, { ...data, id: Math.random().toString(36).substr(2, 9), joinedAt: new Date().toISOString() }]
      })),

      addStudent: (data) => set((state) => ({
        students: [...state.students, { ...data, id: Math.random().toString(36).substr(2, 9), joinedAt: new Date().toISOString() }]
      })),

      deleteStudent: (id) => set((state) => ({
        students: state.students.filter(s => s.id !== id)
      })),

      addTask: (data) => set((state) => ({
        tasks: [...state.tasks, { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() }]
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id),
        progress: state.progress.filter(p => p.taskId !== id) // Cleanup progress
      })),

      updateProgress: (studentUsername, taskId, stageId, completed) => set((state) => {
        const existingProgressIndex = state.progress.findIndex(p => p.studentUsername === studentUsername && p.taskId === taskId);
        let newProgress = [...state.progress];

        if (existingProgressIndex >= 0) {
          const current = newProgress[existingProgressIndex];
          const stageSet = new Set(current.completedStages);
          if (completed) stageSet.add(stageId);
          else stageSet.delete(stageId);
          
          newProgress[existingProgressIndex] = { ...current, completedStages: Array.from(stageSet) };
        } else if (completed) {
          newProgress.push({
            studentUsername,
            taskId,
            completedStages: [stageId]
          });
        }
        
        return { progress: newProgress };
      }),
    }),
    {
      name: 'lms-storage', // unique name for localStorage
    }
  )
);
