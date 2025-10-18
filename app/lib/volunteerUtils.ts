export type BadgeLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface VolunteerBadge {
  level: BadgeLevel;
  emoji: string;
  name: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  minEvents: number;
  description: string;
}

// Badge Configuration
export const BADGES: Record<BadgeLevel, VolunteerBadge> = {
  bronze: {
    level: 'bronze',
    emoji: '🥉',
    name: 'Bronze',
    color: '#CD7F32',
    gradientFrom: '#CD7F32',
    gradientTo: '#8B4513',
    minEvents: 0,
    description: 'New Volunteer - Keep going!'
  },
  silver: {
    level: 'silver',
    emoji: '🥈',
    name: 'Silver',
    color: '#C0C0C0',
    gradientFrom: '#C0C0C0',
    gradientTo: '#808080',
    minEvents: 10,
    description: 'Active Volunteer - Great work!'
  },
  gold: {
    level: 'gold',
    emoji: '🥇',
    name: 'Gold',
    color: '#FFD700',
    gradientFrom: '#FFD700',
    gradientTo: '#FFA500',
    minEvents: 25,
    description: 'Dedicated Volunteer - Amazing!'
  },
  platinum: {
    level: 'platinum',
    emoji: '💎',
    name: 'Platinum',
    color: '#E5E4E2',
    gradientFrom: '#E5E4E2',
    gradientTo: '#B9F2FF',
    minEvents: 50,
    description: 'Elite Volunteer - Outstanding!'
  }
};

/**
 * Calculate badge level based on total events
 * @param totalEvents - Total number of events (participated + organized)
 * @returns Badge level
 */
export function calculateBadgeLevel(totalEvents: number): BadgeLevel {
  if (totalEvents >= 50) return 'platinum';
  if (totalEvents >= 25) return 'gold';
  if (totalEvents >= 10) return 'silver';
  return 'bronze';
}

/**
 * Calculate total points
 * @param participated - Number of events participated
 * @param organized - Number of events organized
 * @returns Total points
 */
export function calculatePoints(
  participated: number, 
  organized: number
): number {
  return (participated * 10) + (organized * 50);
}

/**
 * Get badge information
 * @param totalEvents - Total number of events
 * @returns Badge object with all information
 */
export function getBadge(totalEvents: number): VolunteerBadge {
  const level = calculateBadgeLevel(totalEvents);
  return BADGES[level];
}

/**
 * Get next badge info for progress
 * @param currentLevel - Current badge level
 * @returns Next badge or null if already at max level
 */
export function getNextBadge(
  currentLevel: BadgeLevel
): VolunteerBadge | null {
  const levels: BadgeLevel[] = ['bronze', 'silver', 'gold', 'platinum'];
  const currentIndex = levels.indexOf(currentLevel);
  
  if (currentIndex === levels.length - 1) return null; // Already max level
  
  return BADGES[levels[currentIndex + 1]];
}

/**
 * Calculate progress to next badge
 * @param totalEvents - Total number of events
 * @returns Progress information
 */
export function calculateProgress(totalEvents: number): {
  current: number;
  target: number;
  percentage: number;
  eventsNeeded: number;
} {
  const currentBadge = getBadge(totalEvents);
  const nextBadge = getNextBadge(currentBadge.level);
  
  if (!nextBadge) {
    return {
      current: totalEvents,
      target: totalEvents,
      percentage: 100,
      eventsNeeded: 0
    };
  }
  
  return {
    current: totalEvents,
    target: nextBadge.minEvents,
    percentage: Math.min((totalEvents / nextBadge.minEvents) * 100, 100),
    eventsNeeded: Math.max(nextBadge.minEvents - totalEvents, 0)
  };
}
