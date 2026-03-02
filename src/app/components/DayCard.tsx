import { Link } from 'react-router';
import { Coffee, UtensilsCrossed, Wine, Sparkles } from 'lucide-react';

interface DayCardProps {
  day: string;
  date: string;
  theme: 'pink' | 'green';
}

export function DayCard({ day, date, theme }: DayCardProps) {
  const bgColor = theme === 'pink' 
    ? 'from-pink-100 via-pink-50 to-white' 
    : 'from-green-100 via-green-50 to-white';
  const borderColor = theme === 'pink' ? 'border-pink-400' : 'border-green-400';
  
  const slots = [
    { 
      id: 'breakfast', 
      label: 'Breakfast', 
      icon: Coffee, 
      color: theme === 'pink' ? 'bg-pink-500' : 'bg-green-600',
      hoverColor: theme === 'pink' ? 'hover:bg-pink-600' : 'hover:bg-green-700'
    },
    { 
      id: 'lunch', 
      label: 'Lunch', 
      icon: UtensilsCrossed, 
      color: theme === 'pink' ? 'bg-pink-500' : 'bg-green-600',
      hoverColor: theme === 'pink' ? 'hover:bg-pink-600' : 'hover:bg-green-700'
    },
    { 
      id: 'dinner', 
      label: 'Dinner', 
      icon: Wine, 
      color: theme === 'pink' ? 'bg-pink-500' : 'bg-green-600',
      hoverColor: theme === 'pink' ? 'hover:bg-pink-600' : 'hover:bg-green-700'
    },
    { 
      id: 'activities', 
      label: 'Activities', 
      icon: Sparkles, 
      color: theme === 'pink' ? 'bg-pink-600' : 'bg-green-700',
      hoverColor: theme === 'pink' ? 'hover:bg-pink-700' : 'hover:bg-green-800'
    },
    { 
      id: 'nightlife', 
      label: 'Nightlife', 
      icon: Sparkles, 
      color: theme === 'pink' ? 'bg-pink-700' : 'bg-green-800',
      hoverColor: theme === 'pink' ? 'hover:bg-pink-800' : 'hover:bg-green-900'
    }
  ];

  return (
    <div className={`bg-gradient-to-br ${bgColor} rounded-3xl p-8 shadow-xl border-4 ${borderColor} mb-8 relative overflow-hidden`}>
      {/* Glitter accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-200/30 to-transparent rounded-bl-full"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-6">
          <h3 className="text-4xl mb-2" style={{ fontFamily: "'Rye', serif" }}>
            {day}
          </h3>
          <p className="text-lg text-gray-600">{date}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {slots.map((slot, index) => (
            <Link 
              key={`${slot.id}-${index}`}
              to={`/${slot.id}`}
              className={`${slot.color} ${slot.hoverColor} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer group`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <slot.icon className="w-6 h-6 group-hover:animate-bounce" />
                  <span className="text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {slot.label}
                  </span>
                </div>
                <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <p className="text-sm text-white/80 mt-2">Click to view options</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}