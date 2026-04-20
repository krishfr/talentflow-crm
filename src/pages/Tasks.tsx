import { useState } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, Calendar, AlertCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/UI/Badge';
import Modal from '../components/UI/Modal';
import { TaskPriority } from '../types';

const priorities: TaskPriority[] = ['High', 'Medium', 'Low'];
const defaultForm = { title: '', dueDate: '', priority: 'Medium' as TaskPriority, completed: false };

function isOverdue(dueDate: string) {
  return new Date(dueDate) < new Date(new Date().toDateString());
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Tasks() {
  const { tasks, addTask, toggleTask, deleteTask } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'All'>('All');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.dueDate) return;
    addTask(form);
    setForm(defaultForm);
    setModalOpen(false);
  };

  const filtered = tasks.filter(t => {
    const matchStatus = filter === 'All' || (filter === 'Pending' ? !t.completed : t.completed);
    const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchStatus && matchPriority;
  });

  const pending = tasks.filter(t => !t.completed).length;
  const completed = tasks.filter(t => t.completed).length;
  const highPriority = tasks.filter(t => !t.completed && t.priority === 'High').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">Pending</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{pending}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">Completed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{completed}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">High Priority</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{highPriority}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Pending', 'Completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {f}
            </button>
          ))}
          <div className="w-px bg-gray-200 mx-1" />
          {(['All', ...priorities] as const).map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p as TaskPriority | 'All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                priorityFilter === p
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-600/25 flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      <div className="space-y-2">
        {filtered.map(task => {
          const overdue = !task.completed && isOverdue(task.dueDate);
          return (
            <div
              key={task.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-all duration-150 group ${
                task.completed
                  ? 'border-gray-100 opacity-70'
                  : overdue
                  ? 'border-red-200 bg-red-50/30'
                  : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5 flex-shrink-0 transition-colors"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 hover:text-blue-400 transition-colors" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-snug ${
                    task.completed ? 'line-through text-gray-400' : 'text-gray-900'
                  }`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge label={task.priority} variant={task.priority} />
                    <span className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
                      {overdue ? <AlertCircle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                      {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
                    </span>
                    {task.completed && (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
            <Clock className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">No tasks found</p>
            <p className="text-xs mt-1">Add a new task or adjust your filters</p>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Task">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Task Description *</label>
            <textarea
              required
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Follow up with candidate re: interview"
              rows={3}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                {priorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
