import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SciencePageLoader } from '@/components/ui/SciencePageLoader';
import { RoleSelection } from '@/features/role-selection/RoleSelection';

// ── Lazy-loaded pages for ultra-fast, lightweight initial page loads ──
const SubjectSelection = lazy(() =>
  import('@/features/subject-selection/SubjectSelection').then((m) => ({ default: m.SubjectSelection }))
);
const ChapterHub = lazy(() =>
  import('@/features/chapter-hub/ChapterHub').then((m) => ({ default: m.ChapterHub }))
);
const ChapterIntro = lazy(() =>
  import('@/features/chapter-intro/ChapterIntro').then((m) => ({ default: m.ChapterIntro }))
);
const UniversalMascotChapterIntro = lazy(() =>
  import('@/features/chapter-intro/UniversalMascotChapterIntro').then((m) => ({ default: m.UniversalMascotChapterIntro }))
);
const DynamicMissionEngine = lazy(() =>
  import('@/features/missions/universal-mission/DynamicMissionEngine').then((m) => ({ default: m.DynamicMissionEngine }))
);
const Theme1Hub = lazy(() =>
  import('@/features/theme1/Theme1Hub').then((m) => ({ default: m.Theme1Hub }))
);
const SuperSensesMissionEngine = lazy(() =>
  import('@/features/theme1/SuperSensesMissionEngine').then((m) => ({ default: m.SuperSensesMissionEngine }))
);
const ThemeWaterHub = lazy(() =>
  import('@/features/theme-water/ThemeWaterHub').then((m) => ({ default: m.ThemeWaterHub }))
);
const WaterMissionEngine = lazy(() =>
  import('@/features/theme-water/WaterMissionEngine').then((m) => ({ default: m.WaterMissionEngine }))
);
const ThemeShelterHub = lazy(() =>
  import('@/features/theme-shelter/ThemeShelterHub').then((m) => ({ default: m.ThemeShelterHub }))
);
const ShelterMissionEngine = lazy(() =>
  import('@/features/theme-shelter/ShelterMissionEngine').then((m) => ({ default: m.ShelterMissionEngine }))
);
const VideoLabPage = lazy(() =>
  import('@/features/video-lab/VideoLabPage').then((m) => ({ default: m.VideoLabPage }))
);
const TeacherStudio = lazy(() =>
  import('@/features/teacher-studio/TeacherStudio').then((m) => ({ default: m.TeacherStudio }))
);
const ParentSetup = lazy(() =>
  import('@/features/parent/ParentSetup').then((m) => ({ default: m.ParentSetup }))
);
const ParentPinGate = lazy(() =>
  import('@/features/parent/ParentPinGate').then((m) => ({ default: m.ParentPinGate }))
);
const ParentDashboard = lazy(() =>
  import('@/features/parent/ParentDashboard').then((m) => ({ default: m.ParentDashboard }))
);
const DiscoveryBook = lazy(() =>
  import('@/features/discovery-book/DiscoveryBook').then((m) => ({ default: m.DiscoveryBook }))
);
const DigitalGuidebook = lazy(() =>
  import('@/features/guidebook/DigitalGuidebook').then((m) => ({ default: m.DigitalGuidebook }))
);
const MysteryObjectQuiz = lazy(() =>
  import('@/features/mystery-lab/MysteryObjectQuiz').then((m) => ({ default: m.MysteryObjectQuiz }))
);

// Global Modals and Persistent Controls
import { DevDrawer } from '@/components/dev/DevDrawer';
import { GlobalWordExplainer } from '@/components/dictionary/GlobalWordExplainer';
import { FieldGuideModal } from '@/features/guidebook/FieldGuideModal';
import { TryWithMeEngine } from '@/components/try-with-me/TryWithMeEngine';
import { EnvironmentFXOverlay } from '@/components/effects/EnvironmentFXOverlay';
import { AtmosphereControlWidget } from '@/components/effects/AtmosphereControlWidget';
import { RickrollModal } from '@/components/easter-egg/RickrollModal';
import { useEasterEggStore } from '@/stores/easterEggStore';
import { LivePipVoiceSidecar } from '@/components/ai/LivePipVoiceSidecar';
import { AiScienceVideoPlayerModal } from '@/components/video/AiScienceVideoPlayerModal';

