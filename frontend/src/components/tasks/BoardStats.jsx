import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const STATUS_COLORS = { todo: '#94a3b8', 'in-progress': '#3b82f6', done: '#10b981' };
const PRIORITY_COLORS = { low: '#94a3b8', med: '#f59e0b', high: '#ef4444' };

export default function BoardStats({ stats }) {
  if (!stats) return null;

  const statusData = Object.entries(stats.byStatus).map(([name, value]) => ({
    name: name === 'in-progress' ? 'In Progress' : name.charAt(0).toUpperCase() + name.slice(1),
    value,
    key: name,
  }));

  const priorityData = Object.entries(stats.byPriority).map(([name, value]) => ({
    name: name === 'med' ? 'Medium' : name.charAt(0).toUpperCase() + name.slice(1),
    value,
    key: name,
  }));

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="card p-4">
        <p className="text-sm text-slate-500">Total Tasks</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
      </div>
      <div className="card p-4">
        <p className="text-sm text-slate-500">Overdue</p>
        <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
      </div>
      <div className="card p-4">
        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">By Status</p>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={statusData}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {statusData.map((entry) => (
                <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card p-4">
        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">By Priority</p>
        <ResponsiveContainer width="100%" height={100}>
          <PieChart>
            <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={40}>
              {priorityData.map((entry) => (
                <Cell key={entry.key} fill={PRIORITY_COLORS[entry.key]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
