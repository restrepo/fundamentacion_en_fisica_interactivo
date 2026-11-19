import React, { useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { MathTex } from '../components/MathTex';
import { FigureAsset } from '../components/FigureAsset';
import { EquationBox, ExampleBox, ReasoningTable } from '../components/LatexBlocks';
import { Ch1ExercisesSection } from './ch1/Ch1ExercisesSection';

type PrelimTab = 'vectors' | 'products' | 'dimensional' | 'natural_so2' | 'exercises';

const TABS: Array<{ id: PrelimTab; label: string }> = [
  { id: 'vectors', label: '1.1 Vectores y Traslación' },
  { id: 'products', label: '1.2 Producto Punto y Cruz' },
  { id: 'dimensional', label: '1.3 Análisis Dimensional' },
  { id: 'natural_so2', label: '1.4–1.5 Unidades y SO(2)' },
  { id: 'exercises', label: 'Ejercicios (20)' },
];

export const PreliminariesModule: React.FC = () => {
  const [tab, setTab] = useState<PrelimTab>('vectors');

  // 1.1 Translation invariance state
  const [r1, setR1] = useState({ x: 1.5, y: 3.0 });
  const [r2, setR2] = useState({ x: 4.5, y: 2.0 });
  const [originShift, setOriginShift] = useState({ x0: 1.5, y0: 1.0 });

  // 1.2 Dot & Cross Product state
  const [wrenchLengthM, setWrenchLengthM] = useState<number>(0.25); // 25 cm
  const [appliedForceN, setAppliedForceN] = useState<number>(40); // N
  const [wrenchAngleDeg, setWrenchAngleDeg] = useState<number>(30); // deg
  const [displacementM, setDisplacementM] = useState<number>(4.0); // m for work W = F·Δr

  // 1.3 Dimensional & Conversion interactive calculator
  const [speedKmh, setSpeedKmh] = useState<number>(60);
  const [areaM2, setAreaM2] = useState<number>(2);

  // 1.4 Natural Units converter
  const [quantityType, setQuantityType] = useState<'mass' | 'length' | 'time'>('mass');
  const [mantissa, setMantissa] = useState<number>(1.6726);
  const [exponent, setExponent] = useState<number>(-27);

  // 1.5 SO(2) Rotation state
  const [thetaDeg, setThetaDeg] = useState<number>(30);
  const [vecR, setVecR] = useState({ x: 4.0, y: 2.5 });

  // Computations 1.1
  const dr = useMemo(() => ({ dx: r2.x - r1.x, dy: r2.y - r1.y }), [r1, r2]);
  const r1Prime = useMemo(
    () => ({ x: r1.x - originShift.x0, y: r1.y - originShift.y0 }),
    [r1, originShift]
  );
  const r2Prime = useMemo(
    () => ({ x: r2.x - originShift.x0, y: r2.y - originShift.y0 }),
    [r2, originShift]
  );
  const drPrime = useMemo(
    () => ({ dx: r2Prime.x - r1Prime.x, dy: r2Prime.y - r1Prime.y }),
    [r1Prime, r2Prime]
  );

  // Computations 1.2
  const wrenchAngleRad = (wrenchAngleDeg * Math.PI) / 180;
  const torqueMag = wrenchLengthM * appliedForceN * Math.sin(wrenchAngleRad);
  const workMag = appliedForceN * displacementM * Math.cos(wrenchAngleRad);

  // Computations 1.3
  const speedMs = speedKmh / 3.6;
  const areaCm2 = areaM2 * 10000;

  // Computations 1.4
  const siValue = mantissa * Math.pow(10, exponent);
  // Conversions from main.tex Sec 1.4:
  // 1 kg = 5.609588603e26 GeV/c^2
  // 1 m  = 5.067730716e6  (hbar c / eV)
  // 1 s  = 1.519267448e15 (hbar / eV)
  const natConverted = useMemo(() => {
    if (quantityType === 'mass') {
      const gev = siValue * 5.609588603e26;
      return { value: gev, unit: 'GeV/c²', invUnit: 'kg' };
    }
    if (quantityType === 'length') {
      const nat = siValue * 5.067730716e6;
      return { value: nat, unit: '(ħc)/eV', invUnit: 'm' };
    }
    const nat = siValue * 1.519267448e15;
    return { value: nat, unit: 'ħ/eV', invUnit: 's' };
  }, [quantityType, siValue]);

  // Computations 1.5
  const thetaRad = (thetaDeg * Math.PI) / 180;
  const xRot = vecR.x * Math.cos(thetaRad) + vecR.y * Math.sin(thetaRad);
  const yRot = -vecR.x * Math.sin(thetaRad) + vecR.y * Math.cos(thetaRad);
  const normSq = vecR.x * vecR.x + vecR.y * vecR.y;
  const normSqRot = xRot * xRot + yRot * yRot;

  return (
    <div className="space-y-6">
      {/* Chapter Header & Sub-tabs */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Capítulo 1 · Secciones 1.1 – 1.5 · Preliminares Matemáticos
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Vectores, Análisis Dimensional, Unidades Naturales y Rotaciones SO(2)
          </h1>
          <p className="mt-1.5 max-w-4xl text-sm leading-relaxed text-slate-600">
            Fundamentos matemáticos y metrológicos previos a la física relativista y newtoniana: vectores ligados frente a vectores libres, productos vectoriales, homogeneidad dimensional, unidades de altas energías e invariancia rotacional.
          </p>
        </div>

        <div
          className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 self-start lg:self-auto"
          role="tablist"
          aria-label="Secciones del Capítulo 1"
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

      {/* TAB 1: 1.1 VECTORES Y TRASLACIÓN */}
      {tab === 'vectors' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  1.1 Vectores Ligados, Vectores Libres e Invariancia Traslacional
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Un vector de posición <MathTex tex="\boldsymbol{r} = x\hat{\boldsymbol{\imath}} + y\hat{\boldsymbol{\jmath}} + z\hat{\boldsymbol{k}}" /> es un <strong>vector ligado</strong> porque depende del origen <MathTex tex="O" /> elegido. Sin embargo, el vector desplazamiento <MathTex tex="\Delta\boldsymbol{r} = \boldsymbol{r}_2 - \boldsymbol{r}_1" /> es un <strong>vector libre</strong>: permanece idéntico al trasladar el sistema de coordenadas a <MathTex tex="S'(x_0, y_0)" />.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                <svg
                  viewBox="0 0 460 280"
                  className="w-full h-auto max-h-[340px]"
                  role="img"
                  aria-label="Invariancia traslacional del vector desplazamiento entre dos sistemas de referencia"
                >
                  <defs>
                    <pattern id="ch1VecGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e2e8f0" strokeWidth="0.7" />
                    </pattern>
                  </defs>
                  <rect width="460" height="280" fill="url(#ch1VecGrid)" rx="6" />
                  {(() => {
                    const ox = 110;
                    const oy = 215;
                    const sc = 32;
                    const p1x = ox + r1.x * sc;
                    const p1y = oy - r1.y * sc;
                    const p2x = ox + r2.x * sc;
                    const p2y = oy - r2.y * sc;
                    const s2x = ox + originShift.x0 * sc;
                    const s2y = oy - originShift.y0 * sc;

                    return (
                      <>
                        {/* Axes S */}
                        <line x1="20" y1={oy} x2="435" y2={oy} stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1={ox} y1="265" x2={ox} y2="15" stroke="#94a3b8" strokeWidth="1.5" />
                        <text x={ox - 16} y={oy + 14} className="fill-slate-600 text-xs font-mono">O</text>

                        {/* Shifted Axes S' */}
                        <line x1="20" y1={s2y} x2="435" y2={s2y} stroke="#dc2626" strokeWidth="1.2" strokeDasharray="4 3" />
                        <line x1={s2x} y1="265" x2={s2x} y2="15" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="4 3" />
                        <circle cx={s2x} cy={s2y} r="4" fill="#dc2626" />
                        <text x={s2x + 6} y={s2y + 13} className="fill-red-600 text-[11px] font-mono">
                          O′({originShift.x0.toFixed(1)}, {originShift.y0.toFixed(1)})
                        </text>

                        {/* r0 origin shift vector */}
                        <line x1={ox} y1={oy} x2={s2x} y2={s2y} stroke="#94a3b8" strokeWidth="1.6" strokeDasharray="2 2" />

                        {/* r1 and r2 from O */}
                        <line x1={ox} y1={oy} x2={p1x} y2={p1y} stroke="#0284c7" strokeWidth="2.2" />
                        <circle cx={p1x} cy={p1y} r="4" fill="#0284c7" />
                        <text x={p1x - 20} y={p1y - 8} className="fill-sky-700 text-xs font-mono font-semibold">
                          r₁
                        </text>

                        <line x1={ox} y1={oy} x2={p2x} y2={p2y} stroke="#0284c7" strokeWidth="2.2" />
                        <circle cx={p2x} cy={p2y} r="4" fill="#0284c7" />
                        <text x={p2x + 8} y={p2y - 6} className="fill-sky-700 text-xs font-mono font-semibold">
                          r₂
                        </text>

                        {/* r1' and r2' from O' */}
                        <line x1={s2x} y1={s2y} x2={p1x} y2={p1y} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 3" />
                        <line x1={s2x} y1={s2y} x2={p2x} y2={p2y} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 3" />

                        {/* Invariant difference vector Δr */}
                        <line x1={p1x} y1={p1y} x2={p2x} y2={p2y} stroke="#059669" strokeWidth="3.2" />
                        <text
                          x={(p1x + p2x) / 2 + 6}
                          y={(p1y + p2y) / 2 - 10}
                          className="fill-emerald-700 text-xs font-mono font-bold"
                        >
                          Δr = Δr′
                        </text>
                      </>
                    );
                  })()}
                </svg>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Vector libre Δr = Δr′</span>
                  </div>
                  <div className="mt-1 font-mono text-sm font-bold text-emerald-900 tabular-nums">
                    ({dr.dx.toFixed(1)}, {dr.dy.toFixed(1)}) = ({drPrime.dx.toFixed(1)}, {drPrime.dy.toFixed(1)})
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">En sistema S (desde O)</div>
                  <div className="mt-1 font-mono text-xs font-semibold text-sky-700 tabular-nums">
                    r₁=({r1.x.toFixed(1)}, {r1.y.toFixed(1)}) · r₂=({r2.x.toFixed(1)}, {r2.y.toFixed(1)})
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">En sistema S′ (desde O′)</div>
                  <div className="mt-1 font-mono text-xs font-semibold text-red-700 tabular-nums">
                    r₁′=({r1Prime.x.toFixed(1)}, {r1Prime.y.toFixed(1)}) · r₂′=({r2Prime.x.toFixed(1)}, {r2Prime.y.toFixed(1)})
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Traslación y Coordenadas</h3>
                <button
                  type="button"
                  onClick={() => {
                    setR1({ x: 1.5, y: 3.0 });
                    setR2({ x: 4.5, y: 2.0 });
                    setOriginShift({ x0: 1.5, y0: 1.0 });
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reiniciar
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">Traslación origen x₀</span>
                    <span className="font-mono text-red-600 tabular-nums">{originShift.x0.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min={-2}
                    max={4}
                    step={0.5}
                    value={originShift.x0}
                    onChange={(e) => setOriginShift((p) => ({ ...p, x0: parseFloat(e.target.value) }))}
                    className="sci-slider w-full"
                    aria-label="Traslación x0"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">Traslación origen y₀</span>
                    <span className="font-mono text-red-600 tabular-nums">{originShift.y0.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min={-1}
                    max={3}
                    step={0.5}
                    value={originShift.y0}
                    onChange={(e) => setOriginShift((p) => ({ ...p, y0: parseFloat(e.target.value) }))}
                    className="sci-slider w-full"
                    aria-label="Traslación y0"
                  />
                </div>

                <div className="border-t border-slate-200 pt-3 space-y-2">
                  <div className="text-xs font-semibold text-slate-800">
                    Vector r₁ = ({r1.x.toFixed(1)}, {r1.y.toFixed(1)})
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="range"
                      min={0}
                      max={6}
                      step={0.5}
                      value={r1.x}
                      onChange={(e) => setR1((p) => ({ ...p, x: parseFloat(e.target.value) }))}
                      className="sci-slider w-full"
                      aria-label="Componente x de r1"
                    />
                    <input
                      type="range"
                      min={0}
                      max={5}
                      step={0.5}
                      value={r1.y}
                      onChange={(e) => setR1((p) => ({ ...p, y: parseFloat(e.target.value) }))}
                      className="sci-slider w-full"
                      aria-label="Componente y de r1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-800">
                    Vector r₂ = ({r2.x.toFixed(1)}, {r2.y.toFixed(1)})
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="range"
                      min={0}
                      max={7}
                      step={0.5}
                      value={r2.x}
                      onChange={(e) => setR2((p) => ({ ...p, x: parseFloat(e.target.value) }))}
                      className="sci-slider w-full"
                      aria-label="Componente x de r2"
                    />
                    <input
                      type="range"
                      min={0}
                      max={5}
                      step={0.5}
                      value={r2.y}
                      onChange={(e) => setR2((p) => ({ ...p, y: parseFloat(e.target.value) }))}
                      className="sci-slider w-full"
                      aria-label="Componente y de r2"
                    />
                  </div>
                </div>
              </div>

              <EquationBox
                label="Demostración de invariancia traslacional"
                tex="\Delta\boldsymbol{r}' = \boldsymbol{r}_2' - \boldsymbol{r}_1' = (\boldsymbol{r}_2 - \boldsymbol{r}_0) - (\boldsymbol{r}_1 - \boldsymbol{r}_0) = \boldsymbol{r}_2 - \boldsymbol{r}_1 = \Delta\boldsymbol{r}"
              />
            </aside>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
            <h3 className="text-base font-semibold text-slate-900">
              Homogeneidad del Espacio y Vectores en Física
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Las leyes de la física no pueden depender de dónde coloquemos el origen arbitrario de coordenadas (principio de <strong>homogeneidad del espacio</strong>). Por ello, las cantidades físicas fundamentales como el desplazamiento <MathTex tex="\Delta\boldsymbol{r}" />, la velocidad <MathTex tex="\boldsymbol{v}" />, la aceleración <MathTex tex="\boldsymbol{a}" /> y la fuerza <MathTex tex="\boldsymbol{F}" /> deben ser vectores libres invariantes bajo traslación.
            </p>
            <EquationBox
              boxed
              number="1.1"
              tex="|\boldsymbol{A}| = \sqrt{A_x^2 + A_y^2 + A_z^2}, \qquad \hat{\boldsymbol{u}}_A = \frac{\boldsymbol{A}}{|\boldsymbol{A}|}"
            />
          </div>
        </div>
      )}

      {/* TAB 2: 1.2 PRODUCTO PUNTO Y CRUZ */}
      {tab === 'products' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  1.2.1 Producto Escalar (Trabajo) y 1.2.2 Producto Vectorial (Torque)
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  El producto escalar proyecta un vector sobre otro y produce un escalar; su ejemplo físico directo es el trabajo mecánico <MathTex tex="W = \boldsymbol{F}\cdot\Delta\boldsymbol{r}" />. El producto vectorial mide el giro y genera un vector perpendicular plano mediante la regla de la mano derecha: <MathTex tex="\boldsymbol{\tau} = \boldsymbol{r} \times \boldsymbol{F}" />.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <EquationBox
                  boxed
                  number="1.2"
                  label="Producto Escalar (Punto)"
                  tex="\boldsymbol{A}\cdot\boldsymbol{B} = |\boldsymbol{A}||\boldsymbol{B}|\cos\theta = A_x B_x + A_y B_y + A_z B_z"
                />
                <EquationBox
                  boxed
                  number="1.3"
                  label="Producto Vectorial (Cruz)"
                  tex="|\boldsymbol{A}\times\boldsymbol{B}| = |\boldsymbol{A}||\boldsymbol{B}|\sin\theta"
                />
              </div>

              {/* Interactive Wrench & Displacement SVG */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                <svg viewBox="0 0 460 220" className="w-full h-auto" role="img" aria-label="Diagrama interactivo de llave inglesa y fuerza aplicada">
                  {/* Pivot bolt */}
                  <circle cx="95" cy="135" r="14" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
                  <circle cx="95" cy="135" r="5" fill="#334155" />

                  {/* Wrench arm horizontal proportional to wrenchLengthM */}
                  {(() => {
                    const armPx = 110 + wrenchLengthM * 420; // 0.1m..0.5m -> 152..320px
                    const endX = 95 + armPx;
                    const endY = 135;
                    const fLen = 40 + (appliedForceN / 100) * 55;
                    const fx = endX + fLen * Math.cos(wrenchAngleRad);
                    const fy = endY - fLen * Math.sin(wrenchAngleRad);
                    return (
                      <>
                        {/* Lever arm */}
                        <rect x="95" y="128" width={armPx} height="14" rx="5" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
                        <line x1="95" y1="158" x2={endX} y2="158" stroke="#0284c7" strokeWidth="1.8" />
                        <text x={95 + armPx / 2} y="175" textAnchor="middle" className="fill-sky-700 text-xs font-mono font-semibold">
                          r = {(wrenchLengthM * 100).toFixed(0)} cm
                        </text>

                        {/* Reference extension line */}
                        <line x1={endX} y1={endY} x2={endX + 75} y2={endY} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 3" />

                        {/* Force vector F */}
                        <line x1={endX} y1={endY} x2={fx} y2={fy} stroke="#dc2626" strokeWidth="3" />
                        <circle cx={fx} cy={fy} r="4.5" fill="#dc2626" />
                        <text x={fx + 8} y={fy - 4} className="fill-red-700 text-xs font-mono font-bold">
                          F = {appliedForceN} N ({wrenchAngleDeg}°)
                        </text>

                        {/* Out-of-plane Torque symbol */}
                        <circle cx="95" cy="65" r="14" fill="#ffffff" stroke="#059669" strokeWidth="2" />
                        <circle cx="95" cy="65" r="4" fill="#059669" />
                        <text x="116" y="70" className="fill-emerald-700 text-xs font-mono font-bold">
                          τ = {torqueMag.toFixed(2)} N·m (saliente +k̂)
                        </text>
                      </>
                    );
                  })()}
                </svg>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3">
                  <div className="text-xs text-emerald-800 font-medium">Magnitud del Torque |τ| = r·F·sinθ</div>
                  <div className="mt-1 font-mono text-lg font-bold text-emerald-900 tabular-nums">
                    {torqueMag.toFixed(2)} N·m
                  </div>
                </div>
                <div className="rounded-lg border border-sky-200 bg-sky-50/70 p-3">
                  <div className="text-xs text-sky-800 font-medium">Trabajo W = F·Δr·cosθ (Δr = {displacementM.toFixed(1)} m)</div>
                  <div className="mt-1 font-mono text-lg font-bold text-sky-900 tabular-nums">
                    {workMag.toFixed(2)} J
                  </div>
                </div>
              </div>

              <ExampleBox title="Ejemplo resuelto (Llave inglesa, main.tex)">
                Al aplicar una fuerza de <MathTex tex="40\text{ N}" /> en el extremo de una llave de <MathTex tex="25\text{ cm}" /> (<MathTex tex="0.25\text{ m}" />) formando <MathTex tex="30^\circ" /> con el brazo, el torque es{' '}
                <MathTex tex="|\boldsymbol{\tau}| = (0.25\text{ m})(40\text{ N})\sin 30^\circ = 5.0\text{ N}\cdot\text{m}" />.
              </ExampleBox>
            </div>

            <aside className="lg:col-span-5 space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                <h3 className="text-base font-semibold text-slate-900">Parámetros de Fuerza y Brazo</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">Brazo de palanca r</span>
                      <span className="font-mono text-sky-700 tabular-nums">{wrenchLengthM.toFixed(2)} m</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={0.5}
                      step={0.05}
                      value={wrenchLengthM}
                      onChange={(e) => setWrenchLengthM(parseFloat(e.target.value))}
                      className="sci-slider w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">Fuerza aplicada F</span>
                      <span className="font-mono text-red-700 tabular-nums">{appliedForceN} N</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={appliedForceN}
                      onChange={(e) => setAppliedForceN(parseInt(e.target.value, 10))}
                      className="sci-slider w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">Ángulo θ entre vectores</span>
                      <span className="font-mono text-slate-900 tabular-nums">{wrenchAngleDeg}°</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={180}
                      step={5}
                      value={wrenchAngleDeg}
                      onChange={(e) => setWrenchAngleDeg(parseInt(e.target.value, 10))}
                      className="sci-slider w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">Desplazamiento Δr (para trabajo)</span>
                      <span className="font-mono text-slate-900 tabular-nums">{displacementM.toFixed(1)} m</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={0.5}
                      value={displacementM}
                      onChange={(e) => setDisplacementM(parseFloat(e.target.value))}
                      className="sci-slider w-full"
                    />
                  </div>
                </div>

                <EquationBox
                  label="Determinante formal del producto cruz"
                  tex="\boldsymbol{A}\times\boldsymbol{B} = \begin{vmatrix}\hat{\boldsymbol{\imath}} & \hat{\boldsymbol{\jmath}} & \hat{\boldsymbol{k}} \\ A_x & A_y & A_z \\ B_x & B_y & B_z\end{vmatrix}"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <FigureAsset
                  src="/figures/vectorproduct.png"
                  alt="Regla de la mano derecha para el producto vectorial"
                  caption="Figura original (main.tex): Regla de la mano derecha y dirección ortogonal del producto vectorial A × B."
                />
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* TAB 3: 1.3 ANÁLISIS DIMENSIONAL Y CONVERSIÓN */}
      {tab === 'dimensional' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  1.3 Homogeneidad Dimensional y Factores de Conversión
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Solo pueden sumarse o igualarse cantidades físicas con las mismas dimensiones fundamentales (<MathTex tex="[L], [M], [T]" />). En la ecuación cinemática <MathTex tex="x = v_0 t + \frac{1}{2}at^2" />, cada término se reduce a longitud:
                </p>
              </div>

              <EquationBox
                boxed
                number="1.4"
                tex="[x] = [L], \qquad [v_0 t] = \frac{[L]}{[T]}[T] = [L], \qquad \left[\frac{1}{2}at^2\right] = \frac{[L]}{[T]^2}[T]^2 = [L]"
              />

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  Deducción de las dimensiones de la constante gravitacional G
                </h3>
                <ReasoningTable
                  caption="Deducción paso a paso a partir de la Ley de Gravitación Universal de Newton (main.tex)."
                  rows={[
                    {
                      reasoning: 'Partimos de la magnitud de la fuerza gravitacional entre dos masas.',
                      developmentTex: 'F_g = G\\frac{m_1 m_2}{r^2} \\implies G = \\frac{F_g r^2}{m_1 m_2}',
                    },
                    {
                      reasoning: 'Expresamos la fuerza mediante la segunda ley de Newton (masa × aceleración).',
                      developmentTex: '[F_g] = [M]\\cdot\\frac{[L]}{[T]^2}',
                    },
                    {
                      reasoning: 'Sustituimos [F_g], [r²] = [L]² y las masas [m₁ m₂] = [M]² en G.',
                      developmentTex: '[G] = \\frac{([M][L]/[T]^2)\\cdot [L]^2}{[M]^2} = \\frac{[L]^3}{[M][T]^2}',
                    },
                    {
                      reasoning: 'Concluimos sus unidades en el Sistema Internacional (SI).',
                      developmentTex: '\\text{Unidades SI}(G) = \\frac{\\text{m}^3}{\\text{kg}\\cdot\\text{s}^2} = \\text{N}\\cdot\\text{m}^2/\\text{kg}^2',
                    },
                  ]}
                />
              </div>
            </div>

            <aside className="lg:col-span-5 space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                <h3 className="text-base font-semibold text-slate-900">
                  Calculadora de Factores Unitarios
                </h3>
                <p className="text-xs text-slate-600">
                  Multiplicar por fracciones equivalentes iguales a la unidad conserva el valor físico de la medida.
                </p>

                <div className="space-y-2 border-t border-slate-200 pt-3">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">Rapidez en km/h</span>
                    <span className="font-mono font-bold text-sky-700 tabular-nums">{speedKmh} km/h</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={200}
                    step={5}
                    value={speedKmh}
                    onChange={(e) => setSpeedKmh(parseInt(e.target.value, 10))}
                    className="sci-slider w-full"
                  />
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <MathTex
                      block
                      tex={`${speedKmh}\\frac{\\text{km}}{\\text{h}} \\cdot \\frac{1000\\text{ m}}{1\\text{ km}} \\cdot \\frac{1\\text{ h}}{3600\\text{ s}} = ${speedMs.toFixed(2)}\\text{ m/s}`}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-200 pt-3">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">Área en m² (ej. 2 m²)</span>
                    <span className="font-mono font-bold text-emerald-700 tabular-nums">{areaM2} m²</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.5}
                    value={areaM2}
                    onChange={(e) => setAreaM2(parseFloat(e.target.value))}
                    className="sci-slider w-full"
                  />
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <MathTex
                      block
                      tex={`${areaM2}\\text{ m}^2 \\cdot \\left(\\frac{100\\text{ cm}}{1\\text{ m}}\\right)^2 = ${areaCm2.toLocaleString('es-ES')}\\text{ cm}^2`}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* TAB 4: 1.4–1.5 UNIDADES NATURALES Y SO(2) */}
      {tab === 'natural_so2' && (
        <div className="space-y-8">
          {/* 1.4 Natural Units */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">
                1.4 Sistema Internacional vs. Unidades Naturales (ħ = c = 1)
              </h2>
              <p className="text-sm text-slate-600">
                En física de partículas y relatividad resulta natural fijar <MathTex tex="\hbar = c = \varepsilon_0 = k_B = 1" />, reduciendo tiempo, longitud, masa y temperatura a potencias de una única dimensión fundamental: la energía (<MathTex tex="\text{eV}, \text{MeV}, \text{GeV}" />).
              </p>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Magnitud</th>
                      <th className="px-4 py-2.5 font-semibold">Dimensión</th>
                      <th className="px-4 py-2.5 font-semibold">Unidades SI</th>
                      <th className="px-4 py-2.5 font-semibold">Unidades Naturales</th>
                      <th className="px-4 py-2.5 font-semibold">Factor de conversión exacto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Tiempo</td>
                      <td className="px-4 py-2.5 font-mono">T</td>
                      <td className="px-4 py-2.5">segundo (s)</td>
                      <td className="px-4 py-2.5"><MathTex tex="\hbar / E" /></td>
                      <td className="px-4 py-2.5 font-mono tabular-nums">1 s = 1.519×10¹⁵ ħ/eV</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Longitud</td>
                      <td className="px-4 py-2.5 font-mono">L</td>
                      <td className="px-4 py-2.5">metro (m)</td>
                      <td className="px-4 py-2.5"><MathTex tex="\hbar c / E" /></td>
                      <td className="px-4 py-2.5 font-mono tabular-nums">1 m = 5.068×10⁶ ħc/eV</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Masa</td>
                      <td className="px-4 py-2.5 font-mono">M</td>
                      <td className="px-4 py-2.5">kilogramo (kg)</td>
                      <td className="px-4 py-2.5"><MathTex tex="E / c^2" /></td>
                      <td className="px-4 py-2.5 font-mono tabular-nums">1 kg = 5.610×10²⁶ GeV/c²</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Carga eléctrica</td>
                      <td className="px-4 py-2.5 font-mono">Q</td>
                      <td className="px-4 py-2.5">Coulomb (C)</td>
                      <td className="px-4 py-2.5"><MathTex tex="\sqrt{\varepsilon_0 \hbar c}" /></td>
                      <td className="px-4 py-2.5 font-mono tabular-nums">e ≈ 0.3028 (adimensional)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Temperatura</td>
                      <td className="px-4 py-2.5 font-mono">Θ</td>
                      <td className="px-4 py-2.5">Kelvin (K)</td>
                      <td className="px-4 py-2.5"><MathTex tex="E / k_B" /></td>
                      <td className="px-4 py-2.5 font-mono tabular-nums">1 eV / k_B ≈ 11,604.5 K</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Conversor SI ↔ Naturales</h3>
              <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
                {(
                  [
                    { id: 'mass', label: 'Masa' },
                    { id: 'length', label: 'Longitud' },
                    { id: 'time', label: 'Tiempo' },
                  ] as const
                ).map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setQuantityType(q.id)}
                    className={`rounded-md py-1 text-xs font-medium cursor-pointer ${
                      quantityType === q.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">Mantisa</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">{mantissa.toFixed(4)}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={9.9}
                  step={0.01}
                  value={mantissa}
                  onChange={(e) => setMantissa(parseFloat(e.target.value))}
                  className="sci-slider w-full"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">Exponente 10ⁿ ({natConverted.invUnit})</span>
                  <span className="font-mono font-semibold text-sky-700 tabular-nums">10^{exponent}</span>
                </div>
                <input
                  type="range"
                  min={-31}
                  max={0}
                  step={1}
                  value={exponent}
                  onChange={(e) => setExponent(parseInt(e.target.value, 10))}
                  className="sci-slider w-full"
                />
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1.5">
                <div className="text-[11px] text-slate-500">Valor en SI</div>
                <div className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                  {siValue.toExponential(4)} {natConverted.invUnit}
                </div>
                <div className="text-[11px] text-slate-500 pt-1">En Unidades Naturales</div>
                <div className="font-mono text-base font-bold text-sky-700 tabular-nums">
                  {natConverted.value >= 0.01 && natConverted.value < 1e4
                    ? natConverted.value.toFixed(4)
                    : natConverted.value.toExponential(4)}{' '}
                  {natConverted.unit}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setQuantityType('mass');
                    setMantissa(1.6726);
                    setExponent(-27);
                  }}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Protón (0.938 GeV)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuantityType('mass');
                    setMantissa(9.1094);
                    setExponent(-31);
                  }}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Electrón (0.511 MeV)
                </button>
              </div>
            </aside>
          </div>

          {/* 1.5 SO(2) Rotation Invariance */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  1.5 Invariancia del Producto Escalar bajo Rotación SO(2)
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  La isotropía del espacio exige que la norma euclidiana <MathTex tex="r^2 = x^2 + y^2" /> sea idéntica para dos observadores cuyos ejes estén rotados un ángulo <MathTex tex="\theta" /> (<MathTex tex="x'^2 + y'^2 = x^2 + y^2" />).
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 flex justify-center">
                <svg viewBox="0 0 360 260" className="w-full max-w-md h-auto" role="img" aria-label="Rotación de ejes coordenados por ángulo theta">
                  <circle cx="180" cy="130" r="100" fill="none" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="40" y1="130" x2="320" y2="130" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="180" y1="245" x2="180" y2="15" stroke="#94a3b8" strokeWidth="1.5" />
                  <text x="312" y="124" className="fill-slate-600 text-xs font-mono">x</text>
                  <text x="186" y="25" className="fill-slate-600 text-xs font-mono">y</text>

                  <g transform={`rotate(${-thetaDeg} 180 130)`}>
                    <line x1="50" y1="130" x2="310" y2="130" stroke="#dc2626" strokeWidth="1.8" strokeDasharray="5 3" />
                    <line x1="180" y1="235" x2="180" y2="25" stroke="#dc2626" strokeWidth="1.8" strokeDasharray="5 3" />
                    <text x="300" y="122" className="fill-red-600 text-xs font-mono font-semibold">x′</text>
                    <text x="186" y="34" className="fill-red-600 text-xs font-mono font-semibold">y′</text>
                  </g>

                  {(() => {
                    const sc = 20;
                    const px = 180 + vecR.x * sc;
                    const py = 130 - vecR.y * sc;
                    return (
                      <>
                        <line x1="180" y1="130" x2={px} y2={py} stroke="#0284c7" strokeWidth="3" />
                        <circle cx={px} cy={py} r="5" fill="#0284c7" />
                        <text x={px + 8} y={py - 4} className="fill-sky-700 text-xs font-mono font-bold">
                          r = ({vecR.x.toFixed(1)}, {vecR.y.toFixed(1)})
                        </text>
                      </>
                    );
                  })()}
                </svg>
              </div>

              <EquationBox
                boxed
                number="1.5"
                tex="\begin{pmatrix} x' \\ y' \end{pmatrix} = \begin{pmatrix} \cos\theta & \sin\theta \\ -\sin\theta & \cos\theta \end{pmatrix}\begin{pmatrix} x \\ y \end{pmatrix} \implies x'^2 + y'^2 = x^2(\cos^2\theta + \sin^2\theta) + y^2(\sin^2\theta + \cos^2\theta) = x^2 + y^2"
              />
            </div>

            <aside className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Ángulo de Rotación</h3>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">Ángulo θ</span>
                  <span className="font-mono font-semibold text-red-600 tabular-nums">{thetaDeg}°</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={1}
                  value={thetaDeg}
                  onChange={(e) => setThetaDeg(parseInt(e.target.value, 10))}
                  className="sci-slider w-full"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">Componente x</span>
                  <span className="font-mono text-slate-900 tabular-nums">{vecR.x.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={-4.5}
                  max={4.5}
                  step={0.5}
                  value={vecR.x}
                  onChange={(e) => setVecR((p) => ({ ...p, x: parseFloat(e.target.value) }))}
                  className="sci-slider w-full"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">Componente y</span>
                  <span className="font-mono text-slate-900 tabular-nums">{vecR.y.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={-4.5}
                  max={4.5}
                  step={0.5}
                  value={vecR.y}
                  onChange={(e) => setVecR((p) => ({ ...p, y: parseFloat(e.target.value) }))}
                  className="sci-slider w-full"
                />
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2 text-xs">
                <div className="flex justify-between font-mono tabular-nums">
                  <span className="text-slate-600">x′ rotado:</span>
                  <span className="font-semibold text-red-600">{xRot.toFixed(3)}</span>
                </div>
                <div className="flex justify-between font-mono tabular-nums">
                  <span className="text-slate-600">y′ rotado:</span>
                  <span className="font-semibold text-red-600">{yRot.toFixed(3)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-mono font-bold text-emerald-700 tabular-nums">
                  <span>x²+y² = x′²+y′²</span>
                  <span>{normSq.toFixed(2)} = {normSqRot.toFixed(2)}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* TAB 5: EJERCICIOS (20) */}
      {tab === 'exercises' && <Ch1ExercisesSection />}
    </div>
  );
};
