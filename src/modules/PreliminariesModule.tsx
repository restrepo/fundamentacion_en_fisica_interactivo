import React, { useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { MathTex } from '../components/MathTex';

type PrelimTab = 'vectors' | 'rotation' | 'units';

export const PreliminariesModule: React.FC = () => {
  const [tab, setTab] = useState<PrelimTab>('vectors');

  // Vector translation invariance state
  const [r1, setR1] = useState({ x: 1, y: 3 });
  const [r2, setR2] = useState({ x: 4, y: 2 });
  const [originShift, setOriginShift] = useState({ x0: 1.5, y0: 1.0 });

  // SO(2) Rotation state
  const [thetaDeg, setThetaDeg] = useState<number>(30);
  const [vecR, setVecR] = useState({ x: 4.0, y: 2.5 });

  // Natural Units converter state
  const [massKgExp, setMassKgExp] = useState<number>(-27); // 1.67 x 10^exp kg
  const [massCoeff, setMassCoeff] = useState<number>(1.6726);

  // Translation invariance computations
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
  const dotProduct = r1.x * r2.x + r1.y * r2.y;
  const crossZ = r1.x * r2.y - r1.y * r2.x;

  // Rotation SO(2) computations
  const thetaRad = (thetaDeg * Math.PI) / 180;
  const xRot = vecR.x * Math.cos(thetaRad) + vecR.y * Math.sin(thetaRad);
  const yRot = -vecR.x * Math.sin(thetaRad) + vecR.y * Math.cos(thetaRad);
  const normSq = vecR.x * vecR.x + vecR.y * vecR.y;
  const normSqRot = xRot * xRot + yRot * yRot;

  // Natural units mass -> GeV/c^2 (1 kg = 5.609588603e26 GeV/c^2 from main.tex line 742)
  const massKg = massCoeff * Math.pow(10, massKgExp);
  const massGeV = massKg * 5.609588603e26;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Capítulo 1 · Preliminares Matemáticos
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Vectores, Homogeneidad del Espacio y Rotación SO(2)
          </h1>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-600">
            Explora por qué los vectores libres son invariantes bajo traslación, comprueba que el producto escalar sobrevive a rotaciones de ejes y convierte cantidades al sistema de unidades naturales.
          </p>
        </div>

        <div
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 self-start lg:self-auto"
          role="tablist"
          aria-label="Secciones de Preliminares"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'vectors'}
            onClick={() => setTab('vectors')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              tab === 'vectors'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Invariancia Traslacional
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'rotation'}
            onClick={() => setTab('rotation')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              tab === 'rotation'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rotación SO(2)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'units'}
            onClick={() => setTab('units')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              tab === 'units'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Unidades Naturales
          </button>
        </div>
      </div>

      {tab === 'vectors' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Vectores Libres vs. Vectores Ligados: Homogeneidad del Espacio
              </h2>
              <p className="text-xs text-slate-500">
                Al trasladar el origen de S a S′(x₀, y₀), los vectores posición r₁ y r₂ cambian, pero el vector diferencia Δr = r₂ − r₁ permanece idéntico.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
              <svg viewBox="0 0 460 280" className="w-full h-auto max-h-[360px]" role="img" aria-label="Invariancia traslacional del vector diferencia">
                <defs>
                  <pattern id="vecGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e2e8f0" strokeWidth="0.7" />
                  </pattern>
                </defs>
                <rect width="460" height="280" fill="url(#vecGrid)" rx="6" />

                {/* Origin S at (120, 220), scale 32px/unit */}
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
                      <line x1="20" y1={oy} x2="430" y2={oy} stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1={ox} y1="265" x2={ox} y2="15" stroke="#94a3b8" strokeWidth="1.5" />
                      <text x={ox - 16} y={oy + 14} className="fill-slate-600 text-xs font-mono">O</text>

                      {/* Shifted Axes S' */}
                      <line x1="20" y1={s2y} x2="430" y2={s2y} stroke="#f87171" strokeWidth="1.2" strokeDasharray="4 3" />
                      <line x1={s2x} y1="265" x2={s2x} y2="15" stroke="#f87171" strokeWidth="1.2" strokeDasharray="4 3" />
                      <circle cx={s2x} cy={s2y} r="4" fill="#dc2626" />
                      <text x={s2x + 6} y={s2y + 13} className="fill-red-600 text-[11px] font-mono">
                        O′({originShift.x0.toFixed(1)}, {originShift.y0.toFixed(1)})
                      </text>

                      {/* r1 and r2 from O */}
                      <line x1={ox} y1={oy} x2={p1x} y2={p1y} stroke="#0284c7" strokeWidth="2" />
                      <circle cx={p1x} cy={p1y} r="4" fill="#0284c7" />
                      <text x={p1x - 18} y={p1y - 8} className="fill-sky-700 text-xs font-mono font-semibold">r₁</text>

                      <line x1={ox} y1={oy} x2={p2x} y2={p2y} stroke="#0284c7" strokeWidth="2" />
                      <circle cx={p2x} cy={p2y} r="4" fill="#0284c7" />
                      <text x={p2x + 8} y={p2y - 6} className="fill-sky-700 text-xs font-mono font-semibold">r₂</text>

                      {/* r1' and r2' from O' */}
                      <line x1={s2x} y1={s2y} x2={p1x} y2={p1y} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 3" />
                      <line x1={s2x} y1={s2y} x2={p2x} y2={p2y} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 3" />

                      {/* Invariant difference vector Δr */}
                      <line x1={p1x} y1={p1y} x2={p2x} y2={p2y} stroke="#059669" strokeWidth="3" />
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
                  <span>Δr = Δr′ (Invariante)</span>
                </div>
                <div className="mt-1 font-mono text-sm font-bold text-emerald-900 tabular-nums">
                  ({dr.dx.toFixed(1)}, {dr.dy.toFixed(1)}) = ({drPrime.dx.toFixed(1)}, {drPrime.dy.toFixed(1)})
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs text-slate-500">Producto Escalar r₁ · r₂</div>
                <div className="mt-1 font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {dotProduct.toFixed(2)}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs text-slate-500">Producto Cruz (r₁ × r₂)_z</div>
                <div className="mt-1 font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {crossZ.toFixed(2)} (área)
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Coordenadas y Traslación</h3>
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
                />
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-2">
                <div className="text-xs font-semibold text-slate-800">Vector r₁ = ({r1.x}, {r1.y})</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="range"
                    min={0}
                    max={6}
                    step={0.5}
                    value={r1.x}
                    onChange={(e) => setR1((p) => ({ ...p, x: parseFloat(e.target.value) }))}
                    className="sci-slider w-full"
                    aria-label="r1 x"
                  />
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.5}
                    value={r1.y}
                    onChange={(e) => setR1((p) => ({ ...p, y: parseFloat(e.target.value) }))}
                    className="sci-slider w-full"
                    aria-label="r1 y"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-800">Vector r₂ = ({r2.x}, {r2.y})</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="range"
                    min={0}
                    max={7}
                    step={0.5}
                    value={r2.x}
                    onChange={(e) => setR2((p) => ({ ...p, x: parseFloat(e.target.value) }))}
                    className="sci-slider w-full"
                    aria-label="r2 x"
                  />
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.5}
                    value={r2.y}
                    onChange={(e) => setR2((p) => ({ ...p, y: parseFloat(e.target.value) }))}
                    className="sci-slider w-full"
                    aria-label="r2 y"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <MathTex
                block
                tex="\Delta\boldsymbol{r}' = (x_2 - x_0 - (x_1 - x_0), \dots) = \Delta\boldsymbol{r}"
                className="text-xs"
              />
            </div>
          </aside>
        </div>
      )}

      {tab === 'rotation' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Invariancia del Producto Escalar bajo Rotación SO(2)
              </h2>
              <p className="text-xs text-slate-500">
                Al rotar los ejes un ángulo θ = {thetaDeg}°, las componentes (x′, y′) cambian, pero la magnitud al cuadrado x′² + y′² permanece constante.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 flex justify-center">
              <svg viewBox="0 0 360 280" className="w-full max-w-md h-auto" role="img" aria-label="Rotación de ejes coordenados por ángulo theta">
                {/* Center (180, 140), scale 22 */}
                <circle cx="180" cy="140" r="105" fill="none" stroke="#e2e8f0" strokeDasharray="3 3" />
                {/* S axes */}
                <line x1="40" y1="140" x2="320" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="180" y1="265" x2="180" y2="15" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="312" y="134" className="fill-slate-600 text-xs font-mono">x</text>
                <text x="186" y="25" className="fill-slate-600 text-xs font-mono">y</text>

                {/* Rotated axes S' */}
                <g transform={`rotate(${-thetaDeg} 180 140)`}>
                  <line x1="50" y1="140" x2="310" y2="140" stroke="#dc2626" strokeWidth="1.8" strokeDasharray="5 3" />
                  <line x1="180" y1="255" x2="180" y2="25" stroke="#dc2626" strokeWidth="1.8" strokeDasharray="5 3" />
                  <text x="300" y="132" className="fill-red-600 text-xs font-mono font-semibold">x′</text>
                  <text x="186" y="34" className="fill-red-600 text-xs font-mono font-semibold">y′</text>
                </g>

                {/* Vector r */}
                {(() => {
                  const sc = 22;
                  const px = 180 + vecR.x * sc;
                  const py = 140 - vecR.y * sc;
                  return (
                    <>
                      <line x1="180" y1="140" x2={px} y2={py} stroke="#0284c7" strokeWidth="3" />
                      <circle cx={px} cy={py} r="5" fill="#0284c7" />
                      <text x={px + 8} y={py - 4} className="fill-sky-700 text-xs font-mono font-bold">
                        r = ({vecR.x.toFixed(1)}, {vecR.y.toFixed(1)})
                      </text>
                    </>
                  );
                })()}
              </svg>
            </div>

            <MathTex
              block
              tex="x'^2 + y'^2 = (x\cos\theta + y\sin\theta)^2 + (-x\sin\theta + y\cos\theta)^2 = x^2(\cos^2\theta+\sin^2\theta) + y^2(\sin^2\theta+\cos^2\theta) = x^2 + y^2"
              className="text-sm"
            />
          </div>

          <aside className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 space-y-5">
            <h3 className="text-base font-semibold text-slate-900">Ángulo y Coordenadas</h3>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="rot-theta" className="font-medium text-slate-700">Ángulo de rotación θ</label>
                <span className="font-mono font-semibold text-red-600 tabular-nums">{thetaDeg}°</span>
              </div>
              <input
                id="rot-theta"
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
                <span className="text-slate-600">x′:</span>
                <span className="font-semibold text-red-600">{xRot.toFixed(3)}</span>
              </div>
              <div className="flex justify-between font-mono tabular-nums">
                <span className="text-slate-600">y′:</span>
                <span className="font-semibold text-red-600">{yRot.toFixed(3)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-mono font-bold text-emerald-700 tabular-nums">
                <span>x²+y² = x′²+y′²</span>
                <span>{normSq.toFixed(2)} = {normSqRot.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {tab === 'units' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <h2 className="text-base font-semibold text-slate-900">
              Tabla de Unidades Fundamentales y Unidades Naturales (Sección 1.4)
            </h2>
            <p className="text-xs text-slate-600">
              Las constantes fundamentales ħ, c, ε₀ y k_B permiten expresar cualquier cantidad física en términos de energía (eV, MeV, GeV).
            </p>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Magnitud</th>
                    <th className="px-4 py-2.5 font-semibold">Dimensión</th>
                    <th className="px-4 py-2.5 font-semibold">Unidades SI</th>
                    <th className="px-4 py-2.5 font-semibold">Unidades Naturales</th>
                    <th className="px-4 py-2.5 font-semibold">Equivalencia</th>
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
                    <td className="px-4 py-2.5 font-medium">Distancia</td>
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
                    <td className="px-4 py-2.5"><MathTex tex="\sqrt{\epsilon_0 \hbar c}" /></td>
                    <td className="px-4 py-2.5 font-mono tabular-nums">e ≈ 0.3028 (Heaviside-Lorentz)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <aside className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Conversor Masa ↔ GeV/c²</h3>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Mantisa</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">{massCoeff.toFixed(4)}</span>
              </div>
              <input
                type="range"
                min={1}
                max={9.9}
                step={0.01}
                value={massCoeff}
                onChange={(e) => setMassCoeff(parseFloat(e.target.value))}
                className="sci-slider w-full"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Exponente 10ⁿ (kg)</span>
                <span className="font-mono font-semibold text-sky-700 tabular-nums">10^{massKgExp}</span>
              </div>
              <input
                type="range"
                min={-31}
                max={0}
                step={1}
                value={massKgExp}
                onChange={(e) => setMassKgExp(parseInt(e.target.value, 10))}
                className="sci-slider w-full"
              />
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1.5">
              <div className="text-[11px] text-slate-500">Masa en SI</div>
              <div className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                {massKg.toExponential(4)} kg
              </div>
              <div className="text-[11px] text-slate-500 pt-1">Equivalente en Unidades Naturales</div>
              <div className="font-mono text-base font-bold text-sky-700 tabular-nums">
                {massGeV >= 0.01 && massGeV < 1e4 ? massGeV.toFixed(4) : massGeV.toExponential(4)} GeV/c²
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setMassCoeff(1.6726); setMassKgExp(-27); }}
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Protón (≈0.938 GeV)
              </button>
              <button
                type="button"
                onClick={() => { setMassCoeff(9.1094); setMassKgExp(-31); }}
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Electrón (≈0.511 MeV)
              </button>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};
