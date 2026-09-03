import { create } from 'zustand';
import { aiVideoFinderService, ScienceVideo } from '@/services/aiVideoFinderService';
import { sounds } from '@/lib/sounds';

interface AiVideoState {
  isOpen: boolean;
  activeVideo: ScienceVideo | null;
  scannedTopicBadge: string | null;
  openVideoByContext: (routePath: string, query?: string) => void;
  openVideoDirect: (video: ScienceVideo) => void;
  closeVideo: () => void;
}

export const useAiVideoStore = create<AiVideoState>((set) => ({
  isOpen: false,
  activeVideo: null,
  scannedTopicBadge: null,

  openVideoByContext: (routePath: string, query?: string) => {
    sounds.pop();
    const matched = aiVideoFinderService.scanPageContext(routePath, query);
    set({
      isOpen: true,
      activeVideo: matched,
      scannedTopicBadge: matched.topicBadge || 'Current Activity',
    });
  },

  openVideoDirect: (video: ScienceVideo) => {
    sounds.pop();
    set({
      isOpen: true,
      activeVideo: video,
      scannedTopicBadge: video.topicBadge || 'Recommended Video',
    });
  },

  closeVideo: () => {
    sounds.pop();
    set({
      isOpen: false,
    });
  },
}));
