import { createSlice } from "@reduxjs/toolkit";
import type { Task } from "../Types/types";
import {
  loadTasks,
  addTaskToStorage,
  deleteTaskFromStorage,
  updateTaskInStorage,
} from "../Utils/localStorage";

const initialState = {
  tasks: loadTasks(), 
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: { payload: Task }) => {
        state.tasks.unshift(action.payload);
      addTaskToStorage(action.payload);
    },
    deleteTask: (state, action: { payload: string }) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      deleteTaskFromStorage(action.payload);
    },
    updateTask: (state, action: { payload: Task }) => {
      state.tasks = state.tasks.map((t) =>
        t.id === action.payload.id ? action.payload : t
      );
      updateTaskInStorage(action.payload);
    },
  },
});

export const { addTask, deleteTask, updateTask } = taskSlice.actions;
export default taskSlice.reducer;
