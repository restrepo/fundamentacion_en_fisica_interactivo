import React, { useMemo, useState } from 'react';
import { MathTex } from '../../components/MathTex';
import { FigureAsset } from '../../components/FigureAsset';
import { EquationBox, ExampleBox } from '../../components/LatexBlocks';

export const RelEnergySection: React.FC = () => {
  const [xi, setXi] = useState<number>(1.0); // Rapidity
  const [massKg, setMassKg] = useState<number>(0.001); // 1 mg = 1e-6 kg default via preset
  const [speedBeta, setSpeedBeta] = useState<number>(0.99);

  const rapidityData = useMemo(() => {
    const beta = Math.tanh(xi);
    const gamma = Math.cosh(xi);
    const gammaBeta = Math.sinh(xi);
    return { beta, gamma, gammaBeta };
  }, [xi]);

  const energyCalc = useMemo(() => {
    const c = 2.99792458e8;
    const g = 1 / Math.sqrt(1 - speedBeta * speedBeta);
    const mc2J = massKg * c * c;
    const E_J = g * mc2J;
    const K_J = (g - 1) * mc2J;
    const p_SI = g * massKg * speedBeta * c;
    const tonsTNT = K_J / 4.184e9;
    return { g, mc2J, E_J, K_J, p_SI, tonsTNT };
  }, [massKg, speedBeta]);

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-slate-500">
          Capítulo 2 · Secciones 2.10 – 2.12
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Minkowski, Rapidez Hiperbólica, E = mc² e Impacto en la Vida Cotidiana
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
          La invariancia hiperbólica <MathTex tex="\cosh^2\xi - \sinh^2\xi = 1" /> geométrica el espacio-tiempo de Minkowski y conduce directamente al cuadrivector momento-energía <MathTex tex="E^2 = (pc)^2 + (mc^2)^2" />, unificando masa, energía nuclear, radiación y dispositivos tecnológicos modernos.
        </p>
      </div>

      {/* Hyperbolic Rapidity & Minkowski */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            2.10 Geometría de Minkowski y Rapidez Hiperbólica ξ
          </h2>
          <p className="text-sm text-slate-600">
            Mientras las rotaciones espaciales preservan <MathTex tex="x^2+y^2" /> con funciones circulares (<MathTex tex="\cos\theta, \sin\theta" />), los impulsos de Lorentz preservan <MathTex tex="(ct)^2 - x^2" /> mediante rotaciones hiperbólicas con parámetro <MathTex tex="\xi = \text{atanh}(\beta)" /> (que además es aditivo: <MathTex tex="\xi_{\text{tot}} = \xi_1 + \xi_2" />).
          </p>

          <EquationBox
            boxed
            number="2.5"
            tex="\gamma = \cosh\xi, \qquad \gamma\beta = \sinh\xi, \qquad \beta = \tanh\xi \implies \cosh^2\xi - \sinh^2\xi = 1"
          />
          <EquationBox
            boxed
            number="2.6"
            tex="E = \gamma mc^2, \qquad p = \gamma mv \implies E^2 - (pc)^2 = (mc^2)^2"
          />

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Rapidez hiperbólica ξ</span>
              <span className="font-mono font-bold text-sky-700 tabular-nums">ξ = {xi.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={3.5}
              step={0.05}
              value={xi}
              onChange={(e) => setXi(parseFloat(e.target.value))}
              className="sci-slider w-full"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs font-mono tabular-nums">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-slate-500">β = tanh(ξ)</div>
              <div className="mt-1 font-bold text-slate-900">{rapidityData.beta.toFixed(5)} c</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-slate-500">γ = cosh(ξ)</div>
              <div className="mt-1 font-bold text-sky-700">{rapidityData.gamma.toFixed(4)}</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-slate-500">γβ = senh(ξ)</div>
              <div className="mt-1 font-bold text-emerald-700">{rapidityData.gammaBeta.toFixed(4)}</div>
            </div>
          </div>
        </div>

        {/* Energy-Mass Calculator */}
        <aside className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">
            Calculadora Relativista de Energía Cinética K
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMassKg(1e-6); // 1 mg dust
                setSpeedBeta(0.99);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Polvo 1 mg @ 0.99c
            </button>
            <button
              type="button"
              onClick={() => {
                setMassKg(0.001); // 1 g Starshot
                setSpeedBeta(0.2);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Starshot 1 g @ 0.2c
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Rapidez β = v/c</span>
              <span className="font-mono font-bold text-red-600 tabular-nums">{speedBeta.toFixed(3)} c</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={0.995}
              step={0.005}
              value={speedBeta}
              onChange={(e) => setSpeedBeta(parseFloat(e.target.value))}
              className="sci-slider w-full"
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-2 text-xs font-mono tabular-nums">
            <div className="flex justify-between">
              <span className="text-slate-600">Masa m:</span>
              <span className="font-semibold text-slate-900">{massKg.toExponential(2)} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Factor γ:</span>
              <span className="font-semibold text-slate-900">{energyCalc.g.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Energía en reposo mc²:</span>
              <span className="text-slate-800">{energyCalc.mc2J.toExponential(2)} J</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Momento p = γmv:</span>
              <span className="text-slate-800">{energyCalc.p_SI.toExponential(2)} kg·m/s</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-sky-700 font-bold">
              <span>Energía cinética K:</span>
              <span>{energyCalc.K_J.toExponential(2)} J</span>
            </div>
            <div className="flex justify-between text-red-700 font-bold">
              <span>Equivalente TNT:</span>
              <span>
                {energyCalc.tonsTNT >= 1 ? `${energyCalc.tonsTNT.toFixed(1)} toneladas` : `${(energyCalc.tonsTNT * 1000).toFixed(1)} kg`}
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* Physical Examples & Synthesis Table Δm/m */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            2.11 Equivalencia Masa-Energía en Procesos Reales (Δm / m)
          </h2>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Proceso físico</th>
                  <th className="px-4 py-2.5 font-semibold">Energía liberada</th>
                  <th className="px-4 py-2.5 font-semibold">Fracción Δm / m</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-2.5 font-medium">Combustión de Metano (química)</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums">≈ 50 MJ/kg</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-slate-700">5.6 × 10⁻¹⁰</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium">Fisión nuclear U-235</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums">≈ 71.4 TJ/kg</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-sky-700 font-semibold">8 × 10⁻⁴ (0.08%)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium">Fusión Deuterio-Tritio (bomba H / estrellas)</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums">≈ 339 TJ/kg (4.75× fisión)</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-emerald-700 font-semibold">3.8 × 10⁻³ (0.38%)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium">Aniquilación materia-antimateria (e⁻e⁺ → 2γ)</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums">9.0 × 10¹⁶ J/kg</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-red-700 font-bold">1.0 (100%)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ExampleBox title="Láser de CO₂ industrial (4 kW)">
              Un láser industrial emite <MathTex tex="4000\text{ J/s}" /> en fotones de <MathTex tex="\lambda = 10.6\,\mu\text{m}" /> (<MathTex tex="E_\gamma \approx 0.117\text{ eV}" />), expulsando <MathTex tex="2.13\times 10^{23}" /> fotones por segundo que ejercen una fuerza de retroceso de <MathTex tex="P/c \approx 1.33\times 10^{-5}\text{ N}" />.
            </ExampleBox>
            <FigureAsset
              src="/figures/fusion.jpg"
              alt="Fusión nuclear Deuterio-Tritio"
              caption="Fusión D-T (main.tex): libera 17.6 MeV por reacción, convirtiendo el 0.38% de la masa."
              imgClassName="w-full h-36 object-cover rounded"
            />
          </div>
        </div>

        {/* 2.12 Everyday Relativity */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            2.12 Impacto Cotidiano de la Relatividad
          </h2>
          <div className="space-y-3 text-xs leading-relaxed text-slate-700">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-900">Sistema GPS (+38 μs/día)</div>
              Los satélites adelantan +45 μs/día por gravedad menor y atrasan −7 μs/día por rapidez orbital; sin corregir +38 μs/día el error superaría 11 km diarios.
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-900">Baterías de Plomo-Ácido (automóviles)</div>
              Más del 80% del voltaje de 2.1 V por celda proviene de efectos relativistas en el orbital 6s del plomo (Z=82); sin relatividad solo entregaría ≈ 0.4 V.
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-900">Color del Oro y Mercurio líquido</div>
              La contracción relativista del orbital 6s explica el brillo dorado del Au (Z=79) y debilita los enlaces en el Hg (Z=80), manteniéndolo líquido a temperatura ambiente.
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-900">Tomografía PET (511 keV) y Qubits / ECC RAM</div>
              La aniquilación electrón-positrón genera fotones opuestos de 511 keV en imagen médica; los muones cósmicos inducen inversión de bits en memorias ECC y decoherencia en procesadores cuánticos.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
