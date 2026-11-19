import React, { useMemo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { MathTex } from '../../components/MathTex';
import { FigureAsset } from '../../components/FigureAsset';
import { EquationBox, ExampleBox, ReasoningTable } from '../../components/LatexBlocks';

export const RelDopplerDecaySection: React.FC = () => {
  // Velocity addition
  const [uPrimeBeta, setUPrimeBeta] = useState<number>(0.7);
  const [frameBeta, setFrameBeta] = useState<number>(0.6);
  const [revealVelSteps, setRevealVelSteps] = useState<boolean>(false);

  // Relativistic Doppler (f0 = 550 THz green/yellow default)
  const [dopplerBeta, setDopplerBeta] = useState<number>(0.2); // positive = approaching
  const [f0Thz, setF0Thz] = useState<number>(500);

  // Radioactive Decay simulator
  const [isotope, setIsotope] = useState<'u238' | 'neutron' | 'muon' | 'custom'>('muon');
  const [halfLivesElapsed, setHalfLivesElapsed] = useState<number>(2.5);

  const uEinstein = useMemo(
    () => (uPrimeBeta + frameBeta) / (1 + uPrimeBeta * frameBeta),
    [uPrimeBeta, frameBeta]
  );
  const uGalileo = uPrimeBeta + frameBeta;

  // Doppler factor sqrt((1 + beta)/(1 - beta)) for approaching (+beta) or receding (-beta)
  const dopplerFactor = useMemo(
    () => Math.sqrt((1 + dopplerBeta) / (1 - dopplerBeta)),
    [dopplerBeta]
  );
  const fObsThz = f0Thz * dopplerFactor;

  // Interstellar video transmission example from main.tex line 1959 (beta = 0.9999999)
  const interstellarBeta = 0.9999999;
  const dopplerReceding = Math.sqrt((1 - interstellarBeta) / (1 + interstellarBeta)); // ~2.236e-4

  // Radioactive decay curve N(t) = N0 * (0.5)^(t/t_half)
  const remainingFrac = Math.pow(0.5, halfLivesElapsed);
  const decayPath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 50; i++) {
      const th = (i / 50) * 5;
      const frac = Math.pow(0.5, th);
      const px = 35 + (th / 5) * 235;
      const py = 155 - frac * 125;
      pts.push(`${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`);
    }
    return pts.join(' ');
  }, []);

  const isotopeHalfLife =
    isotope === 'u238'
      ? '4.468 × 10⁹ años'
      : isotope === 'neutron'
      ? '611 s (10.2 min)'
      : isotope === 'muon'
      ? '1.52 μs (τ₀ = 2.2 μs)'
      : '1.0 unidad t₁/₂';

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-slate-500">
          Capítulo 2 · Secciones 2.6 – 2.9
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Composición de Velocidades, Efecto Doppler, Espejos del JWST y Decaimiento
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
          La suma relativista impide superar la velocidad límite <MathTex tex="c" />. Estudiamos también la asimetría entre el Doppler acústico y el Doppler luminoso, su impacto en transmisiones interestelares, los efectos relativistas en el oro de los espejos del telescopio James Webb y la ley exponencial de desintegración radiactiva.
        </p>
      </div>

      {/* 2.6 Velocity Addition */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              2.6 Adición Relativista de Velocidades
            </h2>
            <button
              type="button"
              onClick={() => setRevealVelSteps((r) => !r)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {revealVelSteps ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {revealVelSteps ? 'Ocultar deducción' : 'Ver deducción'}
            </button>
          </div>

          <EquationBox
            boxed
            number="2.3"
            tex="u = \frac{u' + v}{1 + \dfrac{u' v}{c^2}}"
          />

          <ReasoningTable
            caption="Deducción de la transformación de velocidades por cociente de diferenciales (main.tex)."
            rows={[
              {
                reasoning: 'Diferenciamos las transformaciones inversas de Lorentz.',
                developmentTex: "\\Delta x = \\gamma(\\Delta x' + v\\Delta t'), \\qquad \\Delta t = \\gamma\\left(\\Delta t' + \\frac{v\\Delta x'}{c^2}\\right)",
              },
              {
                reasoning: 'Dividimos Δx / Δt cancelando el factor γ y dividimos numerador y denominador por Δt′.',
                developmentTex: revealVelSteps
                  ? "u = \\frac{\\Delta x}{\\Delta t} = \\frac{\\Delta x'/\\Delta t' + v}{1 + \\frac{v}{c^2}(\\Delta x'/\\Delta t')} = \\frac{u' + v}{1 + u'v/c^2}"
                  : "\\text{(Paso oculto — pulsa Ver deducción)}",
              },
            ]}
          />
        </div>

        <aside className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">Comparador Einstein vs. Galileo</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Nave S′ respecto a S (v/c)</span>
                <span className="font-mono font-semibold text-sky-700 tabular-nums">{frameBeta.toFixed(2)} c</span>
              </div>
              <input
                type="range"
                min={-0.95}
                max={0.95}
                step={0.05}
                value={frameBeta}
                onChange={(e) => setFrameBeta(parseFloat(e.target.value))}
                className="sci-slider w-full"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Proyectil en S′ (u′/c)</span>
                <span className="font-mono font-semibold text-emerald-700 tabular-nums">{uPrimeBeta.toFixed(2)} c</span>
              </div>
              <input
                type="range"
                min={-0.99}
                max={1.0}
                step={0.01}
                value={uPrimeBeta}
                onChange={(e) => setUPrimeBeta(parseFloat(e.target.value))}
                className="sci-slider w-full"
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-2 text-xs font-mono tabular-nums">
            <div className="flex justify-between">
              <span className="text-slate-600">Suma galileana (u′ + v):</span>
              <span className={Math.abs(uGalileo) > 1 ? 'text-red-600 font-bold' : 'text-slate-800'}>
                {uGalileo.toFixed(3)} c {Math.abs(uGalileo) > 1 ? '(¡viola c!)' : ''}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-emerald-700 font-bold">
              <span>Suma relativista (u):</span>
              <span>{uEinstein.toFixed(4)} c</span>
            </div>
          </div>
        </aside>
      </div>

      {/* 2.7 Sound vs Light Doppler & Interstellar Video */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            2.7 Efecto Doppler Relativista vs. Acústico
          </h2>
          <p className="text-sm text-slate-600">
            En el sonido importa quién se mueve respecto al aire (fuente vs. receptor). En la luz no existe medio: la dilatación temporal simetriza la expresión, dependiendo solo de la velocidad relativa entre fuente y receptor.
          </p>

          <EquationBox
            boxed
            number="2.4"
            tex="f_{\text{obs}} = f_0 \sqrt{\frac{1 + \beta}{1 - \beta}} \quad (\text{acercándose}), \qquad f_{\text{obs}} = f_0 \sqrt{\frac{1 - \beta}{1 + \beta}} \quad (\text{alejándose})"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FigureAsset
              src="/figures/sound.png"
              alt="Efecto Doppler en ondas sonoras"
              caption="Sonido: el movimiento relativo al medio rompe la simetría entre fuente y observador."
              imgClassName="w-full h-40 object-contain"
            />
            <FigureAsset
              src="/figures/light.png"
              alt="Efecto Doppler relativista de la luz"
              caption="Luz: frentes de onda en el vacío con dilatación temporal incluida."
              imgClassName="w-full h-40 object-contain"
            />
          </div>

          <ExampleBox title="Transmisión de video interestelar (β = 0.9999999, main.tex)">
            Una astronave viaja a <MathTex tex="v = 0.9999999c" /> (<MathTex tex="\gamma \approx 2236.07" />). Para recorrer <MathTex tex="100,000\text{ años luz}" />, su tiempo propio es solo <MathTex tex="\tau \approx 44.72\text{ años}" />. Si transmite video en vivo a 30 fps:
            <ul className="mt-2 list-disc pl-5 text-xs space-y-1">
              <li><strong>Alejándose (<MathTex tex="z+1 = 2\gamma \approx 4472" />):</strong> la Tierra recibe la señal comprimida temporalmente hacia el rojo durante unos 200,000 años (contando la ida y el retorno de luz).</li>
              <li><strong>Regresando:</strong> los fotones se apilan al azul y la Tierra recibe todo el viaje de 44.7 años en apenas <span className="font-mono font-semibold">{(44.72 * 365.25 * dopplerReceding).toFixed(2)} días</span>.</li>
            </ul>
          </ExampleBox>
        </div>

        <aside className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">Simulador Doppler Óptico</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">β (− alejándose, + acercándose)</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {dopplerBeta >= 0 ? '+' : ''}{dopplerBeta.toFixed(2)} c
                </span>
              </div>
              <input
                type="range"
                min={-0.8}
                max={0.8}
                step={0.02}
                value={dopplerBeta}
                onChange={(e) => setDopplerBeta(parseFloat(e.target.value))}
                className="sci-slider w-full"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Frecuencia emitida f₀</span>
                <span className="font-mono text-slate-900 tabular-nums">{f0Thz} THz</span>
              </div>
              <input
                type="range"
                min={400}
                max={700}
                step={10}
                value={f0Thz}
                onChange={(e) => setF0Thz(parseInt(e.target.value, 10))}
                className="sci-slider w-full"
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-2 text-xs">
            <div className="flex justify-between font-mono tabular-nums">
              <span className="text-slate-600">Factor Doppler:</span>
              <span className="font-semibold text-slate-900">{dopplerFactor.toFixed(3)}×</span>
            </div>
            <div className="flex justify-between font-mono tabular-nums">
              <span className="text-slate-600">Frecuencia observada f:</span>
              <span className={`font-bold ${dopplerBeta >= 0 ? 'text-sky-700' : 'text-red-600'}`}>
                {fObsThz.toFixed(1)} THz
              </span>
            </div>
            <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-2">
              {dopplerBeta > 0.01
                ? 'Corrimiento al azul (blueshift): mayor frecuencia, menor longitud de onda.'
                : dopplerBeta < -0.01
                ? 'Corrimiento al rojo (redshift): menor frecuencia, mayor longitud de onda.'
                : 'Sin desplazamiento Doppler longitudinal.'}
            </div>
          </div>
        </aside>
      </div>

      {/* 2.8 JWST Gold Mirrors & 2.9 Radioactive Decay */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            2.8 Por qué el Oro de los Espejos del JWST es Amarillo (Z = 79)
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Sin efectos relativistas, el oro tendría el color plateado de la plata. Debido a su elevada carga nuclear (<MathTex tex="Z = 79" />), los electrones internos del orbital <MathTex tex="1s" /> alcanzan velocidades promedio cercanas a <MathTex tex="v \approx Z\alpha c \approx 0.58c" /> (<MathTex tex="\gamma \approx 1.23" />). La masa relativista aumenta, contrayendo los orbitales <MathTex tex="s" /> y desestabilizando los <MathTex tex="5d" />.
          </p>
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 space-y-2 text-xs text-slate-700">
            <div className="font-semibold text-amber-900">Brecha energética óptica 5d → 6s:</div>
            <p>
              La brecha se reduce desde ≈ 3.8 eV (ultravioleta, como la plata) hasta <strong className="font-mono text-amber-900">ΔE ≈ 2.8 eV</strong> (azul), absorbiendo luz azul y reflejando intensamente amarillo, naranja e infrarrojo en los espejos hexagonales del Telescopio Espacial James Webb.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            2.9 Desintegración Radiactiva Exponencial
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-center">
            <svg viewBox="0 0 290 175" className="w-full h-auto rounded-lg border border-slate-200 bg-slate-50/70 p-2" role="img" aria-label="Curva de decaimiento exponencial radiactivo">
              <line x1="35" y1="155" x2="275" y2="155" stroke="#64748b" strokeWidth="1.5" />
              <line x1="35" y1="20" x2="35" y2="155" stroke="#64748b" strokeWidth="1.5" />
              <path d={decayPath} fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <circle
                cx={35 + (halfLivesElapsed / 5) * 235}
                cy={155 - remainingFrac * 125}
                r="5"
                fill="#dc2626"
              />
              <text x="155" y="170" textAnchor="middle" className="fill-slate-600 text-[10px] font-mono">
                t / t₁/₂ = {halfLivesElapsed.toFixed(1)}
              </text>
              <text x="12" y="90" transform="rotate(-90 12 90)" textAnchor="middle" className="fill-slate-600 text-[10px] font-mono">
                N(t)/N₀ = {(remainingFrac * 100).toFixed(1)}%
              </text>
            </svg>
            <FigureAsset
              src="/figures/decaimiento.png"
              alt="Curva de decaimiento exponencial N(t)"
              caption="Vida media t₁/₂ = ln(2)/λ."
              imgClassName="w-full h-36 object-contain"
            />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'muon', label: 'Muón (t₁/₂ = 1.52 μs)' },
                  { id: 'neutron', label: 'Neutrón libre (611 s)' },
                  { id: 'u238', label: 'U-238 (4.47 Ga)' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIsotope(item.id)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium border cursor-pointer ${
                    isotope === item.id
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-700 font-medium">Semividas transcurridas ({isotopeHalfLife})</span>
              <span className="font-mono font-bold text-red-600 tabular-nums">
                {(remainingFrac * 100).toFixed(2)}% restante
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              step={0.1}
              value={halfLivesElapsed}
              onChange={(e) => setHalfLivesElapsed(parseFloat(e.target.value))}
              className="sci-slider w-full"
            />
            <MathTex block tex="N(t) = N_0 e^{-\lambda t} = N_0\left(\frac{1}{2}\right)^{t/t_{1/2}}" className="text-xs" />
          </div>
        </div>
      </div>
    </div>
  );
};
