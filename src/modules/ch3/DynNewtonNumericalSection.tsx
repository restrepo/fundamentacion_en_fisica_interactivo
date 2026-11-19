import React, { useMemo, useState } from 'react';
import { MathTex } from '../../components/MathTex';
import { EquationBox } from '../../components/LatexBlocks';

export const DynNewtonNumericalSection: React.FC = () => {
  const [simMode, setSimMode] = useState<'harmonic' | 'vertical'>('harmonic');
  const [dtStep, setDtStep] = useState<number>(0.25); // s (harmonic 0.05..1.0; vertical 0.05..0.5)
  const [chordDt, setChordDt] = useState<number>(0.8); // for instantaneous velocity tangent SVG

  // Harmonic Oscillator Euler-Cromer (m = 1 kg, k = 1 N/m, x0 = 1 m, v0 = 0)
  const harmonicRows = useMemo(() => {
    const dt = dtStep;
    const steps = dt >= 0.8 ? 6 : 16;
    const rows: Array<{
      step: number;
      t: number;
      x: number;
      v: number;
      f: number;
      xExact: number;
    }> = [];
    let x = 1.0;
    let v = 0.0;
    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      const f = -1.0 * x;
      rows.push({ step: i, t, x, v, f, xExact: Math.cos(t) });
      // Euler-Cromer update: v_{n+1} = v_n + a_n * dt; x_{n+1} = x_n + v_{n+1} * dt
      v = v + f * dt;
      x = x + v * dt;
    }
    return rows;
  }, [dtStep]);

  // Vertical Throw Euler-Cromer (v0 = 10 m/s, g = 10 m/s^2, y0 = 0)
  const verticalRows = useMemo(() => {
    const dt = Math.min(dtStep, 0.4);
    const maxSteps = Math.min(25, Math.ceil(2.1 / dt));
    const rows: Array<{
      step: number;
      t: number;
      y: number;
      v: number;
      yExact: number;
    }> = [];
    let y = 0;
    let v = 10.0;
    for (let i = 0; i <= maxSteps; i++) {
      const t = i * dt;
      const yExact = 10 * t - 5 * t * t;
      rows.push({ step: i, t, y, v, yExact });
      v = v - 10.0 * dt;
      y = y + v * dt;
      if (y < -0.5 && i > 1) break;
    }
    return rows;
  }, [dtStep]);

  // Plot paths for SVG
  const svgPlot = useMemo(() => {
    if (simMode === 'harmonic') {
      const tMax = harmonicRows[harmonicRows.length - 1]?.t || 6;
      const exactPts: string[] = [];
      for (let i = 0; i <= 80; i++) {
        const t = (i / 80) * tMax;
        const px = 45 + (t / tMax) * 380;
        const py = 105 - Math.cos(t) * 65;
        exactPts.push(`${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`);
      }
      const numPts = harmonicRows
        .map((r, i) => {
          const px = 45 + (r.t / tMax) * 380;
          const clampedX = Math.max(-1.6, Math.min(1.6, r.x));
          const py = 105 - clampedX * 65;
          return `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`;
        })
        .join(' ');
      return { exactPath: exactPts.join(' '), numPath: numPts, tMax };
    } else {
      const tMax = 2.0;
      const exactPts: string[] = [];
      for (let i = 0; i <= 60; i++) {
        const t = (i / 60) * tMax;
        const y = 10 * t - 5 * t * t;
        const px = 45 + (t / tMax) * 380;
        const py = 165 - (y / 6.0) * 130;
        exactPts.push(`${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`);
      }
      const numPts = verticalRows
        .map((r, i) => {
          const px = 45 + (Math.min(r.t, tMax) / tMax) * 380;
          const py = 165 - (Math.max(-0.5, r.y) / 6.0) * 130;
          return `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`;
        })
        .join(' ');
      return { exactPath: exactPts.join(' '), numPath: numPts, tMax };
    }
  }, [simMode, harmonicRows, verticalRows]);

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-slate-500">
          Capítulo 3 · Secciones 3.1 – 3.3
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Leyes de Newton, Velocidad Instantánea e Integración Numérica Euler-Cromer
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
          La segunda ley en su forma general relaciona fuerza neta con tasa de cambio del momento lineal (<MathTex tex="\boldsymbol{F} = \Delta\boldsymbol{p}/\Delta t" />). Cuando la fuerza depende de la posición o no hay solución analítica simple, el algoritmo discreto de <strong>Euler-Cromer</strong> predice la evolución temporal paso a paso.
        </p>
      </div>

      {/* Interactive Euler-Cromer Integrator */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                3.2–3.3 Algoritmo de Euler-Cromer: Solución Numérica vs. Analítica
              </h2>
              <p className="text-xs text-slate-600">
                {simMode === 'harmonic'
                  ? 'Oscilador armónico F = −kx (m = 1 kg, k = 1 N/m, x₀ = 1 m, v₀ = 0).'
                  : 'Lanzamiento vertical F = −mg (v₀ = 10 m/s, g = 10 m/s², recreando position.pdf).'}
              </p>
            </div>

            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setSimMode('harmonic');
                  setDtStep(1.0);
                }}
                className={`rounded-md px-3 py-1 text-xs font-medium cursor-pointer ${
                  simMode === 'harmonic' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Oscilador (F = −kx)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSimMode('vertical');
                  setDtStep(0.1);
                }}
                className={`rounded-md px-3 py-1 text-xs font-medium cursor-pointer ${
                  simMode === 'vertical' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Lanzamiento Vertical
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
            <svg viewBox="0 0 460 195" className="w-full h-auto" role="img" aria-label="Gráfica comparativa entre integración Euler-Cromer y solución analítica">
              <line x1="45" y1={simMode === 'harmonic' ? 105 : 165} x2="435" y2={simMode === 'harmonic' ? 105 : 165} stroke="#94a3b8" strokeWidth="1.2" />
              <line x1="45" y1="20" x2="45" y2="175" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Analytic curve */}
              <path d={svgPlot.exactPath} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 3" />
              {/* Euler-Cromer curve */}
              <path d={svgPlot.numPath} fill="none" stroke="#0284c7" strokeWidth="2.5" />

              {/* Points */}
              {(simMode === 'harmonic' ? harmonicRows : verticalRows).map((r) => {
                const px = 45 + (Math.min(r.t, svgPlot.tMax) / svgPlot.tMax) * 380;
                const val = simMode === 'harmonic' ? (r as { x: number }).x : (r as { y: number }).y;
                const py =
                  simMode === 'harmonic'
                    ? 105 - Math.max(-1.6, Math.min(1.6, val)) * 65
                    : 165 - (Math.max(-0.5, val) / 6.0) * 130;
                return <circle key={r.step} cx={px} cy={py} r="3.2" fill="#dc2626" />;
              })}

              <text x="240" y="190" textAnchor="middle" className="fill-slate-600 text-[10px] font-mono">
                Tiempo t (s) · Azul/Rojo: Euler-Cromer (Δt={dtStep.toFixed(2)} s) · Gris discontinuo: Exacta
              </text>
            </svg>
          </div>

          {/* Step-by-step numerical table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200 max-h-56 overflow-y-auto">
            <table className="w-full text-left text-xs font-mono tabular-nums">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="px-3 py-2">Paso i</th>
                  <th className="px-3 py-2">t (s)</th>
                  <th className="px-3 py-2">{simMode === 'harmonic' ? 'x num (m)' : 'y num (m)'}</th>
                  <th className="px-3 py-2">v (m/s)</th>
                  <th className="px-3 py-2">{simMode === 'harmonic' ? 'x exacta = cos(t)' : 'y exacta (m)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(simMode === 'harmonic' ? harmonicRows.slice(0, 10) : verticalRows.slice(0, 10)).map((r) => (
                  <tr key={r.step}>
                    <td className="px-3 py-1.5">{r.step}</td>
                    <td className="px-3 py-1.5">{r.t.toFixed(2)}</td>
                    <td className="px-3 py-1.5 font-semibold text-sky-700">
                      {simMode === 'harmonic' ? (r as { x: number }).x.toFixed(3) : (r as { y: number }).y.toFixed(3)}
                    </td>
                    <td className="px-3 py-1.5">{r.v.toFixed(3)}</td>
                    <td className="px-3 py-1.5 text-slate-500">
                      {simMode === 'harmonic'
                        ? (r as { xExact: number }).xExact.toFixed(3)
                        : (r as { yExact: number }).yExact.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right sidebar: Step control + Flowchart */}
        <aside className="lg:col-span-4 space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Paso de Integración Δt</h3>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Tamaño de paso Δt</span>
                <span className="font-mono font-bold text-red-600 tabular-nums">{dtStep.toFixed(2)} s</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={simMode === 'harmonic' ? 1.0 : 0.4}
                step={0.05}
                value={dtStep}
                onChange={(e) => setDtStep(parseFloat(e.target.value))}
                className="sci-slider w-full"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDtStep(1.0)}
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Δt = 1.0 s (Tabla libro)
              </button>
              <button
                type="button"
                onClick={() => setDtStep(0.05)}
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Δt = 0.05 s (Preciso)
              </button>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1.5 text-xs">
              <div className="font-semibold text-slate-900">Esquema iterativo Euler-Cromer:</div>
              <MathTex block tex="F_n = F(x_n) \implies v_{n+1} = v_n + \frac{F_n}{m}\Delta t" />
              <MathTex block tex="x_{n+1} = x_n + v_{n+1}\Delta t, \quad t_{n+1} = t_n + \Delta t" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
            <h3 className="text-base font-semibold text-slate-900">
              3.1 Secante vs. Tangente (Velocidad Instantánea)
            </h3>
            <p className="text-xs text-slate-600">
              Al hacer <MathTex tex="\Delta t \to 0" />, la pendiente de la recta secante tiende a la recta tangente <MathTex tex="v_x = dx/dt" />.
            </p>
            <svg viewBox="0 0 280 140" className="w-full h-auto rounded border border-slate-200 bg-slate-50 p-1" role="img" aria-label="Recta secante convergiendo a la tangente">
              <line x1="25" y1="120" x2="260" y2="120" stroke="#94a3b8" strokeWidth="1.2" />
              <line x1="25" y1="15" x2="25" y2="120" stroke="#94a3b8" strokeWidth="1.2" />
              <path d="M 30 112 Q 145 98 245 25" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              {(() => {
                // Anchor t1 at x=100 (u=0.33), t2 shifts by chordDt
                const t1 = 0.35;
                const t2 = Math.min(0.95, t1 + chordDt * 0.6);
                const pt = (u: number) => ({
                  x: 30 + u * 215,
                  y: 112 - u * u * 87,
                });
                const p1 = pt(t1);
                const p2 = pt(t2);
                return (
                  <>
                    <line x1={p1.x - 30} y1={p1.y + ((p1.y - p2.y) / (p2.x - p1.x)) * 30} x2={p2.x + 25} y2={p2.y - ((p1.y - p2.y) / (p2.x - p1.x)) * 25} stroke="#dc2626" strokeWidth="1.8" />
                    <circle cx={p1.x} cy={p1.y} r="4" fill="#dc2626" />
                    <circle cx={p2.x} cy={p2.y} r="4" fill="#059669" />
                  </>
                );
              })()}
            </svg>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-600">Intervalo Δt de la secante</span>
                <span className="font-mono font-semibold text-red-600">{chordDt.toFixed(2)} s</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={1.0}
                step={0.05}
                value={chordDt}
                onChange={(e) => setChordDt(parseFloat(e.target.value))}
                className="sci-slider w-full"
              />
            </div>
          </div>
        </aside>
      </div>

      <EquationBox
        boxed
        number="3.1"
        label="Segunda Ley de Newton en términos del momento lineal"
        tex="\boldsymbol{F}_{\text{neta}} = \lim_{\Delta t \to 0}\frac{\Delta\boldsymbol{p}}{\Delta t} = \frac{d\boldsymbol{p}}{dt} \approx m\boldsymbol{a} \quad (\text{si } m \text{ es constante y } v \ll c)"
      />
    </div>
  );
};
