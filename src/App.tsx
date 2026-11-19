import React, { useState } from 'react';
import { EmElectricitySection } from './modules/em/EmElectricitySection';
import { EmMagnetismSection } from './modules/em/EmMagnetismSection';
import { EmMaxwellSection } from './modules/em/EmMaxwellSection';
import { EmQuantumSection } from './modules/em/EmQuantumSection';
import { EmExercisesSection } from './modules/em/EmExercisesSection';
import { ArchiveModule } from './modules/ArchiveModule';

type AppSection =
  | 'electricity'
  | 'magnetism'
  | 'maxwell'
  | 'quantum'
  | 'exercises'
  | 'book';

const NAV_ITEMS: Array<{ id: Exclude<AppSection, 'book'>; label: string }> = [
  { id: 'electricity', label: 'Electricidad' },
  { id: 'magnetism', label: 'Magnetismo' },
  { id: 'maxwell', label: 'Maxwell' },
  { id: 'quantum', label: 'Átomo y Bohr' },
  { id: 'exercises', label: 'Ejercicios' },
];

export const App: React.FC = () => {
  const [section, setSection] = useState<AppSection>('electricity');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-10">
          {/* Zone 1: Single text element Brand wordmark */}
          <button
            type="button"
            onClick={() => setSection('electricity')}
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Capítulo 4 · Electromagnetismo
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            className="hidden md:flex items-center gap-6 text-sm font-medium"
            aria-label="Secciones del Capítulo 4"
          >
            {NAV_ITEMS.map((item) => {
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                    active
                      ? 'border-sky-600 text-slate-900 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setSection((prev) => (prev === 'book' ? 'electricity' : 'book'))}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                section === 'book'
                  ? 'bg-sky-700 text-white hover:bg-sky-800'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {section === 'book' ? 'Volver al Cap. 4' : 'Libro Completo'}
            </button>
          </div>
        </div>

        {/* Mobile navigation row */}
        <div className="flex md:hidden items-center gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2">
          {NAV_ITEMS.map((item) => {
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        {section === 'electricity' && <EmElectricitySection />}
        {section === 'magnetism' && <EmMagnetismSection />}
        {section === 'maxwell' && <EmMaxwellSection />}
        {section === 'quantum' && <EmQuantumSection />}
        {section === 'exercises' && <EmExercisesSection />}
        {section === 'book' && (
          <ArchiveModule onOpenChapter4={() => setSection('electricity')} />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <span>
            Fundamentación en Física · Capítulo 4: Electromagnetismo (desde main.tex)
          </span>
          <div className="flex items-center gap-4">
            <a
              href="/main.pdf"
              download="Fundamentacion_en_Fisica.pdf"
              className="font-medium text-slate-700 hover:text-slate-900 hover:underline"
            >
              Descargar libro PDF
            </a>
            <button
              type="button"
              onClick={() => setSection('book')}
              className="font-medium text-slate-700 hover:text-slate-900 hover:underline cursor-pointer"
            >
              Explorar Capítulos 1–3 y Figuras
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
