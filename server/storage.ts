import {
  type User, type InsertUser,
  type Student, type InsertStudent,
  type Task, type InsertTask,
  type Progress, type InsertProgress,
  UserModel, StudentModel, TaskModel, ProgressModel
} from "../shared/schema.ts";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Students
  getStudents(): Promise<Student[]>;
  getStudentByUsername(username: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  deleteStudent(id: string): Promise<void>;

  // Tasks
  getTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  deleteTask(id: string): Promise<void>;

  // Progress
  getProgress(): Promise<Progress[]>;
  updateProgress(p: InsertProgress): Promise<Progress>;
  deleteProgressByTaskId(taskId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ id }).lean();
    return user as unknown as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ username }).lean();
    return user as unknown as User | undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = await UserModel.create(insertUser);
    return user.toObject() as User;
  }

  async getStudents(): Promise<Student[]> {
    return (await StudentModel.find().lean()) as unknown as Student[];
  }

  async getStudentByUsername(username: string): Promise<Student | undefined> {
    const student = await StudentModel.findOne({ username }).lean();
    return student as unknown as Student | undefined;
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const student = await StudentModel.create(insertStudent);
    return student.toObject() as Student;
  }

  async deleteStudent(id: string): Promise<void> {
    await StudentModel.deleteOne({ id });
  }

  async getTasks(): Promise<Task[]> {
    return (await TaskModel.find().lean()) as unknown as Task[];
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const task = await TaskModel.create(insertTask);
    return task.toObject() as Task;
  }

  async deleteTask(id: string): Promise<void> {
    await TaskModel.deleteOne({ id });
  }

  async getProgress(): Promise<Progress[]> {
    return (await ProgressModel.find().lean()) as unknown as Progress[];
  }

  async updateProgress(insertProgress: InsertProgress): Promise<Progress> {
    const existing = await ProgressModel.findOne({
      studentUsername: insertProgress.studentUsername,
      taskId: insertProgress.taskId
    });

    if (existing) {
      existing.completedStages = insertProgress.completedStages;
      await existing.save();
      return existing.toObject() as Progress;
    } else {
      const created = await ProgressModel.create(insertProgress);
      return created.toObject() as Progress;
    }
  }

  async deleteProgressByTaskId(taskId: string): Promise<void> {
    await ProgressModel.deleteMany({ taskId });
  }
}

export const storage = new DatabaseStorage();
