import React, { useState } from 'react';
import { DynNewtonNumericalSection } from './ch3/DynNewtonNumericalSection';
import { DynWorkEnergySection } from './ch3/DynWorkEnergySection';
import { DynMomentumForcesSection } from './ch3/DynMomentumForcesSection';
import { DynGravityKeplerSection } from './ch3/DynGravityKeplerSection';
import { DynExercisesSection } from './ch3/DynExercisesSection';

type DynTab = 'newton_num' | 'work_energy' | 'momentum_forces' | 'gravity_kepler' | 'exercises';

const TABS: Array<{ id: DynTab; label: string }> = [
  { id: 'newton_num', label: '3.1–3.3 Newton y Euler-Cromer' },
  { id: 'work_energy', label: '3.4–3.5 Trabajo y Energía' },
  { id: 'momentum_forces', label: '3.6–3.9 Momento y Fuerzas' },
  { id: 'gravity_kepler', label: '3.10–3.13 Gravedad y Kepler' },
  { id: 'exercises', label: 'Ejercicios (12)' },
];

export const DynamicsModule: React.FC = () => {
  const [tab, setTab] = useState<DynTab>('newton_num');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <span className="text-xs font-semibold text-slate-700">
          Capítulo 3 · Dinámica Newtoniana y Gravitación
        </span>
        <div
          className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1"
          role="tablist"
          aria-label="Secciones del Capítulo 3"
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

      {tab === 'newton_num' && <DynNewtonNumericalSection />}
      {tab === 'work_energy' && <DynWorkEnergySection />}
      {tab === 'momentum_forces' && <DynMomentumForcesSection />}
      {tab === 'gravity_kepler' && <DynGravityKeplerSection />}
      {tab === 'exercises' && <DynExercisesSection />}
    </div>
  );
};
