import React, { useMemo, useState } from 'react';
import { MathTex } from '../../components/MathTex';
import { EquationBox, ExampleBox, ReasoningTable } from '../../components/LatexBlocks';

export const DynWorkEnergySection: React.FC = () => {
  // Interactive projectile simulator
  const [v0, setV0] = useState<number>(20); // m/s
  const [angleDeg, setAngleDeg] = useState<number>(45);
  const [gAcc, setGAcc] = useState<number>(9.81);
  const [timeFrac, setTimeFrac] = useState<number>(0.5); // 0..1 of flight time

  const proj = useMemo(() => {
    const rad = (angleDeg * Math.PI) / 180;
    const vx = v0 * Math.cos(rad);
    const vy0 = v0 * Math.sin(rad);
    const tFlight = (2 * vy0) / gAcc;
    const maxHeight = (vy0 * vy0) / (2 * gAcc);
    const range = vx * tFlight;

    const t = timeFrac * tFlight;
    const x = vx * t;
    const y = vy0 * t - 0.5 * gAcc * t * t;
    const vy = vy0 - gAcc * t;
    const speed = Math.hypot(vx, vy);
    const kRatio = (speed * speed) / (v0 * v0);
    const uRatio = 1 - kRatio;

    // SVG trajectory
    const pts: string[] = [];
    const maxW = Math.max(range, 50);
    const maxH = Math.max(maxHeight, 25);
    for (let i = 0; i <= 50; i++) {
      const ti = (i / 50) * tFlight;
      const xi = vx * ti;
      const yi = vy0 * ti - 0.5 * gAcc * ti * ti;
      const px = 40 + (xi / maxW) * 380;
      const py = 175 - (yi / maxH) * 130;
      pts.push(`${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`);
    }
    const ballPx = 40 + (x / maxW) * 380;
    const ballPy = 175 - (Math.max(0, y) / maxH) * 130;

    return {
      vx,
      vy0,
      vy,
      tFlight,
      maxHeight,
      range,
      t,
      x,
      y,
      kRatio,
      uRatio,
      path: pts.join(' '),
      ballPx,
      ballPy,
    };
  }, [v0, angleDeg, gAcc, timeFrac]);

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-slate-500">
          Capítulo 3 · Secciones 3.4 – 3.5
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Teorema Trabajo-Energía y Conservación de la Energía Mecánica
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
          Combinando el área del trapecio en una gráfica <MathTex tex="v\text{-}t" /> de aceleración constante con la definición de trabajo mecánico, deducimos sin cálculo diferencial la energía cinética <MathTex tex="K = \frac{1}{2}mv^2" /> y la conservación de la energía total <MathTex tex="E = K + U" />.
        </p>
      </div>

      {/* Geometric Trapezoid & Work-Energy Table */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            3.4 Área bajo la curva v–t (Trapecio)
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Para aceleración constante, el desplazamiento <MathTex tex="\Delta x" /> equivale al área del trapecio formado por las alturas <MathTex tex="v_i" /> y <MathTex tex="v_f" /> durante el intervalo <MathTex tex="\Delta t" />.
          </p>

          <svg viewBox="0 0 320 200" className="w-full h-auto rounded-lg border border-slate-200 bg-slate-50/70 p-2" role="img" aria-label="Trapecio velocidad vs tiempo">
            <line x1="40" y1="170" x2="295" y2="170" stroke="#64748b" strokeWidth="1.5" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#64748b" strokeWidth="1.5" />
            <polygon points="40,170 40,120 250,45 250,170" fill="#bae6fd" fillOpacity="0.65" stroke="#0284c7" strokeWidth="2" />
            <line x1="40" y1="120" x2="250" y2="120" stroke="#64748b" strokeDasharray="4 3" />
            <text x="145" y="148" textAnchor="middle" className="fill-slate-700 text-xs font-mono">v_i · Δt</text>
            <text x="175" y="100" textAnchor="middle" className="fill-sky-900 text-xs font-mono font-semibold">½ a (Δt)²</text>
            <text x="26" y="124" textAnchor="end" className="fill-slate-700 text-xs font-mono">v_i</text>
            <text x="26" y="49" textAnchor="end" className="fill-slate-700 text-xs font-mono">v_f</text>
            <text x="250" y="185" textAnchor="middle" className="fill-slate-700 text-xs font-mono">Δt</text>
          </svg>

          <EquationBox
            boxed
            number="3.2"
            tex="\Delta x = \frac{v_i + v_f}{2}\Delta t \implies v_f^2 = v_i^2 + 2a\Delta x"
          />
        </div>

        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Deducción del Teorema Trabajo-Energía (W = ΔK)
          </h2>
          <ReasoningTable
            caption="Demostración algebraica desde cinemática uniforme hasta la Segunda Ley de Newton (main.tex)."
            rows={[
              {
                reasoning: 'Usamos la ecuación cinemática independiente del tiempo.',
                developmentTex: 'v_f^2 - v_i^2 = 2 a \\Delta x \\implies a\\Delta x = \\frac{1}{2}(v_f^2 - v_i^2)',
              },
              {
                reasoning: 'Multiplicamos ambos lados por la masa m y aplicamos F = ma.',
                developmentTex: 'm a \\Delta x = F\\Delta x = \\frac{1}{2}m v_f^2 - \\frac{1}{2}m v_i^2',
              },
              {
                reasoning: 'Identificamos el trabajo mecánico W y la energía cinética K = ½mv².',
                developmentTex: 'W = \\boldsymbol{F}\\cdot\\Delta\\boldsymbol{r} = K_f - K_i = \\Delta K',
              },
            ]}
          />

          <ExampleBox title="Rampa de bolas de bolos (main.tex)">
            Una bola de <MathTex tex="5.0\text{ kg}" /> desciende por una rampa de <MathTex tex="1.0\text{ m}" /> de altura ganando <MathTex tex="K = mgh = 49\text{ J}" />. Si la superficie horizontal final tiene <MathTex tex="2.0\text{ m}" /> de longitud para detenerla, la fuerza promedio de frenado requerida es{' '}
            <MathTex tex="F = \Delta K / d = 49\text{ J} / 2.0\text{ m} = 24.5\text{ N} \approx 25\text{ N}" />.
          </ExampleBox>
        </div>
      </div>

      {/* 3.5 Interactive Projectile & Energy Conservation Simulator */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            3.5 Tiro Parabólico y Transformación Continua K(t) ↔ U(t)
          </h2>
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
            <svg viewBox="0 0 460 195" className="w-full h-auto" role="img" aria-label="Trayectoria parabólica y balance energético">
              <line x1="30" y1="175" x2="435" y2="175" stroke="#64748b" strokeWidth="1.5" />
              <line x1="40" y1="20" x2="40" y2="175" stroke="#64748b" strokeWidth="1.5" />
              <path d={proj.path} fill="none" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="5 3" />
              <circle cx={proj.ballPx} cy={proj.ballPy} r="6.5" fill="#dc2626" />
              {/* Velocity components */}
              <line x1={proj.ballPx} y1={proj.ballPy} x2={proj.ballPx + proj.vx * 1.4} y2={proj.ballPy} stroke="#059669" strokeWidth="2" />
              <line x1={proj.ballPx} y1={proj.ballPy} x2={proj.ballPx} y2={proj.ballPy - proj.vy * 1.4} stroke="#d97706" strokeWidth="2" />
              <text x="230" y="191" textAnchor="middle" className="fill-slate-600 text-[10px] font-mono">
                Alcance R = {proj.range.toFixed(1)} m · Altura H = {proj.maxHeight.toFixed(1)} m · t = {proj.t.toFixed(2)} s
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-sky-200 bg-sky-50/60 p-3 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-sky-900">
                <span>Fracción Cinética K / E_total</span>
                <span className="font-mono tabular-nums">{(proj.kRatio * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2.5 w-full rounded bg-sky-200 overflow-hidden">
                <div className="h-full bg-sky-600" style={{ width: `${proj.kRatio * 100}%` }} />
              </div>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-emerald-900">
                <span>Fracción Potencial U / E_total</span>
                <span className="font-mono tabular-nums">{(proj.uRatio * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2.5 w-full rounded bg-emerald-200 overflow-hidden">
                <div className="h-full bg-emerald-600" style={{ width: `${Math.max(0, proj.uRatio * 100)}%` }} />
              </div>
            </div>
          </div>

          <EquationBox
            boxed
            number="3.3"
            tex="H = \frac{v_0^2\sin^2\theta}{2g}, \qquad R = \frac{v_0^2\sin(2\theta)}{g}, \qquad K + mgy = \frac{1}{2}mv_0^2"
          />
        </div>

        <aside className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">Parámetros de Lanzamiento</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Rapidez inicial v₀</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">{v0} m/s</span>
              </div>
              <input type="range" min={10} max={35} step={1} value={v0} onChange={(e) => setV0(parseInt(e.target.value, 10))} className="sci-slider w-full" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Ángulo θ</span>
                <span className="font-mono font-bold text-sky-700 tabular-nums">{angleDeg}°</span>
              </div>
              <input type="range" min={15} max={80} step={5} value={angleDeg} onChange={(e) => setAngleDeg(parseInt(e.target.value, 10))} className="sci-slider w-full" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Gravedad g</span>
                <span className="font-mono text-slate-900 tabular-nums">{gAcc.toFixed(2)} m/s²</span>
              </div>
              <input type="range" min={1.62} max={15} step={0.1} value={gAcc} onChange={(e) => setGAcc(parseFloat(e.target.value))} className="sci-slider w-full" />
            </div>
            <div className="space-y-1 border-t border-slate-200 pt-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Instante del vuelo t / t_vuelo</span>
                <span className="font-mono font-bold text-red-600 tabular-nums">{(timeFrac * 100).toFixed(0)}%</span>
              </div>
              <input type="range" min={0} max={1} step={0.02} value={timeFrac} onChange={(e) => setTimeFrac(parseFloat(e.target.value))} className="sci-slider w-full" />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1.5 text-xs font-mono tabular-nums">
            <div className="flex justify-between"><span>x(t):</span><span>{proj.x.toFixed(2)} m</span></div>
            <div className="flex justify-between"><span>y(t):</span><span>{proj.y.toFixed(2)} m</span></div>
            <div className="flex justify-between"><span>v_x (constante):</span><span>{proj.vx.toFixed(2)} m/s</span></div>
            <div className="flex justify-between"><span>v_y(t):</span><span>{proj.vy.toFixed(2)} m/s</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
};
