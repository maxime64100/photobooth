import React, { useRef, useState } from 'react';
import { Camera, X, RotateCcw } from 'lucide-react';

function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      // First try to get any available camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setError(null);
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setError('Camera permission was denied. Please allow camera access and refresh the page.');
        } else {
          setError('Unable to access camera. Please check your device settings.');
        }
      }
    }
  };

  React.useEffect(() => {
    startCamera();
  }, []);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      setShowCamera(false);
      
      // Stop the camera stream
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    }
  };

  const retakePhoto = async () => {
    setCapturedImage(null);
    setShowCamera(true);
    await startCamera();
  };

  const savePhoto = () => {
    if (capturedImage) {
      // Send the image to the main page via BroadcastChannel
      const channel = new BroadcastChannel('photos');
      channel.postMessage({ image: capturedImage });
      
      // Close the window after a brief delay
      setTimeout(() => {
        window.close();
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="relative h-screen">
        <a 
          href="/"
          className="absolute top-4 right-4 z-10 bg-white/20 p-2 rounded-full backdrop-blur-sm"
        >
          <X className="w-6 h-6 text-white" />
        </a>
        
        {error ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-white text-center p-6 bg-red-500/20 rounded-lg backdrop-blur-sm max-w-md mx-4">
              <Camera className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl font-medium mb-2">Camera Access Error</p>
              <p className="text-sm mb-4">{error}</p>
              <button
                onClick={() => startCamera()}
                className="bg-white text-black px-6 py-2 rounded-full text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : showCamera ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />
            <button
              onClick={capturePhoto}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Camera className="w-6 h-6" />
              Take Photo
            </button>
          </>
        ) : capturedImage ? (
          <div className="h-full flex flex-col items-center justify-center relative">
            <img 
              src={capturedImage} 
              alt="Preview" 
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={retakePhoto}
                className="bg-white/20 text-white px-6 py-3 rounded-full backdrop-blur-sm flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Retake
              </button>
              <button
                onClick={savePhoto}
                className="bg-white text-black px-8 py-3 rounded-full flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Save Photo
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-white text-center">
              <Camera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
              <p className="text-xl">Photo captured!</p>
              <p className="text-sm text-gray-400">Returning to main screen...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CameraPage;