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
  HelpCircle,
  Volume2,
  ArrowRight,
  Layers,
  Eye,
  Info,
} from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { geminiService, MaterialAnalysisResult, DetectedMaterialPointer, ColorStats } from '@/lib/geminiService';
import { useDiscoveryStore } from '@/stores/discoveryStore';

// Built-in sample test objects
import sampleCottonImg from '@/assets/images/specimens/raw_cotton_boll.jpg';
import sampleBottleImg from '@/assets/images/experiments/pet_water_bottle_molding.jpg';
import sampleWireImg from '@/assets/images/wire/copper_wire_macro.jpg';

interface ScanMyWorldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScanMyWorldModal: React.FC<ScanMyWorldModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MaterialAnalysisResult | null>(null);
  const [selectedPointer, setSelectedPointer] = useState<DetectedMaterialPointer | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, capturedImage]);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((e) => console.warn('Play error:', e));
        };
      }
    } catch (err) {
      console.warn('Camera access unavailable:', err);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const extractStatsFromCanvas = (canvas: HTMLCanvasElement): ColorStats => {
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return { avgR: 128, avgG: 128, avgB: 128, brightness: 128 };
      
      const imgData = ctx.getImageData(0, 0, Math.min(canvas.width, 128), Math.min(canvas.height, 128)).data;
      let rSum = 0, gSum = 0, bSum = 0, count = 0;
      for (let i = 0; i < imgData.length; i += 4) {
        rSum += imgData[i];
        gSum += imgData[i + 1];
        bSum += imgData[i + 2];
        count++;
      }
      const avgR = Math.round(rSum / Math.max(count, 1));
      const avgG = Math.round(gSum / Math.max(count, 1));
      const avgB = Math.round(bSum / Math.max(count, 1));
      const brightness = Math.round((avgR * 299 + avgG * 587 + avgB * 114) / 1000);
      return { avgR, avgG, avgB, brightness };
    } catch {
      return { avgR: 128, avgG: 128, avgB: 128, brightness: 128 };
    }
  };

  const capturePhoto = () => {
    sounds.camera();
    const video = videoRef.current;
    
    // Create an in-memory canvas
    const canvas = document.createElement('canvas');
    const width = video && video.videoWidth > 0 ? video.videoWidth : 1280;
    const height = video && video.videoHeight > 0 ? video.videoHeight : 720;
    
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    let stats: ColorStats = { avgR: 128, avgG: 128, avgB: 128, brightness: 128 };
    let dataUrl = '';

    if (ctx && video) {
      try {
        ctx.drawImage(video, 0, 0, width, height);
        stats = extractStatsFromCanvas(canvas);
        dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      } catch (e) {
        console.warn('Canvas draw fallback:', e);
      }
    }

    // If canvas failed, use sample
    if (!dataUrl) {
      dataUrl = sampleCottonImg;
    }

    setCapturedImage(dataUrl);
    stopCamera();
    analyzePhoto(dataUrl, stats);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sounds.pop();
    const reader = new FileReader();
    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      setCapturedImage(rawDataUrl);
      stopCamera();

      const img = new Image();
      img.onload = () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 64;
        tempCanvas.height = 64;
        const ctx = tempCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 64, 64);
          const stats = extractStatsFromCanvas(tempCanvas);
          analyzePhoto(rawDataUrl, stats);
        } else {
          analyzePhoto(rawDataUrl);
        }
      };
      img.onerror = () => analyzePhoto(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sampleUrl: string, sampleName: string) => {
    sounds.pop();
    setCapturedImage(sampleUrl);
    stopCamera();

    let sampleStats: ColorStats = { avgR: 128, avgG: 128, avgB: 128, brightness: 128 };
    if (sampleName.includes('Cotton')) {
      sampleStats = { avgR: 210, avgG: 205, avgB: 200, brightness: 205 };
    } else if (sampleName.includes('Bottle')) {
      sampleStats = { avgR: 80, avgG: 160, avgB: 220, brightness: 155 };
    } else if (sampleName.includes('Wire')) {
      sampleStats = { avgR: 215, avgG: 120, avgB: 50, brightness: 135 };
    }

    analyzePhoto(sampleUrl, sampleStats);
  };

  const analyzePhoto = async (imageInput: string, precomputedStats?: ColorStats) => {
    setIsAnalyzing(true);
    setResult(null);
    setSelectedPointer(null);
    setQuizAnswered(false);
    setSelectedOption(null);
    sounds.sparkle();

    try {
      const [res] = await Promise.all([
        geminiService.detectMaterialFromImage(imageInput, precomputedStats),
        new Promise((resolve) => setTimeout(resolve, 1100)),
      ]);

      setResult(res);
      setSelectedPointer(res.pointers?.[0] || null);
      sounds.success();
      voiceAssistant.speak(
        `${res.sceneDescription} Detected materials: ${res.pointers.map(p => p.itemName).join(', ')}.`
      );
    } catch (err: any) {
      console.warn('Vision analysis fallback engaged:', err);
      const fallbackStats = precomputedStats || { avgR: 128, avgG: 128, avgB: 128, brightness: 128 };
      const res = await geminiService.detectMaterialFromImage(imageInput, fallbackStats);
      setResult(res);
      setSelectedPointer(res.pointers?.[0] || null);
      sounds.success();
      voiceAssistant.speak(
        `${res.sceneDescription} Detected materials: ${res.pointers.map(p => p.itemName).join(', ')}.`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePointerClick = (pointer: DetectedMaterialPointer) => {
    sounds.pop();
    setSelectedPointer(pointer);
    voiceAssistant.speak(`${pointer.itemName} is made from ${pointer.materialName}. ${pointer.whyUsed}`);
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
      voiceAssistant.speak(`Good try! Notice how each material is engineered for its specific purpose.`);
    }
  };

  const handleReset = () => {
    sounds.pop();
    voiceAssistant.stop();
    setCapturedImage(null);
    setResult(null);
    setSelectedPointer(null);
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
            className="relative z-10 bg-white w-full max-w-3xl rounded-3xl md:rounded-[36px] border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 flex items-center justify-between text-slate-950 border-b-2 border-amber-500 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl shadow-xs">
                  <Camera className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full">
                    {geminiService.hasApiKey() ? 'Gemini 2.0 Vision AI' : 'Scene & Material Detective'}
                  </span>
                  <h3 className="text-lg font-black text-slate-950 tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Scan My World • Scene & Material Detective 🔍
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
              <div className="w-full aspect-video sm:aspect-[16/9] rounded-3xl overflow-hidden bg-slate-950 relative border-4 border-slate-800 shadow-inner flex items-center justify-center">
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
                          Take a photo or upload an image of any scene or object!
                        </span>
                      </div>
                    )}
                    {cameraActive && (
                      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6">
                        <div className="w-full flex justify-between">
                          <div className="w-8 h-8 border-t-4 border-l-4 border-amber-400 rounded-tl-xl" />
                          <div className="w-8 h-8 border-t-4 border-r-4 border-amber-400 rounded-tr-xl" />
                        </div>
                        <div className="text-[11px] font-mono font-black text-amber-400 bg-slate-950/80 px-3 py-1 rounded-full border border-amber-400/50 backdrop-blur-xs">
                          AIM AT CARS, CLOTHES, PAPER, DESKS, TOOLS & BOTTLES
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
                      alt="Scanned Scene"
                      className="w-full h-full object-contain"
                    />
                    {isAnalyzing && (
                      <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22D3EE]"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Action Bar */}
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
                      className="flex-1 sm:flex-none px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300 shadow-xs"
                    >
                      <Upload className="w-4 h-4" /> Upload Picture
                    </button>
                  </div>

                  <button
                    onClick={capturePhoto}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                  >
                    <Camera className="w-5 h-5 stroke-[2.5]" />
                    <span>SNAP & ANALYZE SCENE 📸</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Scan Another Scene
                  </button>

                  <span className="text-xs font-mono font-black text-slate-600">
                    {isAnalyzing
                      ? '⚡ Detecting Scene Objects & Materials...'
                      : result
                      ? '✓ Scene Analyzed with Material Pointers!'
                      : '⚠️ Analysis Complete'}
                  </span>
                </div>
              )}

              {/* Sample Presets */}
              {!capturedImage && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">
                    Or Test Sample Scene Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSelectSample(sampleCottonImg, 'Cotton Shirt')}
                      className="px-3.5 py-2 bg-white hover:bg-emerald-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-xs active:scale-95 transition-all"
                    >
                      🌱 Cotton Boll & Cloth
                    </button>
                    <button
                      onClick={() => handleSelectSample(sampleBottleImg, 'Plastic Bottle')}
                      className="px-3.5 py-2 bg-white hover:bg-sky-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-xs active:scale-95 transition-all"
                    >
                      🧴 PET Bottle Molding
                    </button>
                    <button
                      onClick={() => handleSelectSample(sampleWireImg, 'Copper Wire')}
                      className="px-3.5 py-2 bg-white hover:bg-amber-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-xs active:scale-95 transition-all"
                    >
                      ⚡ Copper Wire & Insulation
                    </button>
                  </div>
                </div>
              )}

              {/* AI Multi-Object Scene Result Card */}
              {result && (
                <motion.div
                  ref={resultRef}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white p-5 sm:p-6 rounded-3xl border-3 border-emerald-400 shadow-xl flex flex-col gap-4"
                >
                  {/* Scene Description Box */}
                  <div className="bg-white/90 p-4 rounded-2xl border-2 border-emerald-300 shadow-xs flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        👁️ Pip's Scene Vision
                      </span>
                      <button
                        onClick={() => {
                          sounds.sparkle();
                          voiceAssistant.speak(result.sceneDescription);
                        }}
                        className="p-1.5 rounded-full bg-slate-100 hover:bg-emerald-100 text-emerald-700 cursor-pointer"
                        title="Read Scene"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm font-black text-slate-900 leading-snug">
                      {result.sceneDescription}
                    </p>
                  </div>

                  {/* Detected Object Material Pointers */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-amber-500" />
                        <span>Identified Objects & Materials ({result.pointers.length})</span>
                      </h4>
                      <span className="text-[10px] font-extrabold text-slate-400">
                        Tap any card to inspect
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {result.pointers.map((pointer, idx) => {
                        const isSelected = selectedPointer?.itemName === pointer.itemName;
                        return (
                          <button
                            key={idx}
                            onClick={() => handlePointerClick(pointer)}
                            className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-300 scale-[1.02]'
                                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-lg">{pointer.icon}</span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                  pointer.category === 'Natural'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-sky-100 text-sky-800'
                                }`}>
                                  {pointer.category}
                                </span>
                              </div>
                              <h5 className="text-xs font-black text-slate-900 leading-tight">
                                {pointer.itemName}
                              </h5>
                              <span className="text-[11px] font-extrabold text-slate-600 block mt-0.5">
                                {pointer.materialName}
                              </span>
                            </div>
                            <span className="text-[9px] font-bold text-amber-900 mt-2 block">
                              Why: {pointer.whyUsed}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Object Detail Zoom */}
                  {selectedPointer && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 text-slate-900 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{selectedPointer.icon}</span>
                          <span className="font-black text-xs text-amber-950">
                            Deep Dive: {selectedPointer.itemName} ({selectedPointer.materialName})
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            sounds.sparkle();
                            voiceAssistant.speak(`${selectedPointer.itemName}. ${selectedPointer.whyUsed}. Structure: ${selectedPointer.microscopicStructure}`);
                          }}
                          className="p-1 rounded-full bg-white text-amber-800 shadow-xs hover:bg-amber-100 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-slate-700 bg-white p-2.5 rounded-xl border border-amber-200">
                        🔬 <strong>Microscopic Structure:</strong> {selectedPointer.microscopicStructure}
                      </p>
                    </motion.div>
                  )}

                  {/* Did You Know Fact */}
                  <div className="p-3 bg-amber-100/90 rounded-2xl border border-amber-300 text-xs font-black text-amber-950">
                    <span>💡 Did You Know? {result.funFact}</span>
                  </div>

                  {/* Detective Challenge Quiz */}
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
