import React, { useEffect, useMemo, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { MathTex } from '../../components/MathTex';
import { FigureAsset } from '../../components/FigureAsset';
import { EquationBox, ReasoningTable } from '../../components/LatexBlocks';

const MU_0 = 4 * Math.PI * 1e-7; // 1.2566e-6 T*m/A

export const EmMagnetismSection: React.FC = () => {
  // Straight wire & parallel wires
  const [wireI1, setWireI1] = useState<number>(10); // A
  const [wireI2, setWireI2] = useState<number>(5); // A
  const [wireDistCm, setWireDistCm] = useState<number>(5); // cm

  // Electric motor animation
  const [motorPlaying, setMotorPlaying] = useState<boolean>(true);
  const [motorAngleDeg, setMotorAngleDeg] = useState<number>(25);
  const [motorB, setMotorB] = useState<number>(1.5); // T
  const [motorI, setMotorI] = useState<number>(3.0); // A
  const [motorL, setMotorL] = useState<number>(0.2); // m

  // Solenoid parameters
  const [solN, setSolN] = useState<number>(10);
  const [solL, setSolL] = useState<number>(1.0); // m
  const [solI, setSolI] = useState<number>(10); // A

  // Faraday induction magnet oscillation
  const [faradayAuto, setFaradayAuto] = useState<boolean>(true);
  const [magnetPhase, setMagnetPhase] = useState<number>(0);

  useEffect(() => {
    if (!motorPlaying && !faradayAuto) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (motorPlaying) {
        const omega = 45 * (motorB * motorI) * 0.35; // visual angular speed
        setMotorAngleDeg((prev) => (prev + omega * dt) % 360);
      }
      if (faradayAuto) {
        setMagnetPhase((prev) => (prev + dt * 2.4) % (Math.PI * 2));
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [motorPlaying, faradayAuto, motorB, motorI]);

  // Wire calculations
  const rMeters = wireDistCm / 100;
  const bWire1MicroT = useMemo(
    () => ((MU_0 * wireI1) / (2 * Math.PI * rMeters)) * 1e6,
    [wireI1, rMeters]
  );
  const forcePerMeter = useMemo(
    () => (MU_0 * wireI1 * wireI2) / (2 * Math.PI * rMeters),
    [wireI1, wireI2, rMeters]
  );

  // Motor force
  const thetaRad = (motorAngleDeg * Math.PI) / 180;
  const motorForceMax = motorL * motorI * motorB;
  const motorTorqueRatio = Math.abs(Math.cos(thetaRad));

  // Solenoid B
  const solB = useMemo(() => (MU_0 * solN * solI) / solL, [solN, solI, solL]);

  // Faraday flux & induced EMF (qualitative normalized)
  const magnetPos = Math.sin(magnetPhase); // -1 (outside left) to +1 (deep inside)
  const fluxNorm = 0.5 * (1 + magnetPos);
  const emfNorm = -Math.cos(magnetPhase); // -dPhi/dt

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-slate-500">
          Capítulo 4 · Secciones 4.3 – 4.5
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Magnetismo, Ley de Ampère y Ley de Inducción de Faraday
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
          Las corrientes eléctricas generan campos magnéticos circulares según la Ley de Ampère, producen fuerzas de Lorentz en motores eléctricos y, cuando el flujo magnético cambia en el tiempo, inducen corrientes eléctricas mediante la Ley de Faraday.
        </p>
      </div>

      {/* 4.3 & 4.4 Ampere's Law + Parallel Wires */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">
            4.3–4.4 Ley de Ampère Algebraica y Fuerza entre Alambres Paralelos
          </h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <EquationBox
              number="4.5"
              label="Ley de Ampère y Alambre Recto"
              tex="B \cdot L = \mu_0 I_{\text{enc}} \implies B = \frac{\mu_0 I}{2\pi r}"
            />
            <EquationBox
              number="4.6"
              label="Fuerza Magnética y entre Alambres"
              tex="\boldsymbol{F} = q\boldsymbol{v}\times\boldsymbol{B}, \qquad \frac{F_2}{L} = \frac{\mu_0 I_1 I_2}{2\pi r}"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FigureAsset
              src="/figures/dipolar.png"
              alt="Campo magnético dipolar de un imán"
              caption="Campo magnético dipolar."
              imgClassName="w-full h-32 object-contain"
            />
            <FigureAsset
              src="/figures/ampere.png"
              alt="Campo magnético circular alrededor de un alambre recto"
              caption="Líneas circulares de B alrededor de una corriente I."
              imgClassName="w-full h-32 object-contain"
            />
            <FigureAsset
              src="/figures/alambres.png"
              alt="Fuerza magnética entre dos alambres paralelos con corriente"
              caption="Fuerza ejercida por B₁ de I₁ sobre la corriente I₂."
              imgClassName="w-full h-32 object-contain"
            />
          </div>
        </div>

        <aside className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">
            Calculadora: Alambres con Corriente
          </h3>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Corriente I₁</span>
              <span className="font-mono font-semibold text-sky-700 tabular-nums">{wireI1} A</span>
            </div>
            <input
              type="range"
              min={1}
              max={500}
              step={1}
              value={wireI1}
              onChange={(e) => setWireI1(parseInt(e.target.value, 10))}
              className="sci-slider w-full"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Corriente I₂</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">{wireI2} A</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={wireI2}
              onChange={(e) => setWireI2(parseInt(e.target.value, 10))}
              className="sci-slider w-full"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Distancia r</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">{wireDistCm} cm</span>
            </div>
            <input
              type="range"
              min={1}
              max={1000}
              step={1}
              value={wireDistCm}
              onChange={(e) => setWireDistCm(parseInt(e.target.value, 10))}
              className="sci-slider w-full"
            />
          </div>

          <div className="space-y-2 border-t border-slate-200 pt-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-[11px] text-slate-500">Campo magnético B₁(r)</div>
              <div className="font-mono text-base font-bold text-sky-700 tabular-nums">
                {bWire1MicroT >= 1000
                  ? `${(bWire1MicroT / 1000).toFixed(2)} mT`
                  : `${bWire1MicroT.toFixed(2)} μT`}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-[11px] text-slate-500">Fuerza por longitud (F₂/L)</div>
              <div className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                {forcePerMeter.toExponential(3)} N/m
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setWireI1(500);
              setWireDistCm(1000);
            }}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Probar Ejercicio 4 (500 A a 10 m)
          </button>
        </aside>
      </div>

      {/* DC Electric Motor Interactive Simulation */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Aplicación: El Motor Eléctrico DC (<MathTex tex="F = L I B \sin\theta" />)
              </h3>
              <p className="text-xs text-slate-500">
                El par de fuerzas opuestas <MathTex tex="\boldsymbol{F}_1" /> y <MathTex tex="\boldsymbol{F}_2" /> sobre los lados de la espira genera un torque <MathTex tex="\boldsymbol{\tau} = \boldsymbol{r}\times\boldsymbol{F}" />.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMotorPlaying((p) => !p)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {motorPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {motorPlaying ? 'Pausar rotor' : 'Girar rotor'}
            </button>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 flex justify-center">
            <svg viewBox="0 0 460 220" className="w-full max-w-lg h-auto" role="img" aria-label="Esquema animado de un motor eléctrico DC">
              {/* Pole N */}
              <rect x="28" y="55" width="56" height="110" rx="4" fill="#dc2626" />
              <text x="56" y="116" textAnchor="middle" className="fill-white text-lg font-bold">N</text>

              {/* Pole S */}
              <rect x="376" y="55" width="56" height="110" rx="4" fill="#0284c7" />
              <text x="404" y="116" textAnchor="middle" className="fill-white text-lg font-bold">S</text>

              {/* Magnetic Field B lines */}
              {[75, 110, 145].map((y) => (
                <g key={y}>
                  <line x1="88" y1={y} x2="372" y2={y} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="5 4" />
                  <polygon points={`235,${y} 227,${y - 3.5} 227,${y + 3.5}`} fill="#64748b" />
                </g>
              ))}
              <text x="230" y="66" textAnchor="middle" className="fill-slate-600 text-xs font-mono font-semibold">
                B = {motorB.toFixed(1)} T
              </text>

              {/* Rotation axis */}
              <line x1="230" y1="20" x2="230" y2="200" stroke="#334155" strokeWidth="1.2" strokeDasharray="6 3 2 3" />

              {/* Rotor perspective projection */}
              {(() => {
                const cosA = Math.cos(thetaRad);
                const sinA = Math.sin(thetaRad);
                const halfW = 72 * cosA;
                const yOff = 22 * sinA;
                const lx = 230 - halfW;
                const rx = 230 + halfW;
                const fScale = Math.min(48, Math.max(14, motorForceMax * 18));
                // Commutator flips current every 180 deg so torque stays unidirectional
                const dirSign = cosA >= 0 ? 1 : -1;

                return (
                  <g>
                    {/* Coil loop */}
                    <polygon
                      points={`${lx},${62 + yOff} ${rx},${62 - yOff} ${rx},${158 - yOff} ${lx},${158 + yOff}`}
                      fill="rgba(234, 88, 12, 0.08)"
                      stroke="#ea580c"
                      strokeWidth="4"
                    />
                    {/* Force F1 on left side (upward) */}
                    <line
                      x1={lx}
                      y1={110 + yOff}
                      x2={lx}
                      y2={110 + yOff - dirSign * fScale}
                      stroke="#7c3aed"
                      strokeWidth="3"
                    />
                    <circle cx={lx} cy={110 + yOff} r="4" fill="#ea580c" />
                    <text x={lx - 14} y={110 + yOff - dirSign * fScale - 5} className="fill-violet-700 text-xs font-mono font-bold">
                      F₁
                    </text>

                    {/* Force F2 on right side (downward) */}
                    <line
                      x1={rx}
                      y1={110 - yOff}
                      x2={rx}
                      y2={110 - yOff + dirSign * fScale}
                      stroke="#7c3aed"
                      strokeWidth="3"
                    />
                    <circle cx={rx} cy={110 - yOff} r="4" fill="#ea580c" />
                    <text x={rx + 8} y={110 - yOff + dirSign * fScale + 12} className="fill-violet-700 text-xs font-mono font-bold">
                      F₂
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>

        <aside className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h4 className="text-base font-semibold text-slate-900">Controles del Motor</h4>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Corriente en la espira I</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">{motorI.toFixed(1)} A</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={8}
              step={0.5}
              value={motorI}
              onChange={(e) => setMotorI(parseFloat(e.target.value))}
              className="sci-slider w-full"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Campo magnético B</span>
              <span className="font-mono font-semibold text-sky-700 tabular-nums">{motorB.toFixed(1)} T</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={3.0}
              step={0.1}
              value={motorB}
              onChange={(e) => setMotorB(parseFloat(e.target.value))}
              className="sci-slider w-full"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Longitud activa L</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">{motorL.toFixed(2)} m</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={0.5}
              step={0.05}
              value={motorL}
              onChange={(e) => setMotorL(parseFloat(e.target.value))}
              className="sci-slider w-full"
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1.5 text-xs">
            <div className="flex justify-between font-mono tabular-nums">
              <span className="text-slate-600">Fuerza lateral F = L I B:</span>
              <span className="font-bold text-slate-900">{motorForceMax.toFixed(2)} N</span>
            </div>
            <div className="flex justify-between font-mono tabular-nums">
              <span className="text-slate-600">Factor de torque instantáneo:</span>
              <span className="font-semibold text-violet-700">{(motorTorqueRatio * 100).toFixed(0)}%</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Solenoid Ideal + Ampere Rectangular Loop Derivation */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-base font-semibold text-slate-900">
              Campo Magnético al Interior de un Solenoide (<MathTex tex="B = \mu_0 N I / L" />)
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Aplicando el producto escalar de la Ley de Ampère <MathTex tex="\sum B\cdot L\cos\theta = \mu_0 I_{\text{enc}}" /> sobre el lazo rectangular <MathTex tex="a\to b\to c\to d\to a" />: los lados 2 y 4 aportan <MathTex tex="0" /> (<MathTex tex="\cos 90^\circ = 0" />), el lado exterior 3 aporta <MathTex tex="0" /> (<MathTex tex="B\approx 0" />), y solo sobrevive el lado interior 1, encerrando <MathTex tex="N" /> espiras (<MathTex tex="I_{\text{enc}} = NI" />).
            </p>
            <EquationBox
              boxed
              number="4.7"
              tex="B \cdot L = \mu_0 (N I) \implies B = \frac{\mu_0 N I}{L}"
            />

            <ReasoningTable
              caption="Cálculo interactivo del campo magnético en el interior del solenoide."
              rows={[
                {
                  reasoning: 'Fórmula del solenoide ideal.',
                  developmentTex: 'B = \\frac{\\mu_0 N I}{L}',
                },
                {
                  reasoning: 'Sustituir los parámetros actuales del solenoide en unidades SI.',
                  developmentTex: `B = \\frac{1.257 \\times 10^{-6} \\times ${solN} \\times ${solI}}{${solL.toFixed(
                    2
                  )}} = ${(solB * 1e3).toFixed(3)}\\text{ mT} \\;\\; (${solB.toExponential(2)}\\text{ T})`,
                },
              ]}
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">Número de espiras N</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">{solN}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={2000}
                  step={10}
                  value={solN}
                  onChange={(e) => setSolN(parseInt(e.target.value, 10))}
                  className="sci-slider w-full"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">Longitud de la bobina L (m)</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">{solL.toFixed(2)} m</span>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={2.0}
                  step={0.1}
                  value={solL}
                  onChange={(e) => setSolL(parseFloat(e.target.value))}
                  className="sci-slider w-full"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">Corriente I (A)</span>
                  <span className="font-mono font-semibold text-sky-700 tabular-nums">{solI} A</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={solI}
                  onChange={(e) => setSolI(parseInt(e.target.value, 10))}
                  className="sci-slider w-full"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setSolN(10);
                  setSolL(1.0);
                  setSolI(10);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cargar ejemplo del libro (N=10, L=1 m, I=10 A)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FigureAsset
                src="/figures/solenoide.png"
                alt="Campo magnético de un solenoide"
                imgClassName="w-full h-28 object-contain"
              />
              <FigureAsset
                src="/figures/solenoide2.png"
                alt="Corte de espiras en un solenoide"
                imgClassName="w-full h-28 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4.5 Faraday's Law of Induction & Regenerative Braking */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                4.5 Ley de Inducción de Faraday y Frenado Regenerativo
              </h2>
              <p className="text-xs text-slate-500">
                Un campo magnético variable induce una corriente que se opone al cambio de flujo (Ley de Lenz).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFaradayAuto((a) => !a)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {faradayAuto ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {faradayAuto ? 'Pausar imán' : 'Oscilar imán'}
            </button>
          </div>

          {/* Interactive magnet + coil simulation */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-3">
            <svg viewBox="0 0 460 140" className="w-full h-auto" role="img" aria-label="Imán entrando y saliendo de una bobina induciendo corriente">
              {/* Coil */}
              {[240, 260, 280, 300, 320, 340].map((cx) => (
                <ellipse
                  key={cx}
                  cx={cx}
                  cy="70"
                  rx="10"
                  ry="42"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="3.5"
                />
              ))}

              {/* Magnet moving */}
              {(() => {
                const mx = 100 + fluxNorm * 130;
                return (
                  <g transform={`translate(${mx}, 50)`}>
                    <rect x="0" y="0" width="46" height="40" fill="#475569" rx="3" />
                    <rect x="46" y="0" width="46" height="40" fill="#dc2626" rx="3" />
                    <text x="23" y="25" textAnchor="middle" className="fill-white text-sm font-bold">S</text>
                    <text x="69" y="25" textAnchor="middle" className="fill-white text-sm font-bold">N</text>
                  </g>
                );
              })()}

              {/* Induced current indicator */}
              <text x="385" y="42" className="fill-slate-800 text-xs font-mono font-semibold">
                Φ_B: {(fluxNorm * 100).toFixed(0)}%
              </text>
              <text
                x="385"
                y="65"
                className={`text-xs font-mono font-bold ${
                  emfNorm > 0.08
                    ? 'fill-sky-700'
                    : emfNorm < -0.08
                    ? 'fill-red-600'
                    : 'fill-slate-400'
                }`}
              >
                I_ind: {emfNorm > 0.08 ? '+→' : emfNorm < -0.08 ? '←−' : '0'}
              </text>
            </svg>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Posición manual del imán</span>
                <span className="font-mono text-slate-600 tabular-nums">
                  Flujo {(fluxNorm * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={6.28}
                step={0.05}
                value={magnetPhase}
                onChange={(e) => {
                  setFaradayAuto(false);
                  setMagnetPhase(parseFloat(e.target.value));
                }}
                className="sci-slider w-full"
              />
            </div>
          </div>

          <p className="text-xs leading-relaxed text-slate-600">
            <strong>Aplicaciones en el libro:</strong> En un carro eléctrico, al dejar de acelerar, el movimiento de las ruedas genera un campo variable que recarga la batería e induce un campo opuesto que frena el vehículo (<em>frenado regenerativo</em>). En las estufas de inducción, corriente alterna en la bobina induce corrientes directamente en la olla metálica.
          </p>
        </div>

        <div className="lg:col-span-5 grid grid-cols-1 gap-4">
          <FigureAsset
            src="/figures/faraday.png"
            alt="Experimento de inducción de Faraday"
            caption="Figura del libro: imán entrando y saliendo de un solenoide generando corriente inducida."
            imgClassName="w-full h-40 object-contain"
          />
          <FigureAsset
            src="/figures/ec.png"
            alt="Frenado regenerativo en carro eléctrico"
            caption="Frenado regenerativo en vehículo eléctrico mediante Ley de Faraday."
            imgClassName="w-full h-40 object-contain"
          />
        </div>
      </div>
    </div>
  );
};
