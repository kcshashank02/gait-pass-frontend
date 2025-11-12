import React, { useState, useRef } from 'react';
import { faceApi } from '../../api/faceApi';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { MdCameraAlt, MdCheckCircle, MdCancel, MdUpload, MdWarning } from 'react-icons/md';
import { getErrorMessage } from '../../utils/helpers';
import Card from '../Common/Card';
import '../../styles/dashboard.css';

const FaceVerification = () => {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      
      setStream(mediaStream);
      setCameraActive(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      }, 100);
      
      toast.success('Camera started!');
    } catch (error) {
      console.error('Camera error:', error);
      toast.error('Failed to access camera');
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
    setCameraActive(false);
  };

  const captureFromCamera = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], `test_${Date.now()}.jpg`, { type: 'image/jpeg' });
      const previewUrl = URL.createObjectURL(blob);
      
      setSelectedImage(file);
      setPreview(previewUrl);
      setResult(null);
      stopCamera();
      
      toast.info('Image captured! Click "Test Recognition"');
    }, 'image/jpeg', 0.95);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image too large. Max 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image');
        return;
      }

      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleTestRecognition = async () => {
    if (!selectedImage) {
      toast.error('Please select or capture an image first');
      return;
    }

    setTesting(true);
    setResult(null);

    try {
      console.log('Testing face recognition with image:', selectedImage.name);
      
      const response = await faceApi.testFaceRecognition(selectedImage);
      console.log('Face recognition response:', response);
      
      setResult(response);
      
      if (response.recognized) {
        toast.success('✅ Your face was recognized successfully!');
      } else {
        toast.warning('❌ Face not recognized');
      }
    } catch (error) {
      console.error('Face recognition error:', error);
      
      let errorMessage = 'Recognition failed';
      
      if (error.response?.status === 500) {
        if (error.response?.data?.detail?.includes('ML service')) {
          errorMessage = 'ML Service is not responding. Please wake up the service first.';
        } else {
          errorMessage = 'Server error. Please try again.';
        }
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      toast.error(errorMessage);
      
      setResult({ 
        recognized: false, 
        error: true,
        message: errorMessage
      });
    } finally {
      setTesting(false);
    }
  };

  const clearTest = () => {
    setSelectedImage(null);
    setPreview(null);
    setResult(null);
  };

  // ✅ Get display name with fallbacks
  const getDisplayName = () => {
    // Try multiple possible field names from backend response
    if (result.username) return result.username;
    if (result.person_name) return result.person_name;
    if (result.user_name) return result.user_name;
    if (result.name) return result.name;
    
    // Fallback to current logged-in user
    if (user?.fullName) return user.fullName;
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`.trim();
    }
    if (user?.firstName) return user.firstName;
    if (user?.email) return user.email.split('@')[0];
    
    return 'User';
  };

  return (
    <Card title="Test Face Recognition" className="face-verification-card">
      <div className="face-verification-content">
        <div className="info-banner">
          <MdWarning />
          <div>
            <strong>Test Your Face Registration</strong>
            <p style={{ margin: '4px 0 0 0' }}>
              Upload or capture a photo to verify your face is registered correctly.
            </p>
          </div>
        </div>

        {!cameraActive && !preview && (
          <div className="verification-options">
            <button onClick={startCamera} className="option-btn">
              <MdCameraAlt /> Use Camera
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="option-btn">
              <MdUpload /> Upload Photo
            </button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/jpeg,image/jpg,image/png"
          style={{ display: 'none' }}
        />

        {cameraActive && (
          <div className="camera-section">
            <div className="camera-container">
              <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
            <div className="camera-controls">
              <button onClick={captureFromCamera} className="capture-btn">
                <MdCameraAlt /> Capture Photo
              </button>
              <button onClick={stopCamera} className="stop-btn">
                Stop Camera
              </button>
            </div>
          </div>
        )}

        {preview && (
          <div className="preview-section">
            <h4>Selected Image:</h4>
            <img src={preview} alt="Test" className="test-image-preview" />
            
            <div className="test-actions">
              <button 
                onClick={handleTestRecognition} 
                className="test-btn"
                disabled={testing}
              >
                {testing ? 'Testing Recognition...' : 'Test Recognition'}
              </button>
              <button onClick={clearTest} className="clear-btn">
                Clear
              </button>
            </div>
          </div>
        )}

        {result && (
          <div className={`result-box ${result.error ? 'error' : result.recognized ? 'success' : 'failure'}`}>
            <div className="result-icon">
              {result.error ? (
                <MdWarning size={64} />
              ) : result.recognized ? (
                <MdCheckCircle size={64} />
              ) : (
                <MdCancel size={64} />
              )}
            </div>
            
            {result.recognized ? (
              <>
                <h3>✅ Face Recognized!</h3>
                <div className="result-details">
                  <p className="recognized-user">{getDisplayName()}</p>
                  <p className="recognition-message">Your face is registered and ready to use at station gates.</p>
                </div>
              </>
            ) : (
              <>
                <h3>❌ Face Not Recognized</h3>
                <div className="result-details">
                  <p>{result.message || 'Please register your face first using the Face Registration section above.'}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default FaceVerification;
