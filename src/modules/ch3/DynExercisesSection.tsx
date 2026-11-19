import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import { MathTex } from '../../components/MathTex';

interface Ch3Exercise {
  id: number;
  tag: string;
  title: string;
  statement: React.ReactNode;
  unit?: string;
  expectedValue?: number;
  tolerance?: number;
  mcqOptions?: string[];
  correctMcqIndex?: number;
  hintTex: string;
  solutionTex: string;
  answerLabel: string;
}

const CHAPTER_3_EXERCISES: Ch3Exercise[] = [
  {
    id: 1,
    tag: 'Conceptual · Barcos',
    title: 'Los Dos Proyectiles sobre Barcos',
    statement: (
      <>
        Desde un acantilado a nivel del mar se disparan dos proyectiles idénticos A y B. El proyectil A alcanza una altura máxima de <MathTex tex="H" /> y el proyectil B alcanza una altura máxima de <MathTex tex="4H" />. ¿Cuál tarda más en caer y hace blanco en el barco B?
      </>
    ),
    mcqOptions: ['Proyectil A (menor altura)', 'Proyectil B (t_vuelo = √(8H/g))', 'Ambos tardan exactamente lo mismo'],
    correctMcqIndex: 1,
    hintTex: 't_{\\text{vuelo}} = \\sqrt{\\frac{8 y_{\\max}}{g}}',
    solutionTex: 't_A = \\sqrt{\\frac{8H}{g}}, \\qquad t_B = \\sqrt{\\frac{8(4H)}{g}} = 2t_A \\implies \\text{Barco B tarda el doble.}',
    answerLabel: 'Proyectil B (el tiempo de vuelo se duplica)',
  },
  {
    id: 2,
    tag: 'Conceptual · Gravedad',
    title: '¿Cuánto Cae la Tierra hacia la Pelota?',
    statement: (
      <>
        Si sueltas una pelota de <MathTex tex="1.0\text{ kg}" /> desde <MathTex tex="100\text{ m}" /> de altura (<MathTex tex="M_\oplus = 5.97\times 10^{24}\text{ kg}" />), la Tierra también acelera hacia la pelota por la Tercera Ley de Newton. ¿Cuál es la magnitud de la aceleración <MathTex tex="a_\oplus" /> de la Tierra?
      </>
    ),
    conceptual: false,
    unit: '× 10⁻²⁴ m/s²',
    expectedValue: 1.64,
    tolerance: 0.1,
    hintTex: 'a_\\oplus = \\frac{mg}{M_\\oplus} = \\frac{9.81}{5.97\\times 10^{24}}',
    solutionTex: 'a_\\oplus \\approx 1.64\\times 10^{-24}\\text{ m/s}^2, \\qquad d_\\oplus = \\frac{100\\text{ m}}{M_\\oplus} \\approx 1.67\\times 10^{-23}\\text{ m}',
    answerLabel: 'a_⊕ = 1.64×10⁻²⁴ m/s² · d_⊕ = 1.67×10⁻²³ m',
  } as Ch3Exercise,
  {
    id: 3,
    tag: 'Problema 1',
    title: 'Trabajo y Aceleración de un Automóvil',
    statement: (
      <>
        Un automóvil de <MathTex tex="1200\text{ kg}" /> acelera uniformemente desde el reposo hasta <MathTex tex="25\text{ m/s}" /> en <MathTex tex="10\text{ s}" />. Calcule el trabajo neto realizado sobre el automóvil en <strong>kJ</strong>.
      </>
    ),
    unit: 'kJ',
    expectedValue: 375,
    tolerance: 3,
    hintTex: 'W = \\Delta K = \\frac{1}{2}m v_f^2',
    solutionTex: 'a = 2.5\\text{ m/s}^2, \\; F = 3000\\text{ N}, \\; \\Delta x = 125\\text{ m}, \\; W = \\frac{1}{2}(1200)(25^2) = 375\\text{ kJ}',
    answerLabel: '375 kJ (a = 2.5 m/s², F = 3000 N)',
  },
  {
    id: 4,
    tag: 'Problema 2',
    title: 'Piedra Lanzada desde un Acantilado',
    statement: (
      <>
        Se deja caer una piedra desde un acantilado de <MathTex tex="50\text{ m}" /> de altura (<MathTex tex="g = 9.8\text{ m/s}^2" />). ¿Con qué rapidez <MathTex tex="v_f" /> llega al suelo?
      </>
    ),
    unit: 'm/s',
    expectedValue: 31.3,
    tolerance: 0.4,
    hintTex: 'v_f = \\sqrt{2gh}',
    solutionTex: 'v_f = \\sqrt{2(9.8)(50)} = \\sqrt{980} \\approx 31.3\\text{ m/s}',
    answerLabel: '31.3 m/s',
  },
  {
    id: 5,
    tag: 'Problema 3',
    title: 'Tiro Parabólico de Balón de Fútbol',
    statement: (
      <>
        Un balón es pateado a <MathTex tex="v_0 = 20\text{ m/s}" /> con ángulo de <MathTex tex="45^\circ" /> (<MathTex tex="g = 9.8\text{ m/s}^2" />). Calcule su alcance horizontal máximo <MathTex tex="R" /> en metros.
      </>
    ),
    unit: 'm',
    expectedValue: 40.8,
    tolerance: 0.6,
    hintTex: 'R = \\frac{v_0^2 \\sin(90^\\circ)}{g}, \\qquad H = \\frac{v_0^2\\sin^2(45^\\circ)}{2g}',
    solutionTex: 'R = \\frac{400}{9.8} \\approx 40.8\\text{ m}, \\qquad H \\approx 10.2\\text{ m}',
    answerLabel: 'R = 40.8 m (H = 10.2 m)',
  },
  {
    id: 6,
    tag: 'Problema 4',
    title: 'Caja Arrastrada con Fricción Cinética',
    statement: (
      <>
        Una caja de <MathTex tex="10\text{ kg}" /> se arrastra a velocidad constante mediante una cuerda con <MathTex tex="F = 50\text{ N}" /> inclinada a <MathTex tex="30^\circ" /> (<MathTex tex="g = 9.8\text{ m/s}^2" />). Calcule el coeficiente de fricción cinética <MathTex tex="\mu_k" />.
      </>
    ),
    unit: 'adimensional',
    expectedValue: 0.59,
    tolerance: 0.03,
    hintTex: 'F_N = mg - F\\sin 30^\\circ = 73\\text{ N}, \\qquad \\mu_k = \\frac{F\\cos 30^\\circ}{F_N}',
    solutionTex: '\\mu_k = \\frac{43.3\\text{ N}}{73.0\\text{ N}} \\approx 0.59',
    answerLabel: 'μ_k = 0.59 (F_N = 73 N)',
  },
  {
    id: 7,
    tag: 'Problema 5',
    title: 'Disco sobre Hielo con Tensión Centrípeta',
    statement: (
      <>
        Un disco de <MathTex tex="0.50\text{ kg}" /> gira en círculo horizontal de radio <MathTex tex="r = 1.2\text{ m}" /> a <MathTex tex="v = 6.0\text{ m/s}" />. ¿Cuál es la tensión <MathTex tex="T" /> de la cuerda en Newtons?
      </>
    ),
    unit: 'N',
    expectedValue: 15.0,
    tolerance: 0.3,
    hintTex: 'T = m\\frac{v^2}{r}',
    solutionTex: 'T = 0.50\\frac{6.0^2}{1.2} = 15.0\\text{ N}',
    answerLabel: '15.0 N',
  },
  {
    id: 8,
    tag: 'Problema 6 & 7',
    title: 'Gravedad en Marte y Órbita Terrestre Baja',
    statement: (
      <>
        Un satélite orbita la Tierra a <MathTex tex="400\text{ km}" /> de altitud (<MathTex tex="r = 6771\text{ km}" />). ¿Cuál es su rapidez orbital en <strong>km/s</strong>? (Nota: en Marte <MathTex tex="g_{\text{Marte}} = 3.73\text{ m/s}^2" />).
      </>
    ),
    unit: 'km/s',
    expectedValue: 7.67,
    tolerance: 0.15,
    hintTex: 'v_{\\text{orb}} = \\sqrt{\\frac{GM_\\oplus}{r}}',
    solutionTex: 'v_{\\text{orb}} \\approx 7.67\\text{ km/s}, \\qquad T = \\frac{2\\pi r}{v} \\approx 92.4\\text{ min}',
    answerLabel: '7.67 km/s (T = 92.4 min · g_Marte = 3.73 m/s²)',
  },
  {
    id: 9,
    tag: 'Problema 8 & 9',
    title: 'Colisión Inelástica de Patinador',
    statement: (
      <>
        Un patinador de <MathTex tex="70\text{ kg}" /> a <MathTex tex="4.0\text{ m/s}" /> atrapa un paquete de <MathTex tex="10\text{ kg}" /> lanzado hacia él a <MathTex tex="-2.0\text{ m/s}" />. ¿Cuál es su rapidez final común en <strong>m/s</strong>?
      </>
    ),
    unit: 'm/s',
    expectedValue: 3.25,
    tolerance: 0.08,
    hintTex: 'v_f = \\frac{70(4.0) + 10(-2.0)}{70 + 10}',
    solutionTex: 'v_f = \\frac{280 - 20}{80} = 3.25\\text{ m/s}',
    answerLabel: '3.25 m/s',
  },
  {
    id: 10,
    tag: 'Problema 10',
    title: 'Centro de Masa Unidimensional',
    statement: (
      <>
        Tres masas de <MathTex tex="2\text{ kg}, 3\text{ kg}" /> y <MathTex tex="5\text{ kg}" /> se ubican en <MathTex tex="x = 0\text{ m}, 4\text{ m}" /> y <MathTex tex="8\text{ m}" />. Calcule la posición del centro de masa <MathTex tex="x_{\text{CM}}" /> en metros.
      </>
    ),
    unit: 'm',
    expectedValue: 5.2,
    tolerance: 0.1,
    hintTex: 'x_{\\text{CM}} = \\frac{2(0) + 3(4) + 5(8)}{2 + 3 + 5}',
    solutionTex: 'x_{\\text{CM}} = \\frac{52}{10} = 5.2\\text{ m}',
    answerLabel: '5.2 m',
  },
  {
    id: 11,
    tag: 'Problema 11',
    title: 'Momento Angular de un Cometa (Kepler)',
    statement: (
      <>
        Un cometa pasa por su perihelio (<MathTex tex="r_p = 0.5\text{ UA}" />) a <MathTex tex="v_p = 54\text{ km/s}" />. ¿Cuál es su rapidez en el afelio a <MathTex tex="r_a = 3.0\text{ UA}" /> en <strong>km/s</strong>?
      </>
    ),
    unit: 'km/s',
    expectedValue: 9.0,
    tolerance: 0.2,
    hintTex: 'r_p v_p = r_a v_a \\implies v_a = \\frac{0.5}{3.0}(54\\text{ km/s})',
    solutionTex: 'v_a = 9.0\\text{ km/s}',
    answerLabel: '9.0 km/s',
  },
  {
    id: 12,
    tag: 'Parcial 2 · Impulso y Frenado',
    title: 'Distancia de Frenado con Fricción (Parcial 2)',
    statement: (
      <>
        Un automóvil viaja a <MathTex tex="v_0 = 20\text{ m/s}" /> sobre asfalto con <MathTex tex="\mu_k = 0.70" /> (<MathTex tex="g = 9.8\text{ m/s}^2" />). Calcule la distancia mínima de frenado <MathTex tex="d = v_0^2/(2\mu_k g)" /> en metros.
      </>
    ),
    unit: 'm',
    expectedValue: 29.15,
    tolerance: 0.5,
    hintTex: 'd = \\frac{20^2}{2(0.70)(9.8)}',
    solutionTex: 'd = \\frac{400}{13.72} \\approx 29.15\\text{ m}',
    answerLabel: '29.15 m',
  },
];

