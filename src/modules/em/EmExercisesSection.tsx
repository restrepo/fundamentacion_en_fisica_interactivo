import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import { MathTex } from '../../components/MathTex';

interface Chapter4Exercise {
  id: number;
  title: string;
  statement: React.ReactNode;
  unit: string;
  expectedValue: number;
  tolerance: number;
  hintTex: string;
  solutionTex: string;
  answerLabel: string;
}

const CHAPTER_4_EXERCISES: Chapter4Exercise[] = [
  {
    id: 1,
    title: 'Ley de Coulomb y Superposición',
    statement: (
      <>
        Dos cargas puntuales, <MathTex tex="q_1 = +4.0\,\mu\text{C}" /> y <MathTex tex="q_2 = +9.0\,\mu\text{C}" />, están fijas y separadas por una distancia <MathTex tex="d = 10\text{ cm}" />. ¿A qué distancia exacta <MathTex tex="x" /> de <MathTex tex="q_1" /> debe colocarse una tercera carga <MathTex tex="q_3" /> para que la fuerza eléctrica neta sea cero?
      </>
    ),
    unit: 'cm',
    expectedValue: 4.0,
    tolerance: 0.15,
    hintTex: '\\frac{k q_1 q_3}{x^2} = \\frac{k q_2 q_3}{(d - x)^2}',
    solutionTex: '\\frac{4}{x^2} = \\frac{9}{(10-x)^2} \\implies \\frac{2}{x} = \\frac{3}{10-x} \\implies 20 - 2x = 3x \\implies x = 4.0\\text{ cm}',
    answerLabel: 'x = 4.0 cm',
  },
  {
    id: 2,
    title: 'Energía Potencial Electrostática Nuclear',
    statement: (
      <>
        En el núcleo de helio existen dos protones (<MathTex tex="e = 1.6 \times 10^{-19}\text{ C}" />) separados por <MathTex tex="r = 2.0 \times 10^{-15}\text{ m}" />. Calcule la energía potencial electrostática <MathTex tex="U_e" /> en <strong>MeV</strong>.
      </>
    ),
    unit: 'MeV',
    expectedValue: 0.72,
    tolerance: 0.04,
    hintTex: 'U_e = k\\frac{e^2}{r}, \\quad 1\\text{ MeV} = 1.602 \\times 10^{-13}\\text{ J}',
    solutionTex: 'U_e = \\frac{(8.99\\times 10^9)(1.6\\times 10^{-19})^2}{2.0\\times 10^{-15}} \\approx 1.15\\times 10^{-13}\\text{ J} \\approx 0.72\\text{ MeV}',
    answerLabel: 'U_e ≈ 0.72 MeV (1.15 × 10⁻¹³ J)',
  },
  {
    id: 3,
    title: 'Potencia y Consumo de Energía',
    statement: (
      <>
        Un calentador eléctrico se conecta a <MathTex tex="120\text{ V}" /> y extrae <MathTex tex="15\text{ A}" /> durante <MathTex tex="4\text{ horas}" /> diarias por <MathTex tex="30\text{ días}" />. Calcule la energía total consumida en <strong>kWh</strong> (potencia = 1800 W).
      </>
    ),
    unit: 'kWh',
    expectedValue: 216,
    tolerance: 2,
    hintTex: 'P = V I, \\quad E = P \\cdot t',
    solutionTex: 'P = (120\\text{ V})(15\\text{ A}) = 1800\\text{ W} = 1.8\\text{ kW}. \\quad E = (1.8\\text{ kW})(4 \\times 30\\text{ h}) = 216\\text{ kWh}',
    answerLabel: 'P = 1800 W · E = 216 kWh',
  },
  {
    id: 4,
    title: 'Ley de Ampère (Alambre Recto)',
    statement: (
      <>
        Un cable recto de alta tensión transporta <MathTex tex="I = 500\text{ A}" />. Calcule la magnitud del campo magnético <MathTex tex="B" /> en el suelo a <MathTex tex="r = 10\text{ m}" /> debajo del cable, en <strong>microteslas (μT)</strong>.
      </>
    ),
    unit: 'μT',
    expectedValue: 10,
    tolerance: 0.4,
    hintTex: 'B = \\frac{\\mu_0 I}{2\\pi r}',
    solutionTex: 'B = \\frac{(4\\pi \\times 10^{-7})(500)}{2\\pi (10)} = 1.0 \\times 10^{-5}\\text{ T} = 10\\,\\mu\\text{T}',
    answerLabel: 'B = 10 μT (cinco veces menor que el campo terrestre)',
  },
  {
    id: 5,
    title: 'Diseño de un Solenoide',
    statement: (
      <>
        Un solenoide de longitud <MathTex tex="L = 0.5\text{ m}" /> debe generar <MathTex tex="B = 0.02\text{ T}" /> con una corriente máxima de <MathTex tex="I = 5.0\text{ A}" />. ¿Cuántas espiras <MathTex tex="N" /> se requieren?
      </>
    ),
    unit: 'espiras',
    expectedValue: 1591,
    tolerance: 20,
    hintTex: 'B = \\frac{\\mu_0 N I}{L} \\implies N = \\frac{B L}{\\mu_0 I}',
    solutionTex: 'N = \\frac{(0.02)(0.5)}{(1.257\\times 10^{-6})(5.0)} \\approx 1591\\text{ espiras}',
    answerLabel: 'N ≈ 1591 espiras',
  },
  {
    id: 6,
    title: 'Fuerza de Lorentz (Motor Eléctrico)',
    statement: (
      <>
        Un alambre de <MathTex tex="L = 0.2\text{ m}" /> con <MathTex tex="I = 3.0\text{ A}" /> perpendicular (<MathTex tex="\theta = 90^\circ" />) a un campo magnético experimenta <MathTex tex="F = 1.5\text{ N}" />. Calcule la intensidad del campo <MathTex tex="B" /> en <strong>T</strong>.
      </>
    ),
    unit: 'T',
    expectedValue: 2.5,
    tolerance: 0.05,
    hintTex: 'F = L I B \\sin 90^\\circ',
    solutionTex: 'B = \\frac{F}{L I} = \\frac{1.5}{(0.2)(3.0)} = 2.5\\text{ T}',
    answerLabel: 'B = 2.5 T',
  },
  {
    id: 7,
    title: 'El Aporte de Maxwell (Corriente de Desplazamiento)',
    statement: (
      <>
        Un condensador de área <MathTex tex="A = 0.1\text{ m}^2" /> tiene un campo eléctrico aumentando a <MathTex tex="\Delta E / \Delta t = 1.0 \times 10^6\text{ V/(m}\cdot\text{s)}" />. Calcule <MathTex tex="I_d" /> en <strong>μA</strong> (microamperios).
      </>
    ),
    unit: 'μA',
    expectedValue: 0.885,
    tolerance: 0.03,
    hintTex: 'I_d = \\epsilon_0 A \\frac{\\Delta E}{\\Delta t}',
    solutionTex: 'I_d = (8.85\\times 10^{-12})(0.1)(1.0\\times 10^6) = 8.85\\times 10^{-7}\\text{ A} = 0.885\\,\\mu\\text{A}',
    answerLabel: 'I_d ≈ 8.85 × 10⁻⁷ A (0.885 μA)',
  },
  {
    id: 8,
    title: 'Ondas Electromagnéticas y Antenas (Wi-Fi)',
    statement: (
      <>
        Un enrutador Wi-Fi transmite a <MathTex tex="f = 2.4\text{ GHz}" />. Calcule la longitud óptima de su antena de cuarto de onda (<MathTex tex="\lambda / 4" />) en <strong>cm</strong>.
      </>
    ),
    unit: 'cm',
    expectedValue: 3.125,
    tolerance: 0.08,
    hintTex: '\\lambda = \\frac{c}{f}, \\quad L_{\\text{antena}} = \\frac{\\lambda}{4}',
    solutionTex: '\\lambda = \\frac{3\\times 10^8}{2.4\\times 10^9} = 0.125\\text{ m} = 12.5\\text{ cm} \\implies \\frac{\\lambda}{4} = 3.125\\text{ cm}',
    answerLabel: 'λ = 12.5 cm · Antena λ/4 = 3.125 cm',
  },
  {
    id: 9,
    title: 'Radiación de Sincrotrón',
    statement: (
      <>
        En un colisionador de radio <MathTex tex="R = 1000\text{ m}" />, los electrones viajan con energía <MathTex tex="E = 50\text{ GeV}" />. Usando <MathTex tex="\Delta E \approx 8.85 \times 10^{-5} E^4 / R" />, calcule la energía perdida por vuelta en <strong>GeV</strong>.
      </>
    ),
    unit: 'GeV',
    expectedValue: 0.553,
    tolerance: 0.02,
    hintTex: '\\Delta E = 8.85 \\times 10^{-5} \\frac{(50)^4}{1000}',
    solutionTex: '\\Delta E = 8.85\\times 10^{-5} \\frac{6.25\\times 10^6}{1000} \\approx 0.553\\text{ GeV/vuelta}',
    answerLabel: 'ΔE ≈ 0.553 GeV por vuelta',
  },
  {
    id: 10,
    title: 'El Átomo de Bohr (Línea Hα de Balmer)',
    statement: (
      <>
        El electrón del hidrógeno salta de <MathTex tex="n = 3" /> a <MathTex tex="n = 2" /> emitiendo la línea roja <MathTex tex="H_\alpha" />. Usando <MathTex tex="E_n = -13.6\text{ eV}/n^2" />, calcule la energía del fotón emitido <MathTex tex="\Delta E" /> en <strong>eV</strong>.
      </>
    ),
    unit: 'eV',
    expectedValue: 1.89,
    tolerance: 0.05,
    hintTex: '\\Delta E = E_3 - E_2 = -13.6\\left(\\frac{1}{9} - \\frac{1}{4}\\right)',
    solutionTex: 'E_3 = -1.51\\text{ eV}, \\; E_2 = -3.40\\text{ eV} \\implies \\Delta E = 1.89\\text{ eV}',
    answerLabel: 'ΔE ≈ 1.89 eV',
  },
];

