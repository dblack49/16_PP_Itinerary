import { Link } from 'react-router';
import { ArrowLeft, Camera, Upload, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const PEARLS = [
  "Pearl 1", "Pearl 2", "Pearl 3", "Pearl 4",
  "Pearl 5", "Pearl 6", "Pearl 7", "Pearl 8",
  "Pearl 9", "Pearl 10", "Pearl 11", "Pearl 12",
  "Pearl 13", "Pearl 14", "Pearl 15", "Pearl 16"
];

const DAYS = ["Day 1 - Friday", "Day 2 - Saturday", "Day 3 - Sunday"];

interface Photo {
  pearlName: string;
  photoUrl: string;
  caption: string;
  day: string;
  timestamp: number;
}

export function PhotoAlbumPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPearl, setSelectedPearl] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterDay, setFilterDay] = useState<string>('all');

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce101b60/photos`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      const data = await response.json();
      
      if (data.success && data.photos) {
        setPhotos(data.photos.sort((a: Photo, b: Photo) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPhoto = async () => {
    if (!selectedPearl || !photoFile) {
      alert('Please select your name and choose a photo to upload');
      return;
    }

    setLoading(true);
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', photoFile);
      formData.append('pearlName', selectedPearl);
      formData.append('caption', caption);
      formData.append('day', selectedDay);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce101b60/photos/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: formData
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setPhotoFile(null);
        setPhotoPreview('');
        setCaption('');
        setSelectedDay('');
        // Reset file input
        const fileInput = document.getElementById('photo-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        fetchPhotos();
        alert('Photo uploaded successfully! ✨');
      } else {
        alert(`Failed to upload photo: ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce101b60/photos/${photoId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      const data = await response.json();
      
      if (data.success) {
        fetchPhotos();
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo. Please try again.');
    }
  };

  const filteredPhotos = filterDay === 'all' 
    ? photos 
    : photos.filter(photo => photo.day === filterDay);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-green-500 py-8 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="glitter-effect"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-white hover:text-pink-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Camera className="w-12 h-12 text-white" />
            <div>
              <h1 className="text-4xl md:text-5xl text-white" style={{ fontFamily: "'Rye', serif" }}>
                Nashville Memories 📸
              </h1>
              <p className="text-white/90 text-lg mt-2">
                {photos.length} photos shared by the Pearls
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Add Photo Form */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border-4 border-pink-300 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-8 h-8 text-pink-600" />
            <h2 className="text-3xl text-pink-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              Share a Memory
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Your Name</label>
              <select
                value={selectedPearl}
                onChange={(e) => setSelectedPearl(e.target.value)}
                className="w-full px-4 py-3 border-2 border-pink-300 rounded-xl focus:outline-none focus:border-green-500"
              >
                <option value="">Select your name...</option>
                {PEARLS.map(pearl => (
                  <option key={pearl} value={pearl}>{pearl}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Upload Photo</label>
              <input
                type="file"
                id="photo-file-input"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-4 py-3 border-2 border-pink-300 rounded-xl focus:outline-none focus:border-green-500"
              />
              {photoPreview && (
                <div className="mt-2">
                  <img 
                    src={photoPreview} 
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-xl"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Day (Optional)</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full px-4 py-3 border-2 border-pink-300 rounded-xl focus:outline-none focus:border-green-500"
              >
                <option value="">Select day...</option>
                {DAYS.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Caption (Optional)</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-pink-300 rounded-xl focus:outline-none focus:border-green-500"
              />
            </div>

            <button
              onClick={addPhoto}
              disabled={loading || !selectedPearl || !photoFile}
              className="w-full bg-gradient-to-r from-pink-500 to-green-500 hover:from-pink-600 hover:to-green-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : '✨ Add Photo'}
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => setFilterDay('all')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filterDay === 'all'
                ? 'bg-gradient-to-r from-pink-500 to-green-500 text-white'
                : 'bg-white text-gray-700 border-2 border-gray-300'
            }`}
          >
            All Days
          </button>
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setFilterDay(day)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filterDay === day
                  ? 'bg-gradient-to-r from-pink-500 to-green-500 text-white'
                  : 'bg-white text-gray-700 border-2 border-gray-300'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No photos yet. Be the first to share a memory! 📸</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, index) => (
              <div 
                key={`${photo.timestamp}-${index}`}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="aspect-square bg-gray-100 relative">
                  <img 
                    src={photo.photoUrl} 
                    alt={photo.caption || 'Nashville memory'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400';
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-pink-600">{photo.pearlName}</span>
                    {photo.day && (
                      <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        {photo.day}
                      </span>
                    )}
                  </div>
                  {photo.caption && (
                    <p className="text-gray-700 mb-3">{photo.caption}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(photo.timestamp).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => deletePhoto(`photo:${photo.timestamp}-${photo.pearlName}`)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}