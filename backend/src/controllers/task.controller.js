import prisma from '../config/db.js';
import {
  success,
  error,
  formatTask,
  STATUS_MAP,
  PRIORITY_MAP,
} from '../utils/helpers.js';

const verifyBoardOwnership = async (boardId, userId) => {
  return prisma.board.findFirst({
    where: { id: boardId, ownerId: userId },
  });
};

export const getTasks = async (req, res, next) => {
  try {
    const board = await verifyBoardOwnership(req.params.boardId, req.userId);
    if (!board) {
      return error(res, 'Board not found', 404);
    }

    const { priority, status, sort } = req.query;
    const where = { boardId: req.params.boardId, ownerId: req.userId };

    if (priority && PRIORITY_MAP[priority]) {
      where.priority = PRIORITY_MAP[priority];
    }
    if (status && STATUS_MAP[status]) {
      where.status = STATUS_MAP[status];
    }

    let orderBy = [{ status: 'asc' }, { position: 'asc' }];
    if (sort === 'dueDate') orderBy = [{ dueDate: 'asc' }];
    if (sort === 'priority') orderBy = [{ priority: 'desc' }];

    const tasks = await prisma.task.findMany({ where, orderBy });
    return success(res, tasks.map(formatTask));
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const board = await verifyBoardOwnership(req.params.boardId, req.userId);
    if (!board) {
      return error(res, 'Board not found', 404);
    }

    const { title, description, status, priority, dueDate, estimatedEffort } = req.body;
    const taskStatus = STATUS_MAP[status] || 'TODO';
    const taskPriority = PRIORITY_MAP[priority] || 'MEDIUM';

    const maxPos = await prisma.task.aggregate({
      where: { boardId: req.params.boardId, status: taskStatus },
      _max: { position: true },
    });

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: taskStatus,
        priority: taskPriority,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedEffort: estimatedEffort || null,
        position: (maxPos._max.position ?? -1) + 1,
        boardId: req.params.boardId,
        ownerId: req.userId,
      },
    });
    return success(res, formatTask(task), 201);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const existing = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        boardId: req.params.boardId,
        ownerId: req.userId,
      },
    });
    if (!existing) {
      return error(res, 'Task not found', 404);
    }

    const { title, description, status, priority, dueDate, estimatedEffort, position } = req.body;
    const data = {};

    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (status !== undefined) data.status = STATUS_MAP[status] || existing.status;
    if (priority !== undefined) data.priority = PRIORITY_MAP[priority] || existing.priority;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
    if (estimatedEffort !== undefined) data.estimatedEffort = estimatedEffort;
    if (position !== undefined) data.position = position;

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data,
    });
    return success(res, formatTask(task));
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const existing = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        boardId: req.params.boardId,
        ownerId: req.userId,
      },
    });
    if (!existing) {
      return error(res, 'Task not found', 404);
    }

    await prisma.task.delete({ where: { id: req.params.id } });
    return success(res, { message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const moveTask = async (req, res, next) => {
  try {
    const existing = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        boardId: req.params.boardId,
        ownerId: req.userId,
      },
    });
    if (!existing) {
      return error(res, 'Task not found', 404);
    }

    const { status, position } = req.body;
    if (!status || !STATUS_MAP[status]) {
      return error(res, 'Valid status is required', 422);
    }

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        status: STATUS_MAP[status],
        position: position ?? 0,
      },
    });
    return success(res, formatTask(task));
  } catch (err) {
    next(err);
  }
};

export const getTaskStats = async (req, res, next) => {
  try {
    const board = await verifyBoardOwnership(req.params.boardId, req.userId);
    if (!board) {
      return error(res, 'Board not found', 404);
    }

    const tasks = await prisma.task.findMany({
      where: { boardId: req.params.boardId, ownerId: req.userId },
      select: { status: true, priority: true, dueDate: true },
    });

    const now = new Date();
    const stats = {
      byStatus: { todo: 0, 'in-progress': 0, done: 0 },
      byPriority: { low: 0, med: 0, high: 0 },
      overdue: 0,
      total: tasks.length,
    };

    tasks.forEach((t) => {
      const s = t.status === 'TODO' ? 'todo' : t.status === 'IN_PROGRESS' ? 'in-progress' : 'done';
      const p = t.priority === 'LOW' ? 'low' : t.priority === 'HIGH' ? 'high' : 'med';
      stats.byStatus[s]++;
      stats.byPriority[p]++;
      if (t.dueDate && new Date(t.dueDate) < now && t.status !== 'DONE') {
        stats.overdue++;
      }
    });

    return success(res, stats);
  } catch (err) {
    next(err);
  }
};
