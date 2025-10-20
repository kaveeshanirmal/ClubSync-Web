import React, { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";

interface FeedbackItem {
  id: string;
  clubId: string;
  userId?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

const renderStars = (rating: number, size = "w-5 h-5") => {
  const rounded = Math.round(rating);
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`${size} ${i < rounded ? "text-yellow-400 fill-current" : "text-gray-300"}`}
    />
  ));
};

const FeedBackTab: React.FC<{ clubId: string }> = ({ clubId }) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clubId) return;
    let cancelled = false;
    const fetchFeedbacks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/clubs/${encodeURIComponent(clubId)}/feedbacks`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load feedbacks (${res.status})`);
        const data = (await res.json()) as FeedbackItem[];
        if (!cancelled) setFeedbacks(data || []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchFeedbacks();
    return () => {
      cancelled = true;
    };
  }, [clubId]);

  const average = useMemo(() => {
    if (!feedbacks.length) return 0;
    return feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length;
  }, [feedbacks]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
          <Star className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Volunteer Feedback</h3>
        <div className="h-px bg-gradient-to-r from-orange-500 to-red-500 flex-1 opacity-30" />
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-600">Loading feedback…</div>
      ) : error ? (
        <div className="py-6 text-center text-red-600">{error}</div>
      ) : feedbacks.length === 0 ? (
        <div className="py-12 text-center text-gray-600">No feedback yet for this club.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedbacks.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full -mr-8 -mt-8 opacity-30" />

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900">{item.userId ? "Member" : "Anonymous"}</h4>
                    <p className="text-sm text-gray-600">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center">{renderStars(item.rating)}</div>
                </div>
                <p className="text-sm text-gray-700">{item.comment}</p>
              </div>
            ))}
          </div>

          <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-6 mt-2">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full -mr-8 -mt-8 opacity-30" />
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Overall Club Rating</p>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  <span className="text-3xl font-bold text-gray-900">{average.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">/5</span>
                </div>
                <div className="flex items-center">{renderStars(average, "w-6 h-6")}</div>
              </div>
              <p className="text-sm text-gray-600 mt-1">Based on <span className="font-medium text-gray-900">{feedbacks.length}</span> review{feedbacks.length > 1 ? "s" : ""}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FeedBackTab;
