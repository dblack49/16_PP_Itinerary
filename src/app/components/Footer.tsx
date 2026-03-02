import { Heart, Sparkles, Music } from 'lucide-react';

export function Footer() {
  return (
    <div className="bg-gradient-to-r from-pink-600 via-green-600 to-pink-600 py-12 px-6 relative overflow-hidden">
      {/* Glitter background */}
      <div className="absolute inset-0 opacity-20">
        <div className="glitter-effect"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
          <Sparkles className="w-6 h-6 text-white animate-pulse" />
          <Music className="w-6 h-6 text-white animate-pulse" />
        </div>
        
        <h3 className="text-3xl text-white mb-4" style={{ fontFamily: "'Rye', serif" }}>
          5 Years Strong!
        </h3>
        
        <p className="text-xl text-white/90 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Alpha Kappa Alpha Sorority, Incorporated
        </p>
        
        <p className="text-lg text-white/80">
          Service to All Mankind • Sisterhood Forever
        </p>

        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="text-white text-center">
            <div className="text-3xl mb-1">🌸</div>
            <div className="text-sm">Pretty</div>
          </div>
          <div className="text-white text-center">
            <div className="text-3xl mb-1">💚</div>
            <div className="text-sm">Poised</div>
          </div>
          <div className="text-white text-center">
            <div className="text-3xl mb-1">✨</div>
            <div className="text-sm">Profound</div>
          </div>
        </div>

        <div className="mt-8 text-white/70 text-sm">
          Nashville 2026 • Line Sisters Trip 💕🤠
        </div>
      </div>
    </div>
  );
}
