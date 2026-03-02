import { Link } from 'react-router';
import { Menu, Home, Sparkles, Camera, DollarSign, Music, Stars, X } from 'lucide-react';
import { useState } from 'react';

export function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Home', path: '/', color: 'bg-pink-500' },
    { icon: Stars, label: 'Activities', path: '/activities', color: 'bg-green-500' },
    { icon: Music, label: 'Nightlife', path: '/nightlife', color: 'bg-purple-500' },
    { icon: Sparkles, label: "Who's Ready?", path: '/whos-ready', color: 'bg-green-600' },
    { icon: Camera, label: 'Photos', path: '/photo-album', color: 'bg-pink-600' },
    { icon: DollarSign, label: 'Payments', path: '/split-payment', color: 'bg-purple-600' },
  ];

  return (
    <>
      {/* Floating Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-pink-500 to-green-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Navigation Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Items */}
          <div className="fixed bottom-24 right-6 z-50 space-y-3">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 ${item.color} hover:opacity-90 text-white px-5 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 animate-slide-in`}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-semibold whitespace-nowrap">{item.label}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}