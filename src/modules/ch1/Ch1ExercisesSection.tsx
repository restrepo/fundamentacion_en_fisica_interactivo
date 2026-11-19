import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import { MathTex } from '../../components/MathTex';

interface Ch1Exercise {
  id: number;
  category: string;
  title: string;
  statement: React.ReactNode;
  unit?: string;
  expectedValue?: number;
  tolerance?: number;
  conceptual?: boolean;
  hintTex: string;
  solutionTex: string;
  answerLabel: string;
}

const CHAPTER_1_EXERCISES: Ch1Exercise[] = [
  {
    id: 1,
    category: 'Unidades y Conversión',
    title: 'Conversión de Velocidad',
    statement: (
      <>
        El límite de velocidad en muchas carreteras de Colombia es de <MathTex tex="80\text{ km/h}" />. Exprese esta velocidad en <strong>metros por segundo (m/s)</strong>.
      </>
    ),
    unit: 'm/s',
    expectedValue: 22.22,
    tolerance: 0.25,
    hintTex: '80\\frac{\\text{km}}{\\text{h}} \\cdot \\frac{1000\\text{ m}}{1\\text{ km}} \\cdot \\frac{1\\text{ h}}{3600\\text{ s}}',
    solutionTex: 'v = \\frac{80 \\times 1000}{3600}\\text{ m/s} = \\frac{80}{3.6}\\text{ m/s} \\approx 22.22\\text{ m/s}',
    answerLabel: '22.22 m/s',
  },
  {
    id: 2,
    category: 'Unidades y Conversión',
    title: 'Conversión de Área y Volumen',
    statement: (
      <>
        Un panel solar tiene un área de <MathTex tex="2500\text{ cm}^2" />. Exprese esta área en <strong>m²</strong>. (Además, verifique cuántos m³ son 5 litros: <MathTex tex="5\text{ L} = 0.005\text{ m}^3" />).
      </>
    ),
    unit: 'm²',
    expectedValue: 0.25,
    tolerance: 0.01,
    hintTex: '1\\text{ m}^2 = (100\\text{ cm})^2 = 10^4\\text{ cm}^2',
    solutionTex: 'A = 2500\\text{ cm}^2 \\cdot \\frac{1\\text{ m}^2}{10000\\text{ cm}^2} = 0.25\\text{ m}^2; \\quad V = 5\\text{ L}\\cdot\\frac{10^{-3}\\text{ m}^3}{1\\text{ L}} = 0.005\\text{ m}^3',
    answerLabel: 'A = 0.25 m² · V = 0.005 m³',
  },
  {
    id: 3,
    category: 'Unidades y Conversión',
    title: 'Análisis Dimensional de Energía Cinética',
    statement: (
      <>
        La energía cinética se define algebraicamente como <MathTex tex="K = \frac{1}{2}mv^2" />. Demuestre mediante análisis dimensional que sus unidades SI corresponden al Joule (<MathTex tex="\text{J} = \text{N}\cdot\text{m}" />).
      </>
    ),
    conceptual: true,
    hintTex: '[K] = [m][v]^2 = \\text{M}\\left(\\frac{\\text{L}}{\\text{T}}\\right)^2',
    solutionTex: '[K] = \\text{kg}\\cdot\\left(\\frac{\\text{m}}{\\text{s}}\\right)^2 = \\left(\\text{kg}\\cdot\\frac{\\text{m}}{\\text{s}^2}\\right)\\cdot\\text{m} = \\text{N}\\cdot\\text{m} = \\text{J}',
    answerLabel: '[K] = M L² T⁻² = Joules (J)',
  },
  {
    id: 4,
    category: 'Unidades y Conversión',
    title: 'Conversión a Electronvoltios',
    statement: (
      <>
        Una partícula alfa es expulsada de un núcleo con <MathTex tex="8.0 \times 10^{-13}\text{ J}" />. Sabiendo que <MathTex tex="1\text{ eV} = 1.602 \times 10^{-19}\text{ J}" />, exprese esta energía en <strong>MeV</strong>.
      </>
    ),
    unit: 'MeV',
    expectedValue: 4.99,
    tolerance: 0.1,
    hintTex: 'E(\\text{MeV}) = \\frac{E(\\text{J})}{1.602\\times 10^{-13}\\text{ J/MeV}}',
    solutionTex: 'E = \\frac{8.0\\times 10^{-13}\\text{ J}}{1.602\\times 10^{-19}\\text{ J/eV}} \\approx 4.994\\times 10^6\\text{ eV} \\approx 4.99\\text{ MeV}',
    answerLabel: '≈ 4.99 MeV (≈ 5.0 MeV)',
  },
  {
    id: 5,
    category: 'Unidades y Conversión',
    title: 'Unidades Naturales (Bosón de Higgs)',
    statement: (
      <>
        El Bosón de Higgs tiene una masa teórica de <MathTex tex="125\text{ GeV}/c^2" />. Usando <MathTex tex="1\text{ kg} = 5.610 \times 10^{26}\text{ GeV}/c^2" />, calcule su masa en unidades de <MathTex tex="\times 10^{-25}\text{ kg}" /> (ingrese el coeficiente numérico).
      </>
    ),
    unit: '×10⁻²⁵ kg',
    expectedValue: 2.23,
    tolerance: 0.08,
    hintTex: 'm = \\frac{125\\text{ GeV}/c^2}{5.6096\\times 10^{26}\\text{ GeV}/(c^2\\cdot\\text{kg})}',
    solutionTex: 'm = \\frac{125}{5.6096\\times 10^{26}} \\approx 2.228\\times 10^{-25}\\text{ kg}',
    answerLabel: '2.23 × 10⁻²⁵ kg',
  },
  {
    id: 6,
    category: 'Unidades y Conversión',
    title: 'Unidades Naturales (Radio de Bohr)',
    statement: (
      <>
        El radio del átomo de hidrógeno es <MathTex tex="r = 0.53 \times 10^{-10}\text{ m}" />. Con <MathTex tex="1\text{ m} = 5.068 \times 10^6\text{ }\hbar c/\text{eV}" />, exprese este radio en unidades de <MathTex tex="\times 10^{-4}\text{ }\hbar c/\text{eV}" />.
      </>
    ),
    unit: '×10⁻⁴ ħc/eV',
    expectedValue: 2.69,
    tolerance: 0.08,
    hintTex: 'r = (0.53\\times 10^{-10}\\text{ m}) \\cdot (5.0677\\times 10^6\\text{ m}^{-1}\\frac{\\hbar c}{\\text{eV}})',
    solutionTex: 'r = 0.53\\times 5.068 \\times 10^{-4} \\approx 2.686\\times 10^{-4}\\,\\frac{\\hbar c}{\\text{eV}} \\; (\\text{equivale a } \\approx (3730\\text{ eV})^{-1})',
    answerLabel: '2.69 × 10⁻⁴ ħc/eV',
  },
  {
    id: 7,
    category: 'Magnitud y Dirección',
    title: 'Magnitud de una Fuerza Vectorial',
    statement: (
      <>
        Una fuerza está dada por <MathTex tex="\boldsymbol{F} = (6, -8)\text{ N}" />. Calcule la magnitud <MathTex tex="|\boldsymbol{F}|" /> en <strong>N</strong> (y verifique su ángulo en el desarrollo).
      </>
    ),
    unit: 'N',
    expectedValue: 10,
    tolerance: 0.1,
    hintTex: '|\\boldsymbol{F}| = \\sqrt{F_x^2 + F_y^2}, \\quad \\theta = \\arctan(F_y/F_x)',
    solutionTex: '|\\boldsymbol{F}| = \\sqrt{6^2 + (-8)^2} = \\sqrt{100} = 10\\text{ N}; \\quad \\theta = \\arctan(-8/6) \\approx -53.13^\\circ \\text{ (o } 306.87^\\circ)',
    answerLabel: '|F| = 10 N · θ ≈ −53.13°',
  },
  {
    id: 8,
    category: 'Magnitud y Dirección',
    title: 'Descomposición Vectorial de un Dron',
    statement: (
      <>
        Un dron despega a rapidez <MathTex tex="15\text{ m/s}" /> con ángulo <MathTex tex="60^\circ" /> respecto a la horizontal. Calcule la componente horizontal <MathTex tex="v_x" /> en <strong>m/s</strong>.
      </>
    ),
    unit: 'm/s',
    expectedValue: 7.5,
    tolerance: 0.1,
    hintTex: 'v_x = v\\cos 60^\\circ, \\quad v_y = v\\sin 60^\\circ',
    solutionTex: 'v_x = 15\\cos(60^\\circ) = 7.5\\text{ m/s}; \\quad v_y = 15\\sin(60^\\circ) \\approx 12.99\\text{ m/s}',
    answerLabel: 'v = (7.50, 12.99) m/s',
  },
  {
    id: 9,
    category: 'Magnitud y Dirección',
    title: 'Desplazamiento Resultante',
    statement: (
      <>
        Un estudiante camina <MathTex tex="4\text{ km}" /> al Este (<MathTex tex="+x" />) y <MathTex tex="3\text{ km}" /> al Norte (<MathTex tex="+y" />). Calcule la distancia en línea recta desde su partida en <strong>km</strong>.
      </>
    ),
    unit: 'km',
    expectedValue: 5,
    tolerance: 0.05,
    hintTex: '\\boldsymbol{d} = (4, 3)\\text{ km}, \\quad |\\boldsymbol{d}| = \\sqrt{4^2 + 3^2}',
    solutionTex: '|\\boldsymbol{d}| = \\sqrt{4^2 + 3^2} = \\sqrt{25} = 5\\text{ km}',
    answerLabel: 'd = (4, 3) km · |d| = 5 km',
  },
  {
    id: 10,
    category: 'Magnitud y Dirección',
    title: 'Distancia al Faro',
    statement: (
      <>
        Un barco está en <MathTex tex="\boldsymbol{r}_A = (-5, 12)\text{ km}" /> respecto al faro. ¿A qué distancia exacta <MathTex tex="|\boldsymbol{r}_A|" /> se encuentra?
      </>
    ),
    unit: 'km',
    expectedValue: 13,
    tolerance: 0.05,
    hintTex: '|\\boldsymbol{r}_A| = \\sqrt{(-5)^2 + 12^2}',
    solutionTex: '|\\boldsymbol{r}_A| = \\sqrt{25 + 144} = \\sqrt{169} = 13\\text{ km}',
    answerLabel: '13 km',
  },
  {
    id: 11,
    category: 'Suma y Diferencia',
    title: 'Magnitud de Fuerza Neta',
    statement: (
      <>
        Sobre un objeto actúan <MathTex tex="\boldsymbol{F}_1 = (12, 5)\text{ N}" /> y <MathTex tex="\boldsymbol{F}_2 = (-4, 3)\text{ N}" />. Calcule la magnitud de la fuerza neta <MathTex tex="|\boldsymbol{F}_1 + \boldsymbol{F}_2|" /> en <strong>N</strong>.
      </>
    ),
    unit: 'N',
    expectedValue: 11.31,
    tolerance: 0.15,
    hintTex: '\\boldsymbol{F}_{\\text{neta}} = (12-4, 5+3) = (8, 8)\\text{ N}',
    solutionTex: '|\\boldsymbol{F}_{\\text{neta}}| = \\sqrt{8^2 + 8^2} = 8\\sqrt{2} \\approx 11.31\\text{ N}',
    answerLabel: 'F_neta = (8, 8) N · |F| ≈ 11.31 N',
  },
  {
    id: 12,
    category: 'Suma y Diferencia',
    title: 'Posición Relativa entre Vehículos',
    statement: (
      <>
        El vehículo A está en <MathTex tex="\boldsymbol{r}_A = (10, 5)\text{ m}" /> y B en <MathTex tex="\boldsymbol{r}_B = (3, 29)\text{ m}" />. Calcule la distancia relativa <MathTex tex="|\Delta\boldsymbol{r}_{AB}| = |\boldsymbol{r}_A - \boldsymbol{r}_B|" /> en <strong>m</strong>.
      </>
    ),
    unit: 'm',
    expectedValue: 25,
    tolerance: 0.1,
    hintTex: '\\Delta\\boldsymbol{r}_{AB} = (10-3,\\, 5-29) = (7, -24)\\text{ m}',
    solutionTex: '\\Delta\\boldsymbol{r}_{AB} = (7, -24)\\text{ m}; \\quad |\\Delta\\boldsymbol{r}_{AB}| = \\sqrt{7^2 + (-24)^2} = \\sqrt{625} = 25\\text{ m}',
    answerLabel: 'Δr_AB = (7, −24) m · |Δr_AB| = 25 m',
  },
  {
    id: 13,
    category: 'Suma y Diferencia',
    title: 'Equilibrio de Fuerzas en un Puente',
    statement: (
      <>
        Si <MathTex tex="\boldsymbol{F}_1 = (500, 200)\text{ N}" /> y <MathTex tex="\boldsymbol{F}_2 = (-300, 150)\text{ N}" />, ¿cuál debe ser la magnitud de la fuerza equilibrante <MathTex tex="|\boldsymbol{F}_3|" /> tal que <MathTex tex="\boldsymbol{F}_1+\boldsymbol{F}_2+\boldsymbol{F}_3=\boldsymbol{0}" />?
      </>
    ),
    unit: 'N',
    expectedValue: 403.11,
    tolerance: 2,
    hintTex: '\\boldsymbol{F}_3 = -(\\boldsymbol{F}_1 + \\boldsymbol{F}_2) = (-200, -350)\\text{ N}',
    solutionTex: '\\boldsymbol{F}_3 = (-200, -350)\\text{ N}; \\quad |\\boldsymbol{F}_3| = \\sqrt{200^2 + 350^2} \\approx 403.11\\text{ N}',
    answerLabel: 'F₃ = (−200, −350) N · |F₃| ≈ 403.1 N',
  },
  {
    id: 14,
    category: 'Suma y Diferencia',
    title: 'Conmutatividad de la Suma Vectorial',
    statement: (
      <>
        Dados <MathTex tex="\boldsymbol{u} = (2, -3)" /> y <MathTex tex="\boldsymbol{v} = (-1, 4)" />, demuestre algebraicamente que <MathTex tex="\boldsymbol{u} + \boldsymbol{v} = \boldsymbol{v} + \boldsymbol{u}" />.
      </>
    ),
    conceptual: true,
    hintTex: '(u_x + v_x, u_y + v_y) = (v_x + u_x, v_y + u_y)',
    solutionTex: '\\boldsymbol{u}+\\boldsymbol{v} = (2+(-1),\\,-3+4) = (1, 1); \\quad \\boldsymbol{v}+\\boldsymbol{u} = (-1+2,\\,4+(-3)) = (1, 1)',
    answerLabel: '(1, 1) = (1, 1) (Verificado)',
  },
  {
    id: 15,
    category: 'Producto Escalar',
    title: 'Producto Escalar Analítico (Trabajo)',
    statement: (
      <>
        Dados <MathTex tex="\boldsymbol{F} = (4, -2)\text{ N}" /> y <MathTex tex="\Delta\boldsymbol{r} = (3, 5)\text{ m}" />, calcule el trabajo mecánico <MathTex tex="W = \boldsymbol{F} \cdot \Delta\boldsymbol{r}" /> en <strong>J</strong>.
      </>
    ),
    unit: 'J',
    expectedValue: 2,
    tolerance: 0.05,
    hintTex: 'W = F_x\\Delta x + F_y\\Delta y',
    solutionTex: 'W = (4)(3) + (-2)(5) = 12 - 10 = 2\\text{ J}',
    answerLabel: 'W = 2 J',
  },
  {
    id: 16,
    category: 'Producto Escalar',
    title: 'Producto Escalar Geométrico',
    statement: (
      <>
        Una persona arrastra una caja con <MathTex tex="|\boldsymbol{F}| = 150\text{ N}" /> formando <MathTex tex="30^\circ" /> con la horizontal a lo largo de <MathTex tex="|\Delta\boldsymbol{r}| = 10\text{ m}" />. Calcule el trabajo <MathTex tex="W" /> en <strong>J</strong>.
      </>
    ),
    unit: 'J',
    expectedValue: 1299,
    tolerance: 10,
    hintTex: 'W = |\\boldsymbol{F}|\\,|\\Delta\\boldsymbol{r}|\\cos 30^\\circ',
    solutionTex: 'W = (150)(10)\\cos(30^\\circ) = 1500 \\times 0.8660 \\approx 1299.0\\text{ J}',
    answerLabel: 'W ≈ 1299 J',
  },
  {
    id: 17,
    category: 'Producto Escalar',
    title: 'Ángulo entre Dos Vectores',
    statement: (
      <>
        Encuentre el ángulo <MathTex tex="\theta" /> en <strong>grados</strong> formado entre <MathTex tex="\boldsymbol{u} = (3, 0)" /> y <MathTex tex="\boldsymbol{v} = (3, 3)" /> usando el producto escalar.
      </>
    ),
    unit: '°',
    expectedValue: 45,
    tolerance: 0.5,
    hintTex: '\\cos\\theta = \\frac{\\boldsymbol{u}\\cdot\\boldsymbol{v}}{|\\boldsymbol{u}||\\boldsymbol{v}|}',
    solutionTex: '\\cos\\theta = \\frac{3\\cdot 3 + 0\\cdot 3}{3 \\cdot \\sqrt{18}} = \\frac{9}{9\\sqrt{2}} = \\frac{1}{\\sqrt{2}} \\implies \\theta = 45^\\circ',
    answerLabel: 'θ = 45°',
  },
  {
    id: 18,
    category: 'Producto Vectorial',
    title: 'Magnitud del Torque',
    statement: (
      <>
        Un mecánico usa una llave de <MathTex tex="|\boldsymbol{r}| = 0.40\text{ m}" /> aplicando <MathTex tex="|\boldsymbol{F}| = 200\text{ N}" /> a <MathTex tex="60^\circ" /> respecto al mango. Calcule la magnitud del torque <MathTex tex="|\boldsymbol{\tau}|" /> en <strong>N·m</strong>.
      </>
    ),
    unit: 'N·m',
    expectedValue: 69.28,
    tolerance: 0.5,
    hintTex: '|\\boldsymbol{\\tau}| = |\\boldsymbol{r}|\\,|\\boldsymbol{F}|\\sin 60^\\circ',
    solutionTex: '|\\boldsymbol{\\tau}| = (0.40)(200)\\sin(60^\\circ) = 80 \\times 0.8660 \\approx 69.28\\text{ N}\\cdot\\text{m}',
    answerLabel: '|τ| ≈ 69.28 N·m',
  },
  {
    id: 19,
    category: 'Producto Vectorial',
    title: 'Regla de la Mano Derecha en 3D',
    statement: (
      <>
        Una carga positiva se mueve en dirección <MathTex tex="+x" /> (<MathTex tex="\boldsymbol{v}" />) dentro de un campo en dirección <MathTex tex="+y" /> (<MathTex tex="\boldsymbol{B}" />). Con <MathTex tex="\boldsymbol{F} = q(\boldsymbol{v}\times\boldsymbol{B})" />, ¿en qué eje apunta <MathTex tex="\boldsymbol{F}" />?
      </>
    ),
    conceptual: true,
    hintTex: '\\hat{i} \\times \\hat{j} = \\hat{k}',
    solutionTex: '\\text{Curvando los dedos de } +x \\text{ hacia } +y, \\text{ el pulgar apunta hacia el eje } +z \\text{ (saliendo del plano } xy\\text{).}',
    answerLabel: 'Dirección +z (saliendo del plano xy)',
  },
  {
    id: 20,
    category: 'Producto Vectorial',
    title: 'Maximización del Producto Cruz',
    statement: (
      <>
        Para <MathTex tex="|\boldsymbol{u}\times\boldsymbol{v}| = |\boldsymbol{u}||\boldsymbol{v}|\sin\theta" />, ¿qué ángulo <MathTex tex="\theta" /> entre <MathTex tex="0^\circ" /> y <MathTex tex="180^\circ" /> maximiza el producto vectorial (en <strong>grados</strong>)?
      </>
    ),
    unit: '°',
    expectedValue: 90,
    tolerance: 0.5,
    hintTex: '\\max(\\sin\\theta) = 1 \\text{ cuando } \\boldsymbol{u} \\perp \\boldsymbol{v}',
    solutionTex: '\\text{a) } \\theta = 90^\\circ \\text{ (vectores perpendiculares, } \\sin 90^\\circ = 1\\text{). b) El producto es cero cuando } \\theta = 0^\\circ \\text{ o } 180^\\circ \\text{ (vectores paralelos o antiparalelos).}',
    answerLabel: 'a) 90° · b) Paralelos (0° o 180°)',
  },
];

