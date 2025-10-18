import VolunteerBadge from "./VolunteerBadge";
import PointsDisplay from "./PointsDisplay";
import { VolunteerStatsData } from "@/app/types/volunteer";

interface Props extends VolunteerStatsData {}

export default function VolunteerStats({
  totalPoints,
  eventsParticipated,
  eventsOrganized,
  totalEvents,
  badge,
  nextBadge,
  progress
}: Props) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg border border-orange-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          🎖️ Volunteer Status
        </h3>
        {nextBadge && progress && (
          <div className="text-right">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Next: {nextBadge.emoji} {nextBadge.name}
            </p>
            <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
              {progress.eventsNeeded} events to go!
            </p>
          </div>
        )}
      </div>

      {/* Badge and Points */}
      <div className="flex items-center justify-between mb-6">
        <VolunteerBadge badge={badge} size="lg" showDescription />
        <PointsDisplay points={totalPoints} size="lg" />
      </div>

      {/* Progress Bar (if not max level) */}
      {nextBadge && progress && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
            <span>{progress.current} events</span>
            <span>{progress.target} events</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-2">
            {Math.round(progress.percentage)}% to {nextBadge.name}
          </p>
        </div>
      )}

      {/* Event Statistics Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Total Events */}
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
            {totalEvents}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Total Events
          </p>
        </div>

        {/* Events Participated */}
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {eventsParticipated}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Participated
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            (+{eventsParticipated * 10} pts)
          </p>
        </div>

        {/* Events Organized */}
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            {eventsOrganized}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Organized
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            (+{eventsOrganized * 50} pts)
          </p>
        </div>
      </div>

      {/* Info Footer */}
      <div className="mt-4 pt-4 border-t border-orange-200 dark:border-gray-700">
        <p className="text-xs text-center text-gray-600 dark:text-gray-400">
          💡 Earn <span className="font-semibold text-blue-600">10 points</span> per event participation | 
          <span className="font-semibold text-green-600"> 50 points</span> per event organization
        </p>
      </div>
    </div>
  );
}
