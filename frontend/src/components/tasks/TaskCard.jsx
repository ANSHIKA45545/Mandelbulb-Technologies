import { Calendar, Clock, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PRIORITY_STYLES, PRIORITY_LABELS, formatDate, isOverdue } from '../../utils/taskHelpers';

export default function TaskCard({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { task, status: task.status },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card group p-3 ${overdue ? 'border-red-300 dark:border-red-700' : ''}`}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab touch-none text-slate-400 hover:text-slate-600 active:cursor-grabbing dark:hover:text-slate-300"
          aria-label="Drag task"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-slate-900 dark:text-white">{task.title}</h4>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
              {task.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}>
              {PRIORITY_LABELS[task.priority]}
            </span>
            {task.dueDate && (
              <span className={`flex items-center gap-1 text-xs ${overdue ? 'font-medium text-red-600 dark:text-red-400' : 'text-slate-500'}`}>
                <Calendar className="h-3 w-3" />
                {formatDate(task.dueDate)}
                {overdue && ' (overdue)'}
              </span>
            )}
            {task.estimatedEffort && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                {task.estimatedEffort}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button onClick={() => onEdit(task)} className="btn-ghost rounded p-1" aria-label="Edit task">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onDelete(task)} className="btn-ghost rounded p-1 text-red-500" aria-label="Delete task">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
