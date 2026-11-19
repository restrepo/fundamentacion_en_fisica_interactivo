import React, { useMemo, useState } from 'react';
import { MathTex } from '../../components/MathTex';
import { FigureAsset } from '../../components/FigureAsset';
import { EquationBox, ExampleBox, HistoricalCapsule } from '../../components/LatexBlocks';

export const RelTimeLengthSection: React.FC = () => {
  const [beta, setBeta] = useState<number>(0.87);
  const [interferometerBeta, setInterferometerBeta] = useState<number>(0.6);
  const [muonAltKm, setMuonAltKm] = useState<number>(15);

  const gamma = useMemo(() => 1 / Math.sqrt(1 - beta * beta), [beta]);

  // Interferometer comparison: ether vs special relativity
  const interf = useMemo(() => {
    const g = 1 / Math.sqrt(1 - interferometerBeta * interferometerBeta);
    // In ether: t_perp = gamma * t0, t_parallel = gamma^2 * t0
    // With length contraction L = L0 / gamma: t_parallel = t_perp = gamma * t0
    return {
      g,
      tPerpRatio: g,
      tParEtherRatio: g * g,
      tParEinsteinRatio: g,
    };
  }, [interferometerBeta]);

  // Muon example (main.tex lines 2390-2459)
  const muonData = useMemo(() => {
    const muonBeta = 0.999;
    const muonGamma = 1 / Math.sqrt(1 - muonBeta * muonBeta); // 22.366
    const tau0Us = 2.2;
    const c = 3e8;
    const distClassicalM = muonBeta * c * (tau0Us * 1e-6); // ~659 m
    const tEarthUs = tau0Us * muonGamma; // ~49.2 us
    const distRelKm = (muonBeta * c * (tEarthUs * 1e-6)) / 1000; // ~14.75 km
    const altContractedM = (muonAltKm * 1000) / muonGamma; // ~671 m
    return { muonGamma, distClassicalM, tEarthUs, distRelKm, altContractedM };
  }, [muonAltKm]);

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-slate-500">
          Capítulo 2 · Secciones 2.3 – 2.5
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Dilatación del Tiempo, Contracción de la Longitud y Experimentos Clave
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
          El tiempo propio y la longitud propia no son absolutos: un reloj en movimiento marcha más lento por un factor <MathTex tex="\gamma" />, y una regla en movimiento se contrae en la dirección del movimiento por el mismo factor. Esta contracción explica el resultado nulo de Michelson-Morley y la llegada de muones atmosféricos a la superficie terrestre.
        </p>
      </div>

      {/* Time Dilation & Length Contraction Visualizer */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              2.3 Efectos Cinemáticos a Rapidez β = {beta.toFixed(3)}c (γ = {gamma.toFixed(3)})
            </h2>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Rapidez relativa β = v/c</span>
              <span className="font-mono font-bold text-sky-700 tabular-nums">{beta.toFixed(3)} c</span>
            </div>
            <input
              type="range"
              min={0}
              max={0.995}
              step={0.005}
              value={beta}
              onChange={(e) => setBeta(parseFloat(e.target.value))}
              className="sci-slider w-full"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
              <div className="text-xs font-semibold text-slate-800">Dilatación temporal</div>
              <MathTex block tex="\Delta t = \gamma \Delta\tau" className="text-sm" />
              <div className="text-xs text-slate-600">
                1.00 s propio dura <span className="font-mono font-bold text-sky-700 tabular-nums">{gamma.toFixed(3)} s</span> para el observador en reposo.
              </div>
              <div className="h-3 w-full rounded bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-sky-600 transition-all"
                  style={{ width: `${Math.min(100, (1 / gamma) * 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-500">Ritmo del reloj en movimiento: {(100 / gamma).toFixed(1)}%</div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
              <div className="text-xs font-semibold text-slate-800">Contracción de Lorentz</div>
              <MathTex block tex="L = \frac{L_0}{\gamma} = L_0\sqrt{1-\beta^2}" className="text-sm" />
              <div className="text-xs text-slate-600">
                Regla de 1.00 m se mide de <span className="font-mono font-bold text-emerald-700 tabular-nums">{(1 / gamma).toFixed(3)} m</span>.
              </div>
              <div className="h-3 w-full rounded bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all"
                  style={{ width: `${(1 / gamma) * 100}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-500">Longitud contraída al {(100 / gamma).toFixed(1)}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FigureAsset
              src="/figures/clock.png"
              alt="Reloj de luz en movimiento"
              caption="Reloj de luz: dilatación temporal."
              imgClassName="w-full h-36 object-contain"
            />
            <FigureAsset
              src="/figures/ruler.png"
              alt="Contracción de una regla en movimiento"
              caption="Contracción longitudinal de reglas."
              imgClassName="w-full h-36 object-contain"
            />
            <FigureAsset
              src="/figures/tennis.png"
              alt="Pelota de tenis relativista a 0.87c"
              caption="Contracción a 0.87c (γ ≈ 2.0)."
              imgClassName="w-full h-36 object-contain"
            />
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-4">
          <ExampleBox title="Pelota de tenis a 0.87c (main.tex)">
            Una pelota esférica de diámetro propio <MathTex tex="D_0 = 6.7\text{ cm}" /> lanzada a <MathTex tex="0.87c" /> (<MathTex tex="\gamma \approx 2.0" />) conserva su diámetro vertical de <MathTex tex="6.7\text{ cm}" />, pero su eje paralelo al movimiento se contrae a{' '}
            <MathTex tex="D = D_0 / 2 \approx 3.35\text{ cm}" />.
          </ExampleBox>

          <ExampleBox title="El Muón Atmosférico (15 km a 0.999c)">
            Los muones tienen vida media propia <MathTex tex="\tau_0 = 2.2\,\mu\text{s}" />. Clásicamente solo recorrerían <MathTex tex="659\text{ m}" /> y jamás llegarían al suelo desde <MathTex tex="{muonAltKm}\text{ km}" />.
            <div className="mt-2 space-y-1 text-xs font-mono tabular-nums text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200">
              <div>γ(0.999c) = {muonData.muonGamma.toFixed(2)}</div>
              <div>Tierra (dilatación): Δt = {muonData.tEarthUs.toFixed(1)} μs → {muonData.distRelKm.toFixed(2)} km</div>
              <div>Muón (contracción): L = {muonData.altContractedM.toFixed(0)} m</div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Altura de creación</span>
                <span className="font-mono font-semibold">{muonAltKm} km</span>
              </div>
              <input
                type="range"
                min={5}
                max={20}
                step={1}
                value={muonAltKm}
                onChange={(e) => setMuonAltKm(parseInt(e.target.value, 10))}
                className="sci-slider w-full"
              />
            </div>
          </ExampleBox>
        </aside>
      </div>

      {/* 2.4 Michelson-Morley Interferometer SVG */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            2.4 Experimento de Michelson-Morley: Éter Clásico vs. Contracción de Lorentz
          </h2>
          <p className="text-sm text-slate-600">
            Bajo la hipótesis clásica del éter, el haz que viaja paralelo al movimiento de la Tierra tardaría más (<MathTex tex="t_\parallel = \gamma^2 t_0" />) que el haz perpendicular (<MathTex tex="t_\perp = \gamma t_0" />). La contracción de Lorentz reduce el brazo paralelo a <MathTex tex="L_0/\gamma" />, igualando exactamente ambos tiempos (<MathTex tex="t_\parallel = t_\perp = \gamma t_0" />).
          </p>

          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
            <svg viewBox="0 0 480 210" className="w-full h-auto" role="img" aria-label="Interferómetro de Michelson-Morley">
              {/* Source */}
              <rect x="25" y="132" width="44" height="22" rx="4" fill="#334155" />
              <text x="47" y="147" textAnchor="middle" className="fill-white text-[10px] font-mono">Fuente</text>
              {/* Beam from source to splitter */}
              <line x1="69" y1="143" x2="180" y2="143" stroke="#eab308" strokeWidth="3" />
              {/* Beam splitter 45 deg */}
              <line x1="165" y1="158" x2="195" y2="128" stroke="#0284c7" strokeWidth="4" />
              <text x="150" y="170" className="fill-sky-700 text-[10px] font-mono">Divisor 45°</text>

              {/* Perpendicular arm L_perp = L0 */}
              <line x1="180" y1="143" x2="180" y2="40" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="5 2" />
              <rect x="160" y="32" width="40" height="8" rx="2" fill="#475569" />
              <text x="192" y="88" className="fill-sky-700 text-xs font-mono font-semibold">
                L_⊥ = L₀
              </text>

              {/* Parallel contracted arm L_par = L0 / gamma */}
              {(() => {
                const contractedPx = 180 / interf.g;
                const m2X = 180 + contractedPx;
                return (
                  <g>
                    <line x1="180" y1="143" x2={m2X} y2="143" stroke="#059669" strokeWidth="2.5" />
                    <rect x={m2X} y="123" width="8" height="40" rx="2" fill="#475569" />
                    <text x={180 + contractedPx / 2} y="160" textAnchor="middle" className="fill-emerald-700 text-xs font-mono font-semibold">
                      L_∥ = L₀/γ = {(1 / interf.g).toFixed(2)} L₀
                    </text>
                    {/* Phantom uncontracted reference */}
                    <line x1={180 + 180} y1="123" x2={180 + 180} y2="163" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="366" y="148" className="fill-slate-400 text-[10px] font-mono">L₀ clásico</text>
                  </g>
                );
              })()}

              {/* Detector */}
              <line x1="180" y1="143" x2="180" y2="190" stroke="#eab308" strokeWidth="2.5" />
              <rect x="162" y="188" width="36" height="16" rx="3" fill="#0f172a" />
              <text x="206" y="199" className="fill-slate-700 text-[10px] font-mono">Detector (franja estable)</text>
            </svg>
          </div>

          <EquationBox
            boxed
            number="2.2"
            tex="t_\perp = \gamma t_0, \qquad t_\parallel^{\text{éter}} = \gamma^2 t_0 \neq t_\perp \quad\longrightarrow\quad t_\parallel^{\text{Lorentz}} = \frac{t_\parallel^{\text{éter}}}{\gamma} = \gamma t_0 = t_\perp"
          />
        </div>

        <aside className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">Velocidad del Interferómetro</h3>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">β respecto al éter hipotético</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">{interferometerBeta.toFixed(2)}c</span>
            </div>
            <input
              type="range"
              min={0}
              max={0.85}
              step={0.05}
              value={interferometerBeta}
              onChange={(e) => setInterferometerBeta(parseFloat(e.target.value))}
              className="sci-slider w-full"
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2 text-xs font-mono tabular-nums">
            <div className="flex justify-between">
              <span className="text-slate-600">t_⊥ / t₀:</span>
              <span className="font-semibold text-sky-700">{interf.tPerpRatio.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">t_∥ (éter sin contracción):</span>
              <span className="font-semibold text-red-600">{interf.tParEtherRatio.toFixed(3)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-emerald-700 font-bold">
              <span>t_∥ (con L = L₀/γ):</span>
              <span>{interf.tParEinsteinRatio.toFixed(3)} = t_⊥</span>
            </div>
          </div>

          <HistoricalCapsule title="Nota biológica: Muones y Evolución del ADN">
            Aproximadamente 10,000 muones relativistas atraviesan cada metro cuadrado de la Tierra por minuto. Gracias a la dilatación temporal sobreviven hasta la superficie, donde su radiación ionizante contribuye históricamente a las mutaciones genéticas naturales que impulsan la variabilidad biológica.
          </HistoricalCapsule>
        </aside>
      </div>
    </div>
  );
};
