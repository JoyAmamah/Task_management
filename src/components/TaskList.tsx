import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../features/store";
import { useState } from "react";
import { addTask, updateTask, deleteTask } from "../features/taskSlice";
import TaskModal from "./TaskModal";
import type { Task } from "../Types/types";
import type { AppDispatch } from "../features/store";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import TaskSummary from "./TaskSumary";

const TaskList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const loading = useSelector((state: RootState) => state.tasks.loading);
  const error = useSelector((state: RootState) => state.tasks.error);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const openAddModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (taskId: Task) => {
    setSelectedTask(taskId);
    setIsModalOpen(true);
  };

const handleSave = (task: Task) => {
  if (task.id && task.id.trim() !== "") {
    dispatch(updateTask(task));
  } else {
    const newTask = { ...task, id: uuidv4() };
    dispatch(addTask(newTask));
  }

  setIsModalOpen(false);
};



  const handleDelete = (taskId: string) => {
    dispatch(deleteTask(taskId));
        toast.info("Task deleted successfully");

  };

  const filteredTasks =
    statusFilter === "all"
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Tasks Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 mt-10">
        There is an error: {error}
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto bg-gray-400 px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Tasks Management
      </h1>
      <TaskSummary />
      <div className="flex flex-row justify-between m-5">
        <select
          className="p-2 border rounded text-gray-700"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="todo">To do</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>{" "}
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </div>

    {loading ? (
  <div className="flex justify-center items-center py-10">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    <span className="ml-3 text-gray-600">Loading tasks...</span>
  </div>
) : error ? (
  <p className="text-center text-red-500 mt-10">
    There is an error: {error}
  </p>
) : filteredTasks.length === 0 ? (
  <p className="text-center text-gray-500">No tasks available</p>
) : (
 
        <ul className="space-y-6">
          {filteredTasks
            .slice()
            .reverse()
            .map((task: Task) => (
              <li
                key={task.id}
                className="bg-white p-5 rounded-lg shadow-md border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-300"
              >
                <div className="flex-1 space-y-1">
                  <p className="text-lg font-semibold text-gray-800">
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-gray-600">{task.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        task.status === "completed"
                          ? "text-green-600"
                          : task.status === "pending"
                          ? "text-red-600"
                          : "text-yellow-500"
                      }`}
                    >
                      {task.status || "pending"}
                    </span>
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:ml-4 flex space-x-2">
                  <button
                    onClick={() => openEditModal(task)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(task.id)}
                    className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedTask}
      />
    </div>
  );
};

export default TaskList;
