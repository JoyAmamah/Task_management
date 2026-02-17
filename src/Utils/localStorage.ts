import type { Task } from "../Types/types";

const STORAGE_KEY = "tasks";

export const loadTasks = (): Task[] => {
  const tasks = localStorage.getItem(STORAGE_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const addTaskToStorage = (task: Task) => {
  const tasks = loadTasks();
  tasks.push(task);
  saveTasks(tasks);
};

export const updateTaskInStorage = (updatedTask: Task) => {
  let tasks = loadTasks();
  tasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
  saveTasks(tasks);
};

export const deleteTaskFromStorage = (id: string) => {
  let tasks = loadTasks();
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks(tasks);
};
