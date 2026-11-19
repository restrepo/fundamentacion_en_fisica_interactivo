import React, { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { MathTex } from '../../components/MathTex';
import { FigureAsset } from '../../components/FigureAsset';
import { EquationBox } from '../../components/LatexBlocks';

export const DynGravityKeplerSection: React.FC = () => {
  // Newton's Cannon RK4 simulation
  const [launchRatio, setLaunchRatio] = useState<number>(1.0);
  const [playing, setPlaying] = useState<boolean>(true);
  const [simStep, setSimStep] = useState<number>(0);

  // Kepler 3rd law & binary orbital period calculator
  const [orbitRadiusAU, setOrbitRadiusAU] = useState<number>(1.0);
  const periodYears = Math.pow(orbitRadiusAU, 1.5);

  const trajectory = useMemo(() => {
    const GM = 1.0;
    const rEarth = 0.88;
    let x = 0;
    let y = 1.0;
    let vx = launchRatio;
    let vy = 0;
    const dt = 0.018;
    const pts: Array<{ x: number; y: number; r: number }> = [{ x, y, r: 1.0 }];
    let crashed = false;

    const deriv = (px: number, py: number) => {
      const r2 = px * px + py * py;
      const r3 = r2 * Math.sqrt(r2);
      return { ax: (-GM * px) / r3, ay: (-GM * py) / r3 };
    };

    for (let i = 0; i < 650; i++) {
      const k1v = deriv(x, y);
      const k1x = { vx, vy };
      const x2 = x + 0.5 * dt * k1x.vx;
      const y2 = y + 0.5 * dt * k1x.vy;
      const vx2 = vx + 0.5 * dt * k1v.ax;
      const vy2 = vy + 0.5 * dt * k1v.ay;
      const k2v = deriv(x2, y2);
      const x3 = x + 0.5 * dt * vx2;
      const y3 = y + 0.5 * dt * vy2;
      const vx3 = vx + 0.5 * dt * k2v.ax;
      const vy3 = vy + 0.5 * dt * k2v.ay;
      const k3v = deriv(x3, y3);
      const x4 = x + dt * vx3;
      const y4 = y + dt * vy3;
      const vx4 = vx + dt * k3v.ax;
      const vy4 = vy + dt * k3v.ay;
      const k4v = deriv(x4, y4);

      x += (dt / 6) * (k1x.vx + 2 * vx2 + 2 * vx3 + vx4);
      y += (dt / 6) * (k1x.vy + 2 * vy2 + 2 * vy3 + vy4);
      vx += (dt / 6) * (k1v.ax + 2 * k2v.ax + 2 * k3v.ax + k4v.ax);
      vy += (dt / 6) * (k1v.ay + 2 * k2v.ay + 2 * k3v.ay + k4v.ay);

      const r = Math.hypot(x, y);
      pts.push({ x, y, r });
      if (r <= rEarth) {
        crashed = true;
        break;
      }
      if (r > 3.6) break;
    }

    let regime = 'Órbita elíptica cerrada';
    if (crashed) regime = 'Impacto balístico contra la Tierra';
    else if (Math.abs(launchRatio - 1.0) < 0.04) regime = 'Órbita circular estable (v = v_orb)';
    else if (launchRatio >= Math.SQRT2 - 0.02) regime = 'Trayectoria de escape hiperbólica/parabólica';
    return { pts, crashed, regime };
  }, [launchRatio]);

  useEffect(() => {
    setSimStep(0);
  }, [launchRatio]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setSimStep((prev) => {
        if (prev >= trajectory.pts.length - 1) return trajectory.crashed ? trajectory.pts.length - 1 : 0;
        return prev + 2;
      });
    }, 16);
    return () => window.clearInterval(timer);
  }, [playing, trajectory]);

  const currentPt = trajectory.pts[Math.min(simStep, trajectory.pts.length - 1)];
  const svgCenter = 160;
  const pxScale = 75;
  const polyPath = trajectory.pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${(svgCenter + p.x * pxScale).toFixed(1)} ${(svgCenter - p.y * pxScale).toFixed(1)}`)
    .join(' ');

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-slate-500">
          Capítulo 3 · Secciones 3.10 – 3.13
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Gravitación Universal, Energía Potencial, Cañón de Newton y Leyes de Kepler
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
          Desde las líneas de campo gravitacional y el perfil log-log del campo dentro y fuera de la Tierra, hasta el cálculo de la energía potencial gravitacional <MathTex tex="U(r) = -GMm/r" />, la velocidad de escape, el cañón orbital de Newton y la deducción algebraica de las tres leyes de Kepler.
        </p>
      </div>

      {/* Newton's Cannon RK4 Simulator */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                3.11 Simulador del Cañón de Newton (Integración RK4)
              </h2>
              <p className="text-xs text-slate-600">
                Regimen actual: <strong className="text-sky-700">{trajectory.regime}</strong>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {playing ? 'Pausar' : 'Reproducir'}
              </button>
              <button
                type="button"
                onClick={() => setSimStep(0)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reiniciar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-center">
            <svg viewBox="0 0 320 320" className="w-full h-auto rounded-lg border border-slate-200 bg-slate-950" role="img" aria-label="Simulación orbital del cañón de Newton">
              <circle cx={svgCenter} cy={svgCenter} r={0.88 * pxScale} fill="#1e3a8a" stroke="#38bdf8" strokeWidth="1.5" />
              <path d={polyPath} fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
              {/* Mountain cannon at top */}
              <circle cx={svgCenter} cy={svgCenter - pxScale} r="3.5" fill="#fbbf24" />
              {/* Projectile */}
              <circle cx={svgCenter + currentPt.x * pxScale} cy={svgCenter - currentPt.y * pxScale} r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.2" />
            </svg>
            <FigureAsset
              src="/figures/Newton_Cannon.svg"
              alt="Diagrama clásico de los Principia: Cañón de Newton"
              caption="Grabado original del Cañón de Newton (main.tex)."
              imgClassName="w-full h-56 object-contain"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Razón de rapidez v / v_orbital (v_orb ≈ 7.91 km/s)</span>
              <span className="font-mono font-bold text-sky-700 tabular-nums">
                {launchRatio.toFixed(2)} v_orb ({(launchRatio * 7.91).toFixed(2)} km/s)
              </span>
            </div>
            <input
              type="range"
              min={0.4}
              max={1.5}
              step={0.02}
              value={launchRatio}
              onChange={(e) => setLaunchRatio(parseFloat(e.target.value))}
              className="sci-slider w-full"
            />
            <div className="flex flex-wrap gap-2">
              {[
                { val: 0.7, label: 'Balístico (0.7)' },
                { val: 1.0, label: 'Circular (1.0)' },
                { val: 1.18, label: 'Elíptico (1.18)' },
                { val: 1.42, label: 'Escape (√2 ≈ 1.414)' },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setLaunchRatio(p.val)}
                  className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Earth Interior/Exterior Log-Log g(r) & Escape Velocity */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            3.10 Campo Gravitacional Terrestre (Log-Log) y Potencial U(r)
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Dentro de una esfera uniforme de densidad constante (<MathTex tex="r < R_\oplus" />), la masa encerrada crece como <MathTex tex="r^3" />, por lo que <MathTex tex="g(r) \propto r" /> (pendiente +1 en gráfica log-log). En el exterior (<MathTex tex="r > R_\oplus" />), <MathTex tex="g(r) = GM_\oplus/r^2" /> (pendiente −2).
          </p>

          <svg viewBox="0 0 320 170" className="w-full h-auto rounded-lg border border-slate-200 bg-slate-50/70 p-2" role="img" aria-label="Gráfica log-log del campo gravitacional interior y exterior de la Tierra">
            <line x1="40" y1="145" x2="295" y2="145" stroke="#64748b" strokeWidth="1.5" />
            <line x1="40" y1="15" x2="40" y2="145" stroke="#64748b" strokeWidth="1.5" />
            {/* R_earth vertical marker at x=145 */}
            <line x1="145" y1="20" x2="145" y2="145" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="4 3" />
            <text x="145" y="159" textAnchor="middle" className="fill-red-700 text-[10px] font-mono font-semibold">log(R_⊕)</text>
            {/* Slope +1 inside */}
            <line x1="55" y1="125" x2="145" y2="35" stroke="#0284c7" strokeWidth="2.8" />
            <text x="85" y="72" className="fill-sky-700 text-[10px] font-mono font-bold">pendiente +1 (g ∝ r)</text>
            {/* Slope -2 outside */}
            <line x1="145" y1="35" x2="275" y2="130" stroke="#059669" strokeWidth="2.8" />
            <text x="210" y="65" className="fill-emerald-700 text-[10px] font-mono font-bold">pendiente −2 (g ∝ r⁻²)</text>
          </svg>

          <EquationBox
            boxed
            number="3.5"
            label="Potencial por media geométrica (r₁r₂) y Velocidad de Escape"
            tex="U(r) = -\frac{GMm}{r}, \qquad v_{\text{esc}} = \sqrt{\frac{2GM_\oplus}{R_\oplus}} \approx 11.2\text{ km/s}"
          />
        </div>
      </div>

      {/* 3.12–3.13 Angular Momentum & Kepler's Laws */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          3.12–3.13 Momento Angular L = r × p y Leyes de Kepler
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
            <div className="font-semibold text-slate-900">1ª y 2ª Leyes de Kepler</div>
            <p className="text-slate-600">
              Como la fuerza gravitacional es central (<MathTex tex="\boldsymbol{\tau} = \boldsymbol{r}\times\boldsymbol{F} = 0" />), se conserva el momento angular <MathTex tex="\boldsymbol{L} = mrv_\perp" />, implicando áreas iguales en tiempos iguales (<MathTex tex="dA/dt = L/2m" />).
            </p>
            <MathTex block tex="r_p v_p = r_a v_a" />
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
            <div className="font-semibold text-slate-900">3ª Ley Armónica de Kepler</div>
            <p className="text-slate-600">
              Igualando fuerza centrípeta y gravitacional (<MathTex tex="mv^2/r = GMm/r^2" /> con <MathTex tex="v = 2\pi r/T" />):
            </p>
            <MathTex block tex="T^2 = \frac{4\pi^2}{GM}a^3" />
          </div>

          <div className="rounded-lg border border-sky-200 bg-sky-50/60 p-4 space-y-2 text-xs">
            <div className="font-semibold text-sky-900">Calculadora T² = a³ (Sistema Solar)</div>
            <div className="flex justify-between">
              <span>Semieje mayor a (UA):</span>
              <span className="font-mono font-bold tabular-nums">{orbitRadiusAU.toFixed(2)} UA</span>
            </div>
            <input type="range" min={0.39} max={10} step={0.05} value={orbitRadiusAU} onChange={(e) => setOrbitRadiusAU(parseFloat(e.target.value))} className="sci-slider w-full" />
            <div className="font-mono font-bold text-sky-900 pt-1 tabular-nums">
              Período orbital T = {periodYears.toFixed(2)} años terrestres
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
