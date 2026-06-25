import { Router } from 'express';
import {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
} from '../controllers/board.controller.js';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  getTaskStats,
} from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { boardValidation, boardUpdateValidation } from '../validators/board.validator.js';
import {
  taskValidation,
  taskUpdateValidation,
  moveTaskValidation,
} from '../validators/task.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', getBoards);
router.post('/', boardValidation, validate, createBoard);
router.get('/:id', getBoard);
router.put('/:id', boardUpdateValidation, validate, updateBoard);
router.delete('/:id', deleteBoard);

router.get('/:boardId/tasks/stats', getTaskStats);
router.get('/:boardId/tasks', getTasks);
router.post('/:boardId/tasks', taskValidation, validate, createTask);
router.put('/:boardId/tasks/:id', taskUpdateValidation, validate, updateTask);
router.patch('/:boardId/tasks/:id/move', moveTaskValidation, validate, moveTask);
router.delete('/:boardId/tasks/:id', deleteTask);

export default router;
