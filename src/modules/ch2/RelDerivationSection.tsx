import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, Pause, Play, RotateCcw } from 'lucide-react';
import { MathTex } from '../../components/MathTex';
import { FigureAsset } from '../../components/FigureAsset';
import { EquationBox, ReasoningTable } from '../../components/LatexBlocks';

export const RelDerivationSection: React.FC = () => {
  const [beta, setBeta] = useState<number>(0.6);
  const [xCoord, setXCoord] = useState<number>(120); // m
  const [ctCoord, setCtCoord] = useState<number>(90); // m (c*t)
  const [pulseTime, setPulseTime] = useState<number>(0); // 0..1 normalized
  const [playingPulse, setPlayingPulse] = useState<boolean>(true);
  const [revealPhantom, setRevealPhantom] = useState<boolean>(false);

  React.useEffect(() => {
    if (!playingPulse) return;
    let frame: number;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setPulseTime((prev) => (prev + dt * 0.25) % 1);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [playingPulse]);

  const gamma = useMemo(() => 1 / Math.sqrt(1 - beta * beta), [beta]);

  // Lorentz vs Galilean transformation for event (ct, x)
  const lorentz = useMemo(() => {
    const xPrime = gamma * (xCoord - beta * ctCoord);
    const ctPrime = gamma * (ctCoord - beta * xCoord);
    const galileoXPrime = xCoord - beta * ctCoord;
    const invS2 = ctCoord * ctCoord - xCoord * xCoord;
    const invS2Prime = ctPrime * ctPrime - xPrime * xPrime;
    return { xPrime, ctPrime, galileoXPrime, invS2, invS2Prime };
  }, [gamma, beta, xCoord, ctCoord]);

  // Log-log points for gamma(beta) interactive curve
  const gammaCurvePath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 95; i++) {
      const b = i / 100;
      const g = 1 / Math.sqrt(1 - b * b);
      const px = 40 + b * 240;
      const py = 180 - Math.min(g - 1, 6) * 24;
      pts.push(`${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`);
    }
    return pts.join(' ');
  }, []);

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-slate-500">
          Capítulo 2 · Secciones 2.1 – 2.2
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Postulados de Einstein, Factor de Lorentz y Transformación de Coordenadas
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
          Partiendo del principio de relatividad y de la invariancia de la velocidad de la luz <MathTex tex="c" /> para todo observador inercial, deducimos las ecuaciones de Lorentz y el factor <MathTex tex="\gamma = (1-\beta^2)^{-1/2}" /> sin apelar al éter luminífero.
        </p>
      </div>

      {/* Interactive Light Pulse & Gamma Sandbox */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                2.1 Experimento Conceptual del Pulso de Luz entre S y S′
              </h2>
              <p className="text-xs text-slate-600">
                En t = t′ = 0 coinciden los orígenes y se emite un frente de luz con rapidez c en ambos marcos.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPlayingPulse((p) => !p)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {playingPulse ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {playingPulse ? 'Pausar' : 'Reproducir'}
              </button>
              <button
                type="button"
                onClick={() => setPulseTime(0)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                t=0
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
            <svg viewBox="0 0 480 180" className="w-full h-auto" role="img" aria-label="Comparación de pulso de luz entre marco S y marco S prima">
              {/* Marco S */}
              <line x1="35" y1="55" x2="450" y2="55" stroke="#64748b" strokeWidth="1.5" />
              <line x1="55" y1="25" x2="55" y2="75" stroke="#64748b" strokeWidth="1.5" />
              <text x="15" y="45" className="fill-slate-700 text-xs font-semibold">S</text>
              {/* Photon in S */}
              <circle cx={55 + pulseTime * 360} cy="55" r="6" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
              <text x={55 + pulseTime * 360} y="38" textAnchor="middle" className="fill-amber-700 text-[11px] font-mono font-bold">
                x = ct
              </text>

              {/* Marco S' moving at v = beta * c */}
              {(() => {
                const originPrimeX = 55 + pulseTime * beta * 360;
                const photonX = 55 + pulseTime * 360;
                return (
                  <g>
                    <line x1={originPrimeX - 20} y1="130" x2={Math.min(465, originPrimeX + 360)} y2="130" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 3" />
                    <line x1={originPrimeX} y1="100" x2={originPrimeX} y2="155" stroke="#0284c7" strokeWidth="1.8" />
                    <text x={originPrimeX - 18} y="115" className="fill-sky-700 text-xs font-semibold">S′</text>
                    <text x={originPrimeX} y="168" textAnchor="middle" className="fill-sky-700 text-[11px] font-mono">
                      v = {beta.toFixed(2)}c
                    </text>
                    <circle cx={photonX} cy="130" r="6" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
                    <line x1={originPrimeX} y1="130" x2={photonX} y2="130" stroke="#059669" strokeWidth="2.2" />
                    <text x={(originPrimeX + photonX) / 2} y="120" textAnchor="middle" className="fill-emerald-700 text-[11px] font-mono font-bold">
                      x′ = ct′
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
              <svg viewBox="0 0 300 200" className="w-full h-auto" role="img" aria-label="Curva del factor de Lorentz gamma en función de beta">
                <line x1="40" y1="180" x2="285" y2="180" stroke="#64748b" strokeWidth="1.5" />
                <line x1="40" y1="20" x2="40" y2="180" stroke="#64748b" strokeWidth="1.5" />
                <line x1="280" y1="20" x2="280" y2="180" stroke="#dc2626" strokeWidth="1" strokeDasharray="3 3" />
                <path d={gammaCurvePath} fill="none" stroke="#0284c7" strokeWidth="2.5" />
                <circle
                  cx={40 + beta * 240}
                  cy={180 - Math.min(gamma - 1, 6) * 24}
                  r="5"
                  fill="#dc2626"
                />
                <text x="160" y="196" textAnchor="middle" className="fill-slate-600 text-[10px] font-mono">
                  β = v/c (límite c en 1.0)
                </text>
                <text x="16" y="100" transform="rotate(-90 16 100)" textAnchor="middle" className="fill-slate-600 text-[10px] font-mono">
                  γ(β)
                </text>
                <text x={45 + beta * 240} y={Math.max(30, 174 - Math.min(gamma - 1, 6) * 24)} className="fill-red-700 text-[11px] font-mono font-bold">
                  γ={gamma.toFixed(2)}
                </text>
              </svg>
            </div>

            <FigureAsset
              src="/figures/Lorentz_factor_log_log.png"
              alt="Factor de Lorentz en escala doble logarítmica"
              caption="Figura original (main.tex): Comportamiento asintótico del factor γ frente a 1 − β."
              imgClassName="w-full h-44 object-contain"
            />
          </div>

          <EquationBox
            boxed
            number="2.1"
            tex="\gamma = \frac{1}{\sqrt{1 - \beta^2}}, \qquad x' = \gamma(x - vt), \qquad t' = \gamma\left(t - \frac{vx}{c^2}\right)"
          />
        </div>

        {/* Right Controls: Coordinate Transformer */}
        <aside className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">
            Transformador de Eventos (ct, x)
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Rapidez relativa β = v/c</span>
                <span className="font-mono font-bold text-sky-700 tabular-nums">{beta.toFixed(3)} c</span>
              </div>
              <input
                type="range"
                min={0}
                max={0.99}
                step={0.01}
                value={beta}
                onChange={(e) => setBeta(parseFloat(e.target.value))}
                className="sci-slider w-full"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Posición en S: x</span>
                <span className="font-mono text-slate-900 tabular-nums">{xCoord} m</span>
              </div>
              <input
                type="range"
                min={-300}
                max={300}
                step={10}
                value={xCoord}
                onChange={(e) => setXCoord(parseInt(e.target.value, 10))}
                className="sci-slider w-full"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Tiempo espacial ct</span>
                <span className="font-mono text-slate-900 tabular-nums">{ctCoord} m</span>
              </div>
              <input
                type="range"
                min={0}
                max={300}
                step={10}
                value={ctCoord}
                onChange={(e) => setCtCoord(parseInt(e.target.value, 10))}
                className="sci-slider w-full"
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-2 text-xs">
            <div className="flex justify-between font-mono tabular-nums">
              <span className="text-slate-600">Factor γ:</span>
              <span className="font-bold text-slate-900">{gamma.toFixed(4)}</span>
            </div>
            <div className="flex justify-between font-mono tabular-nums">
              <span className="text-slate-600">Lorentz x′:</span>
              <span className="font-bold text-sky-700">{lorentz.xPrime.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between font-mono tabular-nums">
              <span className="text-slate-600">Lorentz ct′:</span>
              <span className="font-bold text-sky-700">{lorentz.ctPrime.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between font-mono tabular-nums border-t border-slate-200 pt-2">
              <span className="text-slate-600">Galileo x′_G:</span>
              <span className="text-slate-700">{lorentz.galileoXPrime.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between font-mono tabular-nums text-emerald-700 font-semibold">
              <span>Invariante (ct)²−x²:</span>
              <span>{lorentz.invS2.toFixed(0)} = {lorentz.invS2Prime.toFixed(0)} m²</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Reasoning Table for t' derivation (recreating main.tex \phantom steps) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              2.2 Deducción Algebraica del Tiempo Transformado t′
            </h2>
            <p className="text-xs text-slate-600">
              En <MathTex tex="\texttt{main.tex}" />, los pasos intermedios se proponen como ejercicio guiado antes de revelar el resultado.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRevealPhantom((r) => !r)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            {revealPhantom ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {revealPhantom ? 'Ocultar pasos intermedios' : 'Revelar pasos intermedios'}
          </button>
        </div>

        <ReasoningTable
          caption="Deducción de t' a partir de la simetría entre S y S' (main.tex)."
          rows={[
            {
              reasoning: 'Partimos de la transformación directa e inversa para la coordenada espacial.',
              developmentTex: "x' = \\gamma(x - vt), \\qquad x = \\gamma(x' + vt')",
            },
            {
              reasoning: 'Sustituimos x′ dentro de la ecuación inversa para x.',
              developmentTex: revealPhantom
                ? "x = \\gamma\\left[\\gamma(x - vt) + vt'\\right] = \\gamma^2 x - \\gamma^2 vt + \\gamma vt'"
                : "\\text{(Paso oculto — pulsa Revelar pasos intermedios)}",
            },
            {
              reasoning: 'Despejamos γvt′ y usamos la identidad 1 − γ² = −γ²β².',
              developmentTex: revealPhantom
                ? "\\gamma v t' = x(1 - \\gamma^2) + \\gamma^2 vt = \\gamma^2\\left(vt - \\frac{v^2 x}{c^2}\\right)"
                : "1 - \\gamma^2 = 1 - \\frac{1}{1 - v^2/c^2} = -\\gamma^2\\frac{v^2}{c^2}",
            },
            {
              reasoning: 'Dividiendo entre γv obtenemos la transformación de Lorentz para el tiempo.',
              developmentTex: "t' = \\gamma\\left(t - \\frac{vx}{c^2}\\right)",
            },
          ]}
        />
      </div>
    </div>
  );
};
