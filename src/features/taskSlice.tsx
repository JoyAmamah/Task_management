import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch } from './store';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [
    {
      id: '1',
      title: 'Welcome Task',
      description: 'This is your first task. Edit or delete it to get started!',
      status: 'todo',
      priority: 'medium',
      assignee: '1',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Complete Project Documentation',
      description: 'Write comprehensive documentation for the new feature',
      status: 'in-progress',
      priority: 'high',
      assignee: '2',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Team Meeting Preparation',
      description: 'Prepare agenda and materials for weekly team meeting',
      status: 'completed',
      priority: 'medium',
      assignee: '1',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Add a new task
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      state.loading = false;
      state.error = null;
    },

    // Update an existing task
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
      state.loading = false;
      state.error = null;
    },

    // Delete a task
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      state.loading = false;
      state.error = null;
    },

    // Reorder tasks (for drag and drop)
    reorderTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },

    // Assign task to a team member
    assignTask: (state, action: PayloadAction<{ taskId: string; assignee: string }>) => {
      const { taskId, assignee } = action.payload;
      const task = state.tasks.find(task => task.id === taskId);
      if (task) {
        task.assignee = assignee;
        task.updatedAt = new Date().toISOString();
      }
    },

    // Update task status
    updateTaskStatus: (state, action: PayloadAction<{ taskId: string; status: Task['status'] }>) => {
      const { taskId, status } = action.payload;
      const task = state.tasks.find(task => task.id === taskId);
      if (task) {
        task.status = status;
        task.updatedAt = new Date().toISOString();
      }
    },

    // Update task priority
    updateTaskPriority: (state, action: PayloadAction<{ taskId: string; priority: Task['priority'] }>) => {
      const { taskId, priority } = action.payload;
      const task = state.tasks.find(task => task.id === taskId);
      if (task) {
        task.priority = priority;
        task.updatedAt = new Date().toISOString();
      }
    },

    // Add attachment to task
    addAttachment: (state, action: PayloadAction<{ taskId: string; attachment: string }>) => {
      const { taskId, attachment } = action.payload;
      const task = state.tasks.find(task => task.id === taskId);
      if (task) {
        if (!task.attachments) {
          task.attachments = [];
        }
        task.attachments.push(attachment);
        task.updatedAt = new Date().toISOString();
      }
    },

    // Remove attachment from task
    removeAttachment: (state, action: PayloadAction<{ taskId: string; attachmentIndex: number }>) => {
      const { taskId, attachmentIndex } = action.payload;
      const task = state.tasks.find(task => task.id === taskId);
      if (task && task.attachments) {
        task.attachments.splice(attachmentIndex, 1);
        task.updatedAt = new Date().toISOString();
      }
    },

    // Bulk update tasks (for batch operations)
    bulkUpdateTasks: (state, action: PayloadAction<Task[]>) => {
      action.payload.forEach(updatedTask => {
        const index = state.tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = {
            ...updatedTask,
            updatedAt: new Date().toISOString(),
          };
        }
      });
    },

    // Clear all completed tasks
    clearCompletedTasks: (state) => {
      state.tasks = state.tasks.filter(task => task.status !== 'completed');
    },

    // Reset tasks to initial state
    resetTasks: (state) => {
      state.tasks = initialState.tasks;
      state.loading = false;
      state.error = null;
    },

    // Import tasks (for data migration)
    importTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = [...state.tasks, ...action.payload];
      state.loading = false;
      state.error = null;
    },

    // Duplicate a task
    duplicateTask: (state, action: PayloadAction<string>) => {
      const taskToDuplicate = state.tasks.find(task => task.id === action.payload);
      if (taskToDuplicate) {
        const duplicatedTask: Task = {
          ...taskToDuplicate,
          id: `task-${Date.now()}`,
          title: `${taskToDuplicate.title} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        state.tasks.push(duplicatedTask);
      }
    },
  },
});

export const {
  setLoading,
  setError,
  addTask,
  updateTask,
  deleteTask,
  reorderTasks,
  assignTask,
  updateTaskStatus,
  updateTaskPriority,
  addAttachment,
  removeAttachment,
  bulkUpdateTasks,
  clearCompletedTasks,
  resetTasks,
  importTasks,
  duplicateTask,
} = taskSlice.actions;

// Async action creators (for API calls) with proper typing
export const fetchTasks = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      // Simulate API call
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks';
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
    }
  };
};

export const saveTask = (task: Task) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      // Simulate API call
      setTimeout(() => {
        if (task.id) {
          dispatch(updateTask(task));
        } else {
          dispatch(addTask(task));
        }
      }, 500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save task';
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
    }
  };
};

// Selectors
export const selectAllTasks = (state: { tasks: TasksState }) => state.tasks.tasks;
export const selectTaskById = (state: { tasks: TasksState }, taskId: string) =>
  state.tasks.tasks.find(task => task.id === taskId);
export const selectTasksByStatus = (state: { tasks: TasksState }, status: Task['status']) =>
  state.tasks.tasks.filter(task => task.status === status);
export const selectTasksByAssignee = (state: { tasks: TasksState }, assigneeId: string) =>
  state.tasks.tasks.filter(task => task.assignee === assigneeId);
export const selectHighPriorityTasks = (state: { tasks: TasksState }) =>
  state.tasks.tasks.filter(task => task.priority === 'high');
export const selectOverdueTasks = (state: { tasks: TasksState }) =>
  state.tasks.tasks.filter(task => 
    task.dueDate && 
    new Date(task.dueDate) < new Date() && 
    task.status !== 'completed'
  );

export default taskSlice.reducer;