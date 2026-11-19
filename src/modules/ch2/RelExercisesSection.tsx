import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import { MathTex } from '../../components/MathTex';
import { FigureAsset } from '../../components/FigureAsset';

interface Ch2Exercise {
  id: number;
  title: string;
  statement: React.ReactNode;
  figureSrc?: string;
  figureAlt?: string;
  unit?: string;
  expectedValue?: number;
  tolerance?: number;
  conceptual?: boolean;
  hintTex: string;
  solutionTex: string;
  answerLabel: string;
}

const CHAPTER_2_EXERCISES: Ch2Exercise[] = [
  {
    id: 1,
    title: 'Segundo Postulado: Rayo Láser desde Nave',
    statement: (
      <>
        Una nave espacial se acerca a la Tierra a <MathTex tex="v = 0.6c" /> y dispara un rayo láser hacia adelante. ¿Cuál es la rapidez de la luz medida por un observador en la Tierra, expresada en unidades de <MathTex tex="c" />?
      </>
    ),
    unit: 'c',
    expectedValue: 1.0,
    tolerance: 0.02,
    hintTex: 'u = \\frac{c + 0.6c}{1 + (c)(0.6c)/c^2} = c',
    solutionTex: '\\text{Por el Segundo Postulado (o adición relativista), } u = 1.0c \\approx 3.00\\times 10^8\\text{ m/s}.',
    answerLabel: '1.0 c (3 × 10⁸ m/s)',
  },
  {
    id: 2,
    title: 'Viaje a Próxima Centauri: Tiempo Propio',
    statement: (
      <>
        Una astronauta viaja a Próxima Centauri a <MathTex tex="v = 0.8c" />. En la Tierra transcurren <MathTex tex="\Delta t = 5.3\text{ años}" />. ¿Cuántos años envejece la astronauta (<MathTex tex="\Delta t_0" />)?
      </>
    ),
    unit: 'años',
    expectedValue: 3.18,
    tolerance: 0.08,
    hintTex: '\\gamma = \\frac{1}{\\sqrt{1 - 0.8^2}} = \\frac{1}{0.6} \\approx 1.667, \\qquad \\Delta t_0 = \\frac{\\Delta t}{\\gamma}',
    solutionTex: '\\Delta t_0 = 5.3\\text{ años}\\times 0.6 = 3.18\\text{ años}',
    answerLabel: '3.18 años',
  },
  {
    id: 3,
    title: 'Contracción de una Regla a 0.9c',
    statement: (
      <>
        Una varilla de longitud propia <MathTex tex="L_0 = 1.00\text{ m}" /> viaja paralelamente a su eje con <MathTex tex="v = 0.9c" />. ¿Qué longitud <MathTex tex="L" /> mide un observador estacionario?
      </>
    ),
    unit: 'm',
    expectedValue: 0.436,
    tolerance: 0.015,
    hintTex: 'L = L_0\\sqrt{1 - (0.9)^2} = \\sqrt{0.19}',
    solutionTex: 'L = (1.00\\text{ m})\\sqrt{1 - 0.81} \\approx 0.436\\text{ m}',
    answerLabel: '0.436 m',
  },
  {
    id: 4,
    title: 'Transformación Directa de Lorentz',
    statement: (
      <>
        En <MathTex tex="S" />, un destello ocurre en <MathTex tex="x = 120\text{ m}" /> y <MathTex tex="t = 3.0\times 10^{-7}\text{ s}" /> (<MathTex tex="ct = 90\text{ m}" />). Si <MathTex tex="S'" /> se mueve a <MathTex tex="v = 0.5c" /> (<MathTex tex="\gamma \approx 1.1547" />), calcule <MathTex tex="x'" /> en metros.
      </>
    ),
    unit: 'm',
    expectedValue: 86.6,
    tolerance: 1.5,
    hintTex: "x' = \\gamma(x - \\beta ct) = 1.1547(120 - 0.5\\times 90)",
    solutionTex: "x' = 1.1547(75\\text{ m}) \\approx 86.6\\text{ m}, \\qquad t' = 1.1547(3.0\\times 10^{-7} - 2.0\\times 10^{-7}) \\approx 1.15\\times 10^{-7}\\text{ s}",
    answerLabel: "x' = 86.6 m · t' = 1.15×10⁻⁷ s",
  },
  {
    id: 5,
    title: 'Misión Breakthrough Starshot (0.2c)',
    statement: (
      <>
        Una microsonda con microorganismos viaja a Alfa Centauri (<MathTex tex="D_0 = 4.3\text{ años luz}" />) a <MathTex tex="v = 0.2c" /> (<MathTex tex="\gamma \approx 1.0206" />). Calcule el tiempo propio <MathTex tex="\tau" /> medido por la microsonda en años.
      </>
    ),
    unit: 'años',
    expectedValue: 21.07,
    tolerance: 0.2,
    hintTex: 't = \\frac{4.3}{0.2} = 21.5\\text{ años}, \\qquad \\tau = \\frac{t}{\\gamma}',
    solutionTex: 't = 21.5\\text{ años}, \\quad \\tau = \\frac{21.5}{1.0206} \\approx 21.07\\text{ años}, \\quad L\' = \\frac{4.3}{1.0206} \\approx 4.213\\text{ ly}',
    answerLabel: 'τ = 21.07 años (t = 21.5 años)',
  },
  {
    id: 6,
    title: 'Colisión Frontal de Naves Relativistas',
    statement: (
      <>
        Desde una estación, la nave A se mueve a <MathTex tex="+0.7c" /> y la nave B en sentido contrario a <MathTex tex="-0.6c" />. ¿Con qué rapidez (en múltiplos de <MathTex tex="c" />) ve acercarse la nave A a la nave B?
      </>
    ),
    unit: 'c',
    expectedValue: 0.915,
    tolerance: 0.015,
    hintTex: "u = \\frac{0.7 + 0.6}{1 + (0.7)(0.6)}",
    solutionTex: "u = \\frac{1.3}{1.42}c \\approx 0.915c",
    answerLabel: '0.915 c',
  },
  {
    id: 7,
    title: 'Galaxia más Lejana del JWST (z = 14)',
    statement: (
      <>
        La galaxia JADES-GS-z14-0 presenta corrimiento al rojo <MathTex tex="z = 14" /> (<MathTex tex="1+z = 15" />). Si la línea Lyman-alfa tiene <MathTex tex="\lambda_0 = 121.6\text{ nm}" />, calcule la longitud de onda observada <MathTex tex="\lambda_{\text{obs}}" /> en nm (además de su velocidad Doppler efectiva <MathTex tex="v/c \approx 0.991" />).
      </>
    ),
    unit: 'nm',
    expectedValue: 1824,
    tolerance: 15,
    hintTex: '\\lambda_{\\text{obs}} = (1 + z)\\lambda_0 = 15 \\times 121.6\\text{ nm}',
    solutionTex: '\\lambda_{\\text{obs}} = 1824\\text{ nm} = 1.824\\,\\mu\\text{m} \\text{ (IR cercano)}, \\quad \\frac{v}{c} = \\frac{15^2 - 1}{15^2 + 1} = \\frac{224}{226} \\approx 0.991c',
    answerLabel: '1824 nm (1.824 μm · v = 0.991c)',
  },
  {
    id: 8,
    title: 'La Infracción por Luz Roja (Doppler)',
    statement: (
      <>
        Un físico asegura haber visto una luz roja (<MathTex tex="f_0 = 450\text{ THz}" />) como luz verde (<MathTex tex="f_{\text{obs}} = 550\text{ THz}" />) por efecto Doppler al acercarse. ¿Qué rapidez <MathTex tex="v/c" /> debió llevar el camión?
      </>
    ),
    figureSrc: '/figures/foton.png',
    figureAlt: 'Camión acercándose a semáforo en rojo',
    unit: 'c',
    expectedValue: 0.198,
    tolerance: 0.01,
    hintTex: '\\left(\\frac{550}{450}\\right)^2 = \\frac{121}{81} = \\frac{1+\\beta}{1-\\beta}',
    solutionTex: '\\beta = \\frac{121 - 81}{121 + 81} = \\frac{40}{202} \\approx 0.198c \\approx 5.94\\times 10^7\\text{ m/s}',
    answerLabel: '0.198 c (5.94 × 10⁷ m/s)',
  },
  {
    id: 9,
    title: 'Aniquilación Electrón-Positrón',
    statement: (
      <>
        Un electrón y un positrón (<MathTex tex="m_e c^2 = 0.511\text{ MeV}" /> cada uno) se aniquilan en reposo produciendo dos fotones gamma. ¿Cuál es la energía total liberada en <strong>MeV</strong>?
      </>
    ),
    unit: 'MeV',
    expectedValue: 1.022,
    tolerance: 0.01,
    hintTex: 'E_{\\text{total}} = 2 m_e c^2',
    solutionTex: 'E_{\\text{total}} = 2(0.511\\text{ MeV}) = 1.022\\text{ MeV} \\approx 1.64\\times 10^{-13}\\text{ J}',
    answerLabel: '1.022 MeV (1.64 × 10⁻¹³ J)',
  },
  {
    id: 10,
    title: 'Energía Cinética de un Protón a 0.8c',
    statement: (
      <>
        La energía en reposo de un protón es <MathTex tex="mc^2 = 938\text{ MeV}" />. ¿Qué energía cinética <MathTex tex="K" /> (en MeV) requiere para alcanzar <MathTex tex="v = 0.8c" /> (<MathTex tex="\gamma = 5/3" />)?
      </>
    ),
    unit: 'MeV',
    expectedValue: 625.3,
    tolerance: 5,
    hintTex: 'K = (\\gamma - 1)mc^2 = \\left(\\frac{5}{3} - 1\\right)(938\\text{ MeV})',
    solutionTex: 'K = \\frac{2}{3}(938\\text{ MeV}) \\approx 625.3\\text{ MeV}',
    answerLabel: '625.3 MeV',
  },
  {
    id: 11,
    title: 'Momento Relativista de un Asteroide (0.99c)',
    statement: (
      <>
        Un cuerpo de <MathTex tex="1000\text{ kg}" /> viaja a <MathTex tex="v = 0.99c" /> (<MathTex tex="\gamma \approx 7.089" />). Calcule la razón <MathTex tex="p_{\text{rel}} / p_{\text{clásico}}" /> entre el momento relativista y el newtoniano.
      </>
    ),
    unit: 'veces',
    expectedValue: 7.09,
    tolerance: 0.1,
    hintTex: '\\frac{p_{\\text{rel}}}{p_{\\text{cl}}} = \\frac{\\gamma m v}{m v} = \\gamma',
    solutionTex: '\\text{Razón} = \\gamma(0.99c) = \\frac{1}{\\sqrt{1-0.99^2}} \\approx 7.09 \\quad (p_{\\text{rel}} \\approx 2.11\\times 10^{12}\\text{ kg}\\cdot\\text{m/s})',
    answerLabel: '7.09 veces (γ = 7.09)',
  },
  {
    id: 12,
    title: 'Invariancia del Intervalo Espacio-Temporal',
    statement: (
      <>
        En <MathTex tex="S" />, dos eventos en el mismo lugar (<MathTex tex="\Delta x = 0" />) se separan <MathTex tex="\Delta t = 5.0\text{ s}" /> (<MathTex tex="c\Delta t = 1.5\times 10^9\text{ m}" />). Si en <MathTex tex="S'" /> se separan espacialmente <MathTex tex="\Delta x' = 2.0\times 10^9\text{ m}" />, calcule <MathTex tex="\Delta t'" /> en segundos.
      </>
    ),
    unit: 's',
    expectedValue: 8.33,
    tolerance: 0.15,
    hintTex: "(c\\Delta t')^2 - (\\Delta x')^2 = (c\\Delta t)^2 - 0 \\implies c\\Delta t' = \\sqrt{1.5^2 + 2.0^2}\\times 10^9\\text{ m}",
    solutionTex: "c\\Delta t' = 2.5\\times 10^9\\text{ m} \\implies \\Delta t' = \\frac{2.5\\times 10^9}{3.0\\times 10^8} \\approx 8.33\\text{ s}",
    answerLabel: '8.33 s',
  },
  {
    id: 13,
    title: 'Demostración de la Relación Energía-Momento',
    statement: (
      <>
        Demuestre algebraicamente que a partir de <MathTex tex="E = \gamma mc^2" /> y <MathTex tex="p = \gamma mv" /> se cumple el invariante relativista <MathTex tex="E^2 - (pc)^2 = (mc^2)^2" />.
      </>
    ),
    conceptual: true,
    hintTex: '\\text{Factorice } \\gamma^2(mc^2)^2 \\text{ de } E^2 - (pc)^2.',
    solutionTex: 'E^2 - (pc)^2 = \\gamma^2(mc^2)^2\\left(1 - \\frac{v^2}{c^2}\\right) = \\frac{1}{1 - \\beta^2}(mc^2)^2(1 - \\beta^2) = (mc^2)^2',
    answerLabel: 'Demostrado: γ²(1 − β²) = 1',
  },
  {
    id: 14,
    title: 'La Pared Relativista (10 años luz a 0.99c)',
    statement: (
      <>
        Una nave de masa <MathTex tex="m" /> se acelera a <MathTex tex="0.99c" /> (<MathTex tex="\gamma \approx 7.09" />) para recorrer <MathTex tex="10\text{ años luz}" />. ¿Cuántos años propios <MathTex tex="\tau" /> dura el viaje para la tripulación?
      </>
    ),
    unit: 'años',
    expectedValue: 1.43,
    tolerance: 0.08,
    hintTex: 't_{\\text{Tierra}} = \\frac{10}{0.99} \\approx 10.10\\text{ años}, \\qquad \\tau = \\frac{t_{\\text{Tierra}}}{\\gamma}',
    solutionTex: '\\tau = \\frac{10.10}{7.09} \\approx 1.43\\text{ años} \\quad (K_{\\text{rel}} = 6.09\\,mc^2 \\text{ vs. } K_{\\text{cl}} = 0.49\\,mc^2)',
    answerLabel: 'τ ≈ 1.43 años (K_rel = 6.09 mc²)',
  },
];

export const RelExercisesSection: React.FC = () => {
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [status, setStatus] = useState<Record<number, 'correct' | 'wrong' | null>>({});
  const [openSolutions, setOpenSolutions] = useState<Record<number, boolean>>({});

  const checkAnswer = (ex: Ch2Exercise) => {
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

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-slate-500">
          Capítulo 2 · Práctica Interactiva
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Ejercicios de Relatividad Especial (14 Problemas de main.tex)
        </h1>
        <p className="mt-2 max-w-4xl text-sm text-slate-600">
          Comprueba tus resultados numéricos o despliega las soluciones desarrolladas con notación LaTeX exacta del documento original.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {CHAPTER_2_EXERCISES.map((ex) => {
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
                    Ejercicio 2.{ex.id}
                  </span>
                  {st === 'correct' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Correcto
                    </span>
                  )}
                  {st === 'wrong' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700">
                      <XCircle className="h-3.5 w-3.5" /> Revisa el cálculo
                    </span>
                  )}
                </div>

                <h3 className="text-base font-semibold text-slate-900">{ex.title}</h3>
                <div className="text-sm leading-relaxed text-slate-700">{ex.statement}</div>

                {ex.figureSrc && (
                  <FigureAsset
                    src={ex.figureSrc}
                    alt={ex.figureAlt ?? ex.title}
                    imgClassName="w-full h-36 object-contain"
                  />
                )}
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                {!ex.conceptual && (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder={`Respuesta (${ex.unit ?? ''})`}
                      value={inputs[ex.id] ?? ''}
                      onChange={(e) => setInputs((p) => ({ ...p, [ex.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') checkAnswer(ex);
                      }}
                      className="flex-1 min-w-[140px] rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-mono tabular-nums text-slate-900 focus:border-sky-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => checkAnswer(ex)}
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
                      Resultado esperado: <span className="font-mono text-emerald-700">{ex.answerLabel}</span>
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
