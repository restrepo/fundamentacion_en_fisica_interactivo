import React, { useEffect, useMemo, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { MathTex } from '../../components/MathTex';
import { FigureAsset } from '../../components/FigureAsset';
import { EquationBox } from '../../components/LatexBlocks';

const EPSILON_0 = 8.854187817e-12; // F/m
const C_LIGHT = 2.99792458e8; // m/s

export const EmMaxwellSection: React.FC = () => {
  // Displacement current simulator
  const [plateArea, setPlateArea] = useState<number>(0.1); // m^2
  const [dEdtExp, setDEdtExp] = useState<number>(6); // 10^6 V/(m*s)
  const [switchClosed, setSwitchClosed] = useState<boolean>(true);
  const [capPhase, setCapPhase] = useState<number>(0);

  // Dipole antenna & wave simulator
  const [freqMHz, setFreqMHz] = useState<number>(100); // 100 MHz FM radio default
  const [wavePlaying, setWavePlaying] = useState<boolean>(true);
  const [wavePhase, setWavePhase] = useState<number>(0);

  useEffect(() => {
    if (!switchClosed && !wavePlaying) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (switchClosed) {
        setCapPhase((p) => (p + dt * 1.4) % (Math.PI * 2));
      }
      if (wavePlaying) {
        setWavePhase((p) => (p + dt * 3.5) % (Math.PI * 2));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [switchClosed, wavePlaying]);

  const dEdt = Math.pow(10, dEdtExp);
  const displacementCurrent = useMemo(
    () => EPSILON_0 * plateArea * dEdt,
    [plateArea, dEdt]
  );

  // Wave properties
  const freqHz = freqMHz * 1e6;
  const wavelengthM = C_LIGHT / freqHz;

  // Build SVG sine wave path for E(x,t)
  const wavePath = useMemo(() => {
    const pts: string[] = [];
    const kVisual = 0.045 * (1 + Math.log10(freqMHz / 50 + 1));
    for (let x = 0; x <= 230; x += 3) {
      const y = -44 * Math.sin(kVisual * x - wavePhase);
      pts.push(`${x === 0 ? 'M' : 'L'} ${(175 + x).toFixed(1)} ${(115 + y).toFixed(1)}`);
    }
    return pts.join(' ');
  }, [freqMHz, wavePhase]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-slate-500">
          Capítulo 4 · Secciones 4.6 – 4.8
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Ecuaciones de Maxwell, Corriente de Desplazamiento y Ondas EM
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
          Maxwell completó la simetría del electromagnetismo demostrando que un campo eléctrico variable en el vacío induce un campo magnético mediante la corriente de desplazamiento, prediciendo la existencia de las ondas electromagnéticas que viajan a la velocidad de la luz <MathTex tex="c" />.
        </p>
      </div>

      {/* 4.6 Maxwell's Displacement Current */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                4.6 La Corriente de Desplazamiento en un Condensador
              </h2>
              <p className="text-xs text-slate-500">
                Aunque no cruzan electrones por el vacío entre las placas, el cambio de flujo eléctrico <MathTex tex="\Phi_E = A E" /> induce un campo magnético <MathTex tex="\boldsymbol{B}" />.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSwitchClosed((s) => !s)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {switchClosed ? 'Abrir interruptor (I = 0)' : 'Cerrar interruptor (Cargar C)'}
            </button>
          </div>

          {/* Interactive SVG faithful to TikZ lines 9372-9462 */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
            <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[280px]" role="img" aria-label="Condensador con corriente de desplazamiento e inducción de campo B">
              {/* Circuit wires */}
              <polyline points="170,70 70,70 70,180 390,180 390,70 290,70" fill="none" stroke="#334155" strokeWidth="2.5" />

              {/* Battery */}
              <line x1="150" y1="168" x2="150" y2="192" stroke="#0f172a" strokeWidth="3" />
              <line x1="160" y1="173" x2="160" y2="187" stroke="#0f172a" strokeWidth="2" />
              <text x="155" y="206" textAnchor="middle" className="fill-slate-700 text-xs font-mono">ℰ</text>

              {/* Switch */}
              <circle cx="240" cy="180" r="3.5" fill="#0f172a" />
              <circle cx="275" cy="180" r="3.5" fill="#0f172a" />
              <line
                x1="240"
                y1="180"
                x2={switchClosed ? 275 : 268}
                y2={switchClosed ? 180 : 162}
                stroke="#dc2626"
                strokeWidth="2.5"
              />
              <text x="257" y="204" textAnchor="middle" className="fill-slate-600 text-[11px]">
                {switchClosed ? 'Cerrado' : 'Abierto'}
              </text>

              {/* Capacitor Plates */}
              <ellipse cx="170" cy="70" rx="8" ry="44" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
              <ellipse cx="290" cy="70" rx="8" ry="44" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />

              {/* Animated E(t) and induced B rings */}
              {(() => {
                const intensity = switchClosed ? 0.5 + 0.5 * Math.sin(capPhase) : 0;
                return (
                  <>
                    {/* Current arrows in wire */}
                    {switchClosed && (
                      <>
                        <line x1="95" y1="58" x2="135" y2="58" stroke="#dc2626" strokeWidth="2" />
                        <polygon points="138,58 130,54 130,62" fill="#dc2626" />
                        <text x="115" y="51" textAnchor="middle" className="fill-red-600 text-xs font-mono font-bold">I</text>
                        <line x1="325" y1="58" x2="365" y2="58" stroke="#dc2626" strokeWidth="2" />
                        <polygon points="368,58 360,54 360,62" fill="#dc2626" />
                        <text x="345" y="51" textAnchor="middle" className="fill-red-600 text-xs font-mono font-bold">I</text>
                      </>
                    )}

                    {/* E(t) orange field arrows */}
                    {[42, 56, 70, 84, 98].map((y) => (
                      <g key={y} opacity={0.25 + 0.75 * intensity}>
                        <line x1="184" y1={y} x2="274" y2={y} stroke="#ea580c" strokeWidth="1.8" />
                        <polygon points={`278,${y} 270,${y - 3} 270,${y + 3}`} fill="#ea580c" />
                      </g>
                    ))}
                    <text x="230" y="22" textAnchor="middle" className="fill-orange-700 text-xs font-mono font-semibold">
                      E(t) variable
                    </text>

                    {/* Induced B ring in vacuum */}
                    <ellipse
                      cx="230"
                      cy="70"
                      rx="18"
                      ry="36"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="2.2"
                      strokeDasharray={switchClosed ? 'none' : '4 4'}
                      opacity={switchClosed ? 0.95 : 0.25}
                    />
                    <text x="230" y="130" textAnchor="middle" className="fill-sky-700 text-xs font-mono font-semibold">
                      B inducido (I_d)
                    </text>
                  </>
                );
              })()}
            </svg>
          </div>

          <EquationBox
            boxed
            number="4.8"
            label="Deducción algebraica de la Corriente de Desplazamiento"
            tex="E = \frac{Q}{\epsilon_0 A} \implies Q = \epsilon_0 A E \implies I_d = \frac{\Delta Q}{\Delta t} = \epsilon_0 \frac{\Delta \Phi_E}{\Delta t}"
          />
        </div>

        <aside className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">
            Calculadora: Corriente de Desplazamiento
          </h3>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Área de las placas A</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">{plateArea.toFixed(2)} m²</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={1.0}
              step={0.05}
              value={plateArea}
              onChange={(e) => setPlateArea(parseFloat(e.target.value))}
              className="sci-slider w-full"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Tasa de cambio ΔE/Δt</span>
              <span className="font-mono font-semibold text-orange-700 tabular-nums">
                10^{dEdtExp} V/(m·s)
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={9}
              step={1}
              value={dEdtExp}
              onChange={(e) => setDEdtExp(parseInt(e.target.value, 10))}
              className="sci-slider w-full"
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1">
            <div className="text-[11px] text-slate-500">Corriente de desplazamiento I_d</div>
            <div className="font-mono text-base font-bold text-sky-700 tabular-nums">
              {displacementCurrent.toExponential(2)} A
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setPlateArea(0.1);
              setDEdtExp(6);
            }}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Cargar Ejercicio 7 (A=0.1 m², 10⁶ V/m·s)
          </button>

          <FigureAsset
            src="/figures/em.png"
            alt="Espectro de ondas electromagnéticas"
            caption="Espectro electromagnético completo (radio a rayos gamma)."
            imgClassName="w-full h-32 object-contain"
          />
        </aside>
      </div>

      {/* 4.7-4.8 Dipole Antenna & Travelling EM Wave */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                4.7–4.8 Generación Controlada de Ondas: La Antena Dipolo
              </h2>
              <p className="text-xs text-slate-500">
                Un oscilador acelera cargas en vaivén generando campos transversales <MathTex tex="\boldsymbol{E} \perp \boldsymbol{B}" /> que se desprenden a velocidad <MathTex tex="c = \lambda f" />.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setWavePlaying((w) => !w)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {wavePlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {wavePlaying ? 'Pausar onda' : 'Emitir onda'}
            </button>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
            <svg viewBox="0 0 440 220" className="w-full h-auto" role="img" aria-label="Antena dipolo emitiendo onda electromagnética transversal">
              {/* Oscillator source */}
              <circle cx="48" cy="115" r="18" fill="#ffffff" stroke="#334155" strokeWidth="2" />
              <text x="48" y="120" textAnchor="middle" className="fill-slate-900 text-base font-bold">~</text>
              <line x1="66" y1="108" x2="105" y2="108" stroke="#334155" strokeWidth="2" />
              <line x1="66" y1="122" x2="105" y2="122" stroke="#334155" strokeWidth="2" />

              {/* Antenna rods */}
              <line x1="105" y1="30" x2="105" y2="105" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
              <line x1="105" y1="125" x2="105" y2="200" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />

              {/* Oscillating tip charges */}
              {(() => {
                const topPositive = Math.sin(wavePhase) >= 0;
                return (
                  <>
                    <circle cx="105" cy="36" r="10" fill={topPositive ? '#dc2626' : '#0284c7'} />
                    <text x="105" y="40" textAnchor="middle" className="fill-white text-xs font-bold">
                      {topPositive ? '+' : '−'}
                    </text>
                    <circle cx="105" cy="194" r="10" fill={topPositive ? '#0284c7' : '#dc2626'} />
                    <text x="105" y="198" textAnchor="middle" className="fill-white text-xs font-bold">
                      {topPositive ? '−' : '+'}
                    </text>
                  </>
                );
              })()}

              {/* Propagation axis */}
              <line x1="175" y1="115" x2="415" y2="115" stroke="#475569" strokeWidth="1.5" />
              <polygon points="420,115 412,111 412,119" fill="#475569" />
              <text x="372" y="132" className="fill-slate-700 text-[11px] font-mono">
                Propagación (c)
              </text>

              {/* E-field traveling wave */}
              <path d={wavePath} fill="none" stroke="#ea580c" strokeWidth="2.5" />
              <text x="275" y="50" className="fill-orange-700 text-xs font-mono font-semibold">
                Campo E(x, t)
              </text>
            </svg>
          </div>
        </div>

        <aside className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">
            Frecuencia y Longitud de Antena
          </h3>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Frecuencia f (MHz)</span>
              <span className="font-mono font-semibold text-sky-700 tabular-nums">
                {freqMHz >= 1000 ? `${(freqMHz / 1000).toFixed(2)} GHz` : `${freqMHz} MHz`}
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={2500}
              step={10}
              value={freqMHz}
              onChange={(e) => setFreqMHz(parseInt(e.target.value, 10))}
              className="sci-slider w-full"
            />
          </div>

          <EquationBox tex="c = \lambda f \implies \lambda = \frac{c}{f}" />

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-[11px] text-slate-500">Longitud de onda λ</div>
              <div className="mt-0.5 font-mono text-sm font-bold text-slate-900 tabular-nums">
                {wavelengthM >= 1 ? `${wavelengthM.toFixed(2)} m` : `${(wavelengthM * 100).toFixed(2)} cm`}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-[11px] text-slate-500">Antena óptima (λ/4)</div>
              <div className="mt-0.5 font-mono text-sm font-bold text-sky-700 tabular-nums">
                {wavelengthM / 4 >= 1
                  ? `${(wavelengthM / 4).toFixed(2)} m`
                  : `${((wavelengthM / 4) * 100).toFixed(2)} cm`}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFreqMHz(100)}
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Radio FM (100 MHz)
            </button>
            <button
              type="button"
              onClick={() => setFreqMHz(2400)}
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Wi-Fi (2.4 GHz)
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
