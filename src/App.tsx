import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoleSelection } from '@/features/role-selection/RoleSelection';
import { SubjectSelection } from '@/features/subject-selection/SubjectSelection';
import { ParentSetup } from '@/features/parent/ParentSetup';
import { ParentPinGate } from '@/features/parent/ParentPinGate';
import { ParentDashboard } from '@/features/parent/ParentDashboard';
import { ChapterHub } from '@/features/chapter-hub/ChapterHub';
import { ChapterIntro } from '@/features/chapter-intro/ChapterIntro';
import { RaincoatMission } from '@/features/missions/mission-01-raincoat/RaincoatMission';
import { SortingMission } from '@/features/missions/mission-02-sorting/SortingMission';
import { NylonStrengthMission } from '@/features/missions/mission-03-nylon/NylonStrengthMission';
import { FireSafetyMission } from '@/features/missions/mission-04-fire/FireSafetyMission';
import { WireMission } from '@/features/missions/mission-08-wire/WireMission';
import { DynamicMissionEngine } from '@/features/missions/universal-mission/DynamicMissionEngine';
import { DiscoveryBook } from '@/features/discovery-book/DiscoveryBook';
import { MysteryObjectQuiz } from '@/features/mystery-lab/MysteryObjectQuiz';
import { DevDrawer } from '@/components/dev/DevDrawer';
import { GlobalWordExplainer } from '@/components/dictionary/GlobalWordExplainer';
import { FieldGuideModal } from '@/features/guidebook/FieldGuideModal';
import { TryWithMeEngine } from '@/components/try-with-me/TryWithMeEngine';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 relative selection:bg-amber-300 selection:text-slate-950">
        <Routes>
          {/* Entry */}
          <Route path="/" element={<RoleSelection />} />

          {/* Subject Hub */}
          <Route path="/subjects" element={<SubjectSelection />} />

          {/* Parent Portal */}
          <Route path="/parent/setup" element={<ParentSetup />} />
          <Route path="/parent/pin" element={<ParentPinGate />} />
          <Route path="/parent/dashboard" element={<ParentDashboard />} />

          {/* Chapter Hub, Discovery Journal & Mystery Lab */}
          <Route path="/chapter-hub" element={<ChapterHub />} />
          <Route path="/discovery-book" element={<DiscoveryBook />} />
          <Route path="/mystery-lab" element={<MysteryObjectQuiz />} />

          {/* Chapter 3 Missions */}
          <Route path="/chapter/3" element={<ChapterIntro />} />
          <Route path="/chapter/3/mission/1" element={<RaincoatMission />} />
          <Route path="/chapter/3/mission/2" element={<SortingMission />} />
          <Route path="/chapter/3/mission/3" element={<NylonStrengthMission />} />
          <Route path="/chapter/3/mission/4" element={<FireSafetyMission />} />
          <Route path="/chapter/3/mission/8" element={<WireMission />} />
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

        {/* Global Developer Super-Hacks Drawer */}
        <DevDrawer />
      </div>
    </BrowserRouter>
  );
}
