import React, { useState, useRef, useEffect } from 'react';
import { faceApi } from '../../api/faceApi';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { MdCameraAlt, MdUpload, MdVideocam, MdStopCircle } from 'react-icons/md';
import { getErrorMessage } from '../../utils/helpers';
import Card from '../Common/Card';
import '../../styles/dashboard.css';

const FaceRegistration = () => {
  const { user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [captureMode, setCaptureMode] = useState('upload');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [stream, setStream] = useState(null);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' 
        }
      });
      
      setStream(mediaStream);
      setIsCameraActive(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(err => {
            console.error('Video play error:', err);
          });
        }
      }, 100);
      
      toast.success('Camera started! Position your face and click Capture');
    } catch (error) {
      console.error('Camera access error:', error);
      toast.error('Failed to access camera. Please allow camera permissions.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    setStream(null);
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) {
      toast.error('Camera not ready');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      toast.error('Please wait for camera to initialize');
      return;
    }

    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error('Failed to capture image');
        return;
      }
      
      const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
      const preview = URL.createObjectURL(blob);
      
      setCapturedImages(prev => [...prev, { file, preview }]);
      toast.success(`Image ${capturedImages.length + 1} captured!`);
    }, 'image/jpeg', 0.95);
  };

  const removeImage = (index) => {
    if (captureMode === 'camera') {
      setCapturedImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
      setPreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    setSelectedFiles(files);
    const filePreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(filePreviews);
  };

  const handleUpload = async () => {
  const imagesToUpload = captureMode === 'camera' 
    ? capturedImages.map(img => img.file)
    : selectedFiles;

  if (imagesToUpload.length === 0) {
    toast.error('Please select or capture at least 1 image');
    return;
  }

  if (!user?.id) {
    toast.error('User ID not found. Please login again.');
    return;
  }

  setUploading(true);
  try {
    const formData = new FormData();
    
    // ✅ Better person_name with multiple fallbacks
    let personName = user.fullName;
    
    if (!personName || personName.trim() === '' || personName === 'undefined undefined') {
      // Try firstName + lastName
      if (user.firstName && user.lastName) {
        personName = `${user.firstName} ${user.lastName}`.trim();
      } 
      // Try just firstName
      else if (user.firstName) {
        personName = user.firstName;
      }
      // Try email username
      else if (user.email) {
        personName = user.email.split('@')[0];
      }
      // Final fallback
      else {
        personName = 'User';
      }
    }
    
    formData.append('user_id', user.id);
    formData.append('person_name', personName);
    formData.append('registration_type', captureMode === 'camera' ? 'camera_capture' : 'file_upload');
    
    imagesToUpload.forEach((file) => {
      formData.append('images', file);
    });

    console.log('Uploading face data:', {
      user_id: user.id,
      person_name: personName,
      image_count: imagesToUpload.length
    });

    await faceApi.registerFace(formData);
    toast.success('Face registered successfully!');
    
    setSelectedFiles([]);
    setPreviews([]);
    setCapturedImages([]);
    stopCamera();
    
  } catch (error) {
    console.error('Face registration error:', error);
    toast.error(getErrorMessage(error));
  } finally {
    setUploading(false);
  }
};


  const switchMode = (mode) => {
    setCaptureMode(mode);
    setSelectedFiles([]);
    setPreviews([]);
    setCapturedImages([]);
    
    if (mode === 'upload') {
      stopCamera();
    }
  };

  const allPreviews = captureMode === 'camera' 
    ? capturedImages.map(img => img.preview)
    : previews;

  const imageCount = captureMode === 'camera' 
    ? capturedImages.length 
    : selectedFiles.length;

  return (
    <Card title="Face Registration" className="face-registration-card">
      <div className="face-registration-content">
        <p className="instruction-text">
          Register your face for automatic recognition at entry/exit gates. 
          Upload or capture clear images of your face.
        </p>

        <div className="capture-mode-toggle">
          <button
            className={`mode-btn ${captureMode === 'upload' ? 'active' : ''}`}
            onClick={() => switchMode('upload')}
          >
            <MdUpload /> Upload Images
          </button>
          <button
            className={`mode-btn ${captureMode === 'camera' ? 'active' : ''}`}
            onClick={() => switchMode('camera')}
          >
            <MdVideocam /> Use Camera
          </button>
        </div>

        {captureMode === 'upload' && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
            />

            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="upload-trigger-btn"
            >
              <MdCameraAlt /> Select Images from Device
            </button>
          </>
        )}

        {captureMode === 'camera' && (
          <div className="camera-section">
            {!isCameraActive ? (
              <button onClick={startCamera} className="camera-start-btn">
                <MdVideocam /> Start Camera
              </button>
            ) : (
              <div className="camera-active-section">
                <div className="camera-container">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline
                    muted
                    className="camera-video"
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
                
                <div className="camera-controls">
                  <button onClick={captureImage} className="capture-btn">
                    <MdCameraAlt /> Capture Photo ({capturedImages.length})
                  </button>
                  <button onClick={stopCamera} className="stop-btn">
                    <MdStopCircle /> Stop Camera
                  </button>
                </div>
                
                
              </div>
            )}
          </div>
        )}

        {allPreviews.length > 0 && (
          <div className="image-previews">
            <h4>Selected Images ({imageCount})</h4>
            <div className="preview-grid">
              {allPreviews.map((preview, index) => (
                <div key={index} className="preview-item">
                  <img src={preview} alt={`Preview ${index + 1}`} className="image-preview" />
                  <button 
                    onClick={() => removeImage(index)} 
                    className="remove-image-btn"
                    title="Remove this image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {imageCount > 0 && (
          <button 
            onClick={handleUpload} 
            className="upload-btn" 
            disabled={uploading}
          >
            <MdUpload /> {uploading ? 'Uploading...' : `Register Face with ${imageCount} Image${imageCount > 1 ? 's' : ''}`}
          </button>
        )}
      </div>
    </Card>
  );
};

export default FaceRegistration;
