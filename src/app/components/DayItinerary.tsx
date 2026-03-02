import { ImageWithFallback } from './figma/ImageWithFallback';
import { Calendar, Clock, MapPin, Star } from 'lucide-react';

interface Activity {
  time: string;
  title: string;
  location: string;
  description: string;
  icon?: string;
}

interface DayItineraryProps {
  day: string;
  date: string;
  activities: Activity[];
  imageUrl: string;
  theme: 'pink' | 'green';
}

export function DayItinerary({ day, date, activities, imageUrl, theme }: DayItineraryProps) {
  const bgColor = theme === 'pink' ? 'from-pink-50 to-pink-100' : 'from-green-50 to-green-100';
  const accentColor = theme === 'pink' ? 'bg-pink-600' : 'bg-green-700';
  const borderColor = theme === 'pink' ? 'border-pink-300' : 'border-green-300';
  const textColor = theme === 'pink' ? 'text-pink-800' : 'text-green-800';
  
  return (
    <div className={`bg-gradient-to-br ${bgColor} rounded-3xl overflow-hidden shadow-xl border-4 ${borderColor} mb-8`}>
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image side */}
        <div className="relative h-64 md:h-auto">
          <ImageWithFallback 
            src={imageUrl}
            alt={`${day} activities`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-white" />
              <span className="text-white text-lg">{date}</span>
            </div>
            <h3 className="text-4xl text-white mb-1" style={{ fontFamily: "'Rye', serif" }}>
              {day}
            </h3>
          </div>
        </div>

        {/* Activities side */}
        <div className="p-6 md:p-8">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all border-2 border-white/50 relative overflow-hidden"
              >
                {/* Subtle glitter accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-yellow-200/30 to-transparent rounded-bl-full"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start gap-3">
                    <div className={`${accentColor} rounded-lg p-2 flex-shrink-0`}>
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`${textColor} font-semibold`}>{activity.time}</span>
                        {activity.icon && <span className="text-2xl">{activity.icon}</span>}
                      </div>
                      <h4 className="text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {activity.title}
                      </h4>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{activity.location}</span>
                      </div>
                      <p className="text-sm text-gray-700">{activity.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
