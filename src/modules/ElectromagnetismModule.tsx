import React, { useState } from 'react';
import { EmElectricitySection } from './em/EmElectricitySection';
import { EmMagnetismSection } from './em/EmMagnetismSection';
import { EmMaxwellSection } from './em/EmMaxwellSection';
import { EmQuantumSection } from './em/EmQuantumSection';
import { EmExercisesSection } from './em/EmExercisesSection';

type EmTab = 'electricity' | 'magnetism' | 'maxwell' | 'quantum' | 'exercises';

const EM_TABS: Array<{ id: EmTab; label: string }> = [
  { id: 'electricity', label: 'Electricidad (4.1–4.2)' },
  { id: 'magnetism', label: 'Magnetismo (4.3–4.5)' },
  { id: 'maxwell', label: 'Maxwell (4.6–4.8)' },
  { id: 'quantum', label: 'Átomo y Bohr (4.9–4.12)' },
  { id: 'exercises', label: 'Ejercicios (10)' },
];

export const ElectromagnetismModule: React.FC = () => {
  const [tab, setTab] = useState<EmTab>('electricity');

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-xs font-medium text-slate-500">
          Capítulo 4 · Electromagnetismo (Secciones 4.1 – 4.13)
        </div>

        <div
          className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 self-start lg:self-auto"
          role="tablist"
          aria-label="Secciones de Electromagnetismo"
        >
          {EM_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                tab === item.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'electricity' && <EmElectricitySection />}
      {tab === 'magnetism' && <EmMagnetismSection />}
      {tab === 'maxwell' && <EmMaxwellSection />}
      {tab === 'quantum' && <EmQuantumSection />}
      {tab === 'exercises' && <EmExercisesSection />}
    </section>
  );
};
