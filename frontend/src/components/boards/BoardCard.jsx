import { Link } from 'react-router-dom';
import { Calendar, MoreVertical, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';

export default function BoardCard({ board, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="card group relative p-5 transition-shadow hover:shadow-card-hover">
      <Link to={`/boards/${board.id}`} className="block">
        <h3 className="mb-2 text-lg font-semibold text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
          {board.title}
        </h3>
        {board.description && (
          <p className="mb-4 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
            {board.description}
          </p>
        )}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500">
          <Calendar className="h-3.5 w-3.5" />
          {board.taskCount ?? 0} task{(board.taskCount ?? 0) !== 1 ? 's' : ''}
        </div>
      </Link>

      <div className="absolute right-3 top-3">
        <button
          onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen); }}
          className="btn-ghost rounded-lg p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-600 dark:bg-slate-800">
              <button
                onClick={() => { setMenuOpen(false); onEdit(board); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Pencil className="h-4 w-4" /> Rename
              </button>
              <button
                onClick={() => { setMenuOpen(false); onDelete(board); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
