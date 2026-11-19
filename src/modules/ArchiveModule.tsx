import React, { useState } from 'react';
import { BookOpen, Download, ExternalLink } from 'lucide-react';
import { BOOK_CHAPTERS, REPO_FIGURES } from '../data/bookCatalog';
import { FigureAsset } from '../components/FigureAsset';
import { PreliminariesModule } from './PreliminariesModule';
import { RelativityModule } from './RelativityModule';
import { DynamicsModule } from './DynamicsModule';

type BookView = 'index' | 'pdf' | 'figures' | 'ch1' | 'ch2' | 'ch3';

interface ArchiveModuleProps {
  onOpenChapter4: () => void;
}

export const ArchiveModule: React.FC<ArchiveModuleProps> = ({ onOpenChapter4 }) => {
  const [view, setView] = useState<BookView>('index');
  const [chapterFilter, setChapterFilter] = useState<string>('all');

  const chaptersList = Array.from(new Set(REPO_FIGURES.map((f) => f.chapter)));
  const filteredFigures =
    chapterFilter === 'all'
      ? REPO_FIGURES
      : REPO_FIGURES.filter((f) => f.chapter === chapterFilter);

  return (
    <div className="space-y-6">
      {/* Sub-header for Book Explorer */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Archivo del Repositorio · main.tex & main.pdf
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Libro Completo: Fundamentación en Física
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Explora los capítulos 1–3, el documento PDF compilado original y las 24 figuras científicas del repositorio.
          </p>
        </div>

        <div className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 self-start lg:self-auto">
          {[
            { id: 'index', label: 'Índice' },
            { id: 'ch1', label: 'Cap. 1 Preliminares' },
            { id: 'ch2', label: 'Cap. 2 Relatividad' },
            { id: 'ch3', label: 'Cap. 3 Dinámica' },
            { id: 'figures', label: 'Figuras (24)' },
            { id: 'pdf', label: 'PDF Original' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id as BookView)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                view === item.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {view === 'index' && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {BOOK_CHAPTERS.map((chap) => (
            <article
              key={chap.number}
              className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-sky-700">{chap.number}</span>
                  <span className="text-xs text-slate-400 font-mono tabular-nums">
                    {chap.sections.length} secciones
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{chap.title}</h2>
                <p className="text-xs leading-relaxed text-slate-600">{chap.subtitle}</p>
                <ul className="space-y-2 border-t border-slate-100 pt-3">
                  {chap.sections.map((sec) => (
                    <li key={sec.id} className="text-xs text-slate-700">
                      <span className="font-mono font-semibold text-slate-900">{sec.id}</span>{' '}
                      <span className="font-medium">{sec.title}</span>
                      <p className="text-slate-500 mt-0.5">{sec.summary}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                {chap.moduleId === 'electromagnetism' ? (
                  <button
                    type="button"
                    onClick={onOpenChapter4}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 cursor-pointer"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Ir al Capítulo 4 Interactivo
                  </button>
                ) : chap.moduleId === 'preliminaries' ? (
                  <button
                    type="button"
                    onClick={() => setView('ch1')}
                    className="text-xs font-medium text-sky-700 hover:underline cursor-pointer"
                  >
                    Abrir simulador del Capítulo 1 →
                  </button>
                ) : chap.moduleId === 'relativity' ? (
                  <button
                    type="button"
                    onClick={() => setView('ch2')}
                    className="text-xs font-medium text-sky-700 hover:underline cursor-pointer"
                  >
                    Abrir simulador del Capítulo 2 →
                  </button>
                ) : chap.moduleId === 'dynamics' ? (
                  <button
                    type="button"
                    onClick={() => setView('ch3')}
                    className="text-xs font-medium text-sky-700 hover:underline cursor-pointer"
                  >
                    Abrir simulador del Capítulo 3 →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setView('pdf')}
                    className="text-xs font-medium text-sky-700 hover:underline cursor-pointer"
                  >
                    Ver en PDF original →
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {view === 'ch1' && <PreliminariesModule />}
      {view === 'ch2' && <RelativityModule />}
      {view === 'ch3' && <DynamicsModule />}

      {view === 'figures' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setChapterFilter('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium border cursor-pointer ${
                chapterFilter === 'all'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Todas ({REPO_FIGURES.length})
            </button>
            {chaptersList.map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => setChapterFilter(ch)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium border cursor-pointer ${
                  chapterFilter === ch
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFigures.map((fig) => (
              <div
                key={fig.filename}
                className="rounded-xl border border-slate-200 bg-white p-4 space-y-2"
              >
                <div className="text-[11px] font-medium text-slate-500">
                  {fig.chapter}
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{fig.title}</h3>
                <FigureAsset
                  src={`/figures/${fig.filename}`}
                  alt={fig.title}
                  imgClassName="w-full h-44 object-contain"
                />
                <p className="text-xs leading-relaxed text-slate-600">{fig.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'pdf' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Documento Original Compilado (main.pdf)
              </h2>
              <p className="text-xs text-slate-500">
                Libro completo compilado desde main.tex en LaTeX.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/main.pdf"
                download="Fundamentacion_en_Fisica.pdf"
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-800 whitespace-nowrap shrink-0"
              >
                <Download className="h-3.5 w-3.5" />
                Descargar PDF
              </a>
              <a
                href="/main.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Abrir en pestaña
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 h-[720px]">
            <iframe
              src="/main.pdf"
              title="Visor PDF Fundamentación en Física"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};
