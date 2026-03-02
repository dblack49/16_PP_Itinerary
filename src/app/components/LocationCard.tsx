import { ImageWithFallback } from './figma/ImageWithFallback';
import { MapPin, Phone, DollarSign, Star, ExternalLink } from 'lucide-react';

interface Location {
  name: string;
  description: string;
  address?: string;
  phone?: string;
  priceRange?: string;
  imageUrl: string;
  website?: string;
  highlight?: string;
}

interface LocationCardProps {
  location: Location;
  theme: 'pink' | 'green';
}

export function LocationCard({ location, theme }: LocationCardProps) {
  const accentColor = theme === 'pink' ? 'text-pink-600' : 'text-green-700';
  const bgColor = theme === 'pink' 
    ? 'from-pink-50 to-white hover:from-pink-100' 
    : 'from-green-50 to-white hover:from-green-100';
  const borderColor = theme === 'pink' ? 'border-pink-300' : 'border-green-300';
  
  return (
    <div className={`bg-gradient-to-br ${bgColor} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-2 ${borderColor} group`}>
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback 
          src={location.imageUrl}
          alt={location.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {location.highlight && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-lg">
            <Star className="w-4 h-4 fill-current" />
            {location.highlight}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className={`text-2xl mb-2 ${accentColor}`} style={{ fontFamily: "'Playfair Display', serif" }}>
          {location.name}
        </h3>
        
        <p className="text-gray-700 mb-4">{location.description}</p>
        
        <div className="space-y-2 text-sm text-gray-600">
          {location.address && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{location.address}</span>
            </div>
          )}
          
          {location.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span>{location.phone}</span>
            </div>
          )}
          
          {location.priceRange && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 flex-shrink-0" />
              <span>{location.priceRange}</span>
            </div>
          )}
          
          {location.website && (
            <a 
              href={location.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 ${accentColor} hover:underline`}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visit Website</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
