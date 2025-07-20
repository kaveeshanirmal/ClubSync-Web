import React from "react";
import { Star } from "lucide-react";

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-5 h-5 ${
        i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
      }`}
    />
  ));
};

const FeedBackTab: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
        <Star className="w-4 h-4 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">Volunteer Feedback</h3>
      <div className="h-px bg-gradient-to-r from-yellow-500 to-orange-500 flex-1 opacity-30" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        {
          id: 1,
          volunteerName: "Sarah Johnson",
          rating: 5,
          comment:
            "Amazing experience! The club activities are well-organized and engaging.",
          date: "2024-01-15",
        },
        {
          id: 2,
          volunteerName: "Mike Chen",
          rating: 4,
          comment:
            "Great leadership and communication. Would love to see more events.",
          date: "2024-01-14",
        },
      ].map((item) => (
        <div
          key={item.id}
          className="relative overflow-hidden bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full -mr-8 -mt-8 opacity-30" />

          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-bold text-gray-900">{item.volunteerName}</h4>
              <p className="text-sm text-gray-600">{item.date}</p>
            </div>
            <div className="flex items-center">{renderStars(item.rating)}</div>
          </div>
          <p className="text-sm text-gray-700">{item.comment}</p>
        </div>
      ))}
    </div>

    <div className="relative overflow-hidden bg-white rounded-2xl border-2 border-gray-100 p-6">
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full -mr-8 -mt-8 opacity-30" />
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Overall Club Rating</p>
        <div className="flex items-center justify-center space-x-1 mb-2">
          {renderStars(4.5)}
        </div>
        <p className="text-lg font-bold text-gray-900">4.5/5.0</p>
        <p className="text-sm text-gray-600 mt-1">
          Based on{" "}
          {
            [
              {
                id: 1,
                volunteerName: "Sarah Johnson",
                rating: 5,
                comment:
                  "Amazing experience! The club activities are well-organized and engaging.",
                date: "2024-01-15",
              },
              {
                id: 2,
                volunteerName: "Mike Chen",
                rating: 4,
                comment:
                  "Great leadership and communication. Would love to see more events.",
                date: "2024-01-14",
              },
            ].length
          }{" "}
          reviews
        </p>
      </div>
    </div>
  </div>
);

export default FeedBackTab;
