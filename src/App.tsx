import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { Camera } from 'lucide-react';
import { ref, onValue, set } from 'firebase/database';
import { database } from './firebase';
const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);


function App() {
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  // Use window.location.href as base to ensure it works both locally and when deployed
  const cameraUrl = new URL('/camera', window.location.href).toString();

  React.useEffect(() => {
    const photoRef = ref(database, 'latest-photo');
  
    const unsubscribe = onValue(photoRef, (snapshot) => {
      const image = snapshot.val();
      if (image) {
        setDisplayImage(image);
    
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
    
        // Set new 1-minute timeout
        timeoutRef.current = setTimeout(() => {
          setDisplayImage(null);
          set(photoRef, null);
        }, 60000);
      }
    });
    
  
    return () => unsubscribe();
  }, []);
  

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-900 rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Camera className="w-8 h-8 text-indigo-400" />
              Photo Booth
            </h1>
            <div className="fixed bottom-4 right-4 bg-zinc-800 p-4 rounded-lg shadow-lg">
              <QRCode 
                value={cameraUrl}
                size={100}
                level="H"
                includeMargin={true}
              />
              <p className="text-sm text-gray-400 mt-2 text-center">
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
                  className="max-w-full max-h-[80vh] mx-auto rounded-lg shadow-lg object-contain"
                />
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  Photo will disappear in 1 minute
                </div>

              </div>
            ) : (
              <div className="text-center py-32 bg-zinc-800 rounded-lg">
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h2 className="text-2xl font-semibold text-white mb-2">
                  No Photos Yet
                </h2>
                <p className="text-gray-400">
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