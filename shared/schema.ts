import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";
import { randomUUID } from "crypto";

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertStudentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  username: z.string().min(1, "Username is required"),
  password: z.string().optional(),
  avatar: z.string().optional(),
});

export const insertTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  stages: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })),
});

export const insertProgressSchema = z.object({
  studentUsername: z.string(),
  taskId: z.string(),
  completedStages: z.array(z.string()),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertProgress = z.infer<typeof insertProgressSchema>;

export interface User extends InsertUser {
  id: string;
}

export interface Student extends InsertStudent {
  id: string;
  joinedAt: Date;
}

export interface Task extends InsertTask {
  id: string;
  createdAt: Date;
}

export interface Progress extends InsertProgress {
  id: string;
}

// Mongoose Schemas
const userSchema = new Schema({
  id: { type: String, default: () => randomUUID(), unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const studentSchema = new Schema({
  id: { type: String, default: () => randomUUID(), unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: { type: String },
  joinedAt: { type: Date, default: Date.now },
});

const taskSchema = new Schema({
  id: { type: String, default: () => randomUUID(), unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  stages: [{
    id: String,
    name: String,
  }],
  createdAt: { type: Date, default: Date.now },
});

const progressSchema = new Schema({
  id: { type: String, default: () => randomUUID(), unique: true },
  studentUsername: { type: String, required: true },
  taskId: { type: String, required: true },
  completedStages: { type: [String], default: [] },
});

// Models (avoiding re-compilation in dev)
export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export const StudentModel = mongoose.models.Student || mongoose.model("Student", studentSchema);
export const TaskModel = mongoose.models.Task || mongoose.model("Task", taskSchema);
export const ProgressModel = mongoose.models.Progress || mongoose.model("Progress", progressSchema);

