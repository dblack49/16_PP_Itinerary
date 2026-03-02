import { Link } from 'react-router';
import { ItineraryHeader } from '../components/ItineraryHeader';
import { PackingList } from '../components/PackingList';
import { AirbnbSection } from '../components/AirbnbSection';
import { Footer } from '../components/Footer';
import { Camera } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50">
      <ItineraryHeader />

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Trip Overview */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl mb-4 bg-gradient-to-r from-pink-600 to-green-600 bg-clip-text text-transparent"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our Nashville Adventure
          </h2>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
            Three days of country music, sisterhood, and celebrating five incredible years as line sisters.
            Click on activities and nightlife to explore your options! 🤠✨
          </p>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">

            {/* Who's Ready - Disabled */}
            <button
              disabled
              className="inline-flex items-center justify-center gap-3 bg-gray-300 text-gray-500 px-6 py-4 rounded-full shadow-xl cursor-not-allowed text-lg"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Who's Ready (Coming Soon 🚧)
            </button>

            {/* Photo Album - Active */}
            <Link
              to="/photo-album"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all text-lg"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <Camera className="w-6 h-6" />
              Photo Album
            </Link>

            {/* Split Payments - Disabled */}
            <button
              disabled
              className="inline-flex items-center justify-center gap-3 bg-gray-300 text-gray-500 px-6 py-4 rounded-full shadow-xl cursor-not-allowed text-lg"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Split Payments (Coming Soon 💰)
            </button>

          </div>
        </div>

        {/* Important Trip Info */}
        <div className="bg-gradient-to-br from-pink-100 to-green-100 rounded-3xl p-8 shadow-xl border-4 border-yellow-400 mb-12">
          <h3
            className="text-3xl text-center mb-6 text-gray-800"
            style={{ fontFamily: "'Rye', serif" }}
          >
            Important Trip Info 📋
          </h3>

          <div className="bg-white rounded-2xl p-6 space-y-4">
            <div>
              <h4 className="text-xl font-bold text-pink-700 mb-2">BYOB Policy 🍾</h4>
              <p className="text-gray-700">
                Bring your choice of liquor, mixers, seltzers, etc! If you share, cool! If not, idk what to tell you!
                <strong className="block mt-2">Provided: Cups, bottled water, variety of chips</strong>
                <strong className="block">ANYTHING ELSE: Bring your own!</strong>
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold text-green-700 mb-2">Welcome Bag 💖</h4>
              <p className="text-gray-700">$50.00 per Soror - Get your welcome bag on arrival!</p>
            </div>
          </div>
        </div>

        {/* Packing List */}
        <div className="my-12">
          <PackingList />
        </div>

        {/* Airbnb Section */}
        <AirbnbSection />

      </div>

      <Footer />
    </div>
  );
}