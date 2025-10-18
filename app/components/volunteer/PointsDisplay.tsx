interface Props {
  points: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function PointsDisplay({ 
  points, 
  size = 'md',
  showLabel = true 
}: Props) {
  const sizeConfig = {
    sm: {
      number: 'text-2xl',
      unit: 'text-sm',
      label: 'text-xs'
    },
    md: {
      number: 'text-4xl',
      unit: 'text-lg',
      label: 'text-sm'
    },
    lg: {
      number: 'text-6xl',
      unit: 'text-2xl',
      label: 'text-base'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className="flex flex-col items-end">
      <div className="flex items-baseline gap-2">
        <span className={`${config.number} font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent`}>
          {points.toLocaleString()}
        </span>
        <span className={`${config.unit} text-gray-500 dark:text-gray-400`}>
          pts
        </span>
      </div>
      {showLabel && (
        <p className={`${config.label} text-gray-500 dark:text-gray-400`}>
          Total Points
        </p>
      )}
    </div>
  );
}
