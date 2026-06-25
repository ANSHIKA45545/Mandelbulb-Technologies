import prisma from '../config/db.js';
import { success, error, formatBoard } from '../utils/helpers.js';

export const getBoards = async (req, res, next) => {
  try {
    const boards = await prisma.board.findMany({
      where: { ownerId: req.userId },
      include: { _count: { select: { tasks: true } } },
      orderBy: { updatedAt: 'desc' },
    });
    return success(res, boards.map(formatBoard));
  } catch (err) {
    next(err);
  }
};

export const getBoard = async (req, res, next) => {
  try {
    const board = await prisma.board.findFirst({
      where: { id: req.params.id, ownerId: req.userId },
      include: { _count: { select: { tasks: true } } },
    });
    if (!board) {
      return error(res, 'Board not found', 404);
    }
    return success(res, formatBoard(board));
  } catch (err) {
    next(err);
  }
};

export const createBoard = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const board = await prisma.board.create({
      data: { title, description: description || null, ownerId: req.userId },
      include: { _count: { select: { tasks: true } } },
    });
    return success(res, formatBoard(board), 201);
  } catch (err) {
    next(err);
  }
};

export const updateBoard = async (req, res, next) => {
  try {
    const existing = await prisma.board.findFirst({
      where: { id: req.params.id, ownerId: req.userId },
    });
    if (!existing) {
      return error(res, 'Board not found', 404);
    }

    const { title, description } = req.body;
    const board = await prisma.board.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
      },
      include: { _count: { select: { tasks: true } } },
    });
    return success(res, formatBoard(board));
  } catch (err) {
    next(err);
  }
};

export const deleteBoard = async (req, res, next) => {
  try {
    const existing = await prisma.board.findFirst({
      where: { id: req.params.id, ownerId: req.userId },
    });
    if (!existing) {
      return error(res, 'Board not found', 404);
    }

    await prisma.board.delete({ where: { id: req.params.id } });
    return success(res, { message: 'Board deleted successfully' });
  } catch (err) {
    next(err);
  }
};
