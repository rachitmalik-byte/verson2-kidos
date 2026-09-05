import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';
import { sounds } from '@/lib/sounds';

import electromagnetImg from '@/assets/images/landing/electromagnet_coil_3d.jpg';
import molecularImg from '@/assets/images/landing/molecular_structure_3d.jpg';
import biologicalCellImg from '@/assets/images/landing/biological_cell_3d.jpg';
import volcanoImg from '@/assets/images/landing/volcano_lab_loading.jpg';
import planetImg from '@/assets/images/landing/planet_celestial_3d.jpg';
import biodomeImg from '@/assets/images/landing/ecosystem_biodome_3d.jpg';

export const ScienceLabExploration: React.FC = () => {
  const navigate = useNavigate();

  const disciplines = [
    {
      id: 'physics',
      name: 'Physics',
      concept: 'Electromagnet & Magnetic Flux',
      description: 'Test how coiled copper wire creates electromagnetic fields and powers electric motors.',
      image: electromagnetImg,
      badge: 'DISCIPLINE 01',
      accent: 'border-blue-300 hover:border-blue-500 shadow-blue-500/5',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
      route: '/theme/shelter/hub',
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      concept: 'Molecular Lattices & Polymers',
      description: 'Explore covalent bonding, crystal matrix geometry, and synthetic materials.',
      image: molecularImg,
      badge: 'DISCIPLINE 02',
      accent: 'border-amber-300 hover:border-amber-500 shadow-amber-500/5',
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200',
      route: '/chapter-hub',
    },
    {
      id: 'biology',
      name: 'Biology',
      concept: 'Cellular Structures & Organelles',
      description: 'Dissect eukaryotic cells, mitochondria energy transfer, and living biomimicry.',
      image: biologicalCellImg,
      badge: 'DISCIPLINE 03',
      accent: 'border-emerald-300 hover:border-emerald-500 shadow-emerald-500/5',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      route: '/theme/1/hub',
    },
    {
      id: 'earth-science',
      name: 'Earth Science',
      concept: 'Magma Chambers & Tectonic Plates',
      description: 'Simulate subsurface lava flows, viscosity barriers, and earthquake wave physics.',
      image: volcanoImg,
      badge: 'DISCIPLINE 04',
      accent: 'border-orange-300 hover:border-orange-500 shadow-orange-500/5',
      tagColor: 'bg-orange-50 text-orange-800 border-orange-200',
      route: '/theme/shelter/hub',
    },
    {
      id: 'space',
      name: 'Space',
      concept: 'Planetary Orbits & Kepler Laws',
      description: 'Navigate celestial gravity wells, orbital resonance, and atmosphere retention.',
      image: planetImg,
      badge: 'DISCIPLINE 05',
      accent: 'border-cyan-300 hover:border-cyan-500 shadow-cyan-500/5',
      tagColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      route: '/theme/water/hub',
    },
    {
      id: 'environment',
      name: 'Environment',
      concept: 'Microclimates & Closed Ecosystems',
      description: 'Balance miniature biodome cycles, water condensation, and carbon sequestration.',
      image: biodomeImg,
      badge: 'DISCIPLINE 06',
      accent: 'border-teal-300 hover:border-teal-500 shadow-teal-500/5',
      tagColor: 'bg-teal-50 text-teal-800 border-teal-200',
      route: '/theme/1/hub',
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-slate-50/50 border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 text-left gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-bold tracking-widest uppercase mb-3 shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>EXPLORE THE SCIENCE LAB</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight">
              Six Core Scientific Fields
            </h2>
            <p className="text-base text-slate-600 font-medium mt-2 max-w-xl">
              Each discipline features custom 3D apparatus, interactive mathematical sandboxes, and guided experiments.
            </p>
          </div>

          <button
            onClick={() => {
              sounds.pop();
              navigate('/subjects');
            }}
            className="w-fit px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300/80 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <span>View All Curriculum Units</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Science Areas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {disciplines.map((d) => (
            <div
              key={d.id}
              onClick={() => {
                sounds.sparkle();
                navigate(d.route);
              }}
              className={`bg-white rounded-3xl border-2 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer group flex flex-col justify-between ${d.accent}`}
            >
              <div>
                {/* 3D Visual Exhibit Frame */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 mb-5 border border-slate-200/80 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                  <img
                    src={d.image}
                    alt={d.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-md border ${d.tagColor} shadow-2xs`}>
                      {d.badge}
                    </span>
                  </div>
                </div>

                {/* Heading and Concept */}
                <div className="text-left mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 block mb-1">
                    {d.name}
                  </span>
                  <h3 className="text-xl font-display font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    {d.concept}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-2">
                    {d.description}
                  </p>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                <span>Enter Laboratory</span>
                <span className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
