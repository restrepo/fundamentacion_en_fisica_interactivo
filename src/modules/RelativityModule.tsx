import React, { useState } from 'react';
import { RelDerivationSection } from './ch2/RelDerivationSection';
import { RelTimeLengthSection } from './ch2/RelTimeLengthSection';
import { RelDopplerDecaySection } from './ch2/RelDopplerDecaySection';
import { RelEnergySection } from './ch2/RelEnergySection';
import { RelExercisesSection } from './ch2/RelExercisesSection';

type RelTab = 'derivation' | 'time_length' | 'doppler_decay' | 'energy' | 'exercises';

const TABS: Array<{ id: RelTab; label: string }> = [
  { id: 'derivation', label: '2.1–2.2 Lorentz y γ' },
  { id: 'time_length', label: '2.3–2.5 Tiempo y Longitud' },
  { id: 'doppler_decay', label: '2.6–2.9 Doppler y Decaimiento' },
  { id: 'energy', label: '2.10–2.12 E = mc² y Minkowski' },
  { id: 'exercises', label: 'Ejercicios (14)' },
];

export const RelativityModule: React.FC = () => {
  const [tab, setTab] = useState<RelTab>('derivation');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <span className="text-xs font-semibold text-slate-700">
          Capítulo 2 · Relatividad Especial
        </span>
        <div
          className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1"
          role="tablist"
          aria-label="Secciones del Capítulo 2"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                tab === t.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'derivation' && <RelDerivationSection />}
      {tab === 'time_length' && <RelTimeLengthSection />}
      {tab === 'doppler_decay' && <RelDopplerDecaySection />}
      {tab === 'energy' && <RelEnergySection />}
      {tab === 'exercises' && <RelExercisesSection />}
    </div>
  );
};
