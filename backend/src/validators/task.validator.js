import { body } from 'express-validator';

const statusValues = ['todo', 'in-progress', 'done'];
const priorityValues = ['low', 'med', 'medium', 'high'];

export const taskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('status').optional().isIn(statusValues).withMessage('Invalid status'),
  body('priority').optional().isIn(priorityValues).withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date'),
  body('estimatedEffort').optional().trim().isLength({ max: 50 }),
];

export const taskUpdateValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('status').optional().isIn(statusValues).withMessage('Invalid status'),
  body('priority').optional().isIn(priorityValues).withMessage('Invalid priority'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid due date'),
  body('estimatedEffort').optional({ nullable: true }).trim().isLength({ max: 50 }),
  body('position').optional().isInt({ min: 0 }),
];

export const moveTaskValidation = [
  body('status').isIn(statusValues).withMessage('Valid status is required'),
  body('position').optional().isInt({ min: 0 }),
];

export const aiSuggestionValidation = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('description').optional().trim().isLength({ max: 2000 }),
];
