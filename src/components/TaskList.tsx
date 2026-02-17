import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../features/store";
import { useState, useEffect } from "react";
import { addTask, updateTask, deleteTask, reorderTasks, assignTask } from "../features/taskSlice";
import TaskModal from "./TaskModal";
import type { Task } from "../Types/types";
import type { AppDispatch } from "../features/store";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import TaskSummary from "./TaskSumary";
import SEO from "../seo/SEO";
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  type DropResult,
  type DroppableProvided,
  type DraggableProvided,
  type DraggableStateSnapshot
} from "@hello-pangea/dnd";
import { FaUsers, FaClock, FaPaperclip, FaSearch, FaFilter, FaSort } from "react-icons/fa";

// Mock team members for assignment
const teamMembers = [
  { id: "1", name: "Joy Amamah", avatar: "👩‍💻" },
  { id: "2", name: "Alex Chen", avatar: "👨‍💻" },
  { id: "3", name: "Sarah Wilson", avatar: "👩‍💼" },
  { id: "4", name: "Mike Brown", avatar: "👨‍🏫" },
];

const TaskList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const loading = useSelector((state: RootState) => state.tasks.loading);
  const error = useSelector((state: RootState) => state.tasks.error);
  const [statusFilter, setStatusFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "board">("board");

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        toast.info("Task updated by team member");
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const openAddModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSave = (task: Task) => {
    if (task.id && task.id.trim() !== "") {
      dispatch(updateTask(task));
      toast.success("Task updated successfully");
    } else {
      const newTask = { 
        ...task, 
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(addTask(newTask));
      toast.success("Task created successfully");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (taskId: string) => {
    dispatch(deleteTask(taskId));
    toast.info("Task deleted successfully");
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch(reorderTasks(items));
  };

  const handleAssignTask = (taskId: string, assigneeId: string) => {
    const assignee = teamMembers.find(member => member.id === assigneeId);
    if (assignee) {
      dispatch(assignTask({ taskId, assignee: assignee.name }));
      toast.success(`Task assigned to ${assignee.name}`);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      dispatch(updateTask({ ...task, status: newStatus }));
    }
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesAssignee = assigneeFilter === "all" || task.assignee === assigneeFilter;
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesAssignee && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "priority":
          { const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
                 (priorityOrder[a.priority as keyof typeof priorityOrder] || 0); }
        case "dueDate":
          return new Date(a.dueDate || "").getTime() - new Date(b.dueDate || "").getTime();
        default:
          return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <main className="max-w-6xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen px-4 py-8">
      <SEO />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-gray-200 text-gray-800 mb-2">
            Team Task Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Collaborate and manage tasks in real-time with your team
          </p>
        </div>
        
        <div className="flex gap-4 mt-4 lg:mt-0">
          <button
            onClick={() => setViewMode(viewMode === "list" ? "board" : "list")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {viewMode === "list" ? "Board View" : "List View"}
          </button>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span>+</span> Add Task
          </button>
        </div>
      </div>

      {/* Task Summary */}
      <section aria-labelledby="task-summary" className="mb-8">
        <TaskSummary />
      </section>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="relative">
            <FaUsers className="absolute left-3 top-3 text-gray-400" />
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none"
            >
              <option value="all">All Assignees</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.name}>{member.name}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <FaSort className="absolute left-3 top-3 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none"
            >
              <option value="createdAt">Newest First</option>
              <option value="title">Title</option>
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List/Board */}
      <section aria-labelledby="task-list">
        <h2 id="task-list" className="sr-only">Task List</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading tasks...</span>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 text-lg">Error loading tasks: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-4">
              {searchTerm || statusFilter !== "all" || assigneeFilter !== "all" 
                ? "Try adjusting your filters" 
                : "Get started by creating your first task"}
            </p>
            <button
              onClick={openAddModal}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create Task
            </button>
          </div>
        ) : viewMode === "list" ? (
          // List View
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
              {(provided: DroppableProvided) => (
                <ul 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {filteredTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all ${
                            snapshot.isDragging ? 'shadow-lg rotate-2' : 'hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority || 'medium')}`} />
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                  {task.title}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                                  {task.status}
                                </span>
                              </div>
                              
                              {task.description && (
                                <p className="text-gray-600 dark:text-gray-400 mb-3">
                                  {task.description}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                                {task.assignee && (
                                  <span className="flex items-center gap-1">
                                    <FaUsers className="w-3 h-3" />
                                    {task.assignee}
                                  </span>
                                )}
                                {task.dueDate && (
                                  <span className="flex items-center gap-1">
                                    <FaClock className="w-3 h-3" />
                                    {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                                {task.attachments && task.attachments.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <FaPaperclip className="w-3 h-3" />
                                    {task.attachments.length}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                                className="text-sm border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
                              >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                              </select>
                              
                              <select
                                value={task.assignee || ""}
                                onChange={(e) => handleAssignTask(task.id, e.target.value)}
                                className="text-sm border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
                              >
                                <option value="">Assign to...</option>
                                {teamMembers.map(member => (
                                  <option key={member.id} value={member.id}>
                                    {member.name}
                                  </option>
                                ))}
                              </select>
                              
                              <button
                                onClick={() => openEditModal(task)}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                              >
                                Edit
                              </button>
                              
                              <button
                                onClick={() => handleDelete(task.id)}
                                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          // Board View (Kanban) - Simple version without drag-and-drop for now
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['todo', 'in-progress', 'pending', 'completed'].map((status) => (
              <div key={status} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 capitalize">
                  {status.replace('-', ' ')} ({filteredTasks.filter(t => t.status === status).length})
                </h3>
                <div className="min-h-[200px] space-y-3">
                  {filteredTasks
                    .filter(task => task.status === status)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">
                            {task.title}
                          </h4>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority || 'medium')}`} />
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        {task.assignee && (
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            👤 {task.assignee}
                          </div>
                        )}
                        <div className="flex justify-between items-center mt-3">
                          <button
                            onClick={() => openEditModal(task)}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="text-xs text-red-500 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedTask}
        teamMembers={teamMembers}
      />
    </main>
  );
};

export default TaskList;