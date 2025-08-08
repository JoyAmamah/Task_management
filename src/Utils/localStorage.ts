import type { Task } from "../Types/types";

const STORAGE_KEY = "todos";

export const loadTasks = (): Task[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const addTaskToStorage = (task: Task): void => {
  const tasks = loadTasks();
  const updated = [task, ...tasks]; 
  saveTasks(updated);
};


export const deleteTaskFromStorage = (taskId: string): void => {
  const tasks = loadTasks();
  const filtered = tasks.filter(task => task.id !== taskId);
  saveTasks(filtered);
};

export const updateTaskInStorage = (updatedTask: Task): void => {
  const tasks = loadTasks();
  const updated = tasks.map(task => 
    task.id === updatedTask.id ? updatedTask : task
  );
  saveTasks(updated);
};


