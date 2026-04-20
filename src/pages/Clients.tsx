import { useState } from 'react';
import { Plus, Building2, Mail, Phone, Trash2, Briefcase, Users, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/UI/Modal';

const industries = ['Software', 'Finance', 'Healthcare', 'Retail', 'Education', 'Manufacturing', 'Other'];

const defaultForm = { company: '', contactPerson: '', email: '', phone: '', openPositions: 1, industry: 'Software' };

const industryColors: Record<string, string> = {
  Software: 'from-blue-500 to-blue-600',
  Finance: 'from-emerald-500 to-emerald-600',
  Healthcare: 'from-rose-500 to-rose-600',
  Retail: 'from-amber-500 to-amber-600',
  Education: 'from-sky-500 to-sky-600',
  Manufacturing: 'from-slate-500 to-slate-600',
  Other: 'from-gray-500 to-gray-600',
};

export default function Clients() {
  const { clients, addClient, deleteClient } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company || !form.contactPerson) return;
    addClient(form);
    setForm(defaultForm);
    setModalOpen(false);
  };

  const totalPositions = clients.reduce((sum, c) => sum + c.openPositions, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-1">Total Clients</p>
          <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-1">Open Positions</p>
          <p className="text-2xl font-bold text-gray-900">{totalPositions}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-1">Avg. Positions / Client</p>
          <p className="text-2xl font-bold text-gray-900">
            {clients.length > 0 ? (totalPositions / clients.length).toFixed(1) : '0'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">All Clients <span className="text-gray-400 font-normal text-sm">({clients.length})</span></h2>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-600/25"
        >
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clients.map(client => {
          const gradient = industryColors[client.industry] ?? industryColors.Other;
          return (
            <div key={client.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${gradient}`} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">{client.company}</h3>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md inline-block mt-0.5">{client.industry}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteClient(client.id)}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-gray-700">{client.contactPerson}</span>
                  </p>
                  {client.email && (
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </p>
                  )}
                  {client.phone && (
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      {client.phone}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-xs font-semibold text-gray-900">{client.openPositions}</span>
                    <span className="text-xs text-gray-400">open position{client.openPositions !== 1 ? 's' : ''}</span>
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>
          );
        })}

        {clients.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
            <Building2 className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">No clients yet</p>
            <p className="text-xs mt-1">Add your first client to get started</p>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Client">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={form.company}
              onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
              placeholder="e.g. Acme Corporation"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Contact Person *</label>
            <input
              type="text"
              required
              value={form.contactPerson}
              onChange={e => setForm(f => ({ ...f, contactPerson: e.target.value }))}
              placeholder="e.g. John Smith"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="contact@company.com"
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Industry</label>
              <select
                value={form.industry}
                onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Open Positions</label>
              <input
                type="number"
                min="0"
                value={form.openPositions}
                onChange={e => setForm(f => ({ ...f, openPositions: parseInt(e.target.value) || 0 }))}
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
              Add Client
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
