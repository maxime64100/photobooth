import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { Camera } from 'lucide-react';

function App() {
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  // Use window.location.href as base to ensure it works both locally and when deployed
  const cameraUrl = new URL('/camera', window.location.href).toString();

  React.useEffect(() => {
    // Listen for photos from the camera page
    const channel = new BroadcastChannel('photos');
    channel.onmessage = (event) => {
      setDisplayImage(event.data.image);
      // Clear the image after 10 seconds
      setTimeout(() => {
        setDisplayImage(null);
      }, 100000);
    };

    return () => channel.close();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Camera className="w-8 h-8 text-indigo-600" />
              Photo Booth
            </h1>
            <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
              <QRCode 
                value={cameraUrl}
                size={100}
                level="H"
                includeMargin={true}
              />
              <p className="text-sm text-gray-600 mt-2 text-center">
                Scan to take a photo
              </p>
            </div>
          </div>

          <div className="relative">
            {displayImage ? (
              <div className="relative">
                <img
                  src={displayImage}
                  alt="Captured"
                  className="w-full rounded-lg shadow-lg"
                />
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  Photo will disappear in 10s
                </div>
              </div>
            ) : (
              <div className="text-center py-32 bg-gray-50 rounded-lg">
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  No Photos Yet
                </h2>
                <p className="text-gray-600">
                  Scan the QR code with your phone to take a photo
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;