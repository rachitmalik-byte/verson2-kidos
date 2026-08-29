import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  X,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Upload,
  Zap,
  Layers,
  HelpCircle,
  Volume2,
} from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { geminiService, MaterialAnalysisResult } from '@/lib/geminiService';
import { useDiscoveryStore } from '@/stores/discoveryStore';

// Built-in sample test objects for testing
import sampleCottonImg from '@/assets/images/specimens/raw_cotton_boll.jpg';
import sampleBottleImg from '@/assets/images/experiments/pet_water_bottle_molding.jpg';
import sampleWireImg from '@/assets/images/wire/copper_wire_macro.jpg';

interface ScanMyWorldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScanMyWorldModal: React.FC<ScanMyWorldModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MaterialAnalysisResult | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  // Initialize or teardown camera stream
  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, capturedImage]);

  const startCamera = async () => {
    try {
      setErrorMessage(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.warn('Camera access not granted or unavailable:', err);
      setCameraActive(false);
      setErrorMessage('Camera access is unavailable on this device. You can upload an image or test a sample below!');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    sounds.cameraSnap();
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
      stopCamera();
      analyzePhoto(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sounds.pop();
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCapturedImage(dataUrl);
      stopCamera();
      analyzePhoto(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sampleUrl: string, sampleName: string) => {
    sounds.pop();
    setCapturedImage(sampleUrl);
    stopCamera();
    analyzePhoto(sampleUrl);
  };

  const urlOrBlobToBase64 = async (urlOrData: string): Promise<string> => {
    if (urlOrData.startsWith('data:image/')) {
      return urlOrData;
    }
    const res = await fetch(urlOrData);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const analyzePhoto = async (imageInput: string) => {
    setIsAnalyzing(true);
    setResult(null);
    setQuizAnswered(false);
    setSelectedOption(null);
    sounds.sparkle();
    voiceAssistant.speak('Scanning material molecular structure... Let me analyze the fibers and minerals!');

    try {
      const base64Data = await urlOrBlobToBase64(imageInput);
      const res = await geminiService.detectMaterialFromImage(base64Data);
      setResult(res);
      sounds.success();
      voiceAssistant.speak(
        `Material identified! That is ${res.materialName}, a ${res.category} material! Tap the quiz to test its property!`
      );
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setErrorMessage('Could not analyze the photo. Please ensure good lighting and try again!');
      voiceAssistant.speak('Oops! Let us try taking another clear photo with good lighting!');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuizChoice = (optionIndex: number, isCorrect: boolean) => {
    if (quizAnswered) return;
    setSelectedOption(optionIndex);
    setQuizAnswered(true);

    if (isCorrect) {
      sounds.fanfare();
      if (result) {
        addDiscovery({
          id: `ai-${Date.now()}`,
          name: result.materialName,
          category: result.category === 'Natural' ? 'natural' : 'synthetic',
          icon: result.category === 'Natural' ? '🌿' : '🧪',
          description: result.microscopicStructure,
          discoveredIn: 'Scan My World AI Detective',
          funFact: result.funFact,
        });
      }
      voiceAssistant.speak(`Brilliant deduction! +25 Science Stars added to your Field Journal!`);
    } else {
      sounds.boing();
      voiceAssistant.speak(`Not quite! Remember that ${result?.materialName} has unique molecular bonds.`);
    }
  };

  const handleReset = () => {
    sounds.pop();
    voiceAssistant.stop();
    setCapturedImage(null);
    setResult(null);
    setQuizAnswered(false);
    setSelectedOption(null);
    startCamera();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              sounds.pop();
              voiceAssistant.stop();
              stopCamera();
              onClose();
            }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="relative z-10 bg-white w-full max-w-2xl rounded-3xl md:rounded-[36px] border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 flex items-center justify-between text-slate-950 border-b-2 border-amber-500">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white rounded-xl shadow-xs">
              <Camera className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full">
                Gemini 2.5 Vision AI
              </span>
              <h3 className="text-lg font-black text-slate-950 tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Scan My World • Material Detective 🔍
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.pop();
              voiceAssistant.stop();
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-slate-900 cursor-pointer transition-all active:scale-95 shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-4">
          {/* Viewfinder / Image Display */}
          <div className="w-full aspect-video sm:aspect-[4/3] rounded-3xl overflow-hidden bg-slate-950 relative border-4 border-slate-800 shadow-inner flex items-center justify-center">
            {!capturedImage ? (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                />
                {!cameraActive && (
                  <div className="p-6 text-center text-slate-300 flex flex-col items-center">
                    <Camera className="w-12 h-12 text-slate-500 mb-2" />
                    <span className="text-sm font-bold text-slate-400">
                      {errorMessage || 'Initializing camera feed...'}
                    </span>
                  </div>
                )}
                {/* Futuristic Scanner Reticle */}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6">
                    <div className="w-full flex justify-between">
                      <div className="w-8 h-8 border-t-4 border-l-4 border-amber-400 rounded-tl-xl" />
                      <div className="w-8 h-8 border-t-4 border-r-4 border-amber-400 rounded-tr-xl" />
                    </div>
                    <div className="text-[11px] font-mono font-black text-amber-400 bg-slate-950/80 px-3 py-1 rounded-full border border-amber-400/50 backdrop-blur-xs">
                      AIM AT CLOTHES, BOTTLES, OR FURNITURE
                    </div>
                    <div className="w-full flex justify-between">
                      <div className="w-8 h-8 border-b-4 border-l-4 border-amber-400 rounded-bl-xl" />
                      <div className="w-8 h-8 border-b-4 border-r-4 border-amber-400 rounded-br-xl" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                <img
                  src={capturedImage}
                  alt="Scanned Object"
                  className="w-full h-full object-contain"
                />
                {/* Animated Scanning Laser Line */}
                {isAnalyzing && (
                  <motion.div
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22D3EE]"
                  />
                )}
              </div>
            )}

            {/* Hidden canvas for capturing video frames */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Controls Bar */}
          {!capturedImage ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300"
                >
                  <Upload className="w-4 h-4" /> Upload Photo
                </button>
              </div>

              {cameraActive && (
                <button
                  onClick={capturePhoto}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  <Camera className="w-5 h-5 stroke-[2.5]" />
                  <span>SNAP & ANALYZE MATERIAL 📸</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Scan Another Object
              </button>

              <span className="text-xs font-mono font-black text-slate-500">
                {isAnalyzing ? '⚡ AI Analyzing Molecular Polymers...' : '✓ Analysis Complete'}
              </span>
            </div>
          )}

          {/* Quick Sample Presets (For Laptops without Webcams) */}
          {!capturedImage && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">
                Or Test Sample Material Specs:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSelectSample(sampleCottonImg, 'Cotton Shirt')}
                  className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  🌱 Cotton Swatch
                </button>
                <button
                  onClick={() => handleSelectSample(sampleBottleImg, 'Plastic Water Bottle')}
                  className="px-3 py-1.5 bg-white hover:bg-sky-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  🧴 PET Plastic Bottle
                </button>
                <button
                  onClick={() => handleSelectSample(sampleWireImg, 'Copper Wire')}
                  className="px-3 py-1.5 bg-white hover:bg-amber-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  ⚡ Copper Cable
                </button>
              </div>
            </div>
          )}

          {/* AI Result Card */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white p-5 rounded-3xl border-3 border-emerald-400 shadow-xl flex flex-col gap-4"
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-xs ${
                    result.category === 'Natural' ? 'bg-emerald-500 text-white' : 'bg-sky-500 text-white'
                  }`}>
                    {result.category === 'Natural' ? '🌿 NATURAL MATERIAL' : '🧪 SYNTHETIC POLYMER'}
                  </span>
                  <span className="text-xs font-mono font-black text-slate-500">
                    {Math.round(result.confidence * 100)}% Confidence
                  </span>
                </div>

                <button
                  onClick={() => {
                    sounds.sparkle();
                    voiceAssistant.speak(`${result.materialName}. ${result.microscopicStructure}. ${result.funFact}`);
                  }}
                  className="p-2 rounded-full bg-white text-emerald-700 shadow-xs hover:bg-emerald-100 cursor-pointer"
                  title="Read Analysis"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {result.materialName}
                </h4>
                <span className="text-xs font-extrabold text-emerald-800 block mb-2">
                  Family: {result.family}
                </span>
                <p className="text-xs font-bold text-slate-700 leading-relaxed bg-white/80 p-3 rounded-2xl border border-emerald-200">
                  🔬 <strong>Molecular Structure:</strong> {result.microscopicStructure}
                </p>
              </div>

              <div className="p-3 bg-amber-100/90 rounded-2xl border border-amber-300 text-xs font-black text-amber-950">
                <span>💡 Did You Know? {result.funFact}</span>
              </div>

              {/* Interactive Socratic Challenge */}
              <div className="p-4 bg-white rounded-2xl border-2 border-emerald-300 shadow-xs flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  <span>Detective Challenge: {result.interactiveChallenge.question}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {result.interactiveChallenge.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    return (
                      <button
                        key={idx}
                        disabled={quizAnswered}
                        onClick={() => handleQuizChoice(idx, opt.isCorrect)}
                        className={`p-3 rounded-xl text-left text-xs font-black transition-all flex items-center justify-between ${
                          quizAnswered && opt.isCorrect
                            ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950'
                            : isSelected && !opt.isCorrect
                            ? 'bg-rose-100 border-2 border-rose-500 text-rose-950'
                            : 'bg-slate-50 hover:bg-amber-50 border border-slate-200 text-slate-800 cursor-pointer'
                        }`}
                      >
                        <span>{opt.text}</span>
                        {quizAnswered && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>,
document.body
);
};
