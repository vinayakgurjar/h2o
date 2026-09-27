import React, { useState } from 'react';
import { Task } from '../../types';
import { store } from '../../services/store';
import { CheckSquare, Plus, Clock, CheckCircle2, Phone, Calendar, AlertCircle } from 'lucide-react';

export const TasksManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(store.getState().tasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [dueDate, setDueDate] = useState('2026-03-22');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('HIGH');

  const handleToggleTask = (taskId: string, currentStatus: string) => {
    store.updateTaskStatus(taskId, currentStatus === 'TODO' ? 'DONE' : 'TODO');
    setTasks([...store.getState().tasks]);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    store.createTask({
      title: newTaskTitle,
      customerName: customerName || 'General Inquiry',
      dueDate,
      priority,
      status: 'TODO',
      assignedTo: 'Vinayak Pratap (Founder & Sales Lead)',
      type: 'CALL',
    });

    setTasks([...store.getState().tasks]);
    setNewTaskTitle('');
    setCustomerName('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-xl text-[#1A1817]">
            Sales Follow-ups, Calls & Deliveries
          </h2>
          <p className="text-xs text-[#7A6E5E]">
            Never miss an event deadline or client follow-up call.
          </p>
        </div>
      </div>

      {/* Quick Add Task Form */}
      <form
        onSubmit={handleCreateTask}
        className="bg-white p-4 rounded-2xl border border-[#E5DDD0] shadow-xs flex flex-wrap items-center gap-3 text-xs"
      >
        <input
          type="text"
          required
          placeholder="New Task / Call Description..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D8CEBE]"
        />
        <input
          type="text"
          placeholder="Customer / Hotel Name..."
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-48 px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D8CEBE]"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D8CEBE]"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className="px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D8CEBE]"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High Priority</option>
          <option value="URGENT">Urgent Today</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-[#D92365] hover:bg-[#C2185B] text-white font-semibold"
        >
          Add Task
        </button>
      </form>

      {/* Tasks List */}
      <div className="bg-white rounded-2xl border border-[#E5DDD0] overflow-hidden shadow-xs divide-y divide-[#F4EFE6]">
        {tasks.map((t) => (
          <div
            key={t.id}
            className={`p-4 flex items-center justify-between gap-4 transition-colors ${
              t.status === 'DONE' ? 'bg-[#FAF7F2]/60 opacity-60' : 'hover:bg-[#FAF7F2]/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={t.status === 'DONE'}
                onChange={() => handleToggleTask(t.id, t.status)}
                className="w-4 h-4 rounded text-[#D92365] cursor-pointer"
              />
              <div>
                <strong
                  className={`text-xs block ${
                    t.status === 'DONE' ? 'line-through text-stone-500' : 'text-stone-900'
                  }`}
                >
                  {t.title}
                </strong>
                <span className="text-[11px] text-stone-500">
                  {t.customerName} • Assigned: {t.assignedTo}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  t.priority === 'URGENT'
                    ? 'bg-red-100 text-red-800'
                    : t.priority === 'HIGH'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {t.priority}
              </span>
              <span className="font-mono text-stone-500 text-[11px]">Due: {t.dueDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
