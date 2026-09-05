import React from 'react';
import {
  Sparkles,
  Box,
  GraduationCap,
  Target,
  ShieldCheck,
} from 'lucide-react';

export const FeatureStrip: React.FC = () => {
  const features = [
    {
      id: 'ai-guidance',
      title: 'AI-Powered Guidance',
      subtitle: 'Socratic inquiry with Pip',
      icon: Sparkles,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50/80 border-blue-200/60',
    },
    {
      id: '3d-labs',
      title: 'Interactive 3D Labs',
      subtitle: 'Real-time physics engines',
      icon: Box,
      iconColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50/80 border-cyan-200/60',
    },
    {
      id: 'curriculum',
      title: 'Curriculum Aligned',
      subtitle: 'NCERT & Next-Gen STEM',
      icon: GraduationCap,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/80 border-emerald-200/60',
    },
    {
      id: 'grades',
      title: 'Grades 4–8',
      subtitle: 'Tailored cognitive levels',
      icon: Target,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50/80 border-amber-200/60',
    },
    {
      id: 'safe',
      title: 'Safe & Ad-Free',
      subtitle: '100% private sandbox',
      icon: ShieldCheck,
      iconColor: 'text-slate-700',
      bgColor: 'bg-slate-100/80 border-slate-200/60',
    },
  ];

  return (
    <section className="w-full py-4 border-y border-slate-200/90 bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-6 items-stretch">
          {features.map((f, index) => {
            const Icon = f.icon;
            const isLastOdd = index === features.length - 1 && features.length % 2 !== 0;
            return (
              <div
                key={f.id}
                className={`flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-2xl transition-all hover:bg-white hover:shadow-sm border border-slate-200/60 bg-white/50 ${
                  isLastOdd ? 'col-span-2 md:col-span-1 justify-center sm:justify-start' : ''
                }`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shrink-0 ${f.bgColor} ${f.iconColor}`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                </div>
                <div className="text-left min-w-0">
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900 block truncate">
                    {f.title}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">
                    {f.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
