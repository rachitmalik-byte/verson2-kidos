import { AdaptiveNavigationProgressBar } from '@/components/navigation/AdaptiveNavigationProgressBar';
import { VideoLabPage } from '@/features/video-lab/VideoLabPage';
import { ThemeWaterHub } from '@/features/theme-water/ThemeWaterHub';
import { WaterMissionEngine } from '@/features/theme-water/WaterMissionEngine';
import { TeacherStudio } from '@/features/teacher-studio/TeacherStudio';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoleSelection } from '@/features/role-selection/RoleSelection';
import { SubjectSelection } from '@/features/subject-selection/SubjectSelection';
import { ParentSetup } from '@/features/parent/ParentSetup';
import { ParentPinGate } from '@/features/parent/ParentPinGate';
import { ParentDashboard } from '@/features/parent/ParentDashboard';
import { ChapterHub } from '@/features/chapter-hub/ChapterHub';
import { ChapterIntro } from '@/features/chapter-intro/ChapterIntro';
import { UniversalMascotChapterIntro } from '@/features/chapter-intro/UniversalMascotChapterIntro';
import { DigitalGuidebook } from '@/features/guidebook/DigitalGuidebook';
import { DynamicMissionEngine } from '@/features/missions/universal-mission/DynamicMissionEngine';
import { Theme1Hub } from '@/features/theme1/Theme1Hub';
import { SuperSensesMissionEngine } from '@/features/theme1/SuperSensesMissionEngine';
import { ThemeShelterHub } from '@/features/theme-shelter/ThemeShelterHub';
import { ShelterMissionEngine } from '@/features/theme-shelter/ShelterMissionEngine';
import { DiscoveryBook } from '@/features/discovery-book/DiscoveryBook';
import { MysteryObjectQuiz } from '@/features/mystery-lab/MysteryObjectQuiz';
import { DevDrawer } from '@/components/dev/DevDrawer';
import { GlobalWordExplainer } from '@/components/dictionary/GlobalWordExplainer';
import { FieldGuideModal } from '@/features/guidebook/FieldGuideModal';
import { TryWithMeEngine } from '@/components/try-with-me/TryWithMeEngine';
import { EnvironmentFXOverlay } from '@/components/effects/EnvironmentFXOverlay';
import { LivePipVoiceSidecar } from '@/components/ai/LivePipVoiceSidecar';

export function App() {
  return (
    <ErrorBoundary>
    <BrowserRouter>
      <div className="min-h-screen relative selection:bg-amber-300 selection:text-slate-950">
        {/* Global Top-of-Page Adaptive Colorful Progress Line */}
        <AdaptiveNavigationProgressBar />
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

          {/* Theme 3 & 5: Shelter, Mountains & Earth (5 Chapters) */}
          <Route path="/theme/water/hub" element={<ThemeWaterHub />} />
          <Route path="/theme/water/chapter/:chapterNum" element={<WaterMissionEngine />} />
          <Route path="/theme/shelter/hub" element={<ThemeShelterHub />} />
          <Route path="/theme/shelter/chapter/:chapterNum" element={<ShelterMissionEngine />} />

          {/* Chapter Hub, Discovery Journal & Mystery Lab */}
          <Route path="/chapter-hub" element={<ChapterHub />} />
          <Route path="/video-lab" element={<VideoLabPage />} />
          <Route path="/teacher-studio" element={<TeacherStudio />} />
          <Route path="/teacher/studio" element={<TeacherStudio />} />
          <Route path="/teacher" element={<TeacherStudio />} />
          <Route path="/discovery-book" element={<DiscoveryBook />} />
          <Route path="/guidebook" element={<DigitalGuidebook />} />
          <Route path="/mystery-lab" element={<MysteryObjectQuiz />} />

                    {/* Dedicated Full-Screen Mascot Chapter Teaching Intros for All 4 Courses */}
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

        {/* Global Interactive Science Storybook & Field Guide */}
        <FieldGuideModal />

        {/* Global "Try It With Me" Limelight Spotlight Engine */}
        <TryWithMeEngine />

        {/* Global Text-Selection Smart Dictionary & Audio Explainer */}
        <GlobalWordExplainer />

        {/* Global Live Gemini AI Voice & Chat Companion Overlay */}
        <LivePipVoiceSidecar />

        {/* Global Full-Screen Interactive Environmental Effects Overlay */}
        <EnvironmentFXOverlay />

        {/* Global Developer Super-Hacks Drawer */}
        <DevDrawer />
      </div>
    </BrowserRouter>
    </ErrorBoundary>
  );
}
