export const PRIORITY_STYLES = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  med: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export const PRIORITY_LABELS = { low: 'Low', med: 'Medium', high: 'High' };

export const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'border-slate-300 dark:border-slate-600' },
  { id: 'in-progress', title: 'In Progress', color: 'border-blue-400 dark:border-blue-600' },
  { id: 'done', title: 'Done', color: 'border-emerald-400 dark:border-emerald-600' },
];

export const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'done') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate) < today;
};

export const toInputDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
};
