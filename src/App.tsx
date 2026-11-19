import React, { useState } from 'react';
import { Download, MessageSquare, Sparkles } from 'lucide-react';
import { PreliminariesModule } from './modules/PreliminariesModule';
import { RelativityModule } from './modules/RelativityModule';
import { DynamicsModule } from './modules/DynamicsModule';
import { ElectromagnetismModule } from './modules/ElectromagnetismModule';
import { ArchiveModule } from './modules/ArchiveModule';
import {
  HARD_CONCEPTS_BY_CHAPTER,
  PhysicsChatbotDrawer,
  type ChapterKey,
} from './components/PhysicsChatbotDrawer';

type TopSection = ChapterKey;

const NAV_ITEMS: Array<{ id: TopSection; label: string }> = [
  { id: 'ch1', label: 'Cap. 1 Preliminares' },
  { id: 'ch2', label: 'Cap. 2 Relatividad' },
  { id: 'ch3', label: 'Cap. 3 Dinámica' },
  { id: 'ch4', label: 'Cap. 4 Electromagnetismo' },
  { id: 'book', label: 'Libro y Figuras' },
];

export const App: React.FC = () => {
  const [section, setSection] = useState<TopSection>('ch1');
  const [tutorOpen, setTutorOpen] = useState<boolean>(false);
  const [queuedQuestion, setQueuedQuestion] = useState<string | null>(null);

  const askTutorConcept = (question: string) => {
    setQueuedQuestion(question);
    setTutorOpen(true);
  };

  const chapterConcepts = HARD_CONCEPTS_BY_CHAPTER[section];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-10">
          {/* Zone 1: Single text element Brand wordmark */}
          <button
            type="button"
            onClick={() => setSection('ch1')}
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Fundamentación en Física
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            className="hidden md:flex items-center gap-6 text-sm font-medium"
            aria-label="Capítulos del libro"
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
            <a
              href="/main.pdf"
              download="Fundamentacion_en_Fisica.pdf"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Descargar PDF
            </a>
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
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8 space-y-6">
        {/* Contextual Concept Tutor Strip */}
        <div className="flex flex-col gap-3 rounded-xl border border-sky-200 bg-sky-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-900 shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-sky-600" aria-hidden="true" />
              Conceptos difíciles ({chapterConcepts.title}):
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {chapterConcepts.prompts.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => askTutorConcept(item.question)}
                  className="rounded-md border border-sky-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-sky-400 hover:text-sky-900 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setTutorOpen(true)}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-sky-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
            Abrir Tutor de Conceptos
          </button>
        </div>

        {section === 'ch1' && <PreliminariesModule />}
        {section === 'ch2' && <RelativityModule />}
        {section === 'ch3' && <DynamicsModule />}
        {section === 'ch4' && <ElectromagnetismModule />}
        {section === 'book' && (
          <ArchiveModule onOpenChapter={(chap) => setSection(chap)} />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <span>
            Fundamentación en Física · Capítulos 1–4 interactivos (desde main.tex)
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
              Índice y Figuras
            </button>
            <button
              type="button"
              onClick={() => setTutorOpen(true)}
              className="font-medium text-sky-700 hover:text-sky-900 hover:underline cursor-pointer"
            >
              Tutor de Conceptos
            </button>
          </div>
        </div>
      </footer>

      <PhysicsChatbotDrawer
        open={tutorOpen}
        onOpenChange={setTutorOpen}
        activeChapter={section}
        queuedQuestion={queuedQuestion}
        onConsumeQueuedQuestion={() => setQueuedQuestion(null)}
      />
    </div>
  );
};

export default App;
