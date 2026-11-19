import React, { useMemo, useState } from 'react';
import { MathTex } from '../../components/MathTex';
import { FigureAsset } from '../../components/FigureAsset';
import { EquationBox, ExampleBox } from '../../components/LatexBlocks';

export const DynMomentumForcesSection: React.FC = () => {
  // 1D Collisions
  const [m1, setM1] = useState<number>(2);
  const [m2, setM2] = useState<number>(2);
  const [v1i, setV1i] = useState<number>(6);
  const [v2i, setV2i] = useState<number>(0);
  const [collisionType, setCollisionType] = useState<'elastic' | 'inelastic'>('elastic');

  // Inclined plane & friction block
  const [inclineDeg, setInclineDeg] = useState<number>(25);
  const [pullForceN, setPullForceN] = useState<number>(50);
  const [pullAngleDeg, setPullAngleDeg] = useState<number>(30);
  const blockMassKg = 10;
  const g = 9.81;

  const collision = useMemo(() => {
    const M = m1 + m2;
    const vCM = (m1 * v1i + m2 * v2i) / M;
    const pInit = m1 * v1i + m2 * v2i;
    const kInit = 0.5 * m1 * v1i * v1i + 0.5 * m2 * v2i * v2i;

    if (collisionType === 'inelastic') {
      const kFinal = 0.5 * M * vCM * vCM;
      return { vCM, v1f: vCM, v2f: vCM, pInit, kInit, kFinal, kLost: kInit - kFinal };
    }
    const v1f = ((m1 - m2) / M) * v1i + ((2 * m2) / M) * v2i;
    const v2f = ((2 * m1) / M) * v1i + ((m2 - m1) / M) * v2i;
    return { vCM, v1f, v2f, pInit, kInit, kFinal: kInit, kLost: 0 };
  }, [m1, m2, v1i, v2i, collisionType]);

  const inclineAccel = g * Math.sin((inclineDeg * Math.PI) / 180);
  const fNormalBlock = blockMassKg * g - pullForceN * Math.sin((pullAngleDeg * Math.PI) / 180);

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-slate-500">
          Capítulo 3 · Secciones 3.6 – 3.9
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Conservación del Momento, Centro de Masa, Plano Inclinado y Fuerza Centrípeta
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
          Analizamos colisiones elásticas e inelásticas desde el marco del Centro de Masa (ZMF), la descomposición vectorial de fuerzas en planos inclinados y tracción con fricción, y la prueba histórica de Newton que unió la caída de una manzana con la órbita lunar.
        </p>
      </div>

      {/* 3.6–3.7 Momentum & Center of Mass */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              3.6–3.7 Colisiones 1D y Marco de Momento Cero (Centro de Masa)
            </h2>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setCollisionType('elastic')}
                className={`rounded-md px-3 py-1 text-xs font-medium cursor-pointer ${
                  collisionType === 'elastic' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Elástica (K cons.)
              </button>
              <button
                type="button"
                onClick={() => setCollisionType('inelastic')}
                className={`rounded-md px-3 py-1 text-xs font-medium cursor-pointer ${
                  collisionType === 'inelastic' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Perfect. Inelástica
              </button>
            </div>
          </div>

          <EquationBox
            boxed
            number="3.4"
            tex="\boldsymbol{P}_{\text{tot}} = M_{\text{tot}}\boldsymbol{v}_{\text{CM}}, \qquad v_{1f} = \frac{m_1-m_2}{m_1+m_2}v_{1i} + \frac{2m_2}{m_1+m_2}v_{2i}"
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs font-mono tabular-nums">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-slate-500">v_CM</div>
              <div className="mt-1 font-bold text-slate-900">{collision.vCM.toFixed(2)} m/s</div>
            </div>
            <div className="rounded-lg border border-sky-200 bg-sky-50/70 p-3">
              <div className="text-sky-800">v₁ final</div>
              <div className="mt-1 font-bold text-sky-900">{collision.v1f.toFixed(2)} m/s</div>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3">
              <div className="text-emerald-800">v₂ final</div>
              <div className="mt-1 font-bold text-emerald-900">{collision.v2f.toFixed(2)} m/s</div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3">
              <div className="text-amber-800">Energía disipada</div>
              <div className="mt-1 font-bold text-amber-900">{collision.kLost.toFixed(1)} J</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ExampleBox title="Aniquilación e⁻e⁺ → 2γ">
              En el marco de momento cero (<MathTex tex="\boldsymbol{P}_{\text{CM}}=0" />), los dos fotones gamma deben emerger en direcciones exactamente opuestas para conservar <MathTex tex="\boldsymbol{P}_{\text{tot}} = 0" />.
            </ExampleBox>
            <ExampleBox title="Sistema binario m₁ r₁ = m₂ r₂">
              Dos cuerpos ligados orbitan alrededor de su centro de masa común con radios inversamente proporcionales a sus masas.
            </ExampleBox>
          </div>
        </div>

        <aside className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-3">
          <h3 className="text-base font-semibold text-slate-900">Parámetros de Colisión</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between"><span>Masa m₁</span><span className="font-mono font-bold">{m1} kg</span></div>
              <input type="range" min={1} max={10} step={1} value={m1} onChange={(e) => setM1(parseInt(e.target.value, 10))} className="sci-slider w-full" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span>Masa m₂</span><span className="font-mono font-bold">{m2} kg</span></div>
              <input type="range" min={1} max={10} step={1} value={m2} onChange={(e) => setM2(parseInt(e.target.value, 10))} className="sci-slider w-full" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span>Velocidad v₁i</span><span className="font-mono font-bold text-sky-700">{v1i} m/s</span></div>
              <input type="range" min={-8} max={10} step={1} value={v1i} onChange={(e) => setV1i(parseInt(e.target.value, 10))} className="sci-slider w-full" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span>Velocidad v₂i</span><span className="font-mono font-bold text-emerald-700">{v2i} m/s</span></div>
              <input type="range" min={-8} max={10} step={1} value={v2i} onChange={(e) => setV2i(parseInt(e.target.value, 10))} className="sci-slider w-full" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => { setM1(2); setM2(2); setV1i(6); setV2i(0); setCollisionType('elastic'); }}
              className="flex-1 rounded border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] font-medium hover:bg-slate-100 cursor-pointer"
            >
              Masas iguales (billar)
            </button>
            <button
              type="button"
              onClick={() => { setM1(1); setM2(10); setV1i(8); setV2i(0); setCollisionType('elastic'); }}
              className="flex-1 rounded border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] font-medium hover:bg-slate-100 cursor-pointer"
            >
              Rebote contra pared (m₂≫m₁)
            </button>
          </div>
        </aside>
      </div>

      {/* 3.8 Inclined Plane & 3.9 Centripetal Force + Moon Test */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            3.8 Plano Inclinado y Tracción con Fricción
          </h2>
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="font-medium text-slate-700">Ángulo del plano inclinado θ</span>
                <span className="font-mono font-bold text-sky-700 tabular-nums">{inclineDeg}° → a = {inclineAccel.toFixed(2)} m/s²</span>
              </div>
              <input type="range" min={5} max={60} step={1} value={inclineDeg} onChange={(e) => setInclineDeg(parseInt(e.target.value, 10))} className="sci-slider w-full" />
            </div>
            <EquationBox tex="a_x = g\sin\theta, \qquad F_N = mg\cos\theta" />
            <div className="space-y-1 border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span className="font-medium text-slate-700">Bloque 10 kg tirado a {pullAngleDeg}° con F = {pullForceN} N</span>
                <span className="font-mono font-bold text-emerald-700 tabular-nums">F_N = {fNormalBlock.toFixed(1)} N</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="range" min={10} max={90} step={5} value={pullForceN} onChange={(e) => setPullForceN(parseInt(e.target.value, 10))} className="sci-slider w-full" />
                <input type="range" min={0} max={60} step={5} value={pullAngleDeg} onChange={(e) => setPullAngleDeg(parseInt(e.target.value, 10))} className="sci-slider w-full" />
              </div>
              <MathTex block tex="F_N = mg - F\sin\theta, \qquad f_k = \mu_k F_N" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            3.9 Aceleración Centrípeta y la Prueba de la Luna
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-center">
            <FigureAsset
              src="/figures/rueda.png"
              alt="Movimiento circular uniforme y aceleración centrípeta"
              caption="Triángulos semejantes: Δv/v = Δr/r ⇒ a_c = v²/r."
              imgClassName="w-full h-36 object-contain"
            />
            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <EquationBox tex="a_c = \frac{v^2}{r}, \qquad F_c = m\frac{v^2}{r}" />
              <p>
                <strong>Prueba de la Luna (Newton):</strong> La Luna orbita a <MathTex tex="r_L \approx 60 R_\oplus" /> con <MathTex tex="T = 27.3\text{ d}" />, dando <MathTex tex="a_L \approx 0.00272\text{ m/s}^2" />. La razón con la gravedad terrestre es:
              </p>
              <MathTex block tex="\frac{g_0}{a_L} = \frac{9.81}{0.00272} \approx 3606 \approx 60^2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
