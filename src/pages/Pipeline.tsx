import { useState, DragEvent } from 'react';
import { useApp } from '../context/AppContext';
import Badge from '../components/UI/Badge';
import { CandidateStatus, Candidate } from '../types';
import { Briefcase, Clock, GripVertical, ChevronRight } from 'lucide-react';

const columns: { status: CandidateStatus; label: string; color: string; bg: string; dot: string }[] = [
  { status: 'Applied', label: 'Applied', color: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' },
  { status: 'Interview', label: 'Interview', color: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
  { status: 'Offer', label: 'Offer', color: 'text-orange-700', bg: 'bg-orange-50', dot: 'bg-orange-500' },
  { status: 'Hired', label: 'Hired', color: 'text-green-700', bg: 'bg-green-50', dot: 'bg-green-500' },
];

const nextStatus: Partial<Record<CandidateStatus, CandidateStatus>> = {
  Applied: 'Interview',
  Interview: 'Offer',
  Offer: 'Hired',
};

function CandidateCard({ candidate, onDragStart }: { candidate: Candidate; onDragStart: (e: DragEvent, id: string) => void }) {
  const { updateCandidateStatus, canEditCandidates } = useApp();
  const next = nextStatus[candidate.status];

  return (
    <div
      draggable={canEditCandidates}
      onDragStart={e => canEditCandidates && onDragStart(e, candidate.id)}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-150 group"
    >
      <div className="flex items-start gap-2 mb-3">
        <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5 group-hover:text-gray-400 transition-colors" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-xs">
                {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <p className="font-semibold text-gray-900 text-sm truncate">{candidate.name}</p>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1 ml-8">
            <Briefcase className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{candidate.role}</span>
          </p>
        </div>
      </div>

      <div className="ml-6 space-y-1.5">
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {candidate.experience}
        </p>
        <p className="text-xs text-gray-400 truncate">{candidate.email}</p>
      </div>

      {canEditCandidates && next && (
        <button
          onClick={() => updateCandidateStatus(candidate.id, next)}
          className="mt-3 ml-6 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium group/btn"
        >
          Move to {next}
          <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}

export default function Pipeline() {
  const { candidates, updateCandidateStatus, canEditCandidates } = useApp();
  const [dragOverColumn, setDragOverColumn] = useState<CandidateStatus | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDragStart = (e: DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(id);
  };

  const handleDragOver = (e: DragEvent, status: CandidateStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  };

  const handleDrop = (e: DragEvent, status: CandidateStatus) => {
    e.preventDefault();
    if (canEditCandidates && draggingId) {
      updateCandidateStatus(draggingId, status);
    }
    setDraggingId(null);
    setDragOverColumn(null);
  };

  const pipelineCandidates = candidates.filter(c => c.status !== 'Rejected');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-5">
        <p className="text-xs text-gray-400 mt-1">
          {canEditCandidates
            ? 'Drag and drop candidates between stages or use the quick-move button'
            : 'Read-only pipeline view for your role'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map(col => {
          const colCandidates = pipelineCandidates.filter(c => c.status === col.status);
          const isOver = dragOverColumn === col.status;

          return (
            <div
              key={col.status}
              onDragOver={e => canEditCandidates && handleDragOver(e, col.status)}
              onDrop={e => canEditCandidates && handleDrop(e, col.status)}
              onDragLeave={() => setDragOverColumn(null)}
              className={`flex flex-col rounded-2xl transition-all duration-150 ${
                isOver ? 'ring-2 ring-blue-400 ring-offset-1' : ''
              }`}
            >
              <div className={`${col.bg} rounded-t-2xl px-4 py-3 border border-b-0 ${isOver ? 'border-blue-300' : 'border-gray-100'}`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <h3 className={`text-sm font-semibold ${col.color}`}>{col.label}</h3>
                  <span className={`ml-auto text-xs font-bold ${col.color} ${col.bg} px-2 py-0.5 rounded-full`}>
                    {colCandidates.length}
                  </span>
                </div>
              </div>

              <div
                className={`flex-1 min-h-48 p-3 rounded-b-2xl border border-t-0 space-y-2.5 transition-colors ${
                  isOver ? 'bg-blue-50/50 border-blue-300' : 'bg-gray-50/50 border-gray-100'
                }`}
              >
                {colCandidates.map(candidate => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onDragStart={handleDragStart}
                  />
                ))}

                {colCandidates.length === 0 && (
                  <div className={`flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed transition-colors ${
                    isOver ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                  }`}>
                    <p className="text-xs text-gray-400">Drop here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Status Update</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 pb-2 pr-4">Candidate</th>
                <th className="text-left text-xs font-medium text-gray-500 pb-2 pr-4">Role</th>
                <th className="text-left text-xs font-medium text-gray-500 pb-2 pr-4">Current Stage</th>
                <th className="text-left text-xs font-medium text-gray-500 pb-2">Move To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pipelineCandidates.map(candidate => (
                <tr key={candidate.id} className="hover:bg-gray-50/50">
                  <td className="py-2.5 pr-4 font-medium text-gray-900">{candidate.name}</td>
                  <td className="py-2.5 pr-4 text-gray-500 text-xs">{candidate.role}</td>
                  <td className="py-2.5 pr-4">
                    <Badge label={candidate.status} variant={candidate.status} />
                  </td>
                  <td className="py-2.5">
                    {canEditCandidates ? (
                      <select
                        value={candidate.status}
                        onChange={e => updateCandidateStatus(candidate.id, e.target.value as CandidateStatus)}
                        className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        {(['Applied', 'Interview', 'Offer', 'Hired', 'Rejected'] as CandidateStatus[]).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">Read-only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
