import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini API client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Evaluation repository in-memory
  let evaluationsRepository: any[] = [
    {
      id: '1727184000000',
      aprendiz: {
        nombreCompleto: 'Laura Sofía Gómez Martínez',
        tipoDocumento: 'Cédula de Ciudadanía',
        numeroDocumento: '1023456789',
        correo: 'lauras.gomez@sena.edu.co',
        regional: 'Regional Distrito Capital',
        centro: 'Centro de Servicios Financieros',
        programa: 'Tecnólogo en Gestión Financiera y Crediticia',
        ficha: '2976541'
      },
      quizScore: 100,
      quizAnswers: [1, 1, 2, 1, 1],
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      status: 'APROBADO'
    },
    {
      id: '1727187600000',
      aprendiz: {
        nombreCompleto: 'Carlos Andrés Pérez Ruiz',
        tipoDocumento: 'Tarjeta de Identidad',
        numeroDocumento: '1098765432',
        correo: 'carlos.perezr@sena.edu.co',
        regional: 'Regional Antioquia',
        centro: 'Centro de Servicios y Gestión Empresarial',
        programa: 'Tecnólogo en Análisis y Desarrollo de Software',
        ficha: '2895412'
      },
      quizScore: 80,
      quizAnswers: [1, 1, 2, 1, 0],
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      status: 'APROBADO'
    }
  ];

  app.get('/api/evaluations', (req, res) => {
    res.json({ evaluations: evaluationsRepository });
  });

  app.post('/api/evaluations', (req, res) => {
    try {
      const evaluation = req.body;
      evaluation.id = evaluation.id || Date.now().toString();
      evaluation.createdAt = evaluation.createdAt || new Date().toISOString();
      evaluationsRepository.unshift(evaluation);
      res.json({ success: true, evaluation, evaluations: evaluationsRepository });
    } catch (error: any) {
      console.error('Error saving evaluation:', error);
      res.status(500).json({ error: error.message || 'Error al guardar la evaluación' });
    }
  });

  // API endpoint for SENA Tutor AI
  app.post('/api/ask-sena', async (req, res) => {
    try {
      const { prompt, programData } = req.body;
      
      const systemInstruction = `Eres "Tutor SENA", un Asesor Pedagógico e Instructor SENA experto en el Reglamento del Aprendiz (Acuerdo 009 de 2024), historia institucional, formación profesional integral, rutas de aprendizaje y desarrollo humano. 
Tu tono es formal pero empático, motivador, institucional y profundamente claro. Respondes con precisión normativa cuando se trata del Acuerdo 009 de 2024 (derechos, deberes, faltas, medidas formativas, conducto regular), y con calidez pedagógica cuando se trata de orientación formativa.
Contexto del programa actual del aprendiz: Modalidad: ${programData?.modalidad || 'Presencial'}, Centro: ${programData?.centro || 'Centro de Formación'}, Nivel: ${programData?.nivel || 'Tecnólogo'}, Tipo: ${programData?.tipo || 'Etapa Lectiva Inicial'}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text || 'No se pudo generar respuesta en este momento.' });
    } catch (error: any) {
      console.error('Error in /api/ask-sena:', error);
      res.status(500).json({ error: error.message || 'Error al comunicarse con el Tutor SENA.' });
    }
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
