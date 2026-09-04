import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, ShieldCheck, Presentation, Sparkles, CheckCircle2 } from 'lucide-react';
import { sounds } from '@/lib/sounds';

export const RoleEntrySection: React.FC = () => {
  const navigate = useNavigate();

  const paths = [
    {
      id: 'student',
      role: 'YOUNG SCIENTIST',
      badge: 'EXPLORER PORTAL • AGES 9–14',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      accentGradient: 'from-blue-600 to-cyan-600',
      icon: Compass,
      description: 'Complete quests, run virtual experiments and earn discovery badges.',
      features: ['Hands-on 3D Lab Chambers', 'Socratic AI Voice Coach', 'Interactive Science Journal'],
      buttonText: 'Enter Science Quests →',
      route: '/subjects',
      isPrimary: true,
    },
    {
      id: 'parent',
      role: 'PARENT',
      badge: 'FAMILY CO-PILOT • CURRICULUM SYNC',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      accentGradient: 'from-emerald-600 to-teal-600',
      icon: ShieldCheck,
      description: 'Follow progress, support learning and discover experiments to try together.',
      features: ['Real-Time Mastery Insights', 'Screen-Time Controls', 'Kitchen Science Guides'],
      buttonText: 'Open Parent Zone →',
      route: '/parent/dashboard',
      isPrimary: false,
    },
    {
      id: 'teacher',
      role: 'TEACHER',
      badge: 'EDUCATOR STUDIO • CLASSROOM SUITE',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      accentGradient: 'from-indigo-600 to-purple-600',
      icon: Presentation,
      description: 'Create lessons, assign activities and track student progress.',
      features: ['1-Click Lesson Worksheets', 'Live Class Diagnostic Grid', 'Curriculum Standard Maps'],
      buttonText: 'Launch Teacher Studio →',
      route: '/teacher-studio',
      isPrimary: false,
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-bold tracking-widest uppercase mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>CHOOSE YOUR PATH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight">
            Tailored Experiences for Every Learner
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mt-3">
            Whether you are exploring independently, supporting your child, or leading a classroom.
          </p>
        </div>

        {/* 3 Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {paths.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1.5 ${
                  p.isPrimary
                    ? 'bg-gradient-to-b from-white to-blue-50/40 border-2 border-blue-400/80 shadow-xl shadow-blue-500/10'
                    : 'bg-white border-2 border-slate-200/90 hover:border-slate-300 shadow-md hover:shadow-xl'
                }`}
              >
                {/* Top Portal Details */}
                <div>
                  {/* Category Pill */}
                  <div className="flex items-center justify-between mb-6">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight mb-3">
                    {p.role}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
                    {p.description}
                  </p>

                  {/* Key Highlights */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-100 mb-8">
                    {p.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Portal Launch Action */}
                <button
                  onClick={() => {
                    sounds.success();
                    navigate(p.route);
                  }}
                  className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98 ${
                    p.isPrimary
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>{p.buttonText}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
