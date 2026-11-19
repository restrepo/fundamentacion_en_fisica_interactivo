import React from 'react';
import { MathTex } from './MathTex';

interface EquationBoxProps {
  tex: string;
  number?: string;
  label?: string;
  boxed?: boolean;
}

export const EquationBox: React.FC<EquationBoxProps> = ({
  tex,
  number,
  label,
  boxed = false,
}) => {
  return (
    <div
      className={`my-3 flex items-center justify-between gap-4 rounded-lg px-4 py-3 ${
        boxed
          ? 'border border-slate-900 bg-white'
          : 'border border-slate-200 bg-slate-50/70'
      }`}
    >
      <div className="min-w-0 flex-1 overflow-x-auto">
        {label && (
          <div className="mb-1 text-[11px] font-medium text-slate-500">
            {label}
          </div>
        )}
        <MathTex tex={tex} block className="text-sm sm:text-base" />
      </div>
      {number && (
        <span className="shrink-0 font-mono text-xs text-slate-500 tabular-nums">
          ({number})
        </span>
      )}
    </div>
  );
};

interface ExampleBoxProps {
  title?: string;
  children: React.ReactNode;
}

export const ExampleBox: React.FC<ExampleBoxProps> = ({
  title = 'Problema',
  children,
}) => {
  return (
    <div className="rounded-lg border border-slate-900 bg-white p-4 text-sm text-slate-800 leading-relaxed">
      <span className="font-semibold text-slate-900">{title}: </span>
      {children}
    </div>
  );
};

export interface ReasoningRow {
  reasoning: React.ReactNode;
  developmentTex: string;
}

interface ReasoningTableProps {
  caption?: string;
  rows: ReasoningRow[];
}

export const ReasoningTable: React.FC<ReasoningTableProps> = ({ caption, rows }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="px-4 py-2.5 font-semibold text-red-700 w-1/2">
              Razonamiento
            </th>
            <th className="px-4 py-2.5 font-semibold text-red-700 w-1/2">
              Desarrollo
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((row, idx) => (
            <tr key={idx} className="align-middle hover:bg-slate-50/60">
              <td className="px-4 py-3 text-slate-700 leading-relaxed">
                {row.reasoning}
              </td>
              <td className="px-4 py-3">
                <MathTex tex={row.developmentTex} block className="text-xs sm:text-sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {caption && (
        <div className="border-t border-slate-200 bg-slate-50/60 px-4 py-2 text-xs text-slate-500">
          {caption}
        </div>
      )}
    </div>
  );
};

interface HistoricalCapsuleProps {
  title: string;
  children: React.ReactNode;
}

export const HistoricalCapsule: React.FC<HistoricalCapsuleProps> = ({ title, children }) => {
  return (
    <aside className="rounded-xl border border-sky-200 bg-sky-50/40 overflow-hidden">
      <div className="border-b border-sky-200 bg-sky-100/60 px-5 py-3">
        <h3 className="text-sm font-semibold text-sky-950">{title}</h3>
      </div>
      <div className="p-5 text-sm leading-relaxed text-slate-700 space-y-3">
        {children}
      </div>
    </aside>
  );
};
