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

export interface VolunteerStatsData {
  totalPoints: number;
  eventsParticipated: number;
  eventsOrganized: number;
  totalEvents: number;
  badge: VolunteerBadge;
  progress?: {
    current: number;
    target: number;
    percentage: number;
    eventsNeeded: number;
  };
  nextBadge?: VolunteerBadge | null;
}

export interface VolunteerStatsResponse {
  success: boolean;
  data?: VolunteerStatsData;
  error?: string;
}
