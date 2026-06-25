export const STATUS_MAP = {
  todo: 'TODO',
  'in-progress': 'IN_PROGRESS',
  done: 'DONE',
};

export const STATUS_REVERSE = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
};

export const PRIORITY_MAP = {
  low: 'LOW',
  med: 'MEDIUM',
  medium: 'MEDIUM',
  high: 'HIGH',
};

export const PRIORITY_REVERSE = {
  LOW: 'low',
  MEDIUM: 'med',
  HIGH: 'high',
};

export const formatBoard = (board) => ({
  id: board.id,
  title: board.title,
  description: board.description,
  createdAt: board.createdAt,
  updatedAt: board.updatedAt,
  taskCount: board._count?.tasks ?? board.taskCount,
});

export const formatTask = (task) => ({
  id: task.id,
  title: task.title,
  description: task.description,
  status: STATUS_REVERSE[task.status] || 'todo',
  priority: PRIORITY_REVERSE[task.priority] || 'med',
  dueDate: task.dueDate,
  estimatedEffort: task.estimatedEffort,
  position: task.position,
  boardId: task.boardId,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

export const success = (res, data, status = 200) => {
  return res.status(status).json({ success: true, data });
};

export const error = (res, message, status = 400, errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(status).json(body);
};
