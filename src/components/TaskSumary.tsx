import { useSelector } from "react-redux";
import type { RootState } from "../features/store";

const TaskSummary = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const totalTodo = tasks.filter((t) => t.status === "todo").length;
  const totalPending = tasks.filter((t) => t.status === "pending").length;
  const totalCompleted = tasks.filter((t) => t.status === "completed").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">To Do</h3>
        <p className="text-2xl font-bold">{totalTodo}</p>
      </div>

      <div className="bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200 text-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-700 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Pending</h3>
        <p className="text-2xl font-bold">{totalPending}</p>
      </div>
      <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-300 dark:hover:bg-green-700 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Completed</h3>
        <p className="text-2xl font-bold">{totalCompleted}</p>
      </div>
    </div>
  );
};

export default TaskSummary;
