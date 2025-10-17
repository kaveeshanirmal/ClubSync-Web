import { VolunteerBadge as BadgeType } from "@/app/types/volunteer";

interface Props {
  badge: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showDescription?: boolean;
}

export default function VolunteerBadge({ 
  badge, 
  size = 'md', 
  showLabel = true,
  showDescription = false
}: Props) {
  const sizeConfig = {
    sm: {
      container: 'w-10 h-10',
      emoji: 'text-lg',
      name: 'text-xs',
      description: 'text-xs'
    },
    md: {
      container: 'w-16 h-16',
      emoji: 'text-3xl',
      name: 'text-sm',
      description: 'text-xs'
    },
    lg: {
      container: 'w-24 h-24',
      emoji: 'text-5xl',
      name: 'text-base',
      description: 'text-sm'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Badge Circle */}
      <div 
        className={`${config.container} rounded-full flex items-center justify-center shadow-lg border-3 transition-transform hover:scale-110`}
        style={{ 
          background: `linear-gradient(135deg, ${badge.gradientFrom}, ${badge.gradientTo})`,
          borderColor: badge.color,
          borderWidth: '3px',
          borderStyle: 'solid'
        }}
      >
        <span className={config.emoji}>{badge.emoji}</span>
      </div>

      {/* Badge Info */}
      {showLabel && (
        <div className="text-center">
          <p className={`font-semibold text-gray-900 dark:text-white ${config.name}`}>
            {badge.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Volunteer
          </p>
          {showDescription && (
            <p className={`text-gray-600 dark:text-gray-300 mt-1 ${config.description}`}>
              {badge.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