export const DynExercisesSection: React.FC = () => {
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [mcqChoice, setMcqChoice] = useState<Record<number, number>>({});
  const [status, setStatus] = useState<Record<number, 'correct' | 'wrong' | null>>({});
  const [openSolutions, setOpenSolutions] = useState<Record<number, boolean>>({});

  const checkNumeric = (ex: Ch3Exercise) => {
    if (ex.expectedValue === undefined) return;
    const raw = (inputs[ex.id] ?? '').replace(',', '.').trim();
    const val = parseFloat(raw);
    if (Number.isNaN(val)) {
      setStatus((p) => ({ ...p, [ex.id]: 'wrong' }));
      return;
    }
    const tol = ex.tolerance ?? Math.abs(ex.expectedValue) * 0.05;
    const ok = Math.abs(val - ex.expectedValue) <= tol;
    setStatus((p) => ({ ...p, [ex.id]: ok ? 'correct' : 'wrong' }));
    if (ok) setOpenSolutions((p) => ({ ...p, [ex.id]: true }));
  };

  const checkMcq = (ex: Ch3Exercise, idx: number) => {
    setMcqChoice((p) => ({ ...p, [ex.id]: idx }));
    const ok = idx === ex.correctMcqIndex;
    setStatus((p) => ({ ...p, [ex.id]: ok ? 'correct' : 'wrong' }));
    if (ok) setOpenSolutions((p) => ({ ...p, [ex.id]: true }));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-slate-500">
          Capítulo 3 · Problemas Propuestos y Parcial 2
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Ejercicios de Dinámica Newtoniana y Gravitación (main.tex)
        </h1>
        <p className="mt-2 max-w-4xl text-sm text-slate-600">
          Pon a prueba tu comprensión conceptual y cuantitativa con los problemas del capítulo 3, incluyendo las respuestas exactas verificadas en el texto original.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {CHAPTER_3_EXERCISES.map((ex) => {
          const st = status[ex.id];
          const isOpen = !!openSolutions[ex.id];
          return (
            <article
              key={ex.id}
              className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-sky-700 font-mono">
                    {ex.tag}
                  </span>
                  {st === 'correct' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Correcto
                    </span>
                  )}
                  {st === 'wrong' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700">
                      <XCircle className="h-3.5 w-3.5" /> Revisa el resultado
                    </span>
                  )}
                </div>

                <h3 className="text-base font-semibold text-slate-900">{ex.title}</h3>
                <div className="text-sm leading-relaxed text-slate-700">{ex.statement}</div>

                {ex.mcqOptions && (
                  <div className="space-y-1.5 pt-1">
                    {ex.mcqOptions.map((opt, idx) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => checkMcq(ex, idx)}
                        className={`w-full text-left rounded-lg border px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
                          mcqChoice[ex.id] === idx
                            ? idx === ex.correctMcqIndex
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                              : 'border-red-400 bg-red-50 text-red-900'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                {!ex.mcqOptions && (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder={`Respuesta (${ex.unit ?? ''})`}
                      value={inputs[ex.id] ?? ''}
                      onChange={(e) => setInputs((p) => ({ ...p, [ex.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') checkNumeric(ex);
                      }}
                      className="flex-1 min-w-[140px] rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-mono tabular-nums text-slate-900 focus:border-sky-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => checkNumeric(ex)}
                      className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 cursor-pointer"
                    >
                      Verificar
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setOpenSolutions((p) => ({ ...p, [ex.id]: !isOpen }))}
                  className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:underline cursor-pointer"
                >
                  {isOpen ? (
                    <>
                      <ChevronUp className="h-3.5 w-3.5" /> Ocultar solución
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" /> Ver pista y solución completa
                    </>
                  )}
                </button>

                {isOpen && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-2 text-xs">
                    <div className="font-semibold text-slate-800">
                      Respuesta: <span className="font-mono text-emerald-700">{ex.answerLabel}</span>
                    </div>
                    <MathTex block tex={ex.hintTex} />
                    <MathTex block tex={ex.solutionTex} />
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