export function App() {
  React.useEffect(() => {
    // Clear chunk retry flag if the app successfully mounts
    window.sessionStorage.removeItem('pq-chunk-retry');
  }, []);

  const isRickrollOpen = useEasterEggStore((s) => s.isRickrollOpen);
  const closeRickroll = useEasterEggStore((s) => s.closeRickroll);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen relative selection:bg-amber-300 selection:text-slate-950">
          <Suspense fallback={<SciencePageLoader />}>
            <Routes>
              {/* Entry */}
              <Route path="/" element={<RoleSelection />} />

              {/* Subject Hub */}
              <Route path="/subjects" element={<SubjectSelection />} />

              {/* Parent Portal */}
              <Route path="/parent/setup" element={<ParentSetup />} />
              <Route path="/parent/pin" element={<ParentPinGate />} />
              <Route path="/parent/dashboard" element={<ParentDashboard />} />

              {/* Theme 1: Super Senses & Living World (4 Chapters) */}
              <Route path="/theme/1/hub" element={<Theme1Hub />} />
              <Route path="/theme/1/chapter/:chapterNum" element={<SuperSensesMissionEngine />} />

              {/* Theme 2 & 4: Water & Aquatic Experiments */}
              <Route path="/theme/water/hub" element={<ThemeWaterHub />} />
              <Route path="/theme/2/hub" element={<ThemeWaterHub />} />
              <Route path="/theme/water/chapter/:chapterNum" element={<WaterMissionEngine />} />
              <Route path="/theme/2/chapter/:chapterNum" element={<WaterMissionEngine />} />

              {/* Theme 3 & 5: Shelter, Mountains & Earth (5 Chapters) */}
              <Route path="/theme/shelter/hub" element={<ThemeShelterHub />} />
              <Route path="/theme/3/hub" element={<ThemeShelterHub />} />
              <Route path="/theme/5/hub" element={<ThemeShelterHub />} />
              <Route path="/theme/shelter/chapter/:chapterNum" element={<ShelterMissionEngine />} />
              <Route path="/theme/3/chapter/:chapterNum" element={<ShelterMissionEngine />} />
              <Route path="/theme/5/chapter/:chapterNum" element={<ShelterMissionEngine />} />

              {/* Chapter Hub, Discovery Journal & Mystery Lab */}
              <Route path="/chapter-hub" element={<ChapterHub />} />
              <Route path="/video-lab" element={<VideoLabPage />} />
              <Route path="/teacher-studio" element={<TeacherStudio />} />
              <Route path="/teacher/studio" element={<TeacherStudio />} />
              <Route path="/teacher" element={<TeacherStudio />} />
              <Route path="/discovery-book" element={<DiscoveryBook />} />
              <Route path="/guidebook" element={<DigitalGuidebook />} />
              <Route path="/mystery-lab" element={<MysteryObjectQuiz />} />

              {/* Dedicated Full-Screen Mascot Chapter Teaching Intros for All Courses */}
              <Route path="/intro/:courseKey" element={<UniversalMascotChapterIntro />} />
              <Route path="/theme/1/intro" element={<UniversalMascotChapterIntro />} />
              <Route path="/theme/water/intro" element={<UniversalMascotChapterIntro />} />
              <Route path="/theme/shelter/intro" element={<UniversalMascotChapterIntro />} />

              {/* Chapter 3 Missions — All 13 Missions Dynamic Learning Engine */}
              <Route path="/chapter/3" element={<ChapterIntro />} />
              <Route path="/chapter/3/mission/:missionNum" element={<DynamicMissionEngine />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>

          {/* Global Interactive Science Storybook & Field Guide */}
          <FieldGuideModal />

          {/* Global "Try It With Me" Limelight Spotlight Engine */}
          <TryWithMeEngine />

          {/* Global Text-Selection Smart Dictionary & Audio Explainer */}
          <GlobalWordExplainer />

          {/* Global Live Gemini AI Voice & Chat Companion Overlay */}
          <LivePipVoiceSidecar />

          {/* Global AI Page-Scanning Science Cinema & Themed Media Player */}
          <AiScienceVideoPlayerModal />

          {/* Global Full-Screen Interactive Environmental Effects Overlay */}
          <EnvironmentFXOverlay />

          {/* Global Atmosphere & Day/Night Mode Switcher */}
          <AtmosphereControlWidget />

          {/* Secret 7-Click Mascot Rickroll Easter Egg */}
          <RickrollModal isOpen={isRickrollOpen} onClose={closeRickroll} />

          {/* Global Developer Super-Hacks Drawer */}
          <DevDrawer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
