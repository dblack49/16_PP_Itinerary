import { Link } from 'react-router';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { LocationCard } from '../components/LocationCard';

export function ActivitiesPage() {
  const locations = [
    {
      name: "Ole Smoky Moonshine Distillery",
      description: "Taste authentic Tennessee moonshine! Multiple flavors from classic to creative. Fun atmosphere with live music.",
      address: "6th Ave & Broadway, Nashville, TN",
      priceRange: "$10-20 for tastings",
      imageUrl: "https://images.unsplash.com/photo-1588897159261-328f3f53715f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOYXNodmlsbGUlMjBCcm9hZHdheSUyMHN0cmVldCUyMG11c2ljfGVufDF8fHx8MTc3MjE2NTQ3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      highlight: "Must Do!",
      website: "https://olesmoky.com/distillery-locations/nashville-the-holler/"
    },
    {
      name: "National Museum of African American Music",
      description: "Celebrate the rich history and impact of African American music. Interactive exhibits and powerful stories!",
      address: "510 Broadway, Nashville, TN 37203",
      priceRange: "$25 per adult",
      imageUrl: "https://images.unsplash.com/photo-1588897159261-328f3f53715f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOYXNodmlsbGUlMjBCcm9hZHdheSUyMHN0cmVldCUyMG11c2ljfGVufDF8fHx8MTc3MjE2NTQ3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      highlight: "Cultural",
      website: "https://nmaam.org/"
    },
    {
      name: "Nashville Pontoon Cruise",
      description: "Cruise the Cumberland River with your line sisters! BYOB allowed, beautiful city views, perfect for photos.",
      address: "Various departure points",
      priceRange: "$300-600 for group",
      imageUrl: "https://images.unsplash.com/photo-1765720499263-d57f57a86d2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb250b29uJTIwYm9hdCUyMGNydWlzZXxlbnwxfHx8fDE3NzIxNjc5NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      highlight: "Unique",
      website: "https://www.nashvillepontoonrental.com/"
    },
    {
      name: "The Parthenon",
      description: "Full-scale replica of the Greek Parthenon in Centennial Park. Perfect backdrop for photoshoots in your pink & green!",
      address: "2500 West End Ave, Nashville, TN 37203",
      priceRange: "$10 per adult",
      imageUrl: "https://images.unsplash.com/photo-1556033681-83abea291a96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOYXNodmlsbGUlMjBza3lsaW5lfGVufDF8fHx8MTc3MjE2NTQ3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      highlight: "Photo Opp",
      website: "https://www.nashvilleparthenon.com/"
    },
    {
      name: "Play Playground",
      description: "Adult playground bar with games, swings, and fun activities. Great for letting loose with the girls!",
      address: "Downtown Nashville",
      priceRange: "$15-30 per person",
      imageUrl: "https://images.unsplash.com/photo-1588897159261-328f3f53715f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOYXNodmlsbGUlMjBCcm9hZHdheSUyMHN0cmVldCUyMG11c2ljfGVufDF8fHx8MTc3MjE2NTQ3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      highlight: "Fun!",
      website: "https://www.playplayground.com/"
    },
    {
      name: "Bull Riding Experience",
      description: "Test your cowgirl skills on a mechanical bull! Great for photos and laughs. Yee-haw!",
      address: "Various Nashville bars",
      priceRange: "$5-10 per ride",
      imageUrl: "https://images.unsplash.com/photo-1770137740551-09f8d07090ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwYnVsbCUyMHJpZGluZ3xlbnwxfHx8fDE3NzIxNjc5Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      highlight: "Cowgirl",
      website: "https://www.wildhorse.com/"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 py-8 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="glitter-effect"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-white hover:text-green-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Itinerary</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Sparkles className="w-12 h-12 text-white" />
            <div>
              <h1 className="text-4xl md:text-5xl text-white" style={{ fontFamily: "'Rye', serif" }}>
                Nashville Activities
              </h1>
              <p className="text-white/90 text-lg mt-2">
                Unforgettable experiences to make your trip special
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {locations.map((location, index) => (
            <LocationCard 
              key={index}
              location={location}
              theme="green"
            />
          ))}
        </div>
      </div>
    </div>
  );
}