import React, { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, Pause, Play, RotateCcw, CheckCircle2 } from 'lucide-react';
import { MathTex } from '../components/MathTex';
import { FigureAsset } from '../components/FigureAsset';

type RelativityTab = 'derivation' | 'kinematics' | 'minkowski';

interface AlgebraicStep {
  step: number;
  title: string;
  equation: string;
  explanation: string;
  isHiddenExercise?: boolean;
}

const GAMMA_DERIVATION_STEPS: AlgebraicStep[] = [
  {
    step: 1,
    title: 'Linealidad y movimiento del origen',
    equation: 'x\' = \\gamma(x - vt), \\qquad x = \\gamma(x\' + vt\')',
    explanation: 'Por homogeneidad e inercia, la transformación es lineal. El origen S′ (x′=0) sigue x=vt y por simetría inversa v → −v.',
  },
  {
    step: 2,
    title: 'Segundo Postulado (pulso de luz)',
    equation: 'ct\' = \\gamma t(c - v), \\qquad ct = \\gamma t\'(c + v)',
    explanation: 'Un frente de luz emitido en t = t′ = 0 cumple x = ct en S y x′ = ct′ en S′.',
  },
  {
    step: 3,
    title: 'Producto de ecuaciones y despeje',
    equation: 'c^2 t\' t = \\gamma^2 t t\' (c^2 - v^2) \\implies 1 = \\gamma^2\\left(1 - \\frac{v^2}{c^2}\\right)',
    explanation: 'Multiplicando miembro a miembro, cancelando tt′ y dividiendo entre c².',
  },
  {
    step: 4,
    title: 'Factor de Lorentz',
    equation: '\\gamma = \\frac{1}{\\sqrt{1 - \\beta^2}}, \\qquad \\beta = \\frac{v}{c}',
    explanation: 'Resultado final para γ ≥ 1. No existen valores reales si v > c: la luz define la velocidad límite.',
  },
];

const TIME_EXERCISE_STEPS: AlgebraicStep[] = [
  {
    step: 1,
    title: 'Ecuaciones de partida',
    equation: 'x\' = \\gamma(x - vt), \\qquad x = \\gamma(x\' + vt\')',
    explanation: 'Partimos de la transformación directa e inversa para x.',
  },
  {
    step: 2,
    title: 'Sustitución de x′ (Ejercicio)',
    equation: 'x = \\gamma\\left[\\gamma(x - vt) + vt\'\\right]',
    explanation: 'Sustituyendo x′ = γ(x − vt) en x = γ(x′ + vt′).',
    isHiddenExercise: true,
  },
  {
    step: 3,
    title: 'Distribución y agrupación',
    equation: '\\gamma v t\' = x(1 - \\gamma^2) + \\gamma^2 vt',
    explanation: 'Distribuyendo γ, pasando términos a la izquierda y factorizando x.',
  },
  {
    step: 4,
    title: 'Reemplazo de γ² (Ejercicio)',
    equation: '\\gamma v t\' = x\\left(1 - \\frac{c^2}{c^2 - v^2}\\right) + \\gamma^2 vt',
    explanation: 'Reemplazando γ² = c² / (c² − v²) en el término que multiplica a x.',
    isHiddenExercise: true,
  },
  {
    step: 5,
    title: 'Simplificación del numerador',
    equation: '\\gamma v t\' = \\gamma^2 vt - \\gamma^2 \\frac{v^2 x}{c^2}',
    explanation: 'Sumando fracciones, cancelando c² y recuperando γ² = c²/(c² − v²).',
  },
  {
    step: 6,
    title: 'Transformación del tiempo (Ejercicio)',
    equation: 't\' = \\gamma\\left(t - \\frac{vx}{c^2}\\right)',
    explanation: 'Dividiendo ambos lados por γv y factorizando γ.',
    isHiddenExercise: true,
  },
];

export const RelativityModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RelativityTab>('derivation');

  // Shared relativistic speed parameter beta = v / c
  const [beta, setBeta] = useState<number>(0.6);
  const [eventX, setEventX] = useState<number>(4.0); // in light-seconds (c*s)
  const [eventT, setEventT] = useState<number>(5.0); // in seconds (s)

  // Animation state for S -> S' light pulse / clock simulation
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simTime, setSimTime] = useState<number>(1.8);

  // Interactive \phantom exercise reveal state
  const [revealedSteps, setRevealedSteps] = useState<Record<number, boolean>>({});
  const [showLogLogRef, setShowLogLogRef] = useState<boolean>(false);

  // Velocity addition & Doppler parameters
  const [uPrimeBeta, setUPrimeBeta] = useState<number>(0.7);
  const [properLength, setProperLength] = useState<number>(10); // meters
  const [properTime, setProperTime] = useState<number>(2.0); // seconds

  useEffect(() => {
    if (!isPlaying) return;
    let rafId = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      setSimTime((prev) => {
        const next = prev + dt * 0.85;
        return next > 4.2 ? 0 : next;
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying]);

  const gamma = useMemo(() => 1 / Math.sqrt(Math.max(1e-6, 1 - beta * beta)), [beta]);

  // Lorentz transform results (using c = 1 light-second/s for clean coordinates)
  const xPrime = useMemo(() => gamma * (eventX - beta * eventT), [gamma, eventX, beta, eventT]);
  const tPrime = useMemo(() => gamma * (eventT - beta * eventX), [gamma, eventT, beta, eventX]);
  const invariantS2 = useMemo(() => eventT * eventT - eventX * eventX, [eventT, eventX]);
  const invariantS2Prime = useMemo(() => tPrime * tPrime - xPrime * xPrime, [tPrime, xPrime]);

  // Galilean comparison
  const galileanXPrime = eventX - beta * eventT;
  const galileanTPrime = eventT;

  // Gamma curve SVG path
  const gammaCurvePath = useMemo(() => {
    const points: string[] = [];
    const samples = 120;
    for (let i = 0; i <= samples; i++) {
      const b = (i / samples) * 0.985;
      const g = Math.min(8, 1 / Math.sqrt(1 - b * b));
      const px = 44 + b * 240;
      const py = 200 - ((g - 1) / 7) * 165;
      points.push(`${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`);
    }
    return points.join(' ');
  }, []);

  // Velocity addition
  const relativisticSum = useMemo(
    () => (uPrimeBeta + beta) / (1 + uPrimeBeta * beta),
    [uPrimeBeta, beta]
  );
  const galileanSum = uPrimeBeta + beta;

  // Relativistic Doppler (source approaching if beta > 0 in this convention: f_obs = f_0 * sqrt((1+beta)/(1-beta)))
  const dopplerFactor = useMemo(() => Math.sqrt((1 + beta) / (1 - beta)), [beta]);

  // Energy-Momentum in units of mc^2 (m = 1)
  const totalEnergy = gamma;
  const kineticRel = gamma - 1;
  const kineticClass = 0.5 * beta * beta;
  const momentumC = gamma * beta;

  const toggleRevealStep = (step: number) => {
    setRevealedSteps((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  const revealAllExercises = () => {
    const allOpen = TIME_EXERCISE_STEPS.filter((s) => s.isHiddenExercise).every(
      (s) => revealedSteps[s.step]
    );
    const next: Record<number, boolean> = {};
    TIME_EXERCISE_STEPS.forEach((s) => {
      if (s.isHiddenExercise) next[s.step] = !allOpen;
    });
    setRevealedSteps(next);
  };

  return (
    <section className="space-y-6">
      {/* Chapter Header & Sub-navigation */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Capítulo 2 · Relatividad Especial
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Derivación de las Transformaciones de Lorentz
          </h1>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-600">
            Explora el paso de los postulados de Einstein a las ecuaciones de transformación, el factor de Lorentz γ, la dilatación temporal, la contracción de longitud y el espacio de Minkowski.
          </p>
        </div>

        <div
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 self-start lg:self-auto"
          role="tablist"
          aria-label="Secciones de Relatividad Especial"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'derivation'}
            onClick={() => setActiveTab('derivation')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'derivation'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Derivación y Factor γ
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'kinematics'}
            onClick={() => setActiveTab('kinematics')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'kinematics'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dilatación, Longitud y Doppler
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'minkowski'}
            onClick={() => setActiveTab('minkowski')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'minkowski'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Minkowski y Energía E=γmc²
          </button>
        </div>
      </div>

      {/* TAB 1: DERIVATION & GAMMA FACTOR */}
      {activeTab === 'derivation' && (
        <div className="space-y-6">
          {/* Two-Zone Sandbox */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Stage (~65% -> 8 cols) */}
            <div className="lg:col-span-8 space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Experimento Mental: Pulso de Luz entre S y S′
                    </h2>
                    <p className="text-xs text-slate-500">
                      S′ se aleja a velocidad v = {beta.toFixed(2)}c · Factor γ = {gamma.toFixed(3)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPlaying((p) => !p)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      {isPlaying ? 'Pausar' : 'Reproducir'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimTime(0)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reiniciar
                    </button>
                  </div>
                </div>

                {/* Dual SVG Canvas: Inertial Frames + Gamma Plot */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Inertial Frame Diagram */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
                      <span>Sistemas S (azul) y S′ (rojo)</span>
                      <span className="font-mono tabular-nums">t = {simTime.toFixed(2)} s</span>
                    </div>
                    <svg viewBox="0 0 340 220" className="w-full h-auto" role="img" aria-label="Sistemas inerciales S y S prima con frente de luz">
                      {/* Grid */}
                      <defs>
                        <pattern id="relGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e2e8f0" strokeWidth="0.7" />
                        </pattern>
                      </defs>
                      <rect width="340" height="220" fill="url(#relGrid)" rx="6" />

                      {/* Stationary Frame S */}
                      <line x1="40" y1="180" x2="320" y2="180" stroke="#0284c7" strokeWidth="2" />
                      <polygon points="320,180 312,176 312,184" fill="#0284c7" />
                      <line x1="40" y1="180" x2="40" y2="25" stroke="#0284c7" strokeWidth="2" />
                      <polygon points="40,25 36,33 44,33" fill="#0284c7" />
                      <text x="26" y="34" className="fill-sky-700 text-xs font-bold">S</text>
                      <text x="312" y="196" className="fill-sky-700 text-[11px] font-mono">x</text>
                      <text x="24" y="55" className="fill-sky-700 text-[11px] font-mono">ct</text>

                      {/* Light Cone / Pulse wavefront x = ct */}
                      {(() => {
                        const lightPx = 40 + simTime * 56;
                        const clampedLight = Math.min(lightPx, 315);
                        const sPrimeX = 40 + Math.max(-20, beta * simTime * 56);
                        const clampedSPrime = Math.max(20, Math.min(sPrimeX, 260));
                        const eventPx = 40 + Math.max(0, Math.min(eventX * 26, 270));
                        const eventPy = 180 - Math.max(0, Math.min(eventT * 20, 145));

                        return (
                          <>
                            {/* Light wavefront line */}
                            <line
                              x1="40"
                              y1="180"
                              x2={clampedLight}
                              y2={180 - (clampedLight - 40)}
                              stroke="#d97706"
                              strokeWidth="2"
                              strokeDasharray="4 3"
                            />
                            <circle
                              cx={clampedLight}
                              cy={180}
                              r="5"
                              fill="#f59e0b"
                              stroke="#ffffff"
                              strokeWidth="1.5"
                            />
                            <text
                              x={Math.min(clampedLight + 6, 260)}
                              y={170}
                              className="fill-amber-700 text-[10px] font-mono font-semibold"
                            >
                              x = ct
                            </text>

                            {/* Moving Frame S' */}
                            <g transform={`translate(${clampedSPrime - 40}, -12)`}>
                              <line x1="40" y1="180" x2="175" y2="180" stroke="#dc2626" strokeWidth="2" />
                              <polygon points="175,180 167,176 167,184" fill="#dc2626" />
                              <line x1="40" y1="180" x2="40" y2="48" stroke="#dc2626" strokeWidth="2" />
                              <polygon points="40,48 36,56 44,56" fill="#dc2626" />
                              <text x="46" y="56" className="fill-red-600 text-xs font-bold">S′</text>
                              <text x="166" y="195" className="fill-red-600 text-[11px] font-mono">x′</text>
                              {/* Velocity vector */}
                              <line x1="48" y1="115" x2={48 + beta * 42} y2="115" stroke="#0f172a" strokeWidth="1.5" />
                              <text x="52" y="108" className="fill-slate-800 text-[10px] font-mono">
                                v={beta.toFixed(2)}c
                              </text>
                            </g>

                            {/* Displacement vt bracket */}
                            {Math.abs(clampedSPrime - 40) > 8 && (
                              <>
                                <line
                                  x1="40"
                                  y1="204"
                                  x2={clampedSPrime}
                                  y2="204"
                                  stroke="#64748b"
                                  strokeWidth="1.5"
                                />
                                <text
                                  x={(40 + clampedSPrime) / 2 - 10}
                                  y="216"
                                  className="fill-slate-600 text-[10px] font-mono"
                                >
                                  vt
                                </text>
                              </>
                            )}

                            {/* Selected Event Marker */}
                            <circle cx={eventPx} cy={eventPy} r="4.5" fill="#0f172a" />
                            <text x={eventPx + 7} y={eventPy + 3} className="fill-slate-900 text-[10px] font-mono">
                              Evento ({eventX.toFixed(1)}, {eventT.toFixed(1)})
                            </text>
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Factor Gamma Live Graph */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
                      <span>Curva del Factor de Lorentz γ(β)</span>
                      <button
                        type="button"
                        onClick={() => setShowLogLogRef((s) => !s)}
                        className="text-sky-700 hover:underline cursor-pointer"
                      >
                        {showLogLogRef ? 'Ver gráfica interactiva' : 'Ver figura log-log original'}
                      </button>
                    </div>

                    {showLogLogRef ? (
                      <FigureAsset
                        src="/figures/Lorentz_factor_log_log.png"
                        alt="Factor de Lorentz versión log-log"
                        imgClassName="w-full h-44 object-contain"
                      />
                    ) : (
                      <svg viewBox="0 0 320 220" className="w-full h-auto" role="img" aria-label="Gráfica del factor de Lorentz">
                        {/* Axes */}
                        <line x1="44" y1="200" x2="296" y2="200" stroke="#475569" strokeWidth="1.5" />
                        <line x1="44" y1="200" x2="44" y2="20" stroke="#475569" strokeWidth="1.5" />

                        {/* Asymptote v=c */}
                        <line x1="284" y1="24" x2="284" y2="200" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 4" />
                        <text x="242" y="34" className="fill-red-600 text-[10px] font-mono font-semibold">
                          Asíntota v = c
                        </text>

                        {/* Grid y ticks */}
                        {[1, 2, 4, 6, 8].map((val) => {
                          const py = 200 - ((val - 1) / 7) * 165;
                          return (
                            <g key={val}>
                              <line x1="44" y1={py} x2="284" y2={py} stroke="#e2e8f0" strokeWidth="0.8" />
                              <text x="26" y={py + 3} className="fill-slate-500 text-[10px] font-mono tabular-nums">
                                {val}
                              </text>
                            </g>
                          );
                        })}

                        {/* Curve */}
                        <path d={gammaCurvePath} fill="none" stroke="#0284c7" strokeWidth="2.5" />

                        {/* Current beta marker */}
                        {(() => {
                          const absBeta = Math.abs(beta);
                          const px = 44 + absBeta * 240;
                          const clampedG = Math.min(8, gamma);
                          const py = 200 - ((clampedG - 1) / 7) * 165;
                          return (
                            <>
                              <line x1={px} y1="200" x2={px} y2={py} stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" />
                              <line x1="44" y1={py} x2={px} y2={py} stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" />
                              <circle cx={px} cy={py} r="5.5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                              <text x={Math.min(px + 8, 210)} y={Math.max(py - 8, 32)} className="fill-slate-900 text-[11px] font-mono font-semibold tabular-nums">
                                γ = {gamma.toFixed(3)}
                              </text>
                            </>
                          );
                        })()}

                        <text x="140" y="216" className="fill-slate-600 text-[10px] font-mono">
                          |β| = |v|/c
                        </text>
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Algebraic Steps of Derivation + Interactive Exercise Table */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Pasos de la Derivación Algebraica (Sección 2.3 del Libro)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Deducción de γ y ejercicio interactivo para despejar la transformación del tiempo t′.
                  </p>
                </div>

                {/* Part A: Gamma steps */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {GAMMA_DERIVATION_STEPS.map((item) => (
                    <div
                      key={item.step}
                      className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                        <span>{item.step}. {item.title}</span>
                      </div>
                      <div className="my-2">
                        <MathTex tex={item.equation} block className="text-sm" />
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600">{item.explanation}</p>
                    </div>
                  ))}
                </div>

                {/* Part B: Interactive Exercise Table (\phantom steps from main.tex lines 1160-1184) */}
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        Ejercicio Interactivo: Despejar t′ a partir de x′ y x
                      </h4>
                      <p className="text-xs text-slate-500">
                        Basado en los pasos ocultos (\phantom) de la Sección 2.4: haz clic en cada paso oculto para revelar la solución algebraica.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={revealAllExercises}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Alternar todas las soluciones
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="px-3 py-2.5 font-semibold w-14">Paso</th>
                          <th className="px-3 py-2.5 font-semibold">Expresión algebraica</th>
                          <th className="px-3 py-2.5 font-semibold">Justificación</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {TIME_EXERCISE_STEPS.map((row) => {
                          const isHidden = row.isHiddenExercise && !revealedSteps[row.step];
                          return (
                            <tr key={row.step} className="hover:bg-slate-50/70">
                              <td className="px-3 py-3 font-mono font-semibold text-slate-700 tabular-nums align-middle">
                                {row.step})
                              </td>
                              <td className="px-3 py-3 align-middle">
                                {row.isHiddenExercise ? (
                                  <div className="flex flex-wrap items-center gap-2">
                                    {isHidden ? (
                                      <button
                                        type="button"
                                        onClick={() => toggleRevealStep(row.step)}
                                        className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-sky-400 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-800 hover:bg-sky-100 cursor-pointer"
                                      >
                                        <Eye className="h-3.5 w-3.5" />
                                        Revelar paso oculto
                                      </button>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <MathTex tex={row.equation} className="text-sm" />
                                        <button
                                          type="button"
                                          onClick={() => toggleRevealStep(row.step)}
                                          className="text-slate-400 hover:text-slate-600 cursor-pointer"
                                          title="Ocultar paso"
                                          aria-label="Ocultar paso"
                                        >
                                          <EyeOff className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <MathTex tex={row.equation} className="text-sm" />
                                )}
                              </td>
                              <td className="px-3 py-3 text-slate-600 leading-relaxed align-middle">
                                {row.explanation}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Control & Live Calculator Deck (~35% -> 4 cols) */}
            <aside className="lg:col-span-4 space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Controles y Transformador en Vivo
                  </h3>
                  <p className="text-xs text-slate-500">
                    Unidades naturales normalizadas (c = 1 s·luz/s).
                  </p>
                </div>

                {/* Slider: beta = v/c */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="beta-slider" className="font-medium text-slate-700">
                      Velocidad relativa (v / c)
                    </label>
                    <span className="font-mono font-semibold text-sky-700 tabular-nums">
                      {beta >= 0 ? '+' : ''}{beta.toFixed(2)} c
                    </span>
                  </div>
                  <input
                    id="beta-slider"
                    type="range"
                    min={-0.98}
                    max={0.98}
                    step={0.01}
                    value={beta}
                    onChange={(e) => setBeta(parseFloat(e.target.value))}
                    className="sci-slider w-full"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 tabular-nums">
                    <span>−0.98c</span>
                    <span>0</span>
                    <span>+0.98c</span>
                  </div>
                </div>

                {/* Slider: Event x */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="event-x-slider" className="font-medium text-slate-700">
                      Posición del evento en S (x)
                    </label>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {eventX.toFixed(1)} c·s
                    </span>
                  </div>
                  <input
                    id="event-x-slider"
                    type="range"
                    min={-8}
                    max={8}
                    step={0.2}
                    value={eventX}
                    onChange={(e) => setEventX(parseFloat(e.target.value))}
                    className="sci-slider w-full"
                  />
                </div>

                {/* Slider: Event t */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="event-t-slider" className="font-medium text-slate-700">
                      Tiempo del evento en S (t)
                    </label>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {eventT.toFixed(1)} s
                    </span>
                  </div>
                  <input
                    id="event-t-slider"
                    type="range"
                    min={0}
                    max={10}
                    step={0.2}
                    value={eventT}
                    onChange={(e) => setEventT(parseFloat(e.target.value))}
                    className="sci-slider w-full"
                  />
                </div>

                {/* Output Summary Table */}
                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Coordenadas en S′</span>
                    <span className="font-mono text-xs font-semibold text-sky-700 tabular-nums">
                      γ = {gamma.toFixed(4)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div>
                      <div className="text-[11px] text-slate-500">Lorentz x′</div>
                      <div className="font-mono text-base font-bold text-red-600 tabular-nums">
                        {xPrime.toFixed(3)} c·s
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500">Lorentz t′</div>
                      <div className="font-mono text-base font-bold text-red-600 tabular-nums">
                        {tPrime.toFixed(3)} s
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500">Galileo x′ (c→∞)</div>
                      <div className="font-mono text-xs font-medium text-slate-700 tabular-nums">
                        {galileanXPrime.toFixed(3)} c·s
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500">Galileo t′ (c→∞)</div>
                      <div className="font-mono text-xs font-medium text-slate-700 tabular-nums">
                        {galileanTPrime.toFixed(3)} s
                      </div>
                    </div>
                  </div>

                  {/* Invariant Interval Verification */}
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Invariante Espacio-Temporal</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-emerald-900 tabular-nums">
                      <span>(ct)² − x² = {invariantS2.toFixed(3)}</span>
                      <span>(ct′)² − x′² = {invariantS2Prime.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Equations Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
                <h4 className="text-sm font-semibold text-slate-900">
                  Resumen de Ecuaciones
                </h4>
                <MathTex
                  block
                  tex="x' = \gamma(x - vt), \quad t' = \gamma\left(t - \frac{vx}{c^2}\right)"
                  className="text-sm"
                />
                <MathTex
                  block
                  tex="x = \gamma(x' + vt'), \quad t = \gamma\left(t' + \frac{vx'}{c^2}\right)"
                  className="text-sm"
                />
                <p className="text-xs leading-relaxed text-slate-600">
                  Cuando v ≪ c o c → ∞, γ → 1 y recuperamos las transformaciones clásicas de Galileo: x′ = x − vt y t′ = t.
                </p>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* TAB 2: TIME DILATION, LENGTH CONTRACTION, VELOCITY ADDITION & DOPPLER */}
      {activeTab === 'kinematics' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            {/* Dilatación del tiempo & Contracción de longitud */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Dilatación del Tiempo y Contracción de la Longitud
                  </h2>
                  <p className="text-xs text-slate-500">
                    Comparación directa entre el sistema propio S′ y el observador estacionario S (β = {beta.toFixed(2)}, γ = {gamma.toFixed(3)}).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Visual Length Contraction */}
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>Contracción de Longitud (Regla en S′)</span>
                    <span className="font-mono text-sky-700 tabular-nums">
                      L / L₀ = {(1 / gamma).toFixed(3)}
                    </span>
                  </div>

                  {/* Rest ruler */}
                  <div className="space-y-1">
                    <div className="text-[11px] text-slate-500">
                      En reposo (S′): L₀ = {properLength.toFixed(1)} m
                    </div>
                    <div className="h-7 rounded border border-slate-300 bg-white flex items-center px-2">
                      <div
                        className="h-3.5 rounded-sm bg-sky-600 transition-all duration-150"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  {/* Contracted ruler */}
                  <div className="space-y-1">
                    <div className="text-[11px] text-slate-500">
                      Medida desde S: L = L₀/γ = {(properLength / gamma).toFixed(2)} m
                    </div>
                    <div className="h-7 rounded border border-slate-300 bg-white flex items-center px-2">
                      <div
                        className="h-3.5 rounded-sm bg-red-600 transition-all duration-150"
                        style={{ width: `${(100 / gamma).toFixed(2)}%` }}
                      />
                    </div>
                  </div>

                  <MathTex tex="L = L_0 \sqrt{1 - \frac{v^2}{c^2}} = \frac{L_0}{\gamma}" block className="text-sm" />
                </div>

                {/* Time Dilation */}
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>Dilatación del Tiempo (Reloj en S′)</span>
                    <span className="font-mono text-red-600 tabular-nums">
                      Δt = {(properTime * gamma).toFixed(3)} s
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
                      <div className="text-[11px] text-slate-500">Tiempo propio (S′)</div>
                      <div className="mt-1 font-mono text-lg font-bold text-sky-700 tabular-nums">
                        {properTime.toFixed(2)} s
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">Mismo lugar x′_c</div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
                      <div className="text-[11px] text-slate-500">Tiempo en Tierra (S)</div>
                      <div className="mt-1 font-mono text-lg font-bold text-red-600 tabular-nums">
                        {(properTime * gamma).toFixed(2)} s
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">Δt = γ Δt₀</div>
                    </div>
                  </div>

                  <MathTex tex="\Delta t = \frac{\Delta t_0}{\sqrt{1 - v^2/c^2}} = \gamma \Delta t_0" block className="text-sm" />
                </div>
              </div>
            </div>

            {/* Suma Relativista de Velocidades & Doppler */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
              <h3 className="text-base font-semibold text-slate-900">
                Suma Relativista de Velocidades y Efecto Doppler
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <div className="text-xs font-semibold text-slate-800">
                    Nave espacial (v = {beta.toFixed(2)}c) lanza sonda (u′ = {uPrimeBeta.toFixed(2)}c)
                  </div>
                  <MathTex
                    tex="u = \frac{u' + v}{1 + \dfrac{u' v}{c^2}}"
                    block
                    className="text-sm"
                  />
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Suma Clásica (u′ + v):</span>
                      <span
                        className={`font-mono font-semibold tabular-nums ${
                          Math.abs(galileanSum) > 1 ? 'text-red-600' : 'text-slate-800'
                        }`}
                      >
                        {galileanSum.toFixed(4)} c {Math.abs(galileanSum) > 1 ? '(Viola u ≤ c)' : ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Suma Relativista (Einstein):</span>
                      <span className="font-mono font-bold text-emerald-700 tabular-nums">
                        {relativisticSum.toFixed(4)} c
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <div className="text-xs font-semibold text-slate-800">
                    Efecto Doppler Relativista de la Luz
                  </div>
                  <MathTex
                    tex="\nu_{\text{obs}} = \nu_0 \sqrt{\frac{1 + \beta}{1 - \beta}}"
                    block
                    className="text-sm"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Razón de frecuencia ν_obs / ν₀:</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {dopplerFactor.toFixed(3)}×
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Estado:{' '}
                    <span className="font-semibold text-slate-900">
                      {beta > 0.01
                        ? 'Corrimiento al azul (acercamiento)'
                        : beta < -0.01
                        ? 'Corrimiento al rojo (alejamiento)'
                        : 'Sin desplazamiento Doppler'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
              <h3 className="text-base font-semibold text-slate-900">
                Parámetros Cinemáticos
              </h3>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="kin-beta" className="font-medium text-slate-700">
                    Velocidad de la nave S′ (v / c)
                  </label>
                  <span className="font-mono font-semibold text-sky-700 tabular-nums">
                    {beta.toFixed(2)} c
                  </span>
                </div>
                <input
                  id="kin-beta"
                  type="range"
                  min={-0.98}
                  max={0.98}
                  step={0.01}
                  value={beta}
                  onChange={(e) => setBeta(parseFloat(e.target.value))}
                  className="sci-slider w-full"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="kin-uprime" className="font-medium text-slate-700">
                    Velocidad de la sonda en S′ (u′ / c)
                  </label>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {uPrimeBeta.toFixed(2)} c
                  </span>
                </div>
                <input
                  id="kin-uprime"
                  type="range"
                  min={-1.0}
                  max={1.0}
                  step={0.01}
                  value={uPrimeBeta}
                  onChange={(e) => setUPrimeBeta(parseFloat(e.target.value))}
                  className="sci-slider w-full"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="kin-l0" className="font-medium text-slate-700">
                    Longitud propia L₀ (m)
                  </label>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {properLength.toFixed(1)} m
                  </span>
                </div>
                <input
                  id="kin-l0"
                  type="range"
                  min={1}
                  max={50}
                  step={0.5}
                  value={properLength}
                  onChange={(e) => setProperLength(parseFloat(e.target.value))}
                  className="sci-slider w-full"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="kin-t0" className="font-medium text-slate-700">
                    Tiempo propio Δt₀ (s)
                  </label>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {properTime.toFixed(1)} s
                  </span>
                </div>
                <input
                  id="kin-t0"
                  type="range"
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={properTime}
                  onChange={(e) => setProperTime(parseFloat(e.target.value))}
                  className="sci-slider w-full"
                />
              </div>

              <div className="border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setBeta(0.8);
                    setUPrimeBeta(0.7);
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  Cargar Ejemplo del Libro (v = 0.8c, u′ = 0.7c)
                </button>
              </div>
            </div>

            <FigureAsset
              src="/figures/tennis.png"
              alt="Ejemplo de longitud propia con cancha y pelota de tenis"
              caption="Figura del libro: simetría entre la cancha (reposo en S) y la pelota en movimiento (reposo en S′)."
            />
          </aside>
        </div>
      )}

      {/* TAB 3: MINKOWSKI & RELATIVISTIC ENERGY */}
      {activeTab === 'minkowski' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Diagrama de Minkowski e Invariancia del Cuadrivector
              </h2>
              <p className="text-xs text-slate-500">
                Los ejes ct′ y x′ se inclinan un ángulo arctan(β) = {(Math.atan(beta) * 180 / Math.PI).toFixed(1)}° respecto a los ejes ortogonales de S.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
              <svg viewBox="0 0 440 300" className="w-full h-auto max-h-[380px]" role="img" aria-label="Diagrama espacio-tiempo de Minkowski">
                {/* Center at (220, 150) */}
                <defs>
                  <pattern id="minkGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.7" />
                  </pattern>
                </defs>
                <rect width="440" height="300" fill="url(#minkGrid)" rx="6" />

                {/* Light cone shaded */}
                <polygon points="220,150 90,20 350,20" fill="#fef3c7" opacity="0.55" />
                <polygon points="220,150 90,280 350,280" fill="#fef3c7" opacity="0.55" />

                {/* Light cone lines x = +- ct */}
                <line x1="90" y1="280" x2="350" y2="20" stroke="#d97706" strokeWidth="1.8" strokeDasharray="5 4" />
                <line x1="90" y1="20" x2="350" y2="280" stroke="#d97706" strokeWidth="1.8" strokeDasharray="5 4" />
                <text x="336" y="34" className="fill-amber-700 text-[10px] font-mono font-semibold">x = ct</text>

                {/* Stationary axes S */}
                <line x1="40" y1="150" x2="400" y2="150" stroke="#0284c7" strokeWidth="1.8" />
                <line x1="220" y1="285" x2="220" y2="15" stroke="#0284c7" strokeWidth="1.8" />
                <text x="394" y="143" className="fill-sky-700 text-xs font-mono font-semibold">x</text>
                <text x="226" y="24" className="fill-sky-700 text-xs font-mono font-semibold">ct</text>

                {/* Boosted axes S': ct' has slope 1/beta (x = beta * ct), x' has slope beta (ct = beta * x) */}
                {(() => {
                  const len = 135;
                  const dxT = beta * len;
                  const dyT = -len;
                  const dxX = len;
                  const dyX = -beta * len;

                  // Event P in SVG coords (scale: 15 px per unit)
                  const scale = 15;
                  const px = 220 + eventX * scale;
                  const py = 150 - eventT * scale;

                  return (
                    <>
                      {/* ct' axis */}
                      <line
                        x1={220 - dxT}
                        y1={150 - dyT}
                        x2={220 + dxT}
                        y2={150 + dyT}
                        stroke="#dc2626"
                        strokeWidth="2"
                      />
                      <text x={220 + dxT + 5} y={150 + dyT + 10} className="fill-red-600 text-xs font-mono font-semibold">
                        ct′
                      </text>

                      {/* x' axis */}
                      <line
                        x1={220 - dxX}
                        y1={150 - dyX}
                        x2={220 + dxX}
                        y2={150 + dyX}
                        stroke="#dc2626"
                        strokeWidth="2"
                      />
                      <text x={220 + dxX - 10} y={150 + dyX - 8} className="fill-red-600 text-xs font-mono font-semibold">
                        x′
                      </text>

                      {/* Event point */}
                      <circle cx={px} cy={py} r="5.5" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                      <text x={px + 8} y={py - 6} className="fill-slate-900 text-[11px] font-mono font-semibold tabular-nums">
                        P(x={eventX.toFixed(1)}, ct={eventT.toFixed(1)})
                      </text>
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* Energy-Momentum Relation */}
            <div className="border-t border-slate-200 pt-4 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Relación Energía-Momento Relativista (E² = (pc)² + (mc²)²)
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[11px] text-slate-500">Energía Total E / mc²</div>
                  <div className="mt-1 font-mono text-base font-bold text-slate-900 tabular-nums">
                    {totalEnergy.toFixed(4)}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[11px] text-slate-500">Momento pc / mc²</div>
                  <div className="mt-1 font-mono text-base font-bold text-sky-700 tabular-nums">
                    {momentumC.toFixed(4)}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[11px] text-slate-500">Cinética Rel. (γ−1)</div>
                  <div className="mt-1 font-mono text-base font-bold text-red-600 tabular-nums">
                    {kineticRel.toFixed(4)}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[11px] text-slate-500">Cinética Clásica (½β²)</div>
                  <div className="mt-1 font-mono text-base font-bold text-slate-600 tabular-nums">
                    {kineticClass.toFixed(4)}
                  </div>
                </div>
              </div>
              <MathTex
                block
                tex="E = \gamma m c^2 = \sqrt{(pc)^2 + (mc^2)^2} \approx mc^2 + \frac{1}{2}mv^2 \quad (v \ll c)"
                className="text-sm"
              />
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-5">
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
              <h3 className="text-base font-semibold text-slate-900">
                Parámetros del Espacio-Tiempo
              </h3>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="mink-beta" className="font-medium text-slate-700">
                    Impulso de Lorentz (β = v/c)
                  </label>
                  <span className="font-mono font-semibold text-red-600 tabular-nums">
                    {beta.toFixed(2)} c
                  </span>
                </div>
                <input
                  id="mink-beta"
                  type="range"
                  min={-0.9}
                  max={0.9}
                  step={0.02}
                  value={beta}
                  onChange={(e) => setBeta(parseFloat(e.target.value))}
                  className="sci-slider w-full"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="mink-x" className="font-medium text-slate-700">
                    Coordenada x (c·s)
                  </label>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {eventX.toFixed(1)}
                  </span>
                </div>
                <input
                  id="mink-x"
                  type="range"
                  min={-8}
                  max={8}
                  step={0.2}
                  value={eventX}
                  onChange={(e) => setEventX(parseFloat(e.target.value))}
                  className="sci-slider w-full"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="mink-t" className="font-medium text-slate-700">
                    Coordenada ct (c·s)
                  </label>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {eventT.toFixed(1)}
                  </span>
                </div>
                <input
                  id="mink-t"
                  type="range"
                  min={-8}
                  max={8}
                  step={0.2}
                  value={eventT}
                  onChange={(e) => setEventT(parseFloat(e.target.value))}
                  className="sci-slider w-full"
                />
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2 text-xs">
                <div className="font-semibold text-slate-800">Clasificación del intervalo Δs²</div>
                <div className="font-mono text-slate-700 tabular-nums">
                  Δs² = (ct)² − x² = {invariantS2.toFixed(2)}
                </div>
                <div className="text-slate-600">
                  {invariantS2 > 0.05
                    ? 'Tipo tiempo (timelike): existe causalidad física entre el origen y P.'
                    : invariantS2 < -0.05
                    ? 'Tipo espacio (spacelike): ningún rayo de luz conecta ambos eventos.'
                    : 'Tipo luz (lightlike): eventos conectados por un fotón.'}
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};
