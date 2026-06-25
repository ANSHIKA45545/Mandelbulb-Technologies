import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, FolderKanban } from 'lucide-react';
import { boardApi } from '../services/api';
import BoardCard from '../components/boards/BoardCard';
import Modal from '../components/ui/Modal';
import { BoardCardSkeleton } from '../components/ui/Skeleton';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editBoard, setEditBoard] = useState(null);
  const [deleteBoard, setDeleteBoard] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const { data: boards = [], isLoading, isError } = useQuery({
    queryKey: ['boards'],
    queryFn: async () => {
      const res = await boardApi.getAll();
      return res.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => boardApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      setCreateOpen(false);
      setTitle('');
      setDescription('');
      setError('');
    },
    onError: (err) => setError(err.response?.data?.message || 'Failed to create board'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => boardApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      setEditBoard(null);
      setTitle('');
      setDescription('');
      setError('');
    },
    onError: (err) => setError(err.response?.data?.message || 'Failed to update board'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => boardApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      setDeleteBoard(null);
    },
  });

  const openCreate = () => {
    setTitle('');
    setDescription('');
    setError('');
    setCreateOpen(true);
  };

  const openEdit = (board) => {
    setTitle(board.title);
    setDescription(board.description || '');
    setError('');
    setEditBoard(board);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { title, description: description || undefined };
    if (editBoard) {
      updateMutation.mutate({ id: editBoard.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Boards</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage your projects and track progress
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          New Board
        </button>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <BoardCardSkeleton key={i} />)}
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          Failed to load boards. Please check your connection and try again.
        </div>
      )}

      {!isLoading && !isError && boards.length === 0 && (
        <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
            <FolderKanban className="h-8 w-8 text-brand-600 dark:text-brand-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">No boards yet</h2>
          <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400">
            Create your first board to start organizing tasks and tracking your projects.
          </p>
          <button onClick={openCreate} className="btn-primary mt-6">
            <Plus className="h-4 w-4" />
            Create your first board
          </button>
        </div>
      )}

      {!isLoading && boards.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onEdit={openEdit}
              onDelete={setDeleteBoard}
            />
          ))}
        </div>
      )}

      <Modal
        open={createOpen || !!editBoard}
        onClose={() => { setCreateOpen(false); setEditBoard(null); setError(''); }}
        title={editBoard ? 'Rename Board' : 'Create Board'}
      >
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="label">Description (optional)</label>
            <textarea
              className="input min-h-[80px] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => { setCreateOpen(false); setEditBoard(null); }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={createMutation.isPending || updateMutation.isPending}>
              {editBoard ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteBoard} onClose={() => setDeleteBoard(null)} title="Delete Board" size="sm">
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          Are you sure you want to delete <strong>{deleteBoard?.title}</strong>? All tasks in this board will be permanently removed.
        </p>
        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={() => setDeleteBoard(null)}>Cancel</button>
          <button
            className="btn-danger"
            onClick={() => deleteMutation.mutate(deleteBoard.id)}
            disabled={deleteMutation.isPending}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
