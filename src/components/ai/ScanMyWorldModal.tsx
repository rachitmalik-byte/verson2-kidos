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
  Key,
  Check,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  geminiService,
  MaterialAnalysisResult,
  DetectedMaterialPointer,
  MaterialCategory,
  ColorStats,
  getApiKey,
  setApiKey,
} from '@/lib/geminiService';
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

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [result, setResult] = useState<MaterialAnalysisResult | null>(null);
  const [selectedPointerId, setSelectedPointerId] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // API Key State & Prompt
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [customKey, setCustomKey] = useState(getApiKey());
  const [keySaved, setKeySaved] = useState(false);

  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

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

  /**
   * Robust camera frame capture with readyState check
   */
  const capturePhoto = async () => {
    sounds.camera();
    const video = videoRef.current;
    
    // Ensure video frame is actively rendering
    if (video && video.readyState < 2) {
      await new Promise<void>((resolve) => {
        const checkReady = () => {
          if (video.readyState >= 2) resolve();
          else setTimeout(checkReady, 50);
        };
        checkReady();
      });
    }

    const canvas = document.createElement('canvas');
    const width = video && video.videoWidth > 0 ? video.videoWidth : 1280;
    const height = video && video.videoHeight > 0 ? video.videoHeight : 720;
    
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    let dataUrl = '';

    if (ctx && video) {
      try {
        ctx.drawImage(video, 0, 0, width, height);
        dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      } catch (e) {
        console.warn('Canvas capture fallback:', e);
      }
    }

    if (!dataUrl) {
      dataUrl = sampleCottonImg;
    }

    setCapturedImage(dataUrl);
    stopCamera();
    analyzePhoto(dataUrl);
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
      analyzePhoto(rawDataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sampleUrl: string, sampleHint: string) => {
    sounds.pop();
    setCapturedImage(sampleUrl);
    stopCamera();
    analyzePhoto(sampleUrl, sampleHint);
  };

  const analyzePhoto = async (imageInput: string, sampleTypeHint?: string) => {
    setAnalysisError(null);

    // If no API key and it is not a built-in sample, show the key input drawer
    if (!geminiService.hasApiKey() && !sampleTypeHint) {
      setShowKeyInput(true);
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setSelectedPointerId(null);
    setQuizAnswered(false);
    setSelectedOption(null);
    sounds.sparkle();

    try {
      const res = await geminiService.detectMaterialFromImage(imageInput, sampleTypeHint);
      setResult(res);
      if (res.pointers && res.pointers.length > 0) {
        setSelectedPointerId(res.pointers[0].id || 'p1');
      }
      sounds.success();
      voiceAssistant.speak(
        `${res.sceneDescription} Detected ${res.pointers.length} materials.`
      );
    } catch (err: any) {
      console.error('Vision analysis error:', err);
      if (err.message === 'NO_API_KEY') {
        setShowKeyInput(true);
      } else {
        setAnalysisError(err.message || 'Vision AI analysis failed. Please check your Gemini API key.');
      }
      sounds.boing();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveApiKey = () => {
    sounds.pop();
    const clean = customKey.trim();
    setApiKey(clean);
    setKeySaved(true);
    setTimeout(() => {
      setKeySaved(false);
    }, 1500);

    if (capturedImage) {
      analyzePhoto(capturedImage);
    }
  };

  const handlePointerClick = (pointer: DetectedMaterialPointer) => {
    sounds.pop();
    setSelectedPointerId(pointer.id);
    voiceAssistant.speak(`${pointer.itemName} is made from ${pointer.materialName}. ${pointer.whyUsed}`);
  };

  const getCategoryBadgeClass = (category: MaterialCategory) => {
    switch (category) {
      case 'Metallic':
        return 'bg-amber-400 text-amber-950 border border-amber-500';
      case 'Natural':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
      case 'Synthetic':
        return 'bg-sky-100 text-sky-800 border border-sky-300';
      case 'Mineral':
        return 'bg-purple-100 text-purple-800 border border-purple-300';
      case 'Mixed':
      default:
        return 'bg-teal-100 text-teal-800 border border-teal-300';
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
      voiceAssistant.speak(`Good try! Notice how each material is engineered for its specific purpose.`);
    }
  };

  const handleReset = () => {
    sounds.pop();
    voiceAssistant.stop();
    setCapturedImage(null);
    setResult(null);
    setSelectedPointerId(null);
    setQuizAnswered(false);
    setSelectedOption(null);
    setAnalysisError(null);
    startCamera();
  };

  const activePointer = result?.pointers?.find((p) => p.id === selectedPointerId) || result?.pointers?.[0];

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
            className="relative z-10 bg-white w-full max-w-4xl rounded-3xl md:rounded-[36px] border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 flex items-center justify-between text-slate-950 border-b-2 border-amber-500 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl shadow-xs">
                  <Camera className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full">
                      {geminiService.hasApiKey() ? 'Gemini 2.0 Multimodal Vision AI' : 'Live Vision AI Detective'}
                    </span>
                    <button
                      onClick={() => setShowKeyInput(!showKeyInput)}
                      className="px-2.5 py-0.5 bg-amber-200/90 hover:bg-white text-slate-900 rounded-md text-[10px] font-black flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                      title="Set Gemini Vision API Key"
                    >
                      <Key className="w-3 h-3 text-amber-800" />
                      <span>{geminiService.hasApiKey() ? 'API Key Active ✓' : 'Connect API Key 🔑'}</span>
                    </button>
                  </div>
                  <h3 className="text-lg font-black text-slate-950 tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Scan My World • Multimodal Material Detective 🔍
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

            {/* Expandable API Key Setup Drawer */}
            {showKeyInput && (
              <div className="p-4 bg-amber-50 border-b-2 border-amber-300 flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-extrabold text-slate-900 text-xs block">
                      🔑 Connect Google Gemini Vision API Key:
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      To analyze custom photos with real multimodal vision, paste your free Google AI Studio key below.
                    </p>
                  </div>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-black text-violet-700 bg-violet-100 hover:bg-violet-200 px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0"
                  >
                    <span>Get Free Key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="password"
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    placeholder="Paste AIzaSy... API key here"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white font-mono text-xs text-slate-800 focus:outline-amber-500"
                  />
                  <button
                    onClick={handleSaveApiKey}
                    className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0"
                  >
                    {keySaved ? <Check className="w-4 h-4 text-emerald-950" /> : <Key className="w-4 h-4" />}
                    <span>{keySaved ? 'Saved!' : 'Save & Analyze Image 🚀'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Live Error Banner if API error occurs */}
            {analysisError && (
              <div className="mx-4 sm:mx-6 mt-3 p-3.5 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start gap-2.5 text-xs text-rose-900">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-black block uppercase text-[10px] tracking-wider text-rose-700">
                    Vision AI Analysis Error:
                  </span>
                  <span>{analysisError}</span>
                </div>
                <button
                  onClick={() => analyzePhoto(capturedImage || sampleCottonImg)}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-black text-[11px] rounded-xl cursor-pointer shadow-xs active:scale-95 shrink-0"
                >
                  Retry 🔄
                </button>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-4">
              {/* Viewfinder / AR Annotated Image Display */}
              <div className="w-full min-h-[220px] max-h-[360px] rounded-3xl overflow-hidden bg-slate-950 relative border-4 border-slate-800 shadow-inner flex items-center justify-center">
                {!capturedImage ? (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      autoPlay
                      muted
                      className={`w-full h-full object-contain max-h-[340px] ${cameraActive ? 'block' : 'hidden'}`}
                    />
                    {!cameraActive && (
                      <div className="p-8 text-center text-slate-300 flex flex-col items-center">
                        <Camera className="w-12 h-12 text-slate-500 mb-2" />
                        <span className="text-sm font-bold text-slate-400">
                          Take a photo or upload an image to detect all materials!
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
                          AIM AT ANY OBJECT, APPAREL, INFOGRAPHIC OR TOOL
                        </div>
                        <div className="w-full flex justify-between">
                          <div className="w-8 h-8 border-b-4 border-l-4 border-amber-400 rounded-bl-xl" />
                          <div className="w-8 h-8 border-b-4 border-r-4 border-amber-400 rounded-br-xl" />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center bg-slate-950 min-h-[240px] max-h-[360px] overflow-hidden">
                    <img
                      src={capturedImage}
                      alt="Scanned Scene"
                      className="w-full h-full object-contain max-h-[340px]"
                    />

                    {/* Scanning Laser Animation */}
                    {isAnalyzing && (
                      <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_25px_#22D3EE]"
                      />
                    )}

                    {/* Overlay AR Material Pins ON THE IMAGE (Dynamically mapped for all objects) */}
                    {result && !isAnalyzing && result.pointers && result.pointers.map((pointer, idx) => {
                      const isSelected = selectedPointerId === pointer.id;
                      const posX = pointer.pinX || (15 + (idx % 4) * 22);
                      const posY = pointer.pinY || (25 + Math.floor(idx / 4) * 35);

                      return (
                        <motion.button
                          key={pointer.id || idx}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: isSelected ? 1.15 : 1, opacity: 1 }}
                          whileHover={{ scale: 1.2 }}
                          onClick={() => handlePointerClick(pointer)}
                          style={{ top: `${posY}%`, left: `${posX}%` }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 flex items-center gap-1 px-2.5 py-1 rounded-full shadow-2xl transition-all border-2 ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 border-white ring-4 ring-amber-400/70 font-black scale-110'
                              : 'bg-slate-950/90 text-white border-amber-400/80 backdrop-blur-md font-extrabold hover:bg-slate-900'
                          }`}
                        >
                          <span className="text-sm">{pointer.icon}</span>
                          <span className="text-[10px] tracking-tight whitespace-nowrap font-black">
                            {idx + 1}. {pointer.itemName.split('(')[0]}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Controls Bar */}
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
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Scan Another Scene
                  </button>

                  <span className="text-xs font-mono font-black text-slate-600">
                    {isAnalyzing
                      ? '⚡ Detecting All Objects & Materials...'
                      : result
                      ? `✓ Detected ${result.pointers?.length || 0} Objects & Materials!`
                      : '⚠️ Ready to Analyze'}
                  </span>
                </div>
              )}

              {/* Sample Scene Quick Chips */}
              {!capturedImage && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">
                    Or Test Offline Science Specimens (Zero Key Required):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSelectSample(sampleCottonImg, 'sample-cotton')}
                      className="px-3.5 py-2 bg-white hover:bg-emerald-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-xs active:scale-95 transition-all flex items-center gap-1"
                    >
                      <span>🌱 Raw Cotton Boll</span>
                    </button>
                    <button
                      onClick={() => handleSelectSample(sampleBottleImg, 'sample-bottle')}
                      className="px-3.5 py-2 bg-white hover:bg-sky-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-xs active:scale-95 transition-all flex items-center gap-1"
                    >
                      <span>🧴 PET Plastic Bottle</span>
                    </button>
                    <button
                      onClick={() => handleSelectSample(sampleWireImg, 'sample-wire')}
                      className="px-3.5 py-2 bg-white hover:bg-amber-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-xs active:scale-95 transition-all flex items-center gap-1"
                    >
                      <span>⚡ Copper Wire & PVC</span>
                    </button>
                  </div>
                </div>
              )}

              {/* AI Multi-Object Scene Result Breakdown */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white p-5 sm:p-6 rounded-3xl border-3 border-emerald-400 shadow-xl flex flex-col gap-4"
                >
                  {/* Scene Narrative Box */}
                  <div className="bg-white/95 p-4 rounded-2xl border-2 border-emerald-300 shadow-xs flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Eye className="w-3 h-3 text-emerald-700" />
                        <span>Pip's Scene Vision</span>
                      </span>
                      <button
                        onClick={() => {
                          sounds.sparkle();
                          voiceAssistant.speak(result.sceneDescription);
                        }}
                        className="p-1.5 rounded-full bg-slate-100 hover:bg-emerald-100 text-emerald-700 cursor-pointer shadow-xs"
                        title="Read Scene Aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm font-black text-slate-900 leading-snug">
                      {result.sceneDescription}
                    </p>
                  </div>

                  {/* Component Material Cards (Dynamic responsive grid mapping over ALL objects) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-amber-500" />
                        <span>Identified Objects & Materials ({result.pointers?.length || 0})</span>
                      </h4>
                      <span className="text-[10px] font-extrabold text-slate-400">
                        Tap pin on photo or card below
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                      {result.pointers && result.pointers.map((pointer, idx) => {
                        const isSelected = selectedPointerId === pointer.id;
                        return (
                          <button
                            key={pointer.id || idx}
                            onClick={() => handlePointerClick(pointer)}
                            className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-300 scale-[1.02]'
                                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-lg">{pointer.icon}</span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${getCategoryBadgeClass(pointer.category)}`}>
                                  {pointer.category}
                                </span>
                              </div>
                              <h5 className="text-xs font-black text-slate-900 leading-tight">
                                {idx + 1}. {pointer.itemName}
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

                  {/* Selected Object Zoom Breakdown */}
                  {activePointer && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 text-slate-900 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{activePointer.icon}</span>
                          <span className="font-black text-xs text-amber-950">
                            Deep Dive: {activePointer.itemName} ({activePointer.materialName})
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            sounds.sparkle();
                            voiceAssistant.speak(`${activePointer.itemName}. ${activePointer.whyUsed}. Structure: ${activePointer.microscopicStructure}`);
                          }}
                          className="p-1.5 rounded-full bg-white text-amber-800 shadow-xs hover:bg-amber-100 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-slate-700 bg-white p-2.5 rounded-xl border border-amber-200">
                        🔬 <strong>Microscopic Structure:</strong> {activePointer.microscopicStructure}
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
