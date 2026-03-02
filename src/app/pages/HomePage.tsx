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
              Who&apos;s Ready (Coming Soon 🚧)
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

        {/* Day 1 - Friday */}
        <div className="bg-gradient-to-br from-pink-100 via-pink-50 to-white rounded-3xl p-8 shadow-xl border-4 border-pink-400 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-200/30 to-transparent rounded-bl-full" />
          <div className="relative z-10">
            <div className="text-center mb-6">
              <h3 className="text-4xl mb-2" style={{ fontFamily: "'Rye', serif" }}>
                Day 1 - Friday
              </h3>
              <p className="text-lg text-gray-600">February 17, 2026</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🏠</span>
                  <span className="text-xl font-bold text-pink-700">Check-in: 3:00 PM</span>
                </div>
                <p className="text-gray-600 ml-11">Arrival in Nashville, TN</p>
              </div>

              <div className="bg-pink-50 rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🎁</span>
                  <span className="text-xl font-bold text-pink-700">Welcome Bag - $50.00</span>
                </div>
              </div>

              <Link
                to="/activities"
                className="block bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✨</span>
                    <span className="text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Explore Activity Options
                    </span>
                  </div>
                  <span className="text-2xl">→</span>
                </div>
                <p className="text-sm text-white/80 mt-2 ml-11">Click to view suggestions</p>
              </Link>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🍽️</span>
                  <span className="text-xl font-bold text-pink-700">Dinner: 7:00 PM</span>
                </div>
                <p className="text-gray-800 ml-11 mb-2">
                  <strong>Noir Restaurant</strong>
                </p>
                <a
                  href="https://noironmain.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-11 text-pink-600 hover:text-pink-700 underline"
                >
                  View Menu →
                </a>
              </div>

              <div className="bg-gradient-to-r from-pink-200 to-green-200 rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💕</span>
                  <span className="text-xl font-bold text-gray-800">Pink &amp; Green Pajama Party</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Day 2 - Saturday */}
        <div className="bg-gradient-to-br from-green-100 via-green-50 to-white rounded-3xl p-8 shadow-xl border-4 border-green-400 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-200/30 to-transparent rounded-bl-full" />
          <div className="relative z-10">
            <div className="text-center mb-6">
              <h3 className="text-4xl mb-2" style={{ fontFamily: "'Rye', serif" }}>
                Day 2 - Saturday
              </h3>
              <p className="text-lg text-gray-600">February 18, 2026</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🥂</span>
                  <span className="text-xl font-bold text-green-700">Brunch: 12:30 PM</span>
                </div>
                <p className="text-gray-800 ml-11 mb-2">
                  <strong>Linq Restaurant</strong>
                </p>
                <a
                  href="https://www.linqsocialkitchen.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-11 text-green-600 hover:text-green-700 underline"
                >
                  View Menu →
                </a>
              </div>

              <Link
                to="/activities"
                className="block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✨</span>
                    <span className="text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Explore Activity Options
                    </span>
                  </div>
                  <span className="text-2xl">→</span>
                </div>
                <p className="text-sm text-white/80 mt-2 ml-11">Click to view suggestions</p>
              </Link>

              <div className="bg-green-50 rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚐</span>
                  <span className="text-xl font-bold text-green-700">Transportation Provided</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🍝</span>
                  <span className="text-xl font-bold text-green-700">Dinner: 7:30 PM</span>
                </div>
                <p className="text-gray-800 ml-11 mb-2">
                  <strong>V Modern Italian</strong>
                </p>
                <a
                  href="https://v.restaurant/nashville/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-11 text-green-600 hover:text-green-700 underline"
                >
                  View Menu →
                </a>
              </div>

              <Link
                to="/nightlife"
                className="block bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎉</span>
                    <span className="text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Night Out Options
                    </span>
                  </div>
                  <span className="text-2xl">→</span>
                </div>
                <p className="text-sm text-white/80 mt-2 ml-11">Click to explore nightlife spots</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Day 3 - Sunday */}
        <div className="bg-gradient-to-br from-pink-100 via-pink-50 to-white rounded-3xl p-8 shadow-xl border-4 border-pink-400 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-200/30 to-transparent rounded-bl-full" />
          <div className="relative z-10">
            <div className="text-center mb-6">
              <h3 className="text-4xl mb-2" style={{ fontFamily: "'Rye', serif" }}>
                Day 3 - Sunday
              </h3>
              <p className="text-lg text-gray-600">February 19, 2026</p>
              <p className="text-2xl mt-2">16 PP is out! ✌️</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🏠</span>
                  <span className="text-xl font-bold text-pink-700">Check-out: 10:00 AM</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🍳</span>
                  <span className="text-xl font-bold text-pink-700">Breakfast/Brunch</span>
                </div>
                <p className="text-gray-800 ml-11 mb-2">
                  <strong>Chicago&apos;s Home of Chicken &amp; Waffles</strong>
                  <br />
                  <span className="text-sm text-gray-600">For later flights and drivers</span>
                </p>
                <a
                  href="https://chicagoschickenandwafflesnashville.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-11 text-pink-600 hover:text-pink-700 underline"
                >
                  View Menu →
                </a>
              </div>

              <div className="bg-gradient-to-r from-pink-200 to-pink-300 rounded-xl p-6 text-center">
                <p className="text-lg text-pink-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ✈️ Safe travels, sorors! Until next time! 💖💚
                </p>
              </div>
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