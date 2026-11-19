import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { MathTex } from '../../components/MathTex';
import { EquationBox, HistoricalCapsule } from '../../components/LatexBlocks';

const C_GAMMA = 8.85e-5; // m * GeV^-3

// Convert wavelength in nm to visible CSS color (or UV/IR label)
function wavelengthToColor(nm: number): { color: string; region: string } {
  if (nm < 380) return { color: '#64748b', region: 'Ultravioleta (Serie de Lyman)' };
  if (nm >= 380 && nm < 440) return { color: '#7c3aed', region: 'Visible · Violeta (Balmer)' };
  if (nm >= 440 && nm < 495) return { color: '#0284c7', region: 'Visible · Verde-Azulado (Balmer)' };
  if (nm >= 495 && nm < 590) return { color: '#16a34a', region: 'Visible · Verde' };
  if (nm >= 590 && nm < 640) return { color: '#ea580c', region: 'Visible · Naranja' };
  if (nm >= 640 && nm <= 750) return { color: '#dc2626', region: 'Visible · Rojo Hα (Balmer)' };
  return { color: '#94a3b8', region: 'Infrarrojo (Serie de Paschen/Brackett)' };
}

export const EmQuantumSection: React.FC = () => {
  // Classical Collapse animation state
  const [collapseProgress, setCollapseProgress] = useState<number>(0); // 0 -> 1

  // Bohr Atom transition state
  const [nInitial, setNInitial] = useState<number>(3);
  const [nFinal, setNFinal] = useState<number>(2);
  const [bohrAngle, setBohrAngle] = useState<number>(0);

  // Synchrotron Radiation Accelerator Calculator
  const [circumferenceKm, setCircumferenceKm] = useState<number>(27); // LEP = 27 km
  const [beamEnergyGeV, setBeamEnergyGeV] = useState<number>(100); // LEP = 100 GeV

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      setCollapseProgress((p) => (p >= 1 ? 0 : p + dt * 0.28));
      setBohrAngle((a) => (a + dt * (2.6 / Math.pow(nFinal, 0.8))) % (Math.PI * 2));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [nFinal]);

  // Classical spiral path (r decreases with time -> omega increases)
  const classicalSpiral = useMemo(() => {
    const pts: string[] = [];
    const steps = 140;
    for (let i = 0; i <= steps; i++) {
      const u = (i / steps) * collapseProgress;
      const r = 68 * Math.pow(Math.max(0.05, 1 - u), 0.7);
      const ang = u * 18;
      const x = 110 + r * Math.cos(ang);
      const y = 95 + r * Math.sin(ang);
      pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    const rNow = 68 * Math.pow(Math.max(0.05, 1 - collapseProgress), 0.7);
    const angNow = collapseProgress * 18;
    return {
      path: pts.join(' '),
      ex: 110 + rNow * Math.cos(angNow),
      ey: 95 + rNow * Math.sin(angNow),
    };
  }, [collapseProgress]);

  // Bohr energy levels & photon transition
  const eInitial = -13.6 / (nInitial * nInitial);
  const eFinal = -13.6 / (nFinal * nFinal);
  const deltaE = Math.abs(eInitial - eFinal); // eV
  const isEmission = nInitial > nFinal;
  const isSameLevel = nInitial === nFinal;
  // lambda (nm) = h*c / deltaE ≈ 1239.84 / deltaE(eV)
  const wavelengthNm = isSameLevel ? 0 : 1239.842 / deltaE;
  const specInfo = wavelengthToColor(wavelengthNm);

  // Synchrotron calculations (from main.tex lines 9778-9897)
  const radiusM = (circumferenceKm * 1000) / (2 * Math.PI);
  const energyLossPerTurnGeV = useMemo(
    () => (C_GAMMA * Math.pow(beamEnergyGeV, 4)) / radiusM,
    [beamEnergyGeV, radiusM]
  );
  const protonSuppression = Math.pow(0.000511 / 0.93827, 4); // ~ 8.8e-14

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-slate-500">
          Capítulo 4 · Secciones 4.9 – 4.12
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Colapso del Átomo Clásico, Sincrotrón y Modelo de Bohr
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
          Al aplicar la fórmula de Larmor a un electrón orbitando clásicamente un protón, el átomo colapsa en apenas <MathTex tex="4.7 \times 10^{-11}\text{ s}" /> emitiendo un espectro continuo. Esta paradoja motivó la cuantización de Bohr y el nacimiento de la Mecánica Cuántica.
        </p>
      </div>

      {/* 4.9 Classical Atomic Collapse vs Bohr Stability */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                4.9 El Colapso del Átomo Clásico (Fórmula de Larmor)
              </h2>
              <p className="text-xs text-slate-500">
                Comparación entre la espiral radiativa clásica y los orbitales estacionarios cuantizados.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCollapseProgress(0)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reiniciar colapso
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Classical Collapse */}
            <div className="rounded-lg border border-red-200 bg-red-50/30 p-3 text-center">
              <div className="text-xs font-semibold text-red-800 mb-1">
                Física Clásica (Maxwell + Newton)
              </div>
              <svg viewBox="0 0 220 190" className="w-full h-44" role="img" aria-label="Electrón cayendo en espiral hacia el núcleo">
                <circle cx="110" cy="95" r="7" fill="#dc2626" />
                <text x="110" y="98" textAnchor="middle" className="fill-white text-[9px] font-bold">+</text>
                <path d={classicalSpiral.path} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2" />
                <circle cx={classicalSpiral.ex} cy={classicalSpiral.ey} r="5" fill="#0284c7" />
              </svg>
              <div className="text-[11px] font-mono text-red-700 tabular-nums">
                Δt ≈ 4.7 × 10⁻¹¹ s · Espectro continuo
              </div>
            </div>

            {/* Bohr Quantized Atom */}
            <div className="rounded-lg border border-sky-200 bg-sky-50/30 p-3 text-center">
              <div className="text-xs font-semibold text-sky-900 mb-1">
                Modelo de Bohr (Órbitas Estacionarias)
              </div>
              <svg viewBox="0 0 220 190" className="w-full h-44" role="img" aria-label="Órbitas cuantizadas estables en el modelo de Bohr">
                <circle cx="110" cy="95" r="7" fill="#dc2626" />
                <text x="110" y="98" textAnchor="middle" className="fill-white text-[9px] font-bold">+</text>
                {[1, 2, 3, 4].map((n) => {
                  const rad = 16 + n * 14;
                  const isActive = n === nFinal;
                  return (
                    <circle
                      key={n}
                      cx="110"
                      cy="95"
                      r={rad}
                      fill="none"
                      stroke={isActive ? '#0284c7' : '#cbd5e1'}
                      strokeWidth={isActive ? '2' : '1'}
                      strokeDasharray={isActive ? 'none' : '3 3'}
                    />
                  );
                })}
                {(() => {
                  const rad = 16 + Math.min(4, nFinal) * 14;
                  const ex = 110 + rad * Math.cos(bohrAngle);
                  const ey = 95 + rad * Math.sin(bohrAngle);
                  return <circle cx={ex} cy={ey} r="5.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />;
                })()}
              </svg>
              <div className="text-[11px] font-mono text-sky-800 tabular-nums">
                Órbita n={nFinal} estable · L = nℏ
              </div>
            </div>
          </div>

          <EquationBox
            number="4.9"
            label="Fórmula de Larmor y Tiempo de Vida Clásico del Hidrógeno"
            tex="P = \frac{2}{3}\frac{k e^2 a^2}{c^3}, \qquad \Delta t \approx \frac{|E|}{P} = \frac{3 c^3 m^2 r^3}{4 k^2 e^4} \approx 4.7 \times 10^{-11}\text{ s}"
          />
        </div>

        {/* 4.10 Synchrotron Radiation */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">
            4.10 Radiación de Sincrotrón en Aceleradores
          </h3>
          <p className="text-xs leading-relaxed text-slate-600">
            Para electrones ultrarrelativistas (<MathTex tex="v \approx c" />), la fórmula de Larmor se multiplica por <MathTex tex="\gamma^4" />: la pérdida por vuelta crece con <MathTex tex="E^4 / R" /> y es inversamente proporcional a <MathTex tex="m^4" />.
          </p>

          <EquationBox
            tex="E_{\text{perdida}} = C_\gamma \frac{E^4}{R}, \qquad C_\gamma \approx 8.85 \times 10^{-5}\text{ m}\cdot\text{GeV}^{-3}"
          />

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Circunferencia del túnel</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">{circumferenceKm} km</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={1}
                value={circumferenceKm}
                onChange={(e) => setCircumferenceKm(parseInt(e.target.value, 10))}
                className="sci-slider w-full"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Energía del electrón E</span>
                <span className="font-mono font-semibold text-sky-700 tabular-nums">{beamEnergyGeV} GeV</span>
              </div>
              <input
                type="range"
                min={20}
                max={200}
                step={5}
                value={beamEnergyGeV}
                onChange={(e) => setBeamEnergyGeV(parseInt(e.target.value, 10))}
                className="sci-slider w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-[11px] text-slate-500">Pérdida por vuelta (e⁻)</div>
              <div className="font-mono text-sm font-bold text-red-600 tabular-nums">
                {energyLossPerTurnGeV.toFixed(2)} GeV
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-[11px] text-slate-500">Protones (m_e/m_p)⁴</div>
              <div className="font-mono text-sm font-bold text-emerald-700 tabular-nums">
                {protonSuppression.toExponential(1)}×
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setCircumferenceKm(27); setBeamEnergyGeV(100); }}
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              LEP (27 km · 100 GeV)
            </button>
            <button
              type="button"
              onClick={() => { setCircumferenceKm(91); setBeamEnergyGeV(185); }}
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              FCC-ee (91 km · 185 GeV)
            </button>
          </div>
        </div>
      </div>

      {/* Historical Capsule (tcolorbox faithful) */}
      <HistoricalCapsule title="Cápsula Histórica: Un Siglo de Magia sin Física (1814 – 1913)">
        <p>
          <strong>1. El Pragmatismo y la Huella Dactilar (1814 – 1860s):</strong> Joseph von Fraunhofer descubrió líneas oscuras de absorción en el espectro solar. En 1859, Kirchhoff y Bunsen demostraron que cada elemento químico posee una firma espectral única, lo que permitió descubrir el <strong>Helio</strong> en el Sol en 1868 antes de hallarlo en la Tierra.
        </p>
        <p>
          <strong>2. La Numerología de Balmer (1885):</strong> Johann Balmer halló por ensayo y error la fórmula empírica <MathTex tex="E_n = -13.6\text{ eV}/n^2" />, aunque nadie comprendía su origen físico.
        </p>
        <p>
          <strong>3. La Crisis de Rutherford (1911) y el Triunfo Cuántico (1913):</strong> Al descubrir el núcleo atómico, la física clásica predecía un colapso en <MathTex tex="10^{-11}\text{ s}" />. Niels Bohr resolvió la crisis imponiendo la cuantización del momento angular <MathTex tex="mvr = n\hbar" />.
        </p>
      </HistoricalCapsule>

      {/* 4.11-4.12 Bohr Derivation + Interactive Hydrogen Spectrum Explorer */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            4.11 Derivación Algebraica del Modelo de Bohr y Espectro del Hidrógeno
          </h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <EquationBox
              number="4.10"
              label="Equilibrio de Fuerzas y Cuantización"
              tex="\frac{mv^2}{r} = \frac{ke^2}{r^2}, \qquad mvr = n\hbar"
            />
            <EquationBox
              boxed
              number="4.11"
              label="Radio de Bohr y Niveles de Energía"
              tex="r_n = \frac{n^2 \hbar^2}{mke^2} = n^2 a_0, \qquad E_n = -\frac{13.6\text{ eV}}{n^2}"
            />
          </div>

          {/* Interactive Balmer / Hydrogen Spectrum */}
          <div className="rounded-lg border border-slate-200 bg-slate-900 p-4 text-white space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-slate-100">
                Espectro de Emisión del Hidrógeno (Serie de Balmer visible)
              </span>
              <span className="font-mono text-slate-300 tabular-nums">
                410 nm · 434 nm · 486 nm · 656 nm
              </span>
            </div>

            {/* Spectrum bar 380nm - 720nm */}
            <div className="relative h-12 rounded border border-slate-700 bg-slate-950 overflow-hidden">
              {[
                { nm: 410, color: '#7c3aed', n: 6 },
                { nm: 434, color: '#6d28d9', n: 5 },
                { nm: 486, color: '#0ea5e9', n: 4 },
                { nm: 656, color: '#ef4444', n: 3 },
              ].map((line) => {
                const leftPct = ((line.nm - 380) / (720 - 380)) * 100;
                const active =
                  !isSameLevel && Math.abs(wavelengthNm - line.nm) < 6;
                return (
                  <button
                    key={line.nm}
                    type="button"
                    onClick={() => {
                      setNInitial(line.n);
                      setNFinal(2);
                    }}
                    title={`Línea ${line.nm} nm (n=${line.n} → n=2)`}
                    className="absolute top-0 bottom-0 w-2 -translate-x-1/2 cursor-pointer transition-transform hover:scale-x-150"
                    style={{
                      left: `${leftPct}%`,
                      backgroundColor: line.color,
                      boxShadow: active ? `0 0 12px 3px ${line.color}` : 'none',
                      opacity: active ? 1 : 0.65,
                    }}
                  />
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
              <span>
                Transición actual:{' '}
                <strong className="text-white">
                  n = {nInitial} → n = {nFinal}
                </strong>
              </span>
              <span className="font-mono tabular-nums text-white">
                {isSameLevel
                  ? 'Sin salto energético (ΔE = 0)'
                  : `${isEmission ? 'Emisión' : 'Absorción'}: ΔE = ${deltaE.toFixed(2)} eV · λ = ${wavelengthNm.toFixed(1)} nm`}
              </span>
            </div>
          </div>

          {/* Pauli Exclusion Principle */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
            <h4 className="text-sm font-semibold text-slate-900">
              Principio de Exclusión de Pauli y la Regla del Octeto (Neón, n = 2)
            </h4>
            <p className="text-xs leading-relaxed text-slate-600">
              Ningún par de electrones comparte los cuatro números cuánticos (<MathTex tex="n, l, m_l, m_s" />). En la capa <MathTex tex="n=2" />, el orbital esférico <MathTex tex="s" /> admite 2 espines y los tres orbitales lobulares (<MathTex tex="p_x, p_y, p_z" />) admiten 6: <MathTex tex="2 + 6 = 8" /> electrones, explicando la estabilidad química de los gases nobles.
            </p>
          </div>
        </div>

        <aside className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-5">
          <h3 className="text-base font-semibold text-slate-900">
            Selector de Transiciones Cuánticas
          </h3>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Nivel inicial (n_i)</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">
                n = {nInitial} ({eInitial.toFixed(2)} eV)
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={nInitial}
              onChange={(e) => setNInitial(parseInt(e.target.value, 10))}
              className="sci-slider w-full"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Nivel final (n_f)</span>
              <span className="font-mono font-semibold text-sky-700 tabular-nums">
                n = {nFinal} ({eFinal.toFixed(2)} eV)
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={nFinal}
              onChange={(e) => setNFinal(parseInt(e.target.value, 10))}
              className="sci-slider w-full"
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Diferencia de energía |ΔE|:</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {deltaE.toFixed(3)} eV
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Longitud de onda λ:</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {isSameLevel ? '—' : `${wavelengthNm.toFixed(1)} nm`}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200">
              <span className="text-slate-600">Región espectral:</span>
              <span className="font-semibold" style={{ color: specInfo.color }}>
                {isSameLevel ? 'Estado estacionario' : specInfo.region}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => { setNInitial(3); setNFinal(2); }}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Probar Ejercicio 10: Línea Roja Hα (n=3 → n=2)
          </button>
        </aside>
      </div>
    </div>
  );
};
