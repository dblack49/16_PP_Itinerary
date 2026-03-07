import { Home, MapPin, Calendar, Key, Users } from 'lucide-react';

export function AirbnbSection() {
  return (
    <div className="bg-gradient-to-br from-green-100 via-white to-pink-100 rounded-3xl p-8 shadow-xl border-4 border-green-400 mb-12">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Home className="w-8 h-8 text-green-700" />
        <h3 className="text-3xl text-center text-green-800" style={{ fontFamily: "'Rye', serif" }}>
          Our Nashville Home Base
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Location Info */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-6 h-6 text-pink-600" />
            <h4 className="text-xl text-pink-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              Location
            </h4>
          </div>
          <p className="text-gray-700 mb-2">
            <strong>Downtown Nashville</strong>
          </p>
          <p className="text-gray-600 text-sm">
            Walking distance to Broadway and all the honky tonks! Perfect for our cowgirl adventures. 🤠
          </p>
        </div>

        {/* Check-in Info */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-green-600" />
            <h4 className="text-xl text-green-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              Check-in Details
            </h4>
          </div>
          <div className="space-y-2 text-gray-700">
            <p><strong>Check-in:</strong> Friday, April 17 - 3:00 PM</p>
            <p><strong>Check-out:</strong> Sunday, April 19 - 10:00 AM</p>
          </div>
        </div>

        {/* Access Info */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-6 h-6 text-pink-600" />
            <h4 className="text-xl text-pink-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              Access
            </h4>
          </div>
          <p className="text-gray-700">
            <strong>Entry:</strong> Self check-in with keypad
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Code will be shared closer to arrival date
          </p>
        </div>

        {/* Accommodations */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-green-600" />
            <h4 className="text-xl text-green-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              Accommodations
            </h4>
          </div>
          <p className="text-gray-700">
            Sleeps all 16 Prestigious Pearls comfortably!
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Multiple bedrooms and common areas for sisterhood bonding
          </p>
        </div>
      </div>

      {/* Airbnb Link */}
      <div className="mt-6 text-center">
        <a 
          href="https://www.airbnb.com/rooms/1363225994236395590?unique_share_id=b35e7423-26bc-4bd1-aacc-a5636f4af2e8&viralityEntryPoint=1&s=76&source_impression_id=p3_1772400242_P3CNfdr_qrTN-L8C" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all text-lg"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          View Airbnb Listing →
        </a>
      </div>
    </div>
  );
}