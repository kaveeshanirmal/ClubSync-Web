import { useState, useEffect, useCallback } from 'react';
import { VolunteerStatsData } from '@/app/types/volunteer';

interface UseVolunteerStatsReturn {
  stats: VolunteerStatsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useVolunteerStats(userId: string | undefined): UseVolunteerStatsReturn {
  const [stats, setStats] = useState<VolunteerStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/volunteers/stats/${userId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch stats');
      }

      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Error fetching volunteer stats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}