export const EmExercisesSection: React.FC = () => {
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, 'correct' | 'incorrect' | null>>({});
  const [openSolutions, setOpenSolutions] = useState<Record<number, boolean>>({});

  const checkAnswer = (ex: Chapter4Exercise) => {
    const raw = (inputs[ex.id] || '').replace(',', '.').trim();
    const val = parseFloat(raw);
    if (Number.isNaN(val)) {
      setChecked((prev) => ({ ...prev, [ex.id]: 'incorrect' }));
      return;
    }
    const ok = Math.abs(val - ex.expectedValue) <= ex.tolerance;
    setChecked((prev) => ({ ...prev, [ex.id]: ok ? 'correct' : 'incorrect' }));
  };

  const toggleSolution = (id: number) => {
    setOpenSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const correctCount = Object.values(checked).filter((v) => v === 'correct').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Capítulo 4 · Sección 4.13
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Ejercicios Propuestos del Capítulo 4
          </h1>
          <p className="mt-1.5 max-w-3xl text-sm text-slate-600">
            Los 10 problemas de práctica de <code>main.tex</code> con verificador numérico interactivo y desarrollo algebraico completo en LaTeX.
          </p>
        </div>
        <div className="text-xs font-mono font-semibold text-slate-700 tabular-nums shrink-0">
          Resueltos: {correctCount} / {CHAPTER_4_EXERCISES.length}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {CHAPTER_4_EXERCISES.map((ex) => {
          const status = checked[ex.id];
          const isOpen = !!openSolutions[ex.id];

          return (
            <article
              key={ex.id}
              className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-sm font-semibold text-slate-900">
                    {ex.id}. {ex.title}
                  </h2>
                  {status === 'correct' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0">
                      <CheckCircle2 className="h-4 w-4" /> Correcto
                    </span>
                  )}
                  {status === 'incorrect' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 shrink-0">
                      <XCircle className="h-4 w-4" /> Revisa el cálculo
                    </span>
                  )}
                </div>

                <p className="text-sm leading-relaxed text-slate-700">{ex.statement}</p>
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 focus-within:border-sky-600">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder={`Respuesta (${ex.unit})`}
                      value={inputs[ex.id] || ''}
                      onChange={(e) =>
                        setInputs((prev) => ({ ...prev, [ex.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') checkAnswer(ex);
                      }}
                      className="w-32 text-xs font-mono text-slate-900 outline-none tabular-nums"
                      aria-label={`Respuesta ejercicio ${ex.id} en ${ex.unit}`}
                    />
                    <span className="text-xs font-mono text-slate-500">{ex.unit}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => checkAnswer(ex)}
                    className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Comprobar
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSolution(ex.id)}
                    className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {isOpen ? (
                      <>
                        <ChevronUp className="h-3.5 w-3.5" /> Ocultar solución
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3.5 w-3.5" /> Ver solución LaTeX
                      </>
                    )}
                  </button>
                </div>

                {isOpen && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2 text-xs">
                    <div className="text-slate-500 font-medium">Fórmula clave:</div>
                    <MathTex tex={ex.hintTex} block className="text-xs" />
                    <div className="text-slate-500 font-medium pt-1">Desarrollo:</div>
                    <MathTex tex={ex.solutionTex} block className="text-xs" />
                    <div className="font-mono font-semibold text-emerald-800 pt-1">
                      Resultado: {ex.answerLabel}
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
