import { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Eye, Compass, Scan, ShieldCheck, Maximize2, ZoomIn, ZoomOut, Car, Gauge, Hand } from 'lucide-react';
import { useJourneyStore } from '../../store/journeyStore';

/**
 * Gesture & Directional Camera / Vehicle Controller
 * Anchored to Right Sidebar. Uses Real-Time Pixel Computer Vision to detect:
 * 1. Open 2 hands / fingers spread = Move Vehicle FORWARD (Accelerate)
 * 2. Closed fingers / fist = STOP / Brake
 * 3. Hand tilt / turn = Rotate & Steer Vehicle Left / Right
 */
export default function GestureController({
  cameraMode,
  onSwitchMode,
  onRotateCamera,
  onResetCamera,
  onZoomCamera
}) {
  const { isDriveMode, setDriveState, driveSpeed, steeringAngle } = useJourneyStore();

  const [webcamActive, setWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [gestureStatus, setGestureStatus] = useState('Face & Hand Tracking Ready');
  const [camSize, setCamSize] = useState('medium');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  
  // Real-time tracking memory
  const prevFrameDataRef = useRef(null);
  const facePosRef = useRef({ x: 120, y: 80, width: 90, height: 110 });
  const handPosRef = useRef({ x1: 50, y1: 70, x2: 190, y2: 70, dist: 140 });

  // Keyboard driving controls listener
  useEffect(() => {
    if (!isDriveMode) return;

    const handleDriveKeys = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setDriveState({ driveSpeed: 120, gestureStateText: "OPEN HAND: FORWARD ACCELERATION" });
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setDriveState({ driveSpeed: 0, gestureStateText: "CLOSED FIST: VEHICLE STOPPED" });
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setDriveState({ steeringAngle: -35, gestureStateText: "STEERING LEFT" });
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setDriveState({ steeringAngle: 35, gestureStateText: "STEERING RIGHT" });
      }
    };

    const handleDriveKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'A' || e.key === 'd' || e.key === 'D') {
        setDriveState({ steeringAngle: 0 });
      }
    };

    window.addEventListener('keydown', handleDriveKeys);
    window.addEventListener('keyup', handleDriveKeyUp);
    return () => {
      window.removeEventListener('keydown', handleDriveKeys);
      window.removeEventListener('keyup', handleDriveKeyUp);
    };
  }, [isDriveMode, setDriveState]);

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

        // Extract raw RGB pixel data
        const frame = ctx.getImageData(0, 0, w, h);
        const pixels = frame.data;

        let totalSkinX = 0;
        let totalSkinY = 0;
        let skinCount = 0;

        let motionX1 = 0, motionY1 = 0, motionCount1 = 0;
        let motionX2 = 0, motionY2 = 0, motionCount2 = 0;

        const prevPixels = prevFrameDataRef.current;

        for (let y = 0; y < h; y += 4) {
          for (let x = 0; x < w; x += 4) {
            const i = (y * w + x) * 4;
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            const isSkin = r > 65 && g > 40 && b > 20 && r > g && r > b && (r - Math.min(g, b)) > 15;

            if (isSkin) {
              totalSkinX += x;
              totalSkinY += y;
              skinCount++;
            }

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

        // ── 1. Calculate Real Face / Hand Centroid ──
        let targetFaceX = facePosRef.current.x;
        let targetFaceY = facePosRef.current.y;

        if (skinCount > 40) {
          const avgX = totalSkinX / skinCount;
          const avgY = totalSkinY / skinCount;

          targetFaceX = targetFaceX + (avgX - targetFaceX) * 0.25;
          targetFaceY = targetFaceY + (avgY - targetFaceY) * 0.25;
        }

        targetFaceX = Math.max(50, Math.min(w - 50, targetFaceX));
        targetFaceY = Math.max(50, Math.min(h - 50, targetFaceY));

        const faceW = 90;
        const faceH = 110;
        const boxLeft = targetFaceX - faceW / 2;
        const boxTop = targetFaceY - faceH / 2;

        facePosRef.current = { x: targetFaceX, y: targetFaceY, width: faceW, height: faceH };

        // ── 2. Hand Gesture Drive Controls (Open Hands vs Closed Fist vs Turn) ──
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
        handPosRef.current = { x1: h1X, y1: h1Y, x2: h2X, y2: h2Y, dist: currentDist };

        // In Drive Mode, map hand spread and tilt directly to vehicle movement
        if (isDriveMode) {
          // Open 2 Hands (Spread > 90px) ➔ Accelerate Forward
          if (currentDist > 90 || skinCount > 180) {
            setDriveState({ driveSpeed: 120, gestureStateText: "OPEN HANDS: FORWARD ACCELERATION" });
            setGestureStatus("OPEN HAND: FORWARD");
          } else if (currentDist < 50 || skinCount < 60) {
            // Closed Fist / Closed Fingers ➔ Brake / Stop
            setDriveState({ driveSpeed: 0, gestureStateText: "CLOSED FIST: VEHICLE STOPPED" });
            setGestureStatus("CLOSED FIST: STOPPED");
          }

          // Hand Steering Tilt
          const handCenterX = (h1X + h2X) / 2;
          const tiltOffset = (handCenterX - w / 2) / (w / 2);
          if (Math.abs(tiltOffset) > 0.2) {
            const steer = Math.round(tiltOffset * 40);
            setDriveState({ steeringAngle: steer });
          }
        } else {
          // Standard Camera Control
          const centerOffX = (targetFaceX - w / 2) / (w / 2);
          const centerOffY = (targetFaceY - h / 2) / (h / 2);

          if (Math.abs(centerOffX) > 0.1 || Math.abs(centerOffY) > 0.1) {
            onRotateCamera(centerOffX * 0.05, centerOffY * 0.04);
          }
        }

        // Draw Bounding Box & HUD
        ctx.strokeStyle = isDriveMode ? '#42FFB4' : '#39E7FF';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(boxLeft, boxTop, faceW, faceH);

        // Draw 2 Hand Control Dots
        ctx.fillStyle = isDriveMode ? '#42FFB4' : '#39E7FF';
        ctx.beginPath();
        ctx.arc(h1X, h1Y, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FF3399';
        ctx.beginPath();
        ctx.arc(h2X, h2Y, 7, 0, Math.PI * 2);
        ctx.fill();

        // Connect Hand Line
        ctx.strokeStyle = '#8B5CFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(h1X, h1Y);
        ctx.lineTo(h2X, h2Y);
        ctx.stroke();

        ctx.fillStyle = '#39E7FF';
        ctx.font = '10px monospace';
        ctx.fillText(isDriveMode ? 'GESTURE VEHICLE DRIVE ACTIVE' : 'FACE & HAND TRACKING ACTIVE', 10, 16);
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
    };

    animFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [webcamActive, isDriveMode, setDriveState, onRotateCamera, onZoomCamera]);

  useEffect(() => {
    return () => stopWebcam();
  }, []);


  if (cameraMode !== 'reality' && !isDriveMode) return null;

  return (
    <div className="flex flex-col items-center gap-3 glass-card-dark p-4 rounded-2xl shadow-2xl pointer-events-auto w-full transition-all duration-300 animate-fadeIn">
      {/* ── Mode Header ── */}
      {isDriveMode ? (
        <div className="w-full flex items-center justify-between p-2.5 bg-emerald-500/10 border border-emerald-500/40 rounded-xl">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Car className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>Vehicle Drive Mode</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-400/30">
            {driveSpeed > 0 ? `${driveSpeed} km/h` : 'STOPPED'}
          </span>
        </div>
      ) : (
        <button
          onClick={() => onSwitchMode('falcon')}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer animate-pulse"
        >
          <Eye className="w-4 h-4" />
          <span>Release Reality View (Falcon)</span>
        </button>
      )}

      {/* ── Live Webcam AI Preview Box ── */}
      <div className="w-full flex flex-col items-center space-y-2 relative">
        <div className="w-full flex items-center justify-between text-[10px] font-mono text-cyan-400 uppercase tracking-widest px-1">
          <span className="flex items-center gap-1">
            <Scan className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            {isDriveMode ? 'Hand Gesture Driving Cam' : 'Real Face & Hand AI Cam'}
          </span>
          <span className="text-emerald-400 font-bold">{webcamActive ? 'LIVE' : 'OFF'}</span>
        </div>

        {/* Video Canvas Container */}
        <div className="relative w-full h-44 bg-slate-950 rounded-xl overflow-hidden border border-cyan-500/30 flex items-center justify-center shadow-inner">
          <video ref={videoRef} className="hidden" playsInline muted />
          <canvas ref={canvasRef} className={`w-full h-full object-cover ${webcamActive ? 'block' : 'hidden'}`} />

          {!webcamActive && (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <CameraOff className="w-8 h-8 text-slate-400 mb-2 opacity-60" />
              <span className="text-[11px] text-slate-300 mb-2 font-mono">
                {isDriveMode ? 'Open hands = Forward | Closed fist = Brake' : 'Webcam AI preview is off.'}
              </span>
              <button
                onClick={toggleWebcam}
                className="px-3.5 py-1.5 bg-cyan-500/20 border border-cyan-400/40 hover:bg-cyan-400/30 text-cyan-300 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-md"
              >
                Enable Webcam Gesture AI
              </button>
            </div>
          )}

          {/* Active AI Status Tag */}
          {webcamActive && (
            <div className="absolute top-2 left-2 bg-slate-950/90 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shadow-md">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>{gestureStatus}</span>
            </div>
          )}
        </div>

        {webcamError && (
          <div className="text-[10px] text-amber-300 bg-amber-500/10 p-1.5 rounded border border-amber-500/20 text-center w-full font-mono">
            {webcamError}
          </div>
        )}
      </div>

      {/* ── Hand Driving Gesture Legend & Manual Controls ── */}
      {isDriveMode ? (
        <div className="w-full flex flex-col gap-2.5 pt-2 border-t border-cyan-500/20 font-mono text-xs">
          <div className="p-2 bg-slate-950/90 rounded-xl border border-cyan-500/30 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 flex items-center gap-1">
                <Hand className="w-3.5 h-3.5 text-emerald-400" />
                👐 2 Open Hands:
              </span>
              <span className="text-emerald-400 font-bold">FORWARD MOVE</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 flex items-center gap-1">
                <Hand className="w-3.5 h-3.5 text-red-400" />
                ✊ Closed Fist:
              </span>
              <span className="text-red-400 font-bold">STOP / BRAKE</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                ↔️ Hand Tilt:
              </span>
              <span className="text-cyan-400 font-bold">STEER {steeringAngle > 0 ? 'RIGHT' : steeringAngle < 0 ? 'LEFT' : 'STRAIGHT'}</span>
            </div>
          </div>

          {/* Manual Touch / Keyboard Driving Buttons */}
          <div className="flex flex-col gap-1.5 w-full">
            <button
              onClick={() => setDriveState({ driveSpeed: 120, gestureStateText: "FORWARD ACCELERATION" })}
              className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <ArrowUp className="w-4 h-4 text-emerald-400" />
              <span>Drive Forward (Open Hands / W)</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setDriveState({ steeringAngle: -35 })}
                onMouseLeave={() => setDriveState({ steeringAngle: 0 })}
                className="flex-1 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Steer Left</span>
              </button>

              <button
                onClick={() => setDriveState({ driveSpeed: 0, gestureStateText: "BRAKE" })}
                className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>STOP</span>
              </button>

              <button
                onClick={() => setDriveState({ steeringAngle: 35 })}
                onMouseLeave={() => setDriveState({ steeringAngle: 0 })}
                className="flex-1 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Right</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── Directional Manual D-Pad Controls ── */
        <div className="flex flex-col items-center gap-1.5 my-1 w-full pt-2 border-t border-cyan-500/20">
          <div className="flex items-center justify-between w-full text-[9px] font-mono text-slate-300 uppercase tracking-widest px-1">
            <span className="flex items-center gap-1">
              <Compass className="w-3 h-3 text-cyan-400" />
              Directional Manual Pad
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onZoomCamera && onZoomCamera(-0.1)}
                className="p-1 bg-slate-900 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onZoomCamera && onZoomCamera(0.1)}
                className="p-1 bg-slate-900 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded cursor-pointer"
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
              className="p-1.5 bg-slate-950/80 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg transition-all cursor-pointer"
              title="Look Top / Up"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onRotateCamera(-0.2, 0)}
                className="p-1.5 bg-slate-950/80 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg transition-all cursor-pointer"
                title="Look Left"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onResetCamera}
                className="p-1.5 bg-slate-950/80 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg transition-all cursor-pointer"
                title="Reset Center View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onRotateCamera(0.2, 0)}
                className="p-1.5 bg-slate-950/80 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg transition-all cursor-pointer"
                title="Look Right"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => onRotateCamera(0, 0.15)}
              className="p-1.5 bg-slate-950/80 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg transition-all cursor-pointer"
              title="Look Down / Bottom"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

