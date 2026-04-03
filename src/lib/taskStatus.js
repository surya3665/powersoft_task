export const TASK_STATUS_LABELS = {
  todo: 'Need to Do',
  in_progress: 'In Progress',
  testing: 'Need for Test',
  completed: 'Completed',
  reopen: 'Re-open',
};

export const TASK_STATUSES = ['todo', 'in_progress', 'testing', 'completed', 'reopen'];

export const TASK_STATUS_STYLES = {
  todo: {
    label: TASK_STATUS_LABELS.todo,
    accent: '#475569',
    soft: 'rgba(71, 85, 105, 0.12)',
    className: 'status-todo',
  },
  in_progress: {
    label: TASK_STATUS_LABELS.in_progress,
    accent: '#0284c7',
    soft: 'rgba(2, 132, 199, 0.12)',
    className: 'status-in-progress',
  },
  testing: {
    label: TASK_STATUS_LABELS.testing,
    accent: '#d97706',
    soft: 'rgba(217, 119, 6, 0.12)',
    className: 'status-testing',
  },
  completed: {
    label: TASK_STATUS_LABELS.completed,
    accent: '#15803d',
    soft: 'rgba(21, 128, 61, 0.12)',
    className: 'status-completed',
  },
  reopen: {
    label: TASK_STATUS_LABELS.reopen,
    accent: '#dc2626',
    soft: 'rgba(220, 38, 38, 0.12)',
    className: 'status-reopen',
  },
};
