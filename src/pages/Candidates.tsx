import { useState } from 'react';
import { Plus, Search, Mail, Phone, Trash2, Briefcase, Clock, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/UI/Badge';
import Modal from '../components/UI/Modal';
import { CandidateStatus } from '../types';

const statuses: CandidateStatus[] = ['Applied', 'Interview', 'Offer', 'Hired', 'Rejected'];

const defaultForm = { name: '', role: '', experience: '', status: 'Applied' as CandidateStatus, email: '', phone: '' };

export default function Candidates() {
  const { candidates, addCandidate, updateCandidateStatus, deleteCandidate, canEditCandidates } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<CandidateStatus | 'All'>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const filtered = candidates.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role) return;
    addCandidate(form);
    setForm(defaultForm);
    setModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search candidates..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(['All', ...statuses] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s as CandidateStatus | 'All')}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  filterStatus === s
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        {canEditCandidates && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-600/25 flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Candidate
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(candidate => (
          <div key={candidate.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white font-semibold text-sm">
                    {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">{candidate.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {candidate.role}
                  </p>
                </div>
              </div>
              {canEditCandidates && (
                <button
                  onClick={() => deleteCandidate(candidate.id)}
                  className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-2 mb-4">
              {candidate.email && (
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{candidate.email}</span>
                </p>
              )}
              {candidate.phone && (
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  {candidate.phone}
                </p>
              )}
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                {candidate.experience} experience
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <Badge label={candidate.status} variant={candidate.status} />
              {canEditCandidates ? (
                <select
                  value={candidate.status}
                  onChange={e => updateCandidateStatus(candidate.id, e.target.value as CandidateStatus)}
                  className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <span className="text-xs text-gray-400 font-medium">Read-only</span>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
            <Users className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">No candidates found</p>
            <p className="text-xs mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen && canEditCandidates} onClose={() => setModalOpen(false)} title="Add New Candidate">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Jane Smith"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Role / Position *</label>
              <input
                type="text"
                required
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                placeholder="e.g. Senior Engineer"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Experience</label>
              <input
                type="text"
                value={form.experience}
                onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                placeholder="e.g. 5 years"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as CandidateStatus }))}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="email@example.com"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
              Add Candidate
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
