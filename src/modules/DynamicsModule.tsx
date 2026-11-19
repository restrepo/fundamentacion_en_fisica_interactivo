import React, { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { MathTex } from '../components/MathTex';
import { FigureAsset } from '../components/FigureAsset';

export const DynamicsModule: React.FC = () => {
  // Newton's Cannon orbital speed normalized to circular orbital speed v_orb = 1.0 (≈ 7.9 km/s)
  const [launchRatio, setLaunchRatio] = useState<number>(1.0);
  const [playing, setPlaying] = useState<boolean>(true);
  const [simStep, setSimStep] = useState<number>(0);

  // Precompute orbital trajectory via RK4 in normalized units (GM = 1, R_earth = 0.88, R_launch = 1.0)
  const trajectory = useMemo(() => {
    const GM = 1.0;
    const rEarth = 0.88;
    let x = 0;
    let y = 1.0;
    let vx = launchRatio; // v_orb at r=1 is sqrt(GM/1) = 1.0
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

    return { pts, crashed };
  }, [launchRatio]);

  useEffect(() => {
    setSimStep(0);
  }, [launchRatio]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      setSimStep((prev) => (prev + 2 >= trajectory.pts.length ? 0 : prev + 2));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, trajectory.pts.length]);

  const currentPt = trajectory.pts[Math.min(simStep, trajectory.pts.length - 1)];
  const vKms = launchRatio * 7.91;
  const regimeLabel =
    launchRatio < 0.99
      ? 'Trayectoria suborbital (impacta la Tierra)'
      : launchRatio <= 1.02
      ? 'Órbita circular (v = v_orb)'
      : launchRatio < 1.414
      ? 'Órbita elíptica (1ª y 2ª Ley de Kepler)'
      : 'Trayectoria de escape (v ≥ √2 · v_orb)';

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-slate-500">
          Capítulo 3 · Dinámica Newtoniana y Gravitación Universal
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          El Cañón de Newton y Leyes de Kepler
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm text-slate-600">
          Simulación gravitacional de órbitas desde una montaña sobre la Tierra: ajusta la rapidez de lanzamiento y observa la transición entre caída parabólica, órbita circular, órbita elíptica y escape.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Simulación Orbital (<MathTex tex="F_g = G M m / r^2" />)
              </h2>
              <p className="text-xs text-slate-500">{regimeLabel}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {playing ? 'Pausar' : 'Reproducir'}
              </button>
              <button
                type="button"
                onClick={() => setSimStep(0)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Relanzar
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-950 p-3 flex justify-center">
            <svg viewBox="-2.2 -2.2 4.4 4.4" className="w-full max-w-md h-80" role="img" aria-label="Simulación orbital del cañón de Newton">
              {/* Earth */}
              <circle cx="0" cy="0" r="0.88" fill="#0369a1" stroke="#38bdf8" strokeWidth="0.025" />
              {/* Mountain peak at (0, -1.0 in SVG top) */}
              <polygon points="-0.06,-0.87 0.06,-0.87 0,-1.0" fill="#94a3b8" />

              {/* Orbit path */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="0.03"
                strokeDasharray="0.05 0.04"
                points={trajectory.pts.map((p) => `${p.x.toFixed(3)},${(-p.y).toFixed(3)}`).join(' ')}
              />

              {/* Projectile */}
              <circle
                cx={currentPt.x}
                cy={-currentPt.y}
                r="0.065"
                fill="#ffffff"
                stroke="#f59e0b"
                strokeWidth="0.03"
              />
            </svg>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Velocidad de Disparo</h3>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Razón v₀ / v_orb</span>
                <span className="font-mono font-semibold text-sky-700 tabular-nums">
                  {launchRatio.toFixed(2)}× ({vKms.toFixed(2)} km/s)
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={1.55}
                step={0.02}
                value={launchRatio}
                onChange={(e) => setLaunchRatio(parseFloat(e.target.value))}
                className="sci-slider w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLaunchRatio(0.8)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Suborbital (0.8×)
              </button>
              <button
                type="button"
                onClick={() => setLaunchRatio(1.0)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Circular (1.0×)
              </button>
              <button
                type="button"
                onClick={() => setLaunchRatio(1.22)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Elíptica (1.22×)
              </button>
              <button
                type="button"
                onClick={() => setLaunchRatio(1.45)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Escape (1.45×)
              </button>
            </div>

            <MathTex
              block
              tex="v_{\text{orb}} = \sqrt{\frac{GM}{r}} \approx 7.9\text{ km/s}, \quad v_{\text{esc}} = \sqrt{2}\,v_{\text{orb}}"
              className="text-xs"
            />
          </div>

          <FigureAsset
            src="/figures/Newton_Cannon.svg"
            alt="El Cañón de Newton original"
            caption="Ilustración original del Cañón de Newton incluida en el libro."
            imgClassName="w-full h-40 object-contain"
          />
        </aside>
      </div>
    </section>
  );
};
