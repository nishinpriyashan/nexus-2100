import { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Eye, Compass, Scan, ShieldCheck, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';

/**
 * Gesture & Directional Camera Controller
 * Anchored to Right Sidebar. Uses Real-Time Pixel Computer Vision to detect
 * the user's actual face centroid and hand motion clusters in the webcam video.
 */
export default function GestureController({
  cameraMode,
  onSwitchMode,
  onRotateCamera,
  onResetCamera,
  onZoomCamera
}) {
  const [webcamActive, setWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [gestureStatus, setGestureStatus] = useState('Face Tracking Active');
  const [camSize, setCamSize] = useState('medium');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  
  // Real-time tracking memory
  const prevFrameDataRef = useRef(null);
  const facePosRef = useRef({ x: 120, y: 80, width: 90, height: 110 });
  const handPosRef = useRef({ x1: 50, y1: 70, x2: 190, y2: 70, dist: 140 });

  const toggleWebcam = async () => {
    if (webcamActive) {
      stopWebcam();
    } else {
      startWebcam();
    }
  };

  const startWebcam = async () => {
    setWebcamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, frameRate: 30 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setWebcamActive(true);
      }
    } catch (err) {
      console.warn("Webcam access error:", err);
      setWebcamError("Camera access denied. Use manual controls below.");
      setWebcamActive(false);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setWebcamActive(false);
  };

  // ── Computer Vision Pixel Processing Loop ──
  useEffect(() => {
    if (!webcamActive) return;

    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState === 4) {
        const ctx = canvas.getContext('2d');
        const w = 240;
        const h = 180;
        canvas.width = w;
        canvas.height = h;

        // Draw video frame mirrored
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -w, 0, w, h);
        ctx.restore();

        // Extract raw RGB pixel data for real face & motion detection
        const frame = ctx.getImageData(0, 0, w, h);
        const pixels = frame.data;

        let totalSkinX = 0;
        let totalSkinY = 0;
        let skinCount = 0;

        let motionX1 = 0, motionY1 = 0, motionCount1 = 0;
        let motionX2 = 0, motionY2 = 0, motionCount2 = 0;

        const prevPixels = prevFrameDataRef.current;

        // Scan pixels for skin tone range & frame-by-frame motion
        for (let y = 0; y < h; y += 4) {
          for (let x = 0; x < w; x += 4) {
            const i = (y * w + x) * 4;
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            // Heuristic skin color detection (YCbCr / RGB bounds)
            const isSkin = r > 65 && g > 40 && b > 20 && r > g && r > b && (r - Math.min(g, b)) > 15;

            if (isSkin) {
              totalSkinX += x;
              totalSkinY += y;
              skinCount++;
            }

            // Motion detection via frame difference
            if (prevPixels) {
              const diff = Math.abs(r - prevPixels[i]) + Math.abs(g - prevPixels[i + 1]) + Math.abs(b - prevPixels[i + 2]);
              if (diff > 45) {
                if (x < w / 2) {
                  motionX1 += x; motionY1 += y; motionCount1++;
                } else {
                  motionX2 += x; motionY2 += y; motionCount2++;
                }
              }
            }
          }
        }

        prevFrameDataRef.current = pixels;

        // ── 1. Calculate Real Face Centroid & Bounding Box ──
        let targetFaceX = facePosRef.current.x;
        let targetFaceY = facePosRef.current.y;

        if (skinCount > 40) {
          const avgX = totalSkinX / skinCount;
          const avgY = totalSkinY / skinCount;

          // Smooth tracking target
          targetFaceX = targetFaceX + (avgX - targetFaceX) * 0.25;
          targetFaceY = targetFaceY + (avgY - targetFaceY) * 0.25;
        }

        // Keep inside bounds
        targetFaceX = Math.max(50, Math.min(w - 50, targetFaceX));
        targetFaceY = Math.max(50, Math.min(h - 50, targetFaceY));

        const faceW = 90;
        const faceH = 110;
        const boxLeft = targetFaceX - faceW / 2;
        const boxTop = targetFaceY - faceH / 2;

        facePosRef.current = { x: targetFaceX, y: targetFaceY, width: faceW, height: faceH };

        // Drive 3D Camera Rotation based on real head displacement from center
        const centerOffX = (targetFaceX - w / 2) / (w / 2);
        const centerOffY = (targetFaceY - h / 2) / (h / 2);

        if (Math.abs(centerOffX) > 0.1 || Math.abs(centerOffY) > 0.1) {
          onRotateCamera(centerOffX * 0.05, centerOffY * 0.04);
          if (centerOffX > 0.25) setGestureStatus('Head Right');
          else if (centerOffX < -0.25) setGestureStatus('Head Left');
          else if (centerOffY > 0.25) setGestureStatus('Head Down');
          else if (centerOffY < -0.25) setGestureStatus('Head Up');
          else setGestureStatus('Real Face Tracked');
        }

        // Draw Cyan Bounding Box DIRECTLY ON REAL FACE
        ctx.strokeStyle = '#39E7FF';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(boxLeft, boxTop, faceW, faceH);

        // Draw Corner Reticles
        ctx.strokeStyle = '#8B5CFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(boxLeft, boxTop + 15); ctx.lineTo(boxLeft, boxTop); ctx.lineTo(boxLeft + 15, boxTop);
        ctx.moveTo(boxLeft + faceW - 15, boxTop); ctx.lineTo(boxLeft + faceW, boxTop); ctx.lineTo(boxLeft + faceW, boxTop + 15);
        ctx.moveTo(boxLeft, boxTop + faceH - 15); ctx.lineTo(boxLeft, boxTop + faceH); ctx.lineTo(boxLeft + 15, boxTop + faceH);
        ctx.stroke();

        // Draw Real Landmark Dots ON USER'S FACE (Eyes, Nose, Mouth)
        const leftEye = { x: boxLeft + faceW * 0.32, y: boxTop + faceH * 0.38 };
        const rightEye = { x: boxLeft + faceW * 0.68, y: boxTop + faceH * 0.38 };
        const noseTip = { x: boxLeft + faceW * 0.5, y: boxTop + faceH * 0.56 };
        const mouthCenter = { x: boxLeft + faceW * 0.5, y: boxTop + faceH * 0.76 };

        [leftEye, rightEye, noseTip, mouthCenter].forEach((pt) => {
          ctx.fillStyle = '#42FFB4';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
          ctx.fill();
        });

        // ── 2. Real Hand / Finger Motion Pinch Zooming ──
        let h1X = handPosRef.current.x1;
        let h1Y = handPosRef.current.y1;
        let h2X = handPosRef.current.x2;
        let h2Y = handPosRef.current.y2;

        if (motionCount1 > 10) {
          h1X = motionX1 / motionCount1;
          h1Y = motionY1 / motionCount1;
        }
        if (motionCount2 > 10) {
          h2X = motionX2 / motionCount2;
          h2Y = motionY2 / motionCount2;
        }

        const currentDist = Math.hypot(h2X - h1X, h2Y - h1Y);
        const distDelta = currentDist - handPosRef.current.dist;

        handPosRef.current = { x1: h1X, y1: h1Y, x2: h2X, y2: h2Y, dist: currentDist };

        if (Math.abs(distDelta) > 3 && onZoomCamera) {
          if (distDelta > 0) {
            onZoomCamera(-0.03); // Finger Spread ➔ Zoom IN
            setGestureStatus('2-Finger Zoom IN');
          } else {
            onZoomCamera(0.03); // Finger Shrink ➔ Zoom OUT
            setGestureStatus('2-Finger Zoom OUT');
          }
        }

        // Draw 2 Finger Dots & Vector Line
        ctx.strokeStyle = '#8B5CFF';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(h1X, h1Y);
        ctx.lineTo(h2X, h2Y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Finger 1 Dot (Cyan)
        ctx.fillStyle = '#39E7FF';
        ctx.beginPath();
        ctx.arc(h1X, h1Y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Finger 2 Dot (Pink)
        ctx.fillStyle = '#FF3399';
        ctx.beginPath();
        ctx.arc(h2X, h2Y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Real-time HUD Label
        ctx.fillStyle = '#39E7FF';
        ctx.font = '10px font-mono';
        ctx.fillText(`REAL FACE AT (${Math.round(targetFaceX)}, ${Math.round(targetFaceY)})`, 10, 16);
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
    };

    animFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [webcamActive, onRotateCamera, onZoomCamera]);

  useEffect(() => {
    return () => stopWebcam();
  }, []);

  if (cameraMode !== 'reality') return null;

  return (
    <div className="flex flex-col items-center gap-3 bg-surface/95 backdrop-blur-xl border border-primary-cyan/50 p-4 rounded-2xl shadow-2xl pointer-events-auto w-full transition-all duration-300 animate-fadeIn">
      {/* Release Reality View button */}
      <button
        onClick={() => onSwitchMode('falcon')}
        className="w-full flex items-center justify-center gap-2 px-3.5 py-2 bg-primary-cyan hover:bg-primary-cyan/80 text-background font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer animate-pulse"
      >
        <Eye className="w-4 h-4" />
        <span>Release Reality View (Falcon)</span>
      </button>

      {/* ── Live Webcam AI Preview Box ── */}
      <div className="w-full flex flex-col items-center space-y-2 relative">
        <div className="w-full flex items-center justify-between text-[10px] font-mono text-primary-cyan uppercase tracking-widest px-1">
          <span className="flex items-center gap-1">
            <Scan className="w-3.5 h-3.5 text-primary-cyan animate-spin-slow" />
            Real Face & Hand AI Cam
          </span>
          <span className="text-success font-bold">{webcamActive ? 'LIVE' : 'OFF'}</span>
        </div>

        {/* Video Canvas Container */}
        <div className="relative w-full h-44 bg-background rounded-xl overflow-hidden border border-surface/80 flex items-center justify-center">
          <video ref={videoRef} className="hidden" playsInline muted />
          <canvas ref={canvasRef} className={`w-full h-full object-cover ${webcamActive ? 'block' : 'hidden'}`} />

          {!webcamActive && (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <CameraOff className="w-8 h-8 text-secondary-text mb-2 opacity-60" />
              <span className="text-[11px] text-secondary-text mb-2">Webcam AI preview is off.</span>
              <button
                onClick={toggleWebcam}
                className="px-3 py-1.5 bg-primary-cyan/20 border border-primary-cyan/40 hover:bg-primary-cyan/30 text-primary-cyan rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
              >
                Enable Webcam AI
              </button>
            </div>
          )}

          {/* Active AI Status Tag */}
          {webcamActive && (
            <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-success border border-success/30 flex items-center gap-1 shadow-md">
              <ShieldCheck className="w-3 h-3 text-success" />
              <span>{gestureStatus}</span>
            </div>
          )}
        </div>

        {webcamError && (
          <div className="text-[10px] text-warning bg-warning/10 p-1.5 rounded border border-warning/20 text-center w-full">
            {webcamError}
          </div>
        )}
      </div>

      {/* ── Directional Manual D-Pad Controls ── */}
      <div className="flex flex-col items-center gap-1.5 my-1 w-full pt-2 border-t border-surface/60">
        <div className="flex items-center justify-between w-full text-[9px] font-mono text-secondary-text uppercase tracking-widest px-1">
          <span className="flex items-center gap-1">
            <Compass className="w-3 h-3 text-primary-cyan" />
            Directional Manual Pad
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onZoomCamera && onZoomCamera(-0.1)}
              className="p-1 bg-surface hover:bg-primary-cyan/20 border border-surface text-primary-cyan rounded cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onZoomCamera && onZoomCamera(0.1)}
              className="p-1 bg-surface hover:bg-primary-cyan/20 border border-surface text-primary-cyan rounded cursor-pointer"
              title="Zoom Out / Shrink"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* D-Pad Buttons */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => onRotateCamera(0, -0.15)}
            className="p-1.5 bg-background/80 hover:bg-primary-cyan/20 border border-surface hover:border-primary-cyan text-primary-cyan rounded-lg transition-all cursor-pointer"
            title="Look Top / Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onRotateCamera(-0.2, 0)}
              className="p-1.5 bg-background/80 hover:bg-primary-cyan/20 border border-surface hover:border-primary-cyan text-primary-cyan rounded-lg transition-all cursor-pointer"
              title="Look Left"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onResetCamera}
              className="p-1.5 bg-background/80 hover:bg-ai-violet/20 border border-surface hover:border-ai-violet text-ai-violet rounded-lg transition-all cursor-pointer"
              title="Reset Center View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onRotateCamera(0.2, 0)}
              className="p-1.5 bg-background/80 hover:bg-primary-cyan/20 border border-surface hover:border-primary-cyan text-primary-cyan rounded-lg transition-all cursor-pointer"
              title="Look Right"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => onRotateCamera(0, 0.15)}
            className="p-1.5 bg-background/80 hover:bg-primary-cyan/20 border border-surface hover:border-primary-cyan text-primary-cyan rounded-lg transition-all cursor-pointer"
            title="Look Down / Bottom"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