export const Ch1ExercisesSection: React.FC = () => {
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, 'correct' | 'incorrect' | null>>({});
  const [openSolutions, setOpenSolutions] = useState<Record<number, boolean>>({});
  const [filterCat, setFilterCat] = useState<string>('Todas');

  const categories = ['Todas', ...Array.from(new Set(CHAPTER_1_EXERCISES.map((e) => e.category)))];
  const visibleExercises =
    filterCat === 'Todas'
      ? CHAPTER_1_EXERCISES
      : CHAPTER_1_EXERCISES.filter((e) => e.category === filterCat);

  const checkAnswer = (ex: Ch1Exercise) => {
    if (ex.expectedValue === undefined || ex.tolerance === undefined) return;
    const raw = (inputs[ex.id] || '').replace(',', '.').trim();
    const val = parseFloat(raw);
    if (Number.isNaN(val)) {
      setChecked((prev) => ({ ...prev, [ex.id]: 'incorrect' }));
      return;
    }
    const ok = Math.abs(val - ex.expectedValue) <= ex.tolerance;
    setChecked((prev) => ({ ...prev, [ex.id]: ok ? 'correct' : 'incorrect' }));
  };

  const toggleSolution = (id: number) => {
    setOpenSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const correctCount = Object.values(checked).filter((v) => v === 'correct').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Capítulo 1 · Sección 1.6
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Ejercicios Propuestos del Capítulo 1
          </h1>
          <p className="mt-1.5 max-w-3xl text-sm text-slate-600">
            Los 20 ejercicios de unidades físicas, factores de conversión, unidades naturales y análisis vectorial de <code>main.tex</code> con verificación numérica y solución completa en LaTeX.
          </p>
        </div>
        <div className="text-xs font-mono font-semibold text-slate-700 tabular-nums shrink-0">
          Comprobados: {correctCount} / {CHAPTER_1_EXERCISES.filter((e) => !e.conceptual).length} numéricos
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilterCat(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium border cursor-pointer transition-colors ${
              filterCat === cat
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {visibleExercises.map((ex) => {
          const status = checked[ex.id];
          const isOpen = !!openSolutions[ex.id];

          return (
            <article
              key={ex.id}
              className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-medium text-sky-700">{ex.category}</span>
                    <h2 className="text-sm font-semibold text-slate-900">
                      {ex.id}. {ex.title}
                    </h2>
                  </div>
                  {status === 'correct' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0">
                      <CheckCircle2 className="h-4 w-4" /> Correcto
                    </span>
                  )}
                  {status === 'incorrect' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 shrink-0">
                      <XCircle className="h-4 w-4" /> Revisa el cálculo
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{ex.statement}</p>
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-3">
                <div className="flex flex-wrap items-center gap-2">
                  {!ex.conceptual && ex.unit && (
                    <>
                      <div className="flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 focus-within:border-sky-600">
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder={`Valor (${ex.unit})`}
                          value={inputs[ex.id] || ''}
                          onChange={(e) =>
                            setInputs((prev) => ({ ...prev, [ex.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') checkAnswer(ex);
                          }}
                          className="w-28 text-xs font-mono text-slate-900 outline-none tabular-nums"
                          aria-label={`Respuesta ejercicio ${ex.id}`}
                        />
                        <span className="text-xs font-mono text-slate-500">{ex.unit}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => checkAnswer(ex)}
                        className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Comprobar
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleSolution(ex.id)}
                    className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {isOpen ? (
                      <>
                        <ChevronUp className="h-3.5 w-3.5" /> Ocultar solución
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3.5 w-3.5" /> Ver solución LaTeX
                      </>
                    )}
                  </button>
                </div>

                {isOpen && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2 text-xs">
                    <div className="text-slate-500 font-medium">Planteamiento:</div>
                    <MathTex tex={ex.hintTex} block className="text-xs" />
                    <div className="text-slate-500 font-medium pt-1">Desarrollo:</div>
                    <MathTex tex={ex.solutionTex} block className="text-xs" />
                    <div className="font-mono font-semibold text-emerald-800 pt-1">
                      Resultado: {ex.answerLabel}
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
