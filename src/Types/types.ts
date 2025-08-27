export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  initialData?: Task | null;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

