import { BarChart3, Users, Briefcase, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Reports() {
  const { candidates, clients, tasks } = useApp();
  const hired = candidates.filter(candidate => candidate.status === 'Hired').length;
  const activeClients = clients.length;
  const completedTasks = tasks.filter(task => task.completed).length;

  const cards = [
    { label: 'Total Candidates', value: candidates.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Clients', value: activeClients, icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Hired Candidates', value: hired, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Completed Tasks', value: completedTasks, icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-xs text-gray-500 font-medium">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
