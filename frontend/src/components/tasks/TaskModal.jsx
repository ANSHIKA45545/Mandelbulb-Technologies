import { useState, useEffect } from 'react';
import { Sparkles, Check } from 'lucide-react';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';
import { aiApi } from '../../services/api';
import { toInputDate } from '../../utils/taskHelpers';

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'med',
  dueDate: '',
  estimatedEffort: '',
};

export default function TaskModal({ open, onClose, task, defaultStatus, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);

  const isEdit = !!task;

  useEffect(() => {
    if (!open) return;
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: toInputDate(task.dueDate),
        estimatedEffort: task.estimatedEffort || '',
      });
    } else {
      setForm({ ...EMPTY_FORM, status: defaultStatus || 'todo' });
    }
    setError('');
    setSuggestion(null);
  }, [open, task, defaultStatus]);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSuggest = async () => {
    if (!form.title.trim()) {
      setError('Enter a task title before requesting a suggestion');
      return;
    }
    setAiLoading(true);
    setError('');
    try {
      const res = await aiApi.suggestEstimate({
        title: form.title,
        description: form.description,
      });
      setSuggestion(res.data.data);
    } catch {
      setError('AI suggestion unavailable. You can still set values manually.');
    } finally {
      setAiLoading(false);
    }
  };

  const acceptSuggestion = () => {
    if (!suggestion) return;
    setForm((f) => ({
      ...f,
      estimatedEffort: suggestion.estimatedEffort || f.estimatedEffort,
      dueDate: suggestion.suggestedDueDate || f.dueDate,
    }));
    setSuggestion(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = {
        title: form.title,
        description: form.description || undefined,
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate || null,
        estimatedEffort: form.estimatedEffort || null,
      };
      await onSave(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Task' : 'New Task'}>
      {error && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={handleChange('title')} required />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea
            className="input min-h-[80px] resize-none"
            value={form.description}
            onChange={handleChange('description')}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSuggest}
            disabled={aiLoading}
            className="btn-secondary text-sm"
          >
            {aiLoading ? <Spinner size="sm" /> : <Sparkles className="h-4 w-4" />}
            Suggest estimate
          </button>
        </div>

        {suggestion && (
          <div className="rounded-lg border border-brand-200 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-950">
            <p className="text-sm font-medium text-brand-800 dark:text-brand-300">AI Suggestion</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{suggestion.reasoning}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              <span><strong>Effort:</strong> {suggestion.estimatedEffort}</span>
              <span><strong>Due:</strong> {suggestion.suggestedDueDate}</span>
            </div>
            {suggestion.isMock && (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">Using fallback estimate (AI key not configured)</p>
            )}
            <button type="button" onClick={acceptSuggestion} className="btn-primary mt-3 text-sm">
              <Check className="h-4 w-4" /> Accept suggestion
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={handleChange('status')}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <select className="input" value={form.priority} onChange={handleChange('priority')}>
              <option value="low">Low</option>
              <option value="med">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Due date</label>
            <input type="date" className="input" value={form.dueDate} onChange={handleChange('dueDate')} />
          </div>
          <div>
            <label className="label">Estimated effort</label>
            <input
              className="input"
              value={form.estimatedEffort}
              onChange={handleChange('estimatedEffort')}
              placeholder="e.g. 4 hours"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? <Spinner size="sm" /> : isEdit ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
