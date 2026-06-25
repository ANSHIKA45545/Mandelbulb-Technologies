import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

export default function TaskColumn({ column, tasks, onAddTask, onEditTask, onDeleteTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex w-80 min-w-[280px] flex-shrink-0 flex-col">
      <div className={`mb-3 flex items-center justify-between border-l-4 pl-3 ${column.color}`}>
        <h3 className="font-semibold text-slate-800 dark:text-slate-200">
          {column.title}
          <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
            {tasks.length}
          </span>
        </h3>
        <button
          onClick={() => onAddTask(column.id)}
          className="btn-ghost rounded-lg p-1.5"
          aria-label={`Add task to ${column.title}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex min-h-[200px] flex-1 flex-col gap-2 rounded-xl p-2 transition-colors ${
          isOver ? 'bg-brand-50 dark:bg-brand-950/30' : 'bg-slate-100/80 dark:bg-slate-800/50'
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">Drop tasks here</p>
        )}
      </div>
    </div>
  );
}
