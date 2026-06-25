import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { ArrowLeft, Filter } from 'lucide-react';
import { boardApi, taskApi } from '../services/api';
import { COLUMNS } from '../utils/taskHelpers';
import TaskColumn from '../components/tasks/TaskColumn';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import BoardStats from '../components/tasks/BoardStats';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import Skeleton from '../components/ui/Skeleton';

export default function Board() {
  const { boardId } = useParams();
  const queryClient = useQueryClient();
  const [taskModal, setTaskModal] = useState({ open: false, task: null, status: 'todo' });
  const [deleteTask, setDeleteTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const { data: board, isLoading: boardLoading } = useQuery({
    queryKey: ['board', boardId],
    queryFn: async () => {
      const res = await boardApi.getOne(boardId);
      return res.data.data;
    },
  });

  const queryParams = {};
  if (priorityFilter) queryParams.priority = priorityFilter;
  if (sortBy) queryParams.sort = sortBy;

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', boardId, priorityFilter, sortBy],
    queryFn: async () => {
      const res = await taskApi.getAll(boardId, queryParams);
      return res.data.data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['taskStats', boardId],
    queryFn: async () => {
      const res = await taskApi.getStats(boardId);
      return res.data.data;
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    queryClient.invalidateQueries({ queryKey: ['taskStats', boardId] });
    queryClient.invalidateQueries({ queryKey: ['boards'] });
  };

  const createMutation = useMutation({
    mutationFn: (data) => taskApi.create(boardId, data),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => taskApi.update(boardId, id, data),
    onSuccess: invalidate,
  });

  const moveMutation = useMutation({
    mutationFn: ({ id, data }) => taskApi.move(boardId, id, data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => taskApi.delete(boardId, id),
    onSuccess: () => {
      invalidate();
      setDeleteTask(null);
    },
  });

  const tasksByColumn = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id);
    return acc;
  }, {});

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;

    const overId = over.id;
    let newStatus = task.status;

    if (COLUMNS.some((c) => c.id === overId)) {
      newStatus = overId;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) newStatus = overTask.status;
    }

    if (newStatus !== task.status) {
      const columnTasks = tasksByColumn[newStatus] || [];
      moveMutation.mutate({ id: task.id, data: { status: newStatus, position: columnTasks.length } });
    }
  };

  const handleSaveTask = async (data) => {
    if (taskModal.task) {
      await updateMutation.mutateAsync({ id: taskModal.task.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  if (boardLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="text-center">
        <p className="text-slate-600">Board not found</p>
        <Link to="/dashboard" className="btn-primary mt-4">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/dashboard" className="mb-3 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-brand-600 dark:text-slate-400">
          <ArrowLeft className="h-4 w-4" /> Back to boards
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{board.title}</h1>
        {board.description && (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{board.description}</p>
        )}
      </div>

      <BoardStats stats={stats} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            className="input w-auto py-1.5 text-sm"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All priorities</option>
            <option value="low">Low</option>
            <option value="med">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            className="input w-auto py-1.5 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Default order</option>
            <option value="dueDate">Sort by due date</option>
            <option value="priority">Sort by priority</option>
          </select>
        </div>
      </div>

      {tasksLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map((col) => (
              <TaskColumn
                key={col.id}
                column={col}
                tasks={tasksByColumn[col.id] || []}
                onAddTask={(status) => setTaskModal({ open: true, task: null, status })}
                onEditTask={(task) => setTaskModal({ open: true, task, status: task.status })}
                onDeleteTask={setDeleteTask}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask ? (
              <div className="card rotate-2 p-3 opacity-90 shadow-lg">
                <p className="font-medium">{activeTask.title}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <TaskModal
        open={taskModal.open}
        onClose={() => setTaskModal({ open: false, task: null, status: 'todo' })}
        task={taskModal.task}
        defaultStatus={taskModal.status}
        onSave={handleSaveTask}
      />

      <Modal open={!!deleteTask} onClose={() => setDeleteTask(null)} title="Delete Task" size="sm">
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          Delete <strong>{deleteTask?.title}</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={() => setDeleteTask(null)}>Cancel</button>
          <button
            className="btn-danger"
            onClick={() => deleteMutation.mutate(deleteTask.id)}
            disabled={deleteMutation.isPending}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
