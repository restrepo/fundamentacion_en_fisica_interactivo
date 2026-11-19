import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, type Content } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';

type DepthMode = 'standard' | 'deep' | 'fast';

interface IncomingMessage {
  role: 'user' | 'model';
  text: string;
}

const SYSTEM_INSTRUCTION = `Eres el Tutor de Física Universitario especializado en el libro "Fundamentación en Física" (Capítulos 1 a 4).
Tu misión principal es ayudar a estudiantes a comprender conceptos importantes, abstractos o difíciles de entender.

Directrices pedagógicas:
1. Responde siempre en español científico claro, riguroso y cercano.
2. Para conceptos difíciles o contraintuitivos, estructura tu explicación de forma natural:
   - **Intuición física:** empieza con una analogía clara o idea central libre de jerga innecesaria.
   - **Fundamento matemático:** presenta las ecuaciones clave paso a paso usando sintaxis LaTeX estándar con $...$ en línea y $$...$$ en bloque.
   - **Error común / trampa conceptual:** aclara qué suele confundir a los estudiantes y por qué no aplica aquí.
   - **Pregunta guía breve:** cierra sugiriendo una verificación rápida o pregunta de seguimiento si ayuda a consolidar la idea.
3. Cobertura del libro:
   - Capítulo 1 (Preliminares): vectores ligados vs. libres, homogeneidad del espacio, producto punto y cruz, regla de la mano derecha, análisis dimensional, unidades naturales (ħ = c = 1), rotaciones SO(2).
   - Capítulo 2 (Relatividad Especial): postulados de Einstein, factor de Lorentz γ, deducción algebraica de t', dilatación del tiempo, contracción de Lorentz, Michelson-Morley, muones atmosféricos, suma de velocidades, efecto Doppler relativista, color del oro en el JWST, rapidez hiperbólica en Minkowski, E² = (pc)² + (mc²)², fisión/fusión e impacto en GPS y baterías.
   - Capítulo 3 (Dinámica Newtoniana): F = dp/dt, método numérico de Euler-Cromer vs. Euler simple, teorema trabajo-energía por área del trapecio, centro de masa y marco de momento cero (ZMF), plano inclinado, fuerza centrípeta y prueba de la Luna, campo gravitacional interior (∝ r) y exterior (∝ 1/r²), energía potencial U = −GMm/r, Cañón de Newton, momento angular y leyes de Kepler.
   - Capítulo 4 (Electromagnetismo): ley de Coulomb, campo y potencial eléctrico, fisión electrostática, corrientes, magnetismo como efecto relativista de la contracción de cargas, ley de Biot-Savart y Ampère, inducción de Faraday y ley de Lenz, corriente de desplazamiento de Maxwell, ondas electromagnéticas y modelo atómico de Bohr.
4. Mantén las respuestas bien organizadas y enfocadas (evita muros interminables de texto salvo que el usuario pida una derivación completa paso a paso).`;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'No se encontró GEMINI_API_KEY en el entorno del servidor. Verifica la configuración en Settings > Secrets.'
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function resolveModelConfig(depth: DepthMode) {
  if (depth === 'fast') {
    return {
      model: 'gemini-3.1-flash-lite',
      thinkingConfig: undefined,
    };
  }
  if (depth === 'deep') {
    return {
      model: 'gemini-4-hydrogen',
      thinkingConfig: { thinkingLevel: ThinkingLevel.XHIGH },
    };
  }
  return {
    model: 'gemini-4-hydrogen',
    thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
  };
}

async function createApp() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/chat', async (req, res) => {
    try {
      const body = req.body as {
        messages?: IncomingMessage[];
        chapterContext?: string;
        depth?: DepthMode;
      };

      const rawMessages = Array.isArray(body?.messages) ? body.messages : [];
      const validMessages = rawMessages.filter(
        (m) =>
          (m.role === 'user' || m.role === 'model') &&
          typeof m.text === 'string' &&
          m.text.trim().length > 0
      );

      if (validMessages.length === 0) {
        res.status(400).json({ error: 'Debes enviar al menos una pregunta.' });
        return;
      }

      const lastMessage = validMessages[validMessages.length - 1];
      if (lastMessage.role !== 'user') {
        res.status(400).json({ error: 'El último mensaje debe ser del usuario.' });
        return;
      }

      const depth: DepthMode =
        body.depth === 'deep' || body.depth === 'fast' ? body.depth : 'standard';
      const { model, thinkingConfig } = resolveModelConfig(depth);

      const contextBanner = body.chapterContext
        ? `\n\nContexto actual del estudiante en la plataforma: ${body.chapterContext}.`
        : '';

      const history: Content[] = validMessages.slice(0, -1).map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const ai = getAiClient();
      const chat = ai.chats.create({
        model,
        history,
        config: {
          systemInstruction: `${SYSTEM_INSTRUCTION}${contextBanner}`,
          ...(thinkingConfig ? { thinkingConfig } : {}),
        },
      });

      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');

      const stream = await chat.sendMessageStream({
        message: lastMessage.text,
      });

      for await (const chunk of stream) {
        const textChunk = chunk.text;
        if (textChunk) {
          res.write(`data: ${JSON.stringify({ text: textChunk })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error inesperado al consultar el tutor de física.';
      if (!res.headersSent) {
        res.status(500).json({ error: msg });
      } else {
        res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
        res.end();
      }
    }
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

createApp();
