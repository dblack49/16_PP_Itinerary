import { Link } from 'react-router';
import { ArrowLeft, Music } from 'lucide-react';
import { LocationCard } from '../components/LocationCard';

export function NightlifePage() {
  const locations = [
    {
      name: "Linq Rooftop Bar",
      description: "Upscale rooftop experience with panoramic Nashville views. Perfect for a sophisticated night out with the girls!",
      address: "Downtown Nashville",
      priceRange: "$12-18 per cocktail",
      imageUrl: "https://images.unsplash.com/photo-1558011554-b0dd73a08568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBiYXIlMjBuZW9uJTIwbGlnaHRzfGVufDF8fHx8MTc3MjE2Nzk3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      highlight: "Rooftop Views",
      website: "https://www.graduatehotels.com/nashville/restaurants-bars/linq/"
    },
    {
      name: "Jelly Rolls Dueling Piano Bar",
      description: "Sing along and request your favorite songs! High-energy, interactive, and so much fun. No cover charge!",
      address: "182 2nd Ave N, Nashville, TN 37201",
      priceRange: "No cover, tips suggested",
      imageUrl: "https://images.unsplash.com/photo-1558011554-b0dd73a08568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBiYXIlMjBuZW9uJTIwbGlnaHRzfGVufDF8fHx8MTc3MjE2Nzk3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      highlight: "Must Visit!",
      website: "https://jellyrollsnashville.com/"
    },
    {
      name: "Barstools & Buskers",
      description: "Multi-level bar with live music on every floor. Great vibes and always packed with energy!",
      address: "Broadway, Nashville",
      priceRange: "No cover charge",
      imageUrl: "https://images.unsplash.com/photo-1558011554-b0dd73a08568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBiYXIlMjBuZW9uJTIwbGlnaHRzfGVufDF8fHx8MTc3MjE2Nzk3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      website: "https://www.barstoolsandbuskers.com/"
    },
    {
      name: "Vibes",
      description: "Trendy spot with DJ sets, cocktails, and a party atmosphere. Dress to impress!",
      address: "Nashville",
      priceRange: "$10-20 cover charge",
      imageUrl: "https://images.unsplash.com/photo-1558011554-b0dd73a08568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBiYXIlMjBuZW9uJTIwbGlnaHRzfGVufDF8fHx8MTc3MjE2Nzk3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      highlight: "Upscale",
      website: "https://www.vibesashville.com/"
    },
    {
      name: "Jar10",
      description: "Sophisticated cocktail bar with creative drinks and intimate atmosphere. Great for pre-gaming!",
      address: "Nashville",
      priceRange: "$12-16 per cocktail",
      imageUrl: "https://images.unsplash.com/photo-1558011554-b0dd73a08568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBiYXIlMjBuZW9uJTIwbGlnaHRzfGVufDF8fHx8MTc3MjE2Nzk3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      website: "https://www.jar10nashville.com/"
    },
    {
      name: "The Spot Nashville",
      description: "Popular local hangout with live music, dancing, and a fun crowd. Great late-night vibes!",
      address: "Nashville",
      priceRange: "$5-10 cover charge",
      imageUrl: "https://images.unsplash.com/photo-1558011554-b0dd73a08568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBiYXIlMjBuZW9uJTIwbGlnaHRzfGVufDF8fHx8MTc3MjE2Nzk3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      website: "https://www.thespotnashville.com/"
    },
    {
      name: "Skydeck",
      description: "Stunning rooftop bar with skyline views. Perfect for sunset cocktails before hitting the town!",
      address: "Downtown Nashville",
      priceRange: "$12-18 per cocktail",
      imageUrl: "https://images.unsplash.com/photo-1558011554-b0dd73a08568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBiYXIlMjBuZW9uJTIwbGlnaHRzfGVufDF8fHx8MTc3MjE2Nzk3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      highlight: "Skyline Views",
      website: "https://www.loews.com/nashville/dining/skydeck/"
    },
    {
      name: "Tootsie's Orchid Lounge",
      description: "Legendary honky tonk bar on Broadway. Live music all day and night, no cover! Nashville institution.",
      address: "422 Broadway, Nashville, TN 37203",
      priceRange: "No cover charge",
      imageUrl: "https://images.unsplash.com/photo-1761243839291-45a7dc911df7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VudHJ5JTIwbXVzaWMlMjBOYXNodmlsbGUlMjBob25reSUyMHRvbmt8ZW58MXx8fHwxNzcyMTY1NDc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      highlight: "Iconic",
      website: "https://www.tootsies.net/"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 via-pink-700 to-pink-600 py-8 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="glitter-effect"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-white hover:text-pink-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Itinerary</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Music className="w-12 h-12 text-white" />
            <div>
              <h1 className="text-4xl md:text-5xl text-white" style={{ fontFamily: "'Rye', serif" }}>
                Nightlife & Clubs
              </h1>
              <p className="text-white/90 text-lg mt-2">
                Dance the night away at Nashville's hottest spots
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
              theme="pink"
            />
          ))}
        </div>
      </div>
    </div>
  );
}