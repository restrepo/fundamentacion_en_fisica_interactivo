import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  MessageSquare,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { RichPhysicsText } from './RichPhysicsText';

export type ChapterKey = 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'book';
export type TutorDepth = 'standard' | 'deep' | 'fast';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface HardConceptPrompt {
  label: string;
  question: string;
}

export const HARD_CONCEPTS_BY_CHAPTER: Record<ChapterKey, { title: string; prompts: HardConceptPrompt[] }> = {
  ch1: {
    title: 'Cap. 1 · Preliminares Matemáticos',
    prompts: [
      {
        label: 'Vectores libres vs. ligados',
        question:
          '¿Por qué el vector desplazamiento Δr es invariante al trasladar el origen de coordenadas mientras que el vector posición r sí cambia? ¿Qué relación tiene con la homogeneidad del espacio?',
      },
      {
        label: 'Unidades naturales (ħ = c = 1)',
        question:
          'Me cuesta entender las unidades naturales: ¿cómo es posible expresar la masa, la longitud y el tiempo en términos de energía (eV o GeV)?',
      },
      {
        label: 'Regla de la mano derecha y torque',
        question:
          '¿Por qué el torque τ = r × F es un vector perpendicular al plano de rotación en lugar de estar en la dirección de la fuerza?',
      },
    ],
  },
  ch2: {
    title: 'Cap. 2 · Relatividad Especial',
    prompts: [
      {
        label: 'Simultaneidad y paradoja de gemelos',
        question:
          'Si el observador S ve el reloj de S′ ir más lento y S′ ve el reloj de S ir más lento, ¿por qué no es una contradicción física y cómo se resuelve la paradoja de los gemelos?',
      },
      {
        label: 'Muones atmosféricos (2 perspectivas)',
        question:
          '¿Cómo se explica que los muones atmosféricos lleguen a la superficie terrestre tanto desde la dilatación del tiempo (Tierra) como desde la contracción de la longitud (muón)?',
      },
      {
        label: 'Invariante de Minkowski (ct)² − x²',
        question:
          '¿Por qué en el espacio-tiempo de Minkowski el intervalo invariante lleva signo menos, ΔS² = (cΔt)² − Δx², en lugar de signo más como el teorema de Pitágoras?',
      },
      {
        label: 'Por qué el oro del JWST es amarillo',
        question:
          '¿Cómo hace la relatividad especial que los electrones internos del oro contraigan el orbital 6s y cambien su color de plateado a amarillo?',
      },
    ],
  },
  ch3: {
    title: 'Cap. 3 · Dinámica Newtoniana',
    prompts: [
      {
        label: 'Euler-Cromer vs. Euler simple',
        question:
          '¿Por qué el método numérico de Euler-Cromer (actualizar v antes que x) conserva estable la órbita del oscilador armónico mientras que Euler simple diverge?',
      },
      {
        label: 'Gravedad dentro de la Tierra (g ∝ r)',
        question:
          '¿Por qué el campo gravitacional crece linealmente con el radio dentro de una Tierra uniforme (pendiente +1 en log-log) pero cae como 1/r² afuera?',
      },
      {
        label: 'Cañón de Newton y caída libre',
        question:
          '¿Qué significa conceptualmente que la Luna o un satélite en órbita están cayendo continuamente hacia la Tierra sin estrellarse contra ella?',
      },
      {
        label: 'Marco de Momento Cero (Centro de Masa)',
        question:
          '¿Por qué analizar colisiones elásticas e inelásticas desde el marco del Centro de Masa simplifica tanto el cálculo de las velocidades finales?',
      },
    ],
  },
  ch4: {
    title: 'Cap. 4 · Electromagnetismo',
    prompts: [
      {
        label: 'Magnetismo como efecto relativista',
        question:
          '¿Cómo emerge la fuerza magnética sobre una carga en movimiento simplemente a partir de la electrostática y la contracción de Lorentz de las cargas en el alambre?',
      },
      {
        label: 'Signo negativo en Ley de Faraday (Lenz)',
        question:
          '¿Por qué la ley de inducción de Faraday tiene un signo negativo (ε = −dΦ_B/dt) y qué pasaría con la conservación de la energía si fuera positivo?',
      },
      {
        label: 'Corriente de desplazamiento de Maxwell',
        question:
          '¿Qué inconsistencia encontró Maxwell en la ley de Ampère al cargar un capacitor y cómo la corriente de desplazamiento permitió predecir las ondas electromagnéticas?',
      },
      {
        label: 'Cuantización en el átomo de Bohr',
        question:
          '¿Por qué el átomo de Rutherford era inestable según el electromagnetismo clásico y cómo resolvió Bohr ese colapso cuantizando L = nħ?',
      },
    ],
  },
  book: {
    title: 'Libro Completo · Fundamentación en Física',
    prompts: [
      {
        label: 'Conexión entre los 4 capítulos',
        question:
          '¿Cómo se conectan las simetrías espaciales del Capítulo 1, la relatividad del Capítulo 2 y la dinámica del Capítulo 3 para culminar en el electromagnetismo del Capítulo 4?',
      },
      {
        label: 'Principio de conservación vs. simetría',
        question:
          '¿Qué relación intuitiva existe entre las invariancias (traslación, rotación, Lorentz) y las leyes de conservación de momento y energía?',
      },
      {
        label: 'De Newton a Maxwell: el rol de c',
        question:
          '¿Cómo aparece la velocidad de la luz c tanto en las transformaciones de Lorentz como en las constantes ε₀ y μ₀ del electromagnetismo?',
      },
    ],
  },
};

interface PhysicsChatbotDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeChapter: ChapterKey;
  queuedQuestion: string | null;
  onConsumeQueuedQuestion: () => void;
}

export const PhysicsChatbotDrawer: React.FC<PhysicsChatbotDrawerProps> = ({
  open,
  onOpenChange,
  activeChapter,
  queuedQuestion,
  onConsumeQueuedQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [depth, setDepth] = useState<TutorDepth>('standard');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const chapterInfo = HARD_CONCEPTS_BY_CHAPTER[activeChapter];

  useEffect(() => {
    if (open) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, isStreaming]);

  const sendQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isStreaming) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };
    const modelId = `m-${Date.now() + 1}`;
    const placeholderModelMsg: ChatMessage = {
      id: modelId,
      role: 'model',
      text: '',
    };

    const nextHistory = [...messages, userMsg];
    setMessages([...nextHistory, placeholderModelMsg]);
    setInput('');
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({ role: m.role, text: m.text })),
          chapterContext: chapterInfo.title,
          depth,
        }),
      });

      if (!response.ok) {
        let serverErr = `Error del servidor (${response.status})`;
        try {
          const errJson = (await response.json()) as { error?: string };
          if (errJson?.error) serverErr = errJson.error;
        } catch {
          // ignore parse error
        }
        throw new Error(serverErr);
      }

      if (!response.body) {
        throw new Error('No se recibió flujo de respuesta del servidor.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const evt of events) {
          const line = evt
            .split('\n')
            .find((l) => l.startsWith('data: '));
          if (!line) continue;
          const payloadStr = line.slice(6).trim();
          if (!payloadStr) continue;

          try {
            const payload = JSON.parse(payloadStr) as {
              text?: string;
              done?: boolean;
              error?: string;
            };
            if (payload.error) {
              throw new Error(payload.error);
            }
            if (payload.text) {
              accumulated += payload.text;
              setMessages((prev) =>
                prev.map((m) => (m.id === modelId ? { ...m, text: accumulated } : m))
              );
            }
          } catch (innerErr) {
            if (innerErr instanceof Error && innerErr.message !== 'Unexpected end of JSON input') {
              throw innerErr;
            }
          }
        }
      }

      if (!accumulated.trim()) {
        throw new Error('El tutor devolvió una respuesta vacía. Intenta formular la pregunta de nuevo.');
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const message =
        err instanceof Error ? err.message : 'No fue posible conectar con el tutor.';
      setErrorMsg(message);
      setMessages((prev) => prev.filter((m) => m.id !== modelId || m.text.trim().length > 0));
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  // Trigger queued question sent from outside (e.g. quick concept chips)
  useEffect(() => {
    if (open && queuedQuestion && !isStreaming) {
      const q = queuedQuestion;
      onConsumeQueuedQuestion();
      void sendQuestion(q);
    }
  }, [open, queuedQuestion]);

  const handleReset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setErrorMsg(null);
    setIsStreaming(false);
  };

  return (
    <>
      {/* Persistent bottom-right launcher when closed */}
      {!open && (
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-lg hover:bg-slate-800 transition-all cursor-pointer"
          aria-label="Abrir tutor de conceptos difíciles"
        >
          <MessageSquare className="h-4 w-4 text-sky-400" aria-hidden="true" />
          <span>Preguntar al Tutor</span>
        </button>
      )}

      {/* Slide-over drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30 backdrop-blur-[1px]">
          <div
            className="fixed inset-0"
            onClick={() => onOpenChange(false)}
            aria-hidden="true"
          />

          <aside
            className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl"
            aria-label="Tutor interactivo de conceptos difíciles"
          >
            {/* Header */}
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-700">
                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{chapterInfo.title}</span>
                  </div>
                  <h2 className="mt-0.5 text-base font-bold text-slate-900">
                    Tutor de Conceptos Importantes y Difíciles
                  </h2>
                </div>

                <div className="flex items-center gap-1.5">
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={handleReset}
                      title="Reiniciar conversación"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Nueva</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    aria-label="Cerrar tutor"
                    className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Depth selector */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-slate-600">
                  Nivel de explicación:
                </span>
                <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
                  {(
                    [
                      { id: 'fast', label: 'Rápida' },
                      { id: 'standard', label: 'Estándar' },
                      { id: 'deep', label: 'Derivación Profunda' },
                    ] as const
                  ).map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setDepth(mode.id)}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                        depth === mode.id
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scrollable conversation thread */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-slate-50/40">
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                      <Sparkles className="h-4 w-4 text-sky-600" aria-hidden="true" />
                      <span>Pregunta sin rodeos sobre lo que más cuesta entender</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">
                      Escribe cualquier duda sobre intuición física, demostraciones paso a paso, paradojas o errores frecuentes de este capítulo. También puedes elegir un concepto difícil sugerido:
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Conceptos difíciles sugeridos ({chapterInfo.title})
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {chapterInfo.prompts.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => void sendQuestion(item.question)}
                          className="text-left rounded-xl border border-slate-200 bg-white p-3 hover:border-sky-400 hover:bg-sky-50/40 transition-colors cursor-pointer"
                        >
                          <div className="text-xs font-semibold text-sky-800">{item.label}</div>
                          <div className="mt-1 text-xs text-slate-600 leading-relaxed">
                            {item.question}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((m, idx) => {
                    const isUser = m.role === 'user';
                    const isLastModel =
                      !isUser && idx === messages.length - 1;

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[92%] rounded-xl px-4 py-3 ${
                            isUser
                              ? 'bg-slate-900 text-white text-xs sm:text-sm leading-relaxed'
                              : 'border border-slate-200 bg-white text-slate-900 shadow-xs'
                          }`}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap">{m.text}</p>
                          ) : m.text ? (
                            <RichPhysicsText content={m.text} />
                          ) : (
                            <span className="text-xs text-slate-500 italic">
                              Analizando el concepto y preparando la explicación...
                            </span>
                          )}
                        </div>

                        {isLastModel && !isStreaming && m.text && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                void sendQuestion(
                                  '¿Puedes darme una analogía intuitiva cotidiana para entender ese concepto aún mejor?'
                                )
                              }
                              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                            >
                              Pedir analogía intuitiva
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                void sendQuestion(
                                  'Muestra la deducción matemática paso a paso y señala el error más común de los estudiantes.'
                                )
                              }
                              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                            >
                              Ver pasos y error típico
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Quick chip bar after messages to pivot topic */}
                  {!isStreaming && (
                    <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                      <div className="text-[11px] font-medium text-slate-500">
                        Otros temas clave de esta sección:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {chapterInfo.prompts.map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => void sendQuestion(item.question)}
                            className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-sky-400 hover:text-sky-800 cursor-pointer"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {errorMsg && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div ref={scrollEndRef} />
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void sendQuestion(input);
              }}
              className="border-t border-slate-200 bg-white p-4 space-y-2"
            >
              <div className="flex items-end gap-2">
                <textarea
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void sendQuestion(input);
                    }
                  }}
                  placeholder={`Pregunta sobre ${chapterInfo.title} (Enter para enviar)...`}
                  className="flex-1 resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isStreaming || !input.trim()}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{isStreaming ? 'Pensando' : 'Enviar'}</span>
                </button>
              </div>
              <div className="text-[11px] text-slate-500">
                Soporta fórmulas y derivaciones paso a paso con historial multi-turno.
              </div>
            </form>
          </aside>
        </div>
      )}
    </>
  );
};
