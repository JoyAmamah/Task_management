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

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  initialData?: Task | null;
  teamMembers?: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role?: string;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export const initialState: TaskState = {
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

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

// Additional types for drag and drop
export interface DropResult {
  destination?: {
    index: number;
    droppableId: string;
  };
  source: {
    index: number;
    droppableId: string;
  };
  draggableId: string;
}

// Types for Redux actions
export interface AddTaskPayload {
  task: Task;
}

export interface UpdateTaskPayload {
  task: Task;
}

export interface DeleteTaskPayload {
  taskId: string;
}

export interface AssignTaskPayload {
  taskId: string;
  assignee: string;
}

export interface UpdateTaskStatusPayload {
  taskId: string;
  status: Task['status'];
}

export interface UpdateTaskPriorityPayload {
  taskId: string;
  priority: Task['priority'];
}

export interface AddAttachmentPayload {
  taskId: string;
  attachment: string;
}

export interface RemoveAttachmentPayload {
  taskId: string;
  attachmentIndex: number;
}

// Filter types
export interface TaskFilters {
  status?: string;
  assignee?: string;
  priority?: string;
  searchTerm?: string;
}

// Statistics types
export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  pending: number;
  completed: number;
  highPriority: number;
  assigned: number;
  overdue: number;
  completionRate: number;
}