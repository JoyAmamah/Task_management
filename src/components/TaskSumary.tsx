import { useSelector } from "react-redux";
import type { RootState } from "../features/store";
import React from "react";
import { FaTasks, FaClock, FaCheckCircle, FaExclamationTriangle, FaUsers, FaCalendarAlt } from "react-icons/fa";

const TaskSummary = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  // Basic status counts
  const totalTasks = tasks.length;
  const totalTodo = tasks.filter((t) => t.status === "todo").length;
  const totalInProgress = tasks.filter((t) => t.status === "in-progress").length;
  const totalPending = tasks.filter((t) => t.status === "pending").length;
  const totalCompleted = tasks.filter((t) => t.status === "completed").length;

  // Additional metrics
  const highPriorityTasks = tasks.filter((t) => t.priority === "high").length;
  const assignedTasks = tasks.filter((t) => t.assignee).length;
  const overdueTasks = tasks.filter((t) => 
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed"
  ).length;

  // Progress percentage
  const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  // Recent activity (tasks created/updated in last 7 days)
  const recentActivity = tasks.filter((t) => {
    const taskDate = new Date(t.updatedAt || t.createdAt || "");
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return taskDate > weekAgo;
  }).length;

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    subtitle 
  }: { 
    title: string;
    value: number | string;
    icon: React.ComponentType;
    color: string;
    subtitle?: string;
  }) => (
    <div className={`${color} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && (
            <p className="text-xs opacity-70 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="p-3 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
          <Icon />
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon={FaTasks}
          color="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
        />
        <StatCard
          title="In Progress"
          value={totalInProgress}
          icon={FaClock}
          color="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white"
        />
        <StatCard
          title="Completed"
          value={totalCompleted}
          icon={FaCheckCircle}
          color="bg-gradient-to-br from-green-500 to-green-600 text-white"
          subtitle={`${completionRate}% completion`}
        />
        <StatCard
          title="High Priority"
          value={highPriorityTasks}
          icon={FaExclamationTriangle}
          color="bg-gradient-to-br from-red-500 to-red-600 text-white"
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* To Do */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-400 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <FaTasks className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">To Do</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalTodo}</p>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-yellow-400 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <FaClock className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalPending}</p>
            </div>
          </div>
        </div>

        {/* Assigned */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-purple-400 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <FaUsers className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{assignedTasks}</p>
            </div>
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-red-400 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
              <FaCalendarAlt className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{overdueTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {totalTasks > 0 && (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>{totalCompleted} completed</span>
            <span>{totalTasks - totalCompleted} remaining</span>
          </div>
        </div>
      )}

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-center">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">{recentActivity}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">This Week</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {totalTasks > 0 ? Math.round(totalTasks / 7) : 0}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Avg/Week</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {assignedTasks > 0 ? Math.round((assignedTasks / totalTasks) * 100) : 0}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Assigned</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {overdueTasks}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Attention Needed</div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TaskSummary);