import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { addTask, updateTask } from "../features/taskSlice";
import type { Task, TaskModalProps } from "../Types/types";
import { toast } from "react-toastify";

const TaskModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}: TaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setStatus(initialData.status || "todo");
    } else {
      setTitle("");
      setDescription("");
      setStatus("todo");
    }
    setError("");
  }, [initialData, isOpen]);

 const handleSubmit = () => {
  if (!title.trim()) {
    setError("Task title is required!");
    return;
  }
  if (!description.trim()) {
    setError("Task description is required!");
    return;
  }

  const newTask: Task = {
    id: initialData ? initialData.id : uuidv4(),
    title,
    description,
    status,
  };

  if (initialData) {
    dispatch(updateTask(newTask));
    toast.success("Task updated successfully ");
  } else {
    dispatch(addTask(newTask));
    onSave(newTask);
    toast.success("Task added successfully ");
  }

  if (!initialData) {
    setTitle("");
    setDescription("");
    setStatus("todo");
    setError("");
  }

  setTimeout(() => {
    onClose();
  }, 800);
};

  if (!isOpen) return null;

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-900 p-6 rounded-lg w-[90%] max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 dark:text-gray-100">
          {initialData ? "Edit Task" : "Add Task"}
        </h2>

        {error && (
          <p className="mb-2 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Title"
          className="w-full mb-2 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full mb-2 p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <select
          className="w-full mb-4 p-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="todo">To do</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </section>
  );
};

export default TaskModal;
