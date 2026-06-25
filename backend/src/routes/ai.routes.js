import { Router } from 'express';
import { getSuggestion } from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { aiSuggestionValidation } from '../validators/task.validator.js';

const router = Router();

router.use(authenticate);
router.post('/suggest-estimate', aiSuggestionValidation, validate, getSuggestion);

export default router;
