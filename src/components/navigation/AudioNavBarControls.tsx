import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudioStore } from '@/stores/audioStore';
import { useParentStore } from '@/stores/parentStore';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Volume2, VolumeX, Mic, MicOff, Home, Music, Sliders } from 'lucide-react';
import { AudioSettingsModal } from '@/components/audio/AudioSettingsModal';

interface AudioNavBarControlsProps {
  className?: string;
  showProfile?: boolean;
}

export const AudioNavBarControls: React.FC<AudioNavBarControlsProps> = ({
  className = '',
  showProfile = true,
}) => {
  const navigate = useNavigate();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { isSfxMuted, isTtsMuted, isBgmMuted, toggleSfx, toggleTts, toggleBgm } = useAudioStore();
  const child = useParentStore((state) => state.child);

  const handleHomeClick = () => {
    sounds.pop();
    voiceAssistant.stop();
    navigate('/');
  };

  return (
    <>
      <div className={`flex items-center gap-1.5 sm:gap-2 flex-wrap ${className}`}>
        {/* BGM Music Toggle */}
        <button
          onClick={() => {
            sounds.pop();
            toggleBgm();
          }}
          className={`p-2 sm:px-3 sm:py-1.5 rounded-2xl border-2 flex items-center gap-1 font-black text-xs transition-all cursor-pointer shadow-xs active:scale-95 ${
            !isBgmMuted
              ? 'bg-rose-100 border-rose-300 text-rose-900 hover:bg-rose-200'
              : 'bg-slate-100 border-slate-300 text-slate-400'
          }`}
          title={!isBgmMuted ? 'Mute Background Music' : 'Turn On Background Music'}
        >
          <Music className={`w-4 h-4 ${!isBgmMuted ? 'text-rose-600' : 'text-slate-400'}`} />
          <span className="hidden md:inline">{!isBgmMuted ? 'Music' : 'Music Off'}</span>
        </button>

        {/* SFX Toggle */}
        <button
          onClick={() => {
            sounds.pop();
            toggleSfx();
          }}
          className={`p-2 sm:px-3 sm:py-1.5 rounded-2xl border-2 flex items-center gap-1 font-black text-xs transition-all cursor-pointer shadow-xs active:scale-95 ${
            !isSfxMuted
              ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
              : 'bg-slate-100 border-slate-300 text-slate-400'
          }`}
          title={!isSfxMuted ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
        >
          {!isSfxMuted ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden md:inline">{!isSfxMuted ? 'SFX' : 'SFX Off'}</span>
        </button>

        {/* TTS Voice Toggle */}
        <button
          onClick={() => {
            sounds.pop();
            toggleTts();
          }}
          className={`p-2 sm:px-3 sm:py-1.5 rounded-2xl border-2 flex items-center gap-1 font-black text-xs transition-all cursor-pointer shadow-xs active:scale-95 ${
            !isTtsMuted
              ? 'bg-violet-100 border-violet-300 text-violet-900 hover:bg-violet-200'
              : 'bg-slate-100 border-slate-300 text-slate-400'
          }`}
          title={!isTtsMuted ? 'Mute Pip Voice' : 'Unmute Pip Voice'}
        >
          {!isTtsMuted ? <Mic className="w-4 h-4 text-violet-600" /> : <MicOff className="w-4 h-4" />}
          <span className="hidden md:inline">{!isTtsMuted ? 'Voice' : 'Voice Off'}</span>
        </button>

        {/* Audio & Voice Studio Settings Modal Trigger */}
        <button
          onClick={() => {
            sounds.pop();
            setShowSettingsModal(true);
          }}
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700 flex items-center gap-1 font-black text-xs shadow-xs cursor-pointer active:scale-95 transition-all"
          title="Open Audio & Voice Studio Settings (BGM Jukebox & Voice Speed)"
        >
          <Sliders className="w-4 h-4 text-slate-600" />
          <span className="hidden lg:inline">Audio Studio</span>
        </button>

        {/* Profile / Home shortcut */}
        {showProfile && (
          <button
            onClick={handleHomeClick}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 flex items-center gap-1.5 font-black text-xs shadow-xs cursor-pointer active:scale-95 transition-all"
            title="Click to return to Home"
          >
            <div className="w-6 h-6 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-white flex items-center justify-center text-xs font-black shadow-xs">
              {child?.name ? child.name.charAt(0).toUpperCase() : <Home className="w-3.5 h-3.5" />}
            </div>
            <span className="hidden sm:inline font-black text-slate-800">{child?.name || 'Home'}</span>
          </button>
        )}
      </div>

      {/* Audio & Voice Settings Modal */}
      <AudioSettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </>
  );
};
