import { ImageWithFallback } from './figma/ImageWithFallback';
import { MapPin, Phone, DollarSign, Star, ExternalLink, Check } from 'lucide-react';

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

interface VotingLocationCardProps {
  location: Location;
  theme: 'pink' | 'green';
  onVote: () => void;
  isSelected: boolean;
  voteCount?: number;
}

export function VotingLocationCard({ location, theme, onVote, isSelected, voteCount = 0 }: VotingLocationCardProps) {
  const accentColor = theme === 'pink' ? 'text-pink-600' : 'text-green-700';
  const bgColor = theme === 'pink' 
    ? isSelected ? 'from-pink-100 to-pink-50' : 'from-pink-50 to-white hover:from-pink-100' 
    : isSelected ? 'from-green-100 to-green-50' : 'from-green-50 to-white hover:from-green-100';
  const borderColor = theme === 'pink' 
    ? isSelected ? 'border-pink-500' : 'border-pink-300'
    : isSelected ? 'border-green-500' : 'border-green-300';
  const borderWidth = isSelected ? 'border-4' : 'border-2';
  
  return (
    <div className={`bg-gradient-to-br ${bgColor} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all ${borderWidth} ${borderColor} group relative`}>
      {isSelected && (
        <div className={`absolute top-3 left-3 ${theme === 'pink' ? 'bg-pink-500' : 'bg-green-600'} text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-lg z-10`}>
          <Check className="w-4 h-4" />
          Selected
        </div>
      )}
      
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
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
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

        <button
          onClick={onVote}
          className={`w-full ${theme === 'pink' ? 'bg-pink-500 hover:bg-pink-600' : 'bg-green-600 hover:bg-green-700'} text-white py-3 rounded-lg transition-all text-lg shadow-md hover:shadow-lg`}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {isSelected ? 'Remove Vote' : 'Vote for This'}
        </button>
        
        {voteCount > 0 && (
          <p className="text-center text-sm text-gray-600 mt-2">
            {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
          </p>
        )}
      </div>
    </div>
  );
}
