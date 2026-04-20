import { Users, Video, FileText, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatCard from '../components/UI/StatCard';
import Badge from '../components/UI/Badge';
import MiniBarChart from '../components/UI/MiniBarChart';
import { ActivityType } from '../types';

const activityTypeColors: Record<ActivityType, string> = {
  candidate: 'bg-blue-100 text-blue-600',
  client: 'bg-green-100 text-green-600',
  pipeline: 'bg-amber-100 text-amber-600',
  task: 'bg-gray-100 text-gray-600',
};

function timeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor(diff / 60000);
  if (hours >= 24) return `${Math.floor(hours / 24)}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${minutes}m ago`;
}

export default function Dashboard() {
  const { candidates, activities, tasks } = useApp();

  const totalCandidates = candidates.length;
  const interviews = candidates.filter(c => c.status === 'Interview').length;
  const offers = candidates.filter(c => c.status === 'Offer').length;
  const hired = candidates.filter(c => c.status === 'Hired').length;

  const pendingTasks = tasks.filter(t => !t.completed).length;

  const chartData = [3, 5, 2, 8, 6, 10, 7];
  const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const statusBreakdown = [
    { label: 'Applied', count: candidates.filter(c => c.status === 'Applied').length, color: 'bg-blue-500' },
    { label: 'Interview', count: interviews, color: 'bg-amber-500' },
    { label: 'Offer', count: offers, color: 'bg-orange-500' },
    { label: 'Hired', count: hired, color: 'bg-green-500' },
  ];
  const maxCount = Math.max(...statusBreakdown.map(s => s.count), 1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Candidates" value={totalCandidates} icon={Users} color="text-blue-600" bgColor="bg-blue-50" trend="+12%" />
        <StatCard title="In Interview" value={interviews} icon={Video} color="text-amber-600" bgColor="bg-amber-50" trend="+5%" />
        <StatCard title="Offers Extended" value={offers} icon={FileText} color="text-orange-600" bgColor="bg-orange-50" />
        <StatCard title="Hired This Month" value={hired} icon={CheckCircle} color="text-green-600" bgColor="bg-green-50" trend="+2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Weekly Activity</h3>
              <p className="text-xs text-gray-400 mt-0.5">Candidate movements this week</p>
            </div>
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-lg">This Week</span>
          </div>
          <MiniBarChart data={chartData} labels={chartLabels} color="#3b82f6" height={100} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Pipeline Overview</h3>
          <p className="text-xs text-gray-400 mb-5">Candidates by stage</p>
          <div className="space-y-3">
            {statusBreakdown.map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
            <Link to="/pipeline" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {activities.slice(0, 6).map(activity => (
              <div key={activity.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activityTypeColors[activity.type]}`}>
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">
                    <span>{activity.action} </span>
                    <span className="font-semibold text-gray-900">{activity.subject}</span>
                  </p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeAgo(activity.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">Pending Tasks</h3>
            <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-lg font-medium">{pendingTasks}</span>
          </div>
          <div className="p-4 space-y-2">
            {tasks.filter(t => !t.completed).slice(0, 4).map(task => (
              <div key={task.id} className="p-3 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-800 font-medium leading-snug">{task.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge label={task.priority} variant={task.priority} />
                  <span className="text-xs text-gray-400">{task.dueDate}</span>
                </div>
              </div>
            ))}
            {pendingTasks === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No pending tasks</p>
            )}
            <Link
              to="/tasks"
              className="flex items-center justify-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium pt-1"
            >
              View all tasks <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
