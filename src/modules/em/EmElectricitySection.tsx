import React, { useMemo, useState } from 'react';
import { MathTex } from '../../components/MathTex';
import { FigureAsset } from '../../components/FigureAsset';
import { EquationBox, ExampleBox, ReasoningTable } from '../../components/LatexBlocks';

const K_COULOMB = 8.987551786e9; // N m^2 / C^2
const E_CHARGE = 1.602176634e-19; // C
const MEV_IN_J = 1.602176634e-13; // J

export const EmElectricitySection: React.FC = () => {
  // Interactive Coulomb & Field parameters
  const [q1Micro, setQ1Micro] = useState<number>(4); // uC
  const [q2Micro, setQ2Micro] = useState<number>(-3); // uC
  const [distanceCm, setDistanceCm] = useState<number>(6); // cm

  // Interactive Electron Charge Example
  const [electronPreset, setElectronPreset] = useState<'6b' | '4m' | 'custom'>('6b');
  const [customBillions, setCustomBillions] = useState<number>(6);

  // Interactive Power & Energy Calculator (4.2)
  const [voltageV, setVoltageV] = useState<number>(110);
  const [currentA, setCurrentA] = useState<number>(4.0);
  const [monthlyKwh, setMonthlyKwh] = useState<number>(191);

  const rMeters = distanceCm / 100;
  const q1 = q1Micro * 1e-6;
  const q2 = q2Micro * 1e-6;

  const forceMag = useMemo(
    () => (K_COULOMB * Math.abs(q1 * q2)) / (rMeters * rMeters),
    [q1, q2, rMeters]
  );
  const eFieldMag = useMemo(
    () => (K_COULOMB * Math.abs(q1)) / (rMeters * rMeters),
    [q1, rMeters]
  );
  const potentialV = useMemo(() => (K_COULOMB * q1) / rMeters, [q1, rMeters]);
  const potentialEnergyJ = useMemo(() => (K_COULOMB * q1 * q2) / rMeters, [q1, q2, rMeters]);
  const isAttractive = q1 * q2 < 0;

  // Electron count example
  const electronCount =
    electronPreset === '6b'
      ? 6e9
      : electronPreset === '4m'
      ? 4e6
      : customBillions * 1e9;
  const totalChargeC = electronCount * -E_CHARGE;

  // Uranium-235 vs Kr-92 + Ba-141 fission energy (exact formula from main.tex lines 8623-8673)
  const u235Data = useMemo(() => {
    const calcSphereMeV = (z: number, a: number) => {
      const R = 1.2e-15 * Math.cbrt(a);
      const Q = z * E_CHARGE;
      const U_J = (3 / 5) * K_COULOMB * ((Q * Q) / R);
      return { rFm: R * 1e15, uMeV: U_J / MEV_IN_J };
    };
    const u = calcSphereMeV(92, 235);
    const kr = calcSphereMeV(36, 92);
    const ba = calcSphereMeV(56, 141);
    return {
      u,
      kr,
      ba,
      fragSum: kr.uMeV + ba.uMeV,
      deltaMeV: u.uMeV - (kr.uMeV + ba.uMeV),
    };
  }, []);

  // Power & Energy
  const powerW = voltageV * currentA;
  const avgPowerFromBillW = (monthlyKwh * 1000) / 720;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-slate-500">
          Capítulo 4 · Secciones 4.1 – 4.2
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Electricidad, Ley de Coulomb, Potencial y Corriente Eléctrica
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
          En la relatividad especial vimos que las propiedades eléctricas y magnéticas dependen del sistema de referencia inercial. Aquí estudiamos la interacción electrostática fundamental de Coulomb, la energía potencial en enlaces químicos y fisión nuclear, y el flujo de carga en corriente eléctrica.
        </p>
      </div>

      {/* 4.1 COULOMB'S LAW & ELECTRIC FIELD SANDBOX */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              4.1 Ley de Coulomb, Campo Eléctrico y Superficies Equipotenciales
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              La fuerza eléctrica entre dos cargas puntuales <MathTex tex="q_1" /> y <MathTex tex="q_2" /> sigue una ley de inverso del cuadrado análoga a la gravitación, pero admite atracción y repulsión según el signo de las cargas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <EquationBox
              number="4.1"
              label="Ley de Coulomb (vectorial)"
              tex="\boldsymbol{F} = k \frac{q_1 q_2}{r^2}\frac{\boldsymbol{r}}{r} = k \frac{q_1 q_2}{r^3}\boldsymbol{r}"
            />
            <EquationBox
              number="4.2"
              label="Campo eléctrico y magnitudes"
              tex="\boldsymbol{E} = k \frac{q_1}{r^3}\boldsymbol{r}, \qquad F = k\frac{|q_1 q_2|}{r^2}, \qquad E = k\frac{|q_1|}{r^2}"
            />
          </div>

          {/* Interactive SVG Field + Equipotentials Diagram (faithful to TikZ lines 8416-8478) */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-slate-800">
                Visualización Interactiva: Líneas de Campo <MathTex tex="\boldsymbol{E}" /> y Equipotenciales <MathTex tex="V" />
              </span>
              <span className="font-mono text-slate-600 tabular-nums">
                {q1Micro === 0 || q2Micro === 0
                  ? 'Carga neutra (F = 0)'
                  : isAttractive
                  ? 'Estado: Atracción (Uₑ < 0)'
                  : 'Estado: Repulsión (Uₑ > 0)'}
              </span>
            </div>

            <svg
              viewBox="0 0 520 260"
              className="w-full h-auto max-h-[320px]"
              role="img"
              aria-label="Campo eléctrico de q1, superficies equipotenciales y fuerza sobre q2"
            >
              <defs>
                <pattern id="emGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e2e8f0" strokeWidth="0.7" />
                </pattern>
              </defs>
              <rect width="520" height="260" fill="url(#emGrid)" rx="6" />

              {(() => {
                const c1x = 155;
                const cy = 130;
                const pxPerCm = 24;
                const c2x = c1x + distanceCm * pxPerCm;
                const q1Color = q1Micro >= 0 ? '#dc2626' : '#0284c7';
                const q2Color = q2Micro >= 0 ? '#dc2626' : '#0284c7';
                const angles = [0, 45, 90, 135, 180, 225, 270, 315];

                return (
                  <>
                    {/* Equipotential dashed green circles around q1 */}
                    {[38, 72, 106].map((rad, i) => (
                      <circle
                        key={i}
                        cx={c1x}
                        cy={cy}
                        r={rad}
                        fill="none"
                        stroke="#16a34a"
                        strokeWidth="1.1"
                        strokeDasharray="4 3"
                        opacity="0.75"
                      />
                    ))}
                    <text x={c1x - 28} y={cy - 77} className="fill-green-700 text-[10px] font-medium">
                      Equipotencial
                    </text>

                    {/* Radial Electric Field lines from q1 */}
                    {q1Micro !== 0 &&
                      angles.map((deg) => {
                        const rad = (deg * Math.PI) / 180;
                        const rStart = 20;
                        const rEnd = 116;
                        const xA = c1x + Math.cos(rad) * rStart;
                        const yA = cy + Math.sin(rad) * rStart;
                        const xB = c1x + Math.cos(rad) * rEnd;
                        const yB = cy + Math.sin(rad) * rEnd;
                        const out = q1Micro > 0;
                        const tipX = out ? xB : xA;
                        const tipY = out ? yB : yA;
                        const dirX = out ? Math.cos(rad) : -Math.cos(rad);
                        const dirY = out ? Math.sin(rad) : -Math.sin(rad);
                        const perpX = -dirY;
                        const perpY = dirX;
                        return (
                          <g key={deg}>
                            <line
                              x1={xA}
                              y1={yA}
                              x2={xB}
                              y2={yB}
                              stroke={q1Color}
                              strokeWidth="1.4"
                              opacity="0.7"
                            />
                            <polygon
                              points={`${tipX},${tipY} ${tipX - dirX * 7 + perpX * 3.5},${
                                tipY - dirY * 7 + perpY * 3.5
                              } ${tipX - dirX * 7 - perpX * 3.5},${tipY - dirY * 7 - perpY * 3.5}`}
                              fill={q1Color}
                            />
                          </g>
                        );
                      })}

                    {/* Distance line r */}
                    <line
                      x1={c1x}
                      y1={cy + 100}
                      x2={c2x}
                      y2={cy + 100}
                      stroke="#475569"
                      strokeWidth="1.2"
                    />
                    <line x1={c1x} y1={cy + 94} x2={c1x} y2={cy + 106} stroke="#475569" strokeWidth="1.2" />
                    <line x1={c2x} y1={cy + 94} x2={c2x} y2={cy + 106} stroke="#475569" strokeWidth="1.2" />
                    <text
                      x={(c1x + c2x) / 2 - 18}
                      y={cy + 116}
                      className="fill-slate-700 text-xs font-mono tabular-nums"
                    >
                      r = {distanceCm.toFixed(1)} cm
                    </text>

                    {/* Force vector on q2 */}
                    {q1Micro !== 0 && q2Micro !== 0 && (
                      <>
                        {(() => {
                          const fLen = Math.min(82, Math.max(24, Math.log10(forceMag + 1) * 32));
                          const dir = isAttractive ? -1 : 1;
                          const endX = c2x + dir * fLen;
                          return (
                            <g>
                              <line
                                x1={c2x}
                                y1={cy}
                                x2={endX}
                                y2={cy}
                                stroke="#0f172a"
                                strokeWidth="3"
                              />
                              <polygon
                                points={`${endX},${cy} ${endX - dir * 9},${cy - 5} ${
                                  endX - dir * 9
                                },${cy + 5}`}
                                fill="#0f172a"
                              />
                              <text
                                x={isAttractive ? endX - 18 : endX + 6}
                                y={cy - 10}
                                className="fill-slate-900 text-xs font-mono font-bold"
                              >
                                F = {forceMag.toFixed(1)} N
                              </text>
                            </g>
                          );
                        })()}
                      </>
                    )}

                    {/* Charge q1 */}
                    <circle cx={c1x} cy={cy} r="17" fill={q1Color} stroke="#ffffff" strokeWidth="2.5" />
                    <text
                      x={c1x}
                      y={cy + 5}
                      textAnchor="middle"
                      className="fill-white text-sm font-bold font-mono"
                    >
                      {q1Micro >= 0 ? '+' : '−'}
                    </text>
                    <text
                      x={c1x}
                      y={cy - 24}
                      textAnchor="middle"
                      className="fill-slate-900 text-[11px] font-mono font-semibold"
                    >
                      q₁ = {q1Micro > 0 ? '+' : ''}{q1Micro} μC
                    </text>

                    {/* Charge q2 (test charge) */}
                    <circle cx={c2x} cy={cy} r="13" fill={q2Color} stroke="#ffffff" strokeWidth="2" />
                    <text
                      x={c2x}
                      y={cy + 4}
                      textAnchor="middle"
                      className="fill-white text-xs font-bold font-mono"
                    >
                      {q2Micro >= 0 ? '+' : '−'}
                    </text>
                    <text
                      x={c2x}
                      y={cy - 20}
                      textAnchor="middle"
                      className="fill-slate-900 text-[11px] font-mono font-semibold"
                    >
                      q₂ = {q2Micro > 0 ? '+' : ''}{q2Micro} μC
                    </text>
                  </>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Right Controls & Readouts */}
        <aside className="lg:col-span-4 space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
            <h3 className="text-base font-semibold text-slate-900">
              Parámetros Electrostáticos
            </h3>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="q1-slider" className="font-medium text-slate-700">
                  Carga fuente q₁
                </label>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {q1Micro > 0 ? '+' : ''}{q1Micro} μC
                </span>
              </div>
              <input
                id="q1-slider"
                type="range"
                min={-10}
                max={10}
                step={1}
                value={q1Micro}
                onChange={(e) => setQ1Micro(parseInt(e.target.value, 10))}
                className="sci-slider w-full"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="q2-slider" className="font-medium text-slate-700">
                  Carga de prueba q₂
                </label>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {q2Micro > 0 ? '+' : ''}{q2Micro} μC
                </span>
              </div>
              <input
                id="q2-slider"
                type="range"
                min={-10}
                max={10}
                step={1}
                value={q2Micro}
                onChange={(e) => setQ2Micro(parseInt(e.target.value, 10))}
                className="sci-slider w-full"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="r-slider" className="font-medium text-slate-700">
                  Distancia r
                </label>
                <span className="font-mono font-semibold text-sky-700 tabular-nums">
                  {distanceCm.toFixed(1)} cm ({rMeters.toFixed(3)} m)
                </span>
              </div>
              <input
                id="r-slider"
                type="range"
                min={2}
                max={12}
                step={0.5}
                value={distanceCm}
                onChange={(e) => setDistanceCm(parseFloat(e.target.value))}
                className="sci-slider w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-slate-200 pt-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] text-slate-500">Fuerza F</div>
                <div className="mt-0.5 font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {forceMag.toFixed(2)} N
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] text-slate-500">Campo |E(r)|</div>
                <div className="mt-0.5 font-mono text-sm font-bold text-sky-700 tabular-nums">
                  {(eFieldMag / 1e6).toFixed(2)} MN/C
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] text-slate-500">Potencial V(r)</div>
                <div className="mt-0.5 font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {(potentialV / 1e3).toFixed(1)} kV
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] text-slate-500">Energía Pot. Uₑ</div>
                <div className="mt-0.5 font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {potentialEnergyJ.toFixed(3)} J
                </div>
              </div>
            </div>
          </div>

          <FigureAsset
            src="/figures/CoulombsLaw.svg"
            alt="Signos en la Ley de Coulomb"
            caption="Figura del libro: signos de repulsión y atracción en la Ley de Coulomb."
            imgClassName="w-full h-36 object-contain"
          />
        </aside>
      </div>

      {/* Solved Example: Charge of N electrons (with Reasoning/Development Table) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              4.1.1 La Cantidad de Carga en un Grupo de Electrones
            </h3>
            <p className="text-xs text-slate-500">
              Tabla de razonamiento y desarrollo paso a paso (Sección 4.1.1 de main.tex).
            </p>
          </div>
          <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setElectronPreset('6b')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
                electronPreset === '6b' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Ejemplo: 6×10⁹
            </button>
            <button
              type="button"
              onClick={() => setElectronPreset('4m')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
                electronPreset === '4m' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Inténtalo: 4×10⁶
            </button>
            <button
              type="button"
              onClick={() => setElectronPreset('custom')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
                electronPreset === 'custom' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Personalizado
            </button>
          </div>
        </div>

        <ExampleBox>
          Calcule la carga, en coulombs, transportada por{' '}
          {electronPreset === '6b'
            ? '6 mil millones de electrones.'
            : electronPreset === '4m'
            ? '4 millones de electrones (Ejemplo resuelto: Inténtalo tú mismo).'
            : `${customBillions} mil millones de electrones.`}
        </ExampleBox>

        {electronPreset === 'custom' && (
          <div className="max-w-sm space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Cantidad (miles de millones)</span>
              <span className="font-mono font-semibold text-sky-700 tabular-nums">
                {customBillions} × 10⁹ electrones
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={customBillions}
              onChange={(e) => setCustomBillions(parseInt(e.target.value, 10))}
              className="sci-slider w-full"
            />
          </div>
        )}

        <ReasoningTable
          rows={[
            {
              reasoning: 'Exprese el número de electrones en notación científica.',
              developmentTex: `N_e = ${electronCount.toExponential(2).replace('e+', '\\times 10^{')}}`,
            },
            {
              reasoning: (
                <>
                  Calcule la carga <MathTex tex="q" /> multiplicando por la carga elemental{' '}
                  <MathTex tex="q_e = -1.602 \times 10^{-19}\text{ C}" />.
                </>
              ),
              developmentTex: `\\begin{aligned} q &= N_e \\times q_e \\\\ &= (${electronCount.toExponential(
                2
              ).replace('e+', '\\times 10^{')}}) \\times (-1.602 \\times 10^{-19}\\text{ C}) \\\\ &= ${totalChargeC
                .toExponential(2)
                .replace('e', '\\times 10^{')}}\\text{ C} \\end{aligned}`,
            },
          ]}
        />
      </div>

      {/* 4.1.2 Electrostatic Potential Energy, U-235 Fission & Chemical Bonds */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">
            4.1.2 Energía Potencial Eléctrica en el Núcleo de Uranio-235 (Lise Meitner)
          </h3>
          <p className="text-sm leading-relaxed text-slate-600">
            Al modelar un núcleo pesado como una esfera cargada uniformemente (factor geométrico <MathTex tex="3/5" />), la repulsión coulombiana entre sus protones almacena una energía potencial enorme que explica la energía cinética liberada en la fisión nuclear:
          </p>
          <EquationBox
            boxed
            number="4.3"
            tex="U_{\text{esfera}} = \frac{3}{5} k \frac{Q^2}{R}, \qquad R \approx (1.2\text{ fm})\cdot A^{1/3}"
          />
          <EquationBox
            tex="{}^{235}_{92}\text{U} + n \longrightarrow {}^{141}_{56}\text{Ba} + {}^{92}_{36}\text{Kr} + 3n"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Uranio-235 (Z=92)</div>
              <div className="mt-1 font-mono text-base font-bold text-slate-900 tabular-nums">
                {u235Data.u.uMeV.toFixed(0)} MeV
              </div>
              <div className="text-[11px] font-mono text-slate-500">R ≈ {u235Data.u.rFm.toFixed(2)} fm</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Ba-141 + Kr-92</div>
              <div className="mt-1 font-mono text-base font-bold text-sky-700 tabular-nums">
                {u235Data.fragSum.toFixed(0)} MeV
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                ({u235Data.ba.uMeV.toFixed(0)} + {u235Data.kr.uMeV.toFixed(0)} MeV)
              </div>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3">
              <div className="text-xs text-emerald-800 font-medium">ΔE electrostática</div>
              <div className="mt-1 font-mono text-base font-bold text-emerald-900 tabular-nums">
                ≈ {u235Data.deltaMeV.toFixed(0)} MeV
              </div>
              <div className="text-[11px] text-emerald-700">Repulsión convertida en calor</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FigureAsset
              src="/figures/fusion.jpg"
              alt="Modelo nuclear de fisión y fusión"
              caption="Energía nuclear por nucleón (fusión y fisión)."
              imgClassName="w-full h-32 object-contain"
            />
            <FigureAsset
              src="/figures/gotas.jpg"
              alt="Modelo de gota líquida nuclear"
              caption="Deformación del núcleo pesado como gota líquida."
              imgClassName="w-full h-32 object-contain"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
            <h4 className="text-sm font-semibold text-slate-900">
              Enlaces Químicos y Fuerzas de Van der Waals
            </h4>
            <p className="text-xs leading-relaxed text-slate-600">
              Toda la química emerge del balance electrostático: enlace iónico (<MathTex tex="U_e = -k|q_1 q_2|/r" />), enlace covalente (electrones compartidos que atraen a ambos núcleos equilibrando su repulsión), enlace metálico ("mar de electrones") y dipolos inducidos de Van der Waals (<MathTex tex="|\boldsymbol{F}_{\text{VdW}}| \propto 1/r^7" />).
            </p>
          </div>
        </div>
      </div>

      {/* 4.2 Electric Current, Power & Household Consumption */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-slate-900">
            4.2 Corriente Eléctrica, Potencia y Consumo Energético
          </h2>
          <p className="text-sm text-slate-600">
            La corriente eléctrica mide el flujo de carga por unidad de tiempo, mientras que la potencia eléctrica relaciona voltaje y corriente.
          </p>
        </div>

        <EquationBox
          number="4.4"
          tex="I = \frac{q}{t} = \frac{n_e q_e}{t}, \qquad W = U_e = V q = V I t, \qquad P = \frac{W}{t} = V I"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label htmlFor="volt-slider" className="font-medium text-slate-700">Voltaje V</label>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">{voltageV} V</span>
                </div>
                <input
                  id="volt-slider"
                  type="range"
                  min={12}
                  max={240}
                  step={2}
                  value={voltageV}
                  onChange={(e) => setVoltageV(parseInt(e.target.value, 10))}
                  className="sci-slider w-full"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label htmlFor="curr-slider" className="font-medium text-slate-700">Corriente I</label>
                  <span className="font-mono font-semibold text-sky-700 tabular-nums">{currentA.toFixed(1)} A</span>
                </div>
                <input
                  id="curr-slider"
                  type="range"
                  min={0.2}
                  max={20}
                  step={0.2}
                  value={currentA}
                  onChange={(e) => setCurrentA(parseFloat(e.target.value))}
                  className="sci-slider w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] text-slate-500">Potencia P = V·I</div>
                <div className="mt-1 font-mono text-base font-bold text-slate-900 tabular-nums">
                  {powerW.toFixed(0)} W
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] text-slate-500">Electrones / segundo</div>
                <div className="mt-1 font-mono text-xs sm:text-sm font-bold text-sky-700 tabular-nums">
                  {(currentA / E_CHARGE).toExponential(2)}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] text-slate-500">Consumo (8h/día · 30d)</div>
                <div className="mt-1 font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {((powerW * 8 * 30) / 1000).toFixed(1)} kWh
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-800">
                  Calculadora de Factura Mensual (720 h/mes)
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  P_media = {avgPowerFromBillW.toFixed(1)} W
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={400}
                step={1}
                value={monthlyKwh}
                onChange={(e) => setMonthlyKwh(parseInt(e.target.value, 10))}
                className="sci-slider w-full"
                aria-label="Consumo mensual en kWh"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <span>Consumo ingresado: {monthlyKwh} kWh/mes</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMonthlyKwh(35)}
                    className="text-sky-700 hover:underline cursor-pointer"
                  >
                    Nevera (34.7 kWh)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonthlyKwh(191)}
                    className="text-sky-700 hover:underline cursor-pointer"
                  >
                    Hogar ejemplo (191 kWh)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <FigureAsset
              src="/figures/consumo.png"
              alt="Etiqueta de consumo energético de una nevera"
              caption="Ejemplo del libro: etiqueta de 34.7 kWh/mes equivale a P = 48 W (I = 0.44 A a 110 V)."
              imgClassName="w-full h-56 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
