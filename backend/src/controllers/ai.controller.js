import { suggestEstimate } from '../services/ai.service.js';
import { success } from '../utils/helpers.js';

export const getSuggestion = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const suggestion = await suggestEstimate(title, description);
    return success(res, suggestion);
  } catch (err) {
    next(err);
  }
};
