import { ImageWithFallback } from './figma/ImageWithFallback';
import { Sparkles } from 'lucide-react';

export function ItineraryHeader() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-pink-500 to-green-600 py-16 px-6">
      {/* Glitter overlay effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="glitter-effect"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
          <h1 className="text-5xl md:text-7xl text-white" style={{ fontFamily: "'Rye', serif" }}>
            Nashville Bound!
          </h1>
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mt-6 border-2 border-white/30">
          <h2 className="text-3xl text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            16 Prestigious Pearls
          </h2>
          <p className="text-xl text-white/90">
            Celebrating 5 Years of Sisterhood 💕
          </p>
          <p className="text-lg text-white/80 mt-2">
            Pink, Green & Country Dreams
          </p>
        </div>
      </div>

      {/* Western rope decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-repeat-x opacity-20" 
           style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 10px, white 10px, white 12px)" }}>
      </div>
    </div>
  );
}