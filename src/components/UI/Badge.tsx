import { CandidateStatus, TaskPriority } from '../../types';

type BadgeVariant = CandidateStatus | TaskPriority | 'default';

const variantStyles: Record<string, string> = {
  Applied: 'bg-blue-50 text-blue-700 border border-blue-200',
  Interview: 'bg-amber-50 text-amber-700 border border-amber-200',
  Offer: 'bg-orange-50 text-orange-700 border border-orange-200',
  Hired: 'bg-green-50 text-green-700 border border-green-200',
  Rejected: 'bg-red-50 text-red-700 border border-red-200',
  High: 'bg-red-50 text-red-700 border border-red-200',
  Medium: 'bg-amber-50 text-amber-700 border border-amber-200',
  Low: 'bg-green-50 text-green-700 border border-green-200',
  default: 'bg-gray-100 text-gray-600 border border-gray-200',
};

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({ label, variant = 'default', className = '' }: BadgeProps) {
  const style = variantStyles[variant] ?? variantStyles.default;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style} ${className}`}>
      {label}
    </span>
  );
}
