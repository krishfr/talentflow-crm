interface BrandMarkProps {
  size?: 'sm' | 'md';
}

export default function BrandMark({ size = 'md' }: BrandMarkProps) {
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-9 h-9 text-sm';

  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-sm shadow-blue-600/30`}>
      <span className="font-bold text-white tracking-tight">TF</span>
    </div>
  );
}
