// EmotionRecorder.jsx
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

const EmotionRecorder = forwardRef((props, ref) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const intervalRef = useRef(null);
  const recordedVideoUrlRef = useRef(null);
  const [latestEmotion, setLatestEmotion] = useState(null);
  const emotionSnapshots = useRef([]);
  
  const [recorderReady, setRecorderReady] = useState(false);

  useImperativeHandle(ref, () => ({
    start: startInterview,
    stop: () => stopInterview(), // returns a Promise now
    getResult: () => {
      const presentFrames = emotionSnapshots.current.filter(e => e?.candidate_present);
    
      if (presentFrames.length === 0) {
        return {
          emotionData: {
            candidate_present: false,
            emotion_scores: {},
            stress_level: 0.0,
            is_confused: false,
            is_confident: false,
            focus_score: 0.0
          },
          videoUrl: recordedVideoUrlRef.current
        };
      }
    
      const last = presentFrames[presentFrames.length - 1];
    
      return {
        emotionData: last,
        videoUrl: recordedVideoUrlRef.current
      };
    }
    
  }));

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) videoRef.current.srcObject = stream;

        const mimeTypes = [
          'video/webm;codecs=vp9',
          'video/webm;codecs=vp8',
          'video/webm',
          'video/mp4'
        ];

        let recorder;
        for (const type of mimeTypes) {
          if (MediaRecorder.isTypeSupported(type)) {
            recorder = new MediaRecorder(stream, { mimeType: type });
            break;
          }
        }

        if (!recorder) {
          console.error('No supported MediaRecorder types found.');
          return;
        }

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) recordedChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current = recorder;
        setRecorderReady(true);
      } catch (err) {
        console.error('Camera/mic access error:', err);
      }
    };

    initCamera();
    return () => clearInterval(intervalRef.current);
  }, []);

  const captureAndSendFrame = async () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg'));
    if (!blob) return;

    const formData = new FormData();
    formData.append('video', blob, 'frame.jpg');

    try {
      const res = await fetch('http://127.0.0.1:8000/analyze-emotion/', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      emotionSnapshots.current.push(data); // ⬅️ Save each frame's emotion result
      setLatestEmotion(data); // Keep track of the most recent one
      console.log("📸 Emotion response:", data);
    } catch (err) {
      console.error('Backend error:', err);
    }
  };

  const startInterview = () => {
    if (!recorderReady || !mediaRecorderRef.current) {
      alert('MediaRecorder not ready.');
      return;
    }

    recordedChunksRef.current = [];
    emotionSnapshots.current = []; 
    mediaRecorderRef.current.start();
    intervalRef.current = setInterval(() => captureAndSendFrame(), 1000);
  };

  const stopInterview = () => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.onstop = async () => {
          const blob = new Blob(recordedChunksRef.current, {
            type: mediaRecorderRef.current.mimeType,
          });
          const videoUrl = URL.createObjectURL(blob);
          recordedVideoUrlRef.current = videoUrl;
  
          // 🔁 Give webcam a moment to stabilize, then send final frame
          await new Promise(r => setTimeout(r, 500)); // 0.5s delay
          await captureAndSendFrame();
  
          resolve();
        };
  
        clearInterval(intervalRef.current);
        mediaRecorderRef.current.stop();
      } else {
        resolve();
      }
    });
  };
  
  
  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      style={{
        position: 'fixed',
        bottom: 100,
        right: 30,
        width: '250px',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '12px',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        backgroundColor: '#000'
      }}
    />
  );
});

export default EmotionRecorder;
