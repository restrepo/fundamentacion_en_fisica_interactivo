export type ChapterId =
  | 'relativity'
  | 'preliminaries'
  | 'dynamics'
  | 'electromagnetism'
  | 'archive';

export interface BookSection {
  id: string;
  title: string;
  texLine: number;
  summary: string;
  interactiveModule?: ChapterId;
}

export interface BookChapter {
  number: string;
  title: string;
  subtitle: string;
  moduleId: ChapterId;
  sections: BookSection[];
}

export interface RepoFigure {
  filename: string;
  title: string;
  chapter: string;
  description: string;
}

export const BOOK_CHAPTERS: BookChapter[] = [
  {
    number: 'Capítulo 1',
    title: 'Preliminares',
    subtitle: 'Vectores, análisis dimensional, unidades naturales y simetría rotacional SO(2)',
    moduleId: 'preliminaries',
    sections: [
      {
        id: '1.1',
        title: 'Vectores en Dos Dimensiones y Operaciones',
        texLine: 106,
        summary: 'Magnitud, dirección, suma, diferencia e invariancia traslacional del vector desplazamiento (homogeneidad del espacio).',
        interactiveModule: 'preliminaries',
      },
      {
        id: '1.2',
        title: 'Simplificación de Unidades y Análisis Dimensional',
        texLine: 546,
        summary: 'Homogeneidad dimensional y deducción algebraica de las unidades SI de constantes físicas como G.',
        interactiveModule: 'preliminaries',
      },
      {
        id: '1.3',
        title: 'Factores de Conversión y Unidades Naturales',
        texLine: 675,
        summary: 'Conversión de tiempo, distancia y masa a unidades de energía usando ħ, c, ε₀ y k_B.',
        interactiveModule: 'preliminaries',
      },
      {
        id: '1.4',
        title: 'Noción de Transformaciones e Invariancia Bajo Rotación',
        texLine: 765,
        summary: 'Rotación de ejes en un ángulo θ y demostración algebraica de x′² + y′² = x² + y².',
        interactiveModule: 'preliminaries',
      },
    ],
  },
  {
    number: 'Capítulo 2',
    title: 'Relatividad Especial',
    subtitle: 'Derivación algebraica de las transformaciones de Lorentz, cinemática y espacio de Minkowski',
    moduleId: 'relativity',
    sections: [
      {
        id: '2.1',
        title: 'Postulados y Derivación de las Transformaciones de Lorentz',
        texLine: 944,
        summary: 'Linealidad, origen en movimiento, principio de relatividad y constancia de c para obtener γ, x′ y t′.',
        interactiveModule: 'relativity',
      },
      {
        id: '2.2',
        title: 'Dilatación del Tiempo y Contracción de la Longitud',
        texLine: 1238,
        summary: 'Reloj en movimiento en S′, tiempo propio Δt₀, regla propia L₀ y el experimento de Michelson-Morley.',
        interactiveModule: 'relativity',
      },
      {
        id: '2.3',
        title: 'Suma Relativista de Velocidades y Efecto Doppler',
        texLine: 1583,
        summary: 'Composición de velocidades de Einstein respetando el límite c y comparación entre sonido clásico y luz.',
        interactiveModule: 'relativity',
      },
      {
        id: '2.4',
        title: 'Espacio de Minkowski, Energía y Momento Relativista',
        texLine: 2462,
        summary: 'Intervalo invariante Δs², funciones hiperbólicas, cuadrivector energía-momento y equivalencia masa-energía.',
        interactiveModule: 'relativity',
      },
    ],
  },
  {
    number: 'Capítulo 3',
    title: 'Dinámica Newtoniana',
    subtitle: 'Leyes de Newton, trabajo y energía, movimiento parabólico, gravitación y leyes de Kepler',
    moduleId: 'dynamics',
    sections: [
      {
        id: '3.1',
        title: 'Leyes de Newton y Teorema del Trabajo y la Energía',
        texLine: 3892,
        summary: 'Solución numérica del oscilador armónico, aceleración constante y demostración algebraica de W = ΔK.',
        interactiveModule: 'dynamics',
      },
      {
        id: '3.2',
        title: 'Movimiento Parabólico y Conservación del Momento',
        texLine: 4864,
        summary: 'Trayectoria y(x), alcance máximo, centro de masas y colisiones con conservación de cantidad de movimiento.',
        interactiveModule: 'dynamics',
      },
      {
        id: '3.3',
        title: 'Fuerza Centrípeta y Gravitación Universal',
        texLine: 5953,
        summary: 'Prueba de la Luna, campo gravitacional g y el Cañón de Newton de proyectiles a órbitas.',
        interactiveModule: 'dynamics',
      },
      {
        id: '3.4',
        title: 'Momento Angular y Leyes de Kepler',
        texLine: 7291,
        summary: 'Derivación simplificada de las tres leyes de Kepler y período orbital lunar.',
        interactiveModule: 'dynamics',
      },
    ],
  },
  {
    number: 'Capítulo 4',
    title: 'Electromagnetismo',
    subtitle: 'Coulomb, Ampère, inducción de Faraday, Maxwell, radiación y el modelo atómico de Bohr',
    moduleId: 'electromagnetism',
    sections: [
      {
        id: '4.1',
        title: 'Electricidad y Ley de Coulomb',
        texLine: 8385,
        summary: 'Interacción electrostática, campo eléctrico y corriente eléctrica.',
        interactiveModule: 'electromagnetism',
      },
      {
        id: '4.2',
        title: 'Magnetismo, Ley de Ampère y Ley de Faraday',
        texLine: 8947,
        summary: 'Fuerza entre alambres paralelos con corriente, solenoides e inducción electromagnética.',
        interactiveModule: 'electromagnetism',
      },
      {
        id: '4.3',
        title: 'Ecuaciones de Maxwell y Ondas Electromagnéticas',
        texLine: 9362,
        summary: 'Corriente de desplazamiento, radiación en antenas dipolares y propagación a velocidad c.',
        interactiveModule: 'electromagnetism',
      },
      {
        id: '4.4',
        title: 'Colapso Clásico y Modelo de Bohr del Hidrógeno',
        texLine: 9656,
        summary: 'Inestabilidad radiativa por fórmula de Larmor y cuantización de niveles de energía Eₙ = -13.6/n² eV.',
        interactiveModule: 'electromagnetism',
      },
    ],
  },
  {
    number: 'Apéndices',
    title: 'Apéndices Matemáticos y Evidencia',
    subtitle: 'Ignatowski, rotación de Wick, matriz de Lorentz, LHC y fórmula de Larmor relativista',
    moduleId: 'archive',
    sections: [
      {
        id: 'A.1',
        title: 'Invariancia Rotacional y Evidencia en el LHC',
        texLine: 10157,
        summary: 'Contracción relativista observada en colisiones de iones pesados ultrarrelativistas.',
      },
      {
        id: 'A.2',
        title: 'Enfoque de Ignatowski: Lorentz desde Simetrías',
        texLine: 10369,
        summary: 'Derivación de las transformaciones sin asumir explícitamente la constancia de c, solo homogeneidad e isotropía.',
      },
      {
        id: 'A.3',
        title: 'Fórmula de Euler y Rotación de Wick',
        texLine: 10482,
        summary: 'Impulsos de Lorentz como rotaciones hiperbólicas y conexión con rotaciones euclidianas imaginarias.',
      },
    ],
  },
];

export const REPO_FIGURES: RepoFigure[] = [
  {
    filename: 'Lorentz_factor_log_log.png',
    title: 'Factor de Lorentz γ (escala log-log)',
    chapter: 'Capítulo 2 · Relatividad Especial',
    description: 'Crecimiento asintótico del factor γ = (1 - v²/c²)⁻¹/² conforme la velocidad se aproxima a c.',
  },
  {
    filename: 'clock.png',
    title: 'Reloj de referencia en S′',
    chapter: 'Capítulo 2 · Dilatación del Tiempo',
    description: 'Icono empleado en el diagrama espacio-tiempo para representar un reloj en reposo en x′_c.',
  },
  {
    filename: 'ruler.png',
    title: 'Regla en movimiento en S′',
    chapter: 'Capítulo 2 · Contracción de Longitud',
    description: 'Objeto rígido cuya longitud propia L₀ se contrae al medirse simultáneamente desde S.',
  },
  {
    filename: 'tennis.png',
    title: 'Longitud propia: cancha y pelota de tenis',
    chapter: 'Capítulo 2 · Contracción de Longitud',
    description: 'Analogía pedagógica de simetría relativista entre observadores en S y S′.',
  },
  {
    filename: 'sound.png',
    title: 'Efecto Doppler clásico (sonido)',
    chapter: 'Capítulo 2 · Ondas y Doppler',
    description: 'Frentes de onda mecánicos propagándose en un medio material (aire).',
  },
  {
    filename: 'light.png',
    title: 'Efecto Doppler relativista (luz)',
    chapter: 'Capítulo 2 · Ondas y Doppler',
    description: 'Propagación electromagnética isotrópica en el vacío a velocidad invariante c.',
  },
  {
    filename: 'decaimiento.png',
    title: 'Decaimiento radiactivo exponencial',
    chapter: 'Capítulo 2 · Decaimiento y Relatividad',
    description: 'Curva de desintegración N(t) en función de la vida media y constante λ.',
  },
  {
    filename: 'foton.png',
    title: 'Fotón en el experimento mental',
    chapter: 'Capítulo 2 · Ejercicios',
    description: 'Ilustración usada en los problemas conceptuales sobre propagación luminosa.',
  },
  {
    filename: 'fusion.jpg',
    title: 'Reacción de fusión nuclear',
    chapter: 'Capítulo 2 · Equivalencia Masa-Energía',
    description: 'Defecto de masa convertido en energía mediante ΔE = Δm c².',
  },
  {
    filename: 'consumo.png',
    title: 'Escalas de consumo energético',
    chapter: 'Capítulo 2 · Energía Relativista',
    description: 'Comparativa entre energía química, fisión nuclear y fusión.',
  },
  {
    filename: 'vectorproduct.png',
    title: 'Producto vectorial en 3D',
    chapter: 'Capítulo 1 · Preliminares',
    description: 'Área del paralelogramo y dirección perpendicular por regla de la mano derecha.',
  },
  {
    filename: 'Newton_Cannon.svg',
    title: 'El Cañón de Newton',
    chapter: 'Capítulo 3 · Gravitación Universal',
    description: 'Transición continua desde trayectorias parabólicas locales hasta órbitas circulares, elípticas y de escape.',
  },
  {
    filename: 'rueda.png',
    title: 'Movimiento circular y velocidad tangencial',
    chapter: 'Capítulo 3 · Fuerza Centrípeta',
    description: 'Geometría de aceleración centrípeta a_c = v²/r en movimiento uniforme.',
  },
  {
    filename: 'CoulombsLaw.svg',
    title: 'Ley de Coulomb',
    chapter: 'Capítulo 4 · Electricidad',
    description: 'Fuerza electrostática inversamente proporcional al cuadrado de la distancia entre cargas.',
  },
  {
    filename: 'alambres.png',
    title: 'Fuerza entre alambres paralelos',
    chapter: 'Capítulo 4 · Ley de Ampère',
    description: 'Interacción magnética atractiva o repulsiva entre corrientes eléctricas I₁ e I₂.',
  },
  {
    filename: 'ampere.png',
    title: 'Campo magnético de un conductor',
    chapter: 'Capítulo 4 · Magnetismo',
    description: 'Líneas de campo circular B alrededor de un hilo conductor rectilíneo.',
  },
  {
    filename: 'solenoide.png',
    title: 'Campo en un solenoide',
    chapter: 'Capítulo 4 · Magnetismo',
    description: 'Distribución del campo magnético uniforme en el interior de una bobina.',
  },
  {
    filename: 'solenoide2.png',
    title: 'Espiras y flujo magnético en solenoide',
    chapter: 'Capítulo 4 · Magnetismo',
    description: 'Corte transversal del solenoide para aplicación de la ley circuital de Ampère.',
  },
  {
    filename: 'faraday.png',
    title: 'Inducción electromagnética de Faraday',
    chapter: 'Capítulo 4 · Ley de Faraday',
    description: 'Generación de fuerza electromotriz inducida al variar el flujo magnético en el tiempo.',
  },
  {
    filename: 'dipolar.png',
    title: 'Radiación dipolar de una antena',
    chapter: 'Capítulo 4 · Ondas Electromagnéticas',
    description: 'Emisión de campos eléctricos y magnéticos acoplados desde cargas aceleradas.',
  },
  {
    filename: 'em.png',
    title: 'Espectro electromagnético y ondas',
    chapter: 'Capítulo 4 · Ondas Electromagnéticas',
    description: 'Propagación transversal de los vectores E y B perpendiculares entre sí.',
  },
  {
    filename: 'ec.png',
    title: 'Ecuación de campo / energía clásica',
    chapter: 'Capítulo 4 · Modelo Atómico',
    description: 'Balance energético en el análisis de órbitas clásicas frente a la cuantización.',
  },
  {
    filename: 'b2-b1.png',
    title: 'Diferencia de niveles energéticos',
    chapter: 'Capítulo 4 · Modelo de Bohr',
    description: 'Transiciones cuánticas entre estados estacionarios del átomo de hidrógeno.',
  },
  {
    filename: 'gotas.jpg',
    title: 'Experimento y fenómeno físico complementario',
    chapter: 'Archivo del Libro',
    description: 'Recurso gráfico incluido en el repositorio original del curso.',
  },
];
