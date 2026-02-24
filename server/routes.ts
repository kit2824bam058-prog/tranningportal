import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.ts";
import { insertStudentSchema, insertTaskSchema, insertProgressSchema } from "../shared/schema.ts";

export async function registerRoutes(
  app: Express
): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Students
  app.get("/api/students", async (_req: Request, res: Response) => {
    const students = await storage.getStudents();
    res.json(students);
  });

  app.post("/api/students", async (req: Request, res: Response) => {
    const parsed = insertStudentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const student = await storage.createStudent(parsed.data);
    res.status(201).json(student);
  });

  app.delete("/api/students/:id", async (req: Request, res: Response) => {
    await storage.deleteStudent(req.params.id as string);
    res.sendStatus(204);
  });

  // Tasks
  app.get("/api/tasks", async (_req: Request, res: Response) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.post("/api/tasks", async (req: Request, res: Response) => {
    const parsed = insertTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const task = await storage.createTask(parsed.data);
    res.status(201).json(task);
  });

  app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
    await storage.deleteTask(req.params.id as string);
    await storage.deleteProgressByTaskId(req.params.id as string);
    res.sendStatus(204);
  });

  // Progress
  app.get("/api/progress", async (_req: Request, res: Response) => {
    const progress = await storage.getProgress();
    res.json(progress);
  });

  app.post("/api/progress", async (req: Request, res: Response) => {
    const parsed = insertProgressSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const progress = await storage.updateProgress(parsed.data);
    res.json(progress);
  });

  // Initial Data
  app.get("/api/data", async (_req: Request, res: Response) => {
    const [students, tasks, progress] = await Promise.all([
      storage.getStudents(),
      storage.getTasks(),
      storage.getProgress()
    ]);
    res.json({ students, tasks, progress });
  });

  const httpServer = createServer(app);
  return httpServer;
}
