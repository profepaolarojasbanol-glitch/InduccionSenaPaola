import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import reglamentoData from './data/reglamento.json';
import { 
  BookOpen, 
  UserCheck, 
  Building2, 
  MapPin, 
  Scale, 
  Award, 
  Bot, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ShieldAlert, 
  Send, 
  Sparkles, 
  GraduationCap, 
  FileText, 
  ChevronRight, 
  RotateCcw,
  Printer,
  BadgeCheck,
  Compass,
  Users,
  Target,
  Clock,
  Wifi,
  Briefcase,
  Video,
  Film,
  Download,
  Database,
  User,
  Search,
  BarChart3,
  Shield,
  Sun,
  Moon
} from 'lucide-react';

interface ProgramData {
  modalidad: string;
  centro: string;
  nivel: string;
  tipo: string;
}

interface ApprenticeData {
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  correo: string;
  regional: string;
  centro: string;
  programa: string;
  ficha: string;
}

interface CharacterizationForm {
  edad: string;
  genero: string;
  ubicacion: string;
  conectividad: string;
  dispositivo: string;
  estiloAprendizaje: string;
  expectativas: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'intro' | 'caracterizacion' | 'modulo1' | 'modulo2' | 'modulo3' | 'jsonModule' | 'registro' | 'evaluacion' | 'repositorio' | 'tutor' | 'admin'>('intro');
  const [darkMode, setDarkMode] = useState(false);
  
  // Apprentice Data & Repository state
  const [apprenticeData, setApprenticeData] = useState<ApprenticeData>({
    nombreCompleto: 'María Fernanda Torres Ríos',
    tipoDocumento: 'Cédula de Ciudadanía',
    numeroDocumento: '1012345678',
    correo: 'mftorres@sena.edu.co',
    regional: 'Regional Distrito Capital',
    centro: 'Centro de Servicios Financieros',
    programa: 'Tecnólogo en Gestión Financiera y Crediticia',
    ficha: '2976541'
  });
  const [apprenticeRegistered, setApprenticeRegistered] = useState(true);
  const [evaluationsRepository, setEvaluationsRepository] = useState<any[]>([]);
  const [evalRepoSearch, setEvalRepoSearch] = useState('');

  React.useEffect(() => {
    fetch('/api/evaluations')
      .then(res => res.json())
      .then(data => {
        if (data.evaluations) {
          setEvaluationsRepository(data.evaluations);
        }
      })
      .catch(err => {
        console.error('Error fetching evaluations:', err);
        const local = JSON.parse(localStorage.getItem('sena_evaluations') || '[]');
        if (local.length > 0) setEvaluationsRepository(local);
      });
  }, []);
  
  // Program Data state [DATOS_PROGRAMA]
  const [programData, setProgramData] = useState<ProgramData>({
    modalidad: 'Presencial',
    centro: 'Centro de Servicios Financieros',
    nivel: 'Tecnólogo en Gestión Financiera y Crediticia',
    tipo: 'Etapa Lectiva Inicial'
  });

  const [isEditingProgram, setIsEditingProgram] = useState(false);

  // Characterization state
  const [characterization, setCharacterization] = useState<CharacterizationForm>({
    edad: '18-25',
    genero: 'Femenino',
    ubicacion: 'Bogotá D.C.',
    conectividad: 'Fibra óptica / Banda ancha estable',
    dispositivo: 'Computador portátil personal',
    estiloAprendizaje: 'Visual y Práctico (Aprender haciendo)',
    expectativas: 'Adquirir competencias técnicas de alta calidad para insertarme exitosamente en el mercado laboral y emprender.'
  });
  const [characterizationSubmitted, setCharacterizationSubmitted] = useState(false);

  // Module 3 interactive case study state
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [caseAnswer, setCaseAnswer] = useState<string | null>(null);

  // JSON Module state
  const [jsonSearchQuery, setJsonSearchQuery] = useState('');
  const [selectedCapitulo, setSelectedCapitulo] = useState<number | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  // Evaluation Quiz state
  const [quizAnswers, setQuizAnswers] = useState<number[]>([-1, -1, -1, -1, -1]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // AI Tutor state
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', text: string}>>([
    { role: 'assistant', text: '¡Hola! Soy tu Tutor SENA virtual. Estoy aquí para resolver cualquier duda sobre tu inducción, el Acuerdo 009 de 2024, el conducto regular o tu formación profesional integral. ¿En qué te puedo colaborar hoy?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const getShuffledQuiz = () => {
    const questionBank = [
      {
        question: "¿Cuál es el principio fundamental que rige la Formación Profesional Integral en el SENA?",
        options: [
          "Aprender a memorizar normativas teóricas sin práctica.",
          "Aprender haciendo, desarrollando competencias técnicas y humanas para el trabajo.",
          "Asistir obligatoriamente a todas las conferencias magistrales sin evaluar proyectos.",
          "Obtener un título académico universitario tradicional."
        ],
        correct: 1,
        explanation: "El SENA se fundamenta en el 'Aprender haciendo', integrando el saber, el hacer y el ser."
      },
      {
        question: "Según el Acuerdo 009 de 2024, ¿cuál es una de las principales responsabilidades o deberes del aprendiz?",
        options: [
          "Ejecutar las decisiones administrativas de la Dirección General.",
          "Participar en las actividades de inducción y cumplir con las actividades formativas del programa.",
          "Pagar una matrícula mensual equivalente al salario mínimo.",
          "Trabajar exclusivamente en empresas multinacionales aliadas."
        ],
        correct: 1,
        explanation: "El aprendiz tiene el deber de participar activamente en su proceso formativo, cumpliendo con los cronogramas y actividades de aprendizaje."
      },
      {
        question: "Si un aprendiz tiene un desacuerdo con una calificación o nota de un instructor, ¿cuál es el primer paso del conducto regular?",
        options: [
          "Acudir directamente al Director Nacional del SENA.",
          "Presentar una queja en redes sociales institucionales.",
          "Dialogar directamente con el instructor que orienta la competencia para buscar una aclaración y concertación.",
          "Abandonar el programa de formación."
        ],
        correct: 2,
        explanation: "El conducto regular siempre inicia con el diálogo respetuoso y directo con el actor involucrado (el instructor)."
      },
      {
        question: "¿Qué es una medida formativa dentro del Reglamento del Aprendiz (Acuerdo 009 de 2024)?",
        options: [
          "Una expulsión inmediata sin derecho a descargos.",
          "Una acción de carácter pedagógico orientada a encauzar al aprendiz hacia el cumplimiento de sus deberes y mejora actitudinal o académica.",
          "Una multa económica impuesta por la tesorería del centro.",
          "Un castigo físico severo."
        ],
        correct: 1,
        explanation: "Las medidas formativas (como llamados de atención o planes de mejoramiento) tienen un carácter eminentemente pedagógico y correctivo formativo."
      },
      {
        question: "La cobertura del SENA a nivel nacional se organiza principalmente a través de:",
        options: [
          "Únicamente una sede central en Bogotá.",
          "Regionales y Centros de Formación Profesional ubicados en todo el territorio colombiano.",
          "Agencias internacionales en el exterior.",
          "Colegios de educación básica secundaria."
        ],
        correct: 1,
        explanation: "El SENA cuenta con una amplia presencia territorial mediante 33 Regionales y más de 117 Centros de Formación en todo el país."
      },
      {
        question: "¿Cómo se clasifican principalmente las faltas en el Reglamento del Aprendiz (Acuerdo 009 de 2024)?",
        options: [
          "Faltas leves, graves y gravísimas.",
          "Faltas académicas y faltas disciplinarias.",
          "Faltas internas y externas.",
          "Faltas administrativas y penales."
        ],
        correct: 1,
        explanation: "Las faltas según el Acuerdo 009 se clasifican en académicas (relacionadas con el proceso de aprendizaje) y disciplinarias (relacionadas con el comportamiento y convivencia)."
      },
      {
        question: "¿Cuál es el propósito de la Comisión de Evaluación y Promoción en el SENA?",
        options: [
          "Imponer sanciones económicas a los aprendices.",
          "Analizar el rendimiento académico de los aprendices y recomendar planes de mejoramiento o decisiones sobre la continuidad.",
          "Organizar eventos deportivos institucionales.",
          "Nombrar a los instructores de cada programa."
        ],
        correct: 1,
        explanation: "La Comisión de Evaluación y Promoción evalúa casos especiales de rendimiento académico y define acciones de apoyo pedagógico."
      },
      {
        question: "¿Qué tipo de estímulos e incentivos contempla el SENA para los aprendices con sobresaliente desempeño?",
        options: [
          "Vehículos institucionales y becas en el exterior sin requisitos.",
          "Designación como monitor, participación en pasantías nacionales/internacionales y reconocimientos especiales.",
          "Exoneración definitiva de presentar proyectos productivos.",
          "Exención de normas institucionales."
        ],
        correct: 1,
        explanation: "El SENA reconoce el mérito a través de monitorías, participación en eventos de investigación, pasantías y distinciones honoríficas."
      },
      {
        question: "¿Cuáles son los símbolos distintivos institucionales del SENA?",
        options: [
          "El himno, la bandera, el escudo y el logotipo que refleja la formación.",
          "Únicamente el escudo nacional.",
          "El lema comercial y el color corporativo.",
          "La tarjeta de identidad institucional."
        ],
        correct: 0,
        explanation: "Los símbolos del SENA incluyen el escudo, la bandera, el himno y el logotipo institucional que representa la Formación Profesional Integral."
      },
      {
        question: "Según el Acuerdo 009 de 2024, ¿qué implica el respeto por los bienes y recursos de la institución?",
        options: [
          "Utilizarlos únicamente para fines personales fuera del horario de clases.",
          "Cuidar, conservar y dar uso adecuado a los equipos, herramientas, talleres y plataformas tecnológicas del SENA.",
          "Considerarlos propiedad privada de los aprendices.",
          "Venderlos cuando finalice el programa de formación."
        ],
        correct: 1,
        explanation: "Es un deber fundamental del aprendiz velar por el buen uso y conservación de la infraestructura, equipos y recursos puestos a su disposición."
      }
    ];

    const shuffledQ = [...questionBank].sort(() => Math.random() - 0.5).slice(0, 5);
    return shuffledQ.map(q => {
      const indexedOptions = q.options.map((opt, idx) => ({ opt, isCorrect: idx === q.correct }));
      const shuffledOpts = [...indexedOptions].sort(() => Math.random() - 0.5);
      const newCorrect = shuffledOpts.findIndex(o => o.isCorrect);
      return {
        question: q.question,
        options: shuffledOpts.map(o => o.opt),
        correct: newCorrect,
        explanation: q.explanation
      };
    });
  };

  const [quizQuestions, setQuizQuestions] = useState(getShuffledQuiz);

  const handleQuizSubmit = async () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) {
        score += 20;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    const status = score >= 80 ? 'APROBADO' : 'REPROBADO';

    const evaluationRecord = {
      id: Date.now().toString(),
      aprendiz: apprenticeData,
      quizScore: score,
      quizAnswers,
      createdAt: new Date().toISOString(),
      status
    };

    try {
      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evaluationRecord)
      });
      const data = await res.json();
      if (data.evaluations) {
        setEvaluationsRepository(data.evaluations);
      }
    } catch (err) {
      console.error('Error saving evaluation to server:', err);
      const local = JSON.parse(localStorage.getItem('sena_evaluations') || '[]');
      const updated = [evaluationRecord, ...local];
      localStorage.setItem('sena_evaluations', JSON.stringify(updated));
      setEvaluationsRepository(updated);
    }

    if (score >= 80) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/ask-sena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          programData
        })
      });
      const data = await res.json();
      if (data.text) {
        setChatMessages(prev => [...prev, { role: 'assistant', text: data.text }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', text: 'Lo siento, no pude procesar tu consulta en este momento.' }]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'assistant', text: 'Error de conexión con el Tutor IA. Por favor, intenta de nuevo.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans flex flex-col transition-colors duration-300`}>
      {/* Top SENA Brand Header */}
      <header className="bg-[#00324D] text-white shadow-lg border-b-4 border-[#39A900]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-xl shadow-md flex items-center justify-center w-14 h-14">
              <img 
                src="data:image/svg+xml,%3c?xml%20version=%271.0%27%20encoding=%27utf-8%27?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2026.0.1,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3csvg%20version=%271.1%27%20id=%27Capa_1%27%20xmlns=%27http://www.w3.org/2000/svg%27%20xmlns:xlink=%27http://www.w3.org/1999/xlink%27%20x=%270px%27%20y=%270px%27%20viewBox=%270%200%201000%201000%27%20style=%27enable-background:new%200%200%201000%201000;%27%20xml:space=%27preserve%27%3e%3cstyle%20type=%27text/css%27%3e%20.st0{fill:%2339a900;}%20%3c/style%3e%3cpath%20id=%27path47-5%27%20class=%27st0%27%20d=%27M504.2,20.5c-58.3,0.1-105.6,47.4-105.5,105.8c0.1,58.3,47.4,105.6,105.7,105.6%20c58.3,0,105.6-47.3,105.6-105.7V126C609.9,67.6,562.6,20.4,504.2,20.5z%20M155.6,264.6c-18.6,0.1-37.5,1.1-55.2,5.6%20c-11.7,3-23,7.8-30.3,15.4c-9.2,9.5-10.4,22.3-5.9,33.3c4,9.7,14.8,16.9,26.8,21.1c25.9,8.9,54.6,10.7,81.8,16.3%20c5,1.2,10.6,2.6,13.7,6c3.2,4.1,1.3,9.7-4,12.2c-8.8,4.5-20.1,4.5-30.4,4.4c-9.4-0.4-19.7-1.2-27.2-5.9c-5.5-3.4-6.5-9.1-5.2-14.1%20l-60.6,0c-0.2,9.2,1.6,18.9,8.4,26.8c5.6,6.8,14.8,11.5,24.6,14.4c15.7,4.6,32.7,6,49.4,6.4c22.7,0.4,45.8-0.3,67.6-5.4%20c13-3.2,25.8-8.3,34.1-16.6c14.8-14.8,11.3-38.3-8.3-49.8c-9.8-5.7-21.5-9.2-33.4-11.5c-17.5-3.6-35.3-6.3-52.9-9.2%20c-6.2-1.2-12.8-2.3-18-5.2c-5.5-2.9-5.9-9.8-0.3-12.9c7.2-4.1,16.8-4,25.4-4c9.1,0.2,19,0.7,26.5,5c4.2,2.3,5.9,6.3,5.9,10.1%20l57.6-0.1c-0.2-7.3-1.6-14.9-6.9-21.2c-6.2-7.8-17.1-12.7-28.3-15.5C192.8,265.6,174.1,264.7,155.6,264.6L155.6,264.6z%20M280.6,268.9%20l0,137.7l168.1,0l0-30H342.3v-26.7h94.9v-29.3h-94.9l0-21.9l102.6,0l-0.1-29.7L280.6,268.9z%20M557.5,269c0,0-51.9,0-77.9,0l0,137.7%20l59,0l0-92.7l80.8,92.6l81,0.1l0-137.7l-59.1,0l0.1,92L557.5,269z%20M805.6,269.2c0,0-63.6,91.9-95.6,137.7l61.9,0l14.9-24.8h95.7%20l13.9,24.9l68.8,0L874,269.2L805.6,269.2z%20M836.6,302.1l29.4,49.9l-60.7,0.1L836.6,302.1z%20M10.6,445.6l0.5,75l280.1-1%20c14.3,3.1,22.6,12.4,19.7,33.5L138.6,854.7l56.1,52.5l266.9-461.6L10.6,445.6z%20M545.2,446.2l262.4,459.6l58-52.1L691.3,552.9%20c-2.9-21.2,5.4-30.6,19.7-33.7l280.2,1l-0.1-73.7L545.2,446.2z%20M500.9,522.3L254.8,944.7l65.4,31.9L484.4,699%20c5.7-4.6,11.4-7.1,17.1-7.3c6-0.2,12.2,2,18.3,6.8l163.8,278.4l67.4-35.2L500.9,522.3z%27/%3e%3cg%20id=%27_x23_000000ff-2%27%20transform=%27matrix(0.31570611,0,0,0.23560774,-391.49698,-10.601126)%27%3e%3c/g%3e%3c/svg%3e" 
                alt="SENA Logo" 
                className="w-13 h-13 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Inducción Interactiva SENA</h1>
              <p className="text-xs text-emerald-300 font-medium">Formación Profesional Integral y Apropiación del Acuerdo 009 de 2024</p>
            </div>
          </div>

          {/* Admin, Dark Mode & Program Config Pills */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 p-2.5 rounded-xl border border-slate-700 shadow transition-all flex items-center justify-center"
              title={darkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-amber-300" />}
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all border ${
                activeTab === 'admin' 
                  ? 'bg-[#39A900] text-white border-emerald-400 ring-2 ring-emerald-500/50' 
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-600'
              }`}
            >
              <Shield className="w-4 h-4" /> Panel Administrador & Analítica
            </button>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 flex items-center gap-3 text-sm">
              <GraduationCap className="w-5 h-5 text-[#39A900] shrink-0" />
              <div className="text-left">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Programa Actual</div>
                <div className="font-bold text-slate-100">{programData.nivel} en {programData.centro.split(',')[0]} ({programData.modalidad})</div>
              </div>
              <button 
                onClick={() => setIsEditingProgram(!isEditingProgram)}
                className="ml-2 text-xs bg-[#39A900] hover:bg-[#329600] text-white px-2.5 py-1 rounded-lg font-bold transition-colors"
              >
                {isEditingProgram ? 'Cerrar' : 'Configurar'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Program Config Modal / Drawer */}
      {isEditingProgram && (
        <div className="bg-slate-900 text-white border-b border-slate-800 py-4 px-4 shadow-inner animate-fadeIn">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Modalidad</label>
              <select 
                value={programData.modalidad}
                onChange={e => setProgramData({...programData, modalidad: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#39A900]"
              >
                <option value="Presencial">Presencial</option>
                <option value="Virtual">Virtual</option>
                <option value="A Distancia">A Distancia</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Nivel de Formación</label>
              <select 
                value={programData.nivel}
                onChange={e => setProgramData({...programData, nivel: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#39A900]"
              >
                <option value="Tecnólogo">Tecnólogo</option>
                <option value="Técnico">Técnico</option>
                <option value="Operario">Operario</option>
                <option value="Especialización Tecnológica">Especialización Tecnológica</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Centro de Formación</label>
              <input 
                type="text"
                value={programData.centro}
                onChange={e => setProgramData({...programData, centro: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#39A900]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar Tabs */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 py-2 min-w-max">
          <button
            onClick={() => setActiveTab('intro')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'intro' 
                ? 'bg-[#00324D] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-[#39A900]" />
            1. Ficha Técnica
          </button>
          
          <button
            onClick={() => setActiveTab('caracterizacion')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'caracterizacion' 
                ? 'bg-[#00324D] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-[#39A900]" />
            2. Caracterización
          </button>

          <button
            onClick={() => setActiveTab('modulo1')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'modulo1' 
                ? 'bg-[#00324D] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#39A900]" />
            3. Identidad SENA
          </button>

          <button
            onClick={() => setActiveTab('modulo2')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'modulo2' 
                ? 'bg-[#00324D] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#39A900]" />
            4. Presencia Territorial
          </button>

          <button
            onClick={() => setActiveTab('modulo3')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'modulo3' 
                ? 'bg-[#00324D] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Scale className="w-4 h-4 text-[#39A900]" />
            5. Acuerdo 009 de 2024
          </button>

          <button
            onClick={() => setActiveTab('jsonModule')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'jsonModule' 
                ? 'bg-[#00324D] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-[#39A900]" />
            6. Módulo JSON & Derechos
          </button>

          <button
            onClick={() => setActiveTab('registro')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'registro' 
                ? 'bg-[#00324D] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-[#39A900]" />
            7. Datos del Aprendiz
          </button>

          <button
            onClick={() => setActiveTab('evaluacion')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'evaluacion' 
                ? 'bg-[#00324D] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-[#39A900]" />
            8. Evaluación & Insignia
          </button>

          <button
            onClick={() => setActiveTab('repositorio')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'repositorio' 
                ? 'bg-[#00324D] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4 text-[#39A900]" />
            9. Repositorio Respuestas
          </button>

          <button
            onClick={() => setActiveTab('tutor')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all relative ${
              activeTab === 'tutor' 
                ? 'bg-[#00324D] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
            10. Tutor IA SENA
            <span className="absolute -top-1 -right-1 bg-[#39A900] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">IA</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'admin' 
                ? 'bg-[#00324D] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4 text-[#39A900]" />
            11. Panel Administrador
          </button>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        
        {/* TAB 1: INTRO / FICHA TÉCNICA */}
        {activeTab === 'intro' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-gradient-to-br from-[#00324D] to-[#001f30] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-96 h-96 bg-[#39A900]/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="max-w-3xl relative z-10">
                <span className="bg-[#39A900] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                  Diseño Instruccional Senior • SENA
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                  Propuesta Pedagógica y Estructural: Herramienta de Inducción SENA
                </h2>
                <p className="text-slate-200 text-lg leading-relaxed mb-6">
                  Bienvenido a la plataforma oficial de ambientación y apropiación institucional. Diseñada bajo los más altos estándares pedagógicos de la Formación Profesional Integral (FPI) y rigurosamente alineada con el <strong className="text-[#39A900]">Acuerdo 009 de 2024</strong> (Reglamento del Aprendiz).
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setActiveTab('caracterizacion')}
                    className="bg-[#39A900] hover:bg-[#329600] text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2"
                  >
                    Iniciar Ruta de Aprendizaje <ArrowRight className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('tutor')}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl backdrop-blur-md transition-all flex items-center gap-2 border border-white/20"
                  >
                    Consultar Tutor IA <Bot className="w-5 h-5 text-emerald-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Ficha Técnica Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <a 
                    href="https://youtu.be/B3b7T6-h8i4" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-emerald-50 text-[#39A900] hover:bg-[#39A900] hover:text-white rounded-xl flex items-center justify-center font-bold mb-4 transition-colors"
                    title="Ver video de inducción en YouTube"
                  >
                    <Film className="w-6 h-6" />
                  </a>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">1. Definición de la Herramienta</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Plataforma web interactiva gamificada de microaprendizaje (Microlearning) diseñada para facilitar la ambientación de nuevos aprendices, asegurando la apropiación de derechos, deberes y cultura organizacional.
                  </p>
                </div>
                <div className="text-xs font-semibold text-[#39A900] bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                  Objetivo: Reducir la deserción temprana y fortalecer el sentido de pertenencia institucional.
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center font-bold mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Público Objetivo y Alcance</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Nuevos aprendices matriculados en programas de nivel <strong className="text-slate-800">{programData.nivel}</strong> bajo la modalidad <strong className="text-slate-800">{programData.modalidad}</strong> en el <strong className="text-slate-800">{programData.centro}</strong>.
                  </p>
                </div>
                <div className="text-xs font-semibold text-sky-700 bg-sky-50 p-2.5 rounded-lg border border-sky-100">
                  Enfoque inclusivo, accesible y adaptado a múltiples dispositivos.
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold mb-4">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Estructura Curricular</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Compuesta por 3 módulos nucleares: Identidad Institucional, Presencia Territorial y Marco Normativo (Acuerdo 009 de 2024), con simulaciones prácticas y evaluación certificable.
                  </p>
                </div>
                <div className="text-xs font-semibold text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                  Duración estimada: 10 horas de inducción autónoma y guiada.
                </div>
              </div>
            </div>


          </div>
        )}

        {/* TAB 2: CARACTERIZACIÓN DEL APRENDIZ */}
        {activeTab === 'caracterizacion' && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6 animate-fadeIn">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-[#39A900] uppercase tracking-wider">Paso 2 de la Inducción</span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Ruta de Caracterización del Aprendiz</h2>
              <p className="text-slate-600 text-sm mt-1">
                Este instrumento inicial de diagnóstico nos permite conocer tu perfil sociodemográfico, canales de acceso a conectividad, estilos de aprendizaje y expectativas formativas para ofrecerte el mejor acompañamiento.
              </p>
            </div>

            {characterizationSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-4">
                <div className="w-16 h-16 bg-[#39A900] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <BadgeCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-950">¡Caracterización Registrada Exitosamente!</h3>
                <p className="text-emerald-800 text-sm max-w-xl mx-auto">
                  Tus datos han sido procesados por el sistema pedagógico. Tu perfil ha sido adaptado para garantizar una experiencia formativa exitosa en tu programa de nivel <strong className="text-emerald-950">{programData.nivel}</strong>.
                </p>
                <button
                  onClick={() => setCharacterizationSubmitted(false)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors"
                >
                  Modificar Respuestas
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setCharacterizationSubmitted(true); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Rango de Edad</label>
                    <select
                      value={characterization.edad}
                      onChange={e => setCharacterization({...characterization, edad: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#39A900]"
                    >
                      <option value="Menor de 18 años">Menor de 18 años</option>
                      <option value="18-25">18 a 25 años</option>
                      <option value="26-35">26 a 35 años</option>
                      <option value="Más de 35 años">Más de 35 años</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Ubicación Actual (Ciudad / Municipio)</label>
                    <input
                      type="text"
                      value={characterization.ubicacion}
                      onChange={e => setCharacterization({...characterization, ubicacion: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#39A900]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Canal de Acceso a Conectividad</label>
                    <select
                      value={characterization.conectividad}
                      onChange={e => setCharacterization({...characterization, conectividad: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#39A900]"
                    >
                      <option value="Fibra óptica / Banda ancha estable">Fibra óptica / Banda ancha estable</option>
                      <option value="Internet móvil (Datos celulares)">Internet móvil (Datos celulares)</option>
                      <option value="Conexión limitada / Puntos Vive Digital">Conexión limitada / Puntos Vive Digital</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Dispositivo Principal de Estudio</label>
                    <select
                      value={characterization.dispositivo}
                      onChange={e => setCharacterization({...characterization, dispositivo: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#39A900]"
                    >
                      <option value="Computador portátil personal">Computador portátil personal</option>
                      <option value="Computador de escritorio">Computador de escritorio</option>
                      <option value="Teléfono inteligente (Smartphone)">Teléfono inteligente (Smartphone)</option>
                      <option value="Tablet o dispositivo compartido">Tablet o dispositivo compartido</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Estilo de Aprendizaje Preferido</label>
                    <select
                      value={characterization.estiloAprendizaje}
                      onChange={e => setCharacterization({...characterization, estiloAprendizaje: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#39A900]"
                    >
                      <option value="Visual y Práctico (Aprender haciendo)">Visual y Práctico (Aprender haciendo - Enfoque SENA)</option>
                      <option value="Auditivo y Conceptual (Lecturas y explicaciones)">Auditivo y Conceptual (Lecturas y conferencias)</option>
                      <option value="Kinestésico y Colaborativo (Trabajo en equipo y talleres)">Kinestésico y Colaborativo (Trabajo en equipo)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Expectativas frente al Programa de Formación</label>
                    <textarea
                      rows={3}
                      value={characterization.expectativas}
                      onChange={e => setCharacterization({...characterization, expectativas: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#39A900]"
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    className="bg-[#39A900] hover:bg-[#329600] text-white font-bold px-8 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    Guardar y Continuar al Módulo 1 <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: MÓDULO 1 - IDENTIDAD INSTITUCIONAL */}
        {activeTab === 'modulo1' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <span className="text-xs font-bold text-[#39A900] uppercase tracking-wider">Módulo 1 de 3</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Identidad Institucional SENA</h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                El Servicio Nacional de Aprendizaje (SENA) es un establecimiento público de orden nacional adscrito al Ministerio del Trabajo, encargado de cumplir la función que le corresponde al Estado de invertir en el desarrollo social y técnico de los trabajadores colombianos.
              </p>
            </div>

            {/* History & Impact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="w-12 h-12 bg-emerald-50 text-[#39A900] rounded-xl flex items-center justify-center font-bold">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Historia y Creación</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Fundado el <strong className="text-slate-900">21 de junio de 1957</strong> bajo el Decreto 118 de ese año, impulsado por el mendocino Rodolfo Martínez Tono junto a obreros, empresarios, la Iglesia Católica y la OIT. Nació con el propósito de proporcionar formación profesional a los trabajadores colombianos para impulsar la industria, el comercio y el agro.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center font-bold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Misión y Visión</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  <strong className="text-slate-900">Misión:</strong> El SENA está encargado de cumplir la función que corresponde al Estado de invertir en el desarrollo social y técnico de los trabajadores colombianos, ofreciendo y ejecutando la formación profesional integral.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  <strong className="text-slate-900">Visión:</strong> Ser una organización de clase mundial en formación profesional integral y en el uso de la ciencia, tecnología e innovación, comprometida con el desarrollo económico y social de Colombia.
                </p>
              </div>
            </div>



            {/* Símbolos SENA */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Símbolos Patrios e Institucionales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 flex flex-col items-center text-center">
                  <img src="https://www.sena.edu.co/assets/escudo-CKAC4aSg.png" alt="Escudo SENA" className="w-16 h-16 object-contain my-1" />
                  <div className="font-bold text-[#00324D] text-lg">El Escudo</div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Refleja los tres sectores económicos en los que opera la acción del SENA: el piñón (industria), el caduceo (comercio y servicios) y el café (agricultura).
                  </p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 flex flex-col items-center text-center">
                  <img src="https://www.cursosvirtualessena.com.co/wp-content/uploads/2020/09/significado-de-la-bandera-del-sena.jpg" alt="Bandera SENA" className="w-16 h-16 object-contain my-1 rounded-lg" />
                  <div className="font-bold text-[#00324D] text-lg">La Bandera</div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    De fondo blanco, en el centro lleva el escudo de la institución. Representa la paz, la tranquilidad y la pulcritud que deben reinar en la labor formativa.
                  </p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-bold text-[#00324D] text-lg">El Himno</div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Letra compuesta por Luis Alfredo Sarmiento y música por Daniel Marroquín. Exalta la juventud colombiana, el trabajo creador y la grandeza de la patria.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('modulo2')}
                className="bg-[#39A900] hover:bg-[#329600] text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                Continuar al Módulo 2: Presencia Territorial <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: MÓDULO 2 - PRESENCIA TERRITORIAL */}
        {activeTab === 'modulo2' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <span className="text-xs font-bold text-[#39A900] uppercase tracking-wider">Módulo 2 de 3</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Presencia Territorial (Regionales SENA)</h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                El SENA tiene cobertura en el 100% del territorio nacional a través de sus 33 Regionales y más de 117 Centros de Formación Profesional, garantizando acceso democrático a la educación y el empleo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <div className="w-10 h-10 bg-emerald-50 text-[#39A900] rounded-xl flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">33 Regionales</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Presentes en cada departamento del país y en el Distrito Capital de Bogotá, articulando políticas regionales de empleo y competitividad.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Centros de Formación</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Espacios dotados con talleres, laboratorios y ambientes especializados para que desarrolles tus competencias técnicas reales. Tu centro actual es: <strong className="text-slate-900">{programData.centro}</strong>.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
                  <Wifi className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Modalidades de Atención</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Operamos en modalidades <strong className="text-slate-900">Presencial</strong>, <strong className="text-slate-900">Virtual</strong> (a través de LMS Sofia Plus / Territorium) y <strong className="text-slate-900">A Distancia</strong> con encuentros programados.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Canales de Atención Institucional</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Línea Gratuita Nacional</div>
                  <div className="text-slate-600">01 8000 910 270</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Plataforma SOFIA Plus</div>
                  <div className="text-slate-600">oferta.senasofiaplus.edu.co</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Atención Ciudadana Bogotá</div>
                  <div className="text-slate-600">(601) 592 5555</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('modulo3')}
                className="bg-[#39A900] hover:bg-[#329600] text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                Continuar al Módulo 3: Marco Normativo (Acuerdo 009 de 2024) <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: MÓDULO 3 - ACUERDO 009 DE 2024 */}
        {activeTab === 'modulo3' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <span className="text-xs font-bold text-[#39A900] uppercase tracking-wider">Módulo 3 de 3 • Núcleo Normativo</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Reglamento del Aprendiz SENA (Acuerdo 009 de 2024)</h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                El Reglamento del Aprendiz es el marco normativo que regula los derechos, deberes, prohibiciones, faltas y procedimientos disciplinarios y formativos durante tu tránsito por el SENA.
              </p>
            </div>

            {/* Derechos vs Deberes Table */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Tabla Comparativa: Derechos Esenciales vs. Deberes del Aprendiz</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#00324D] text-white text-sm">
                      <th className="p-4 rounded-tl-xl">Derechos Esenciales del Aprendiz</th>
                      <th className="p-4 rounded-tr-xl">Deberes y Responsabilidades</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 text-slate-700">Recibir inducción integral actualizada sobre el programa y la institución.</td>
                      <td className="p-4 text-slate-700">Cumplir con las actividades de inducción y las fases de tu programa formativo.</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 text-slate-700">Disponer de ambientes de formación dotados con recursos didácticos y tecnológicos.</td>
                      <td className="p-4 text-slate-700">Hacer uso adecuado y racional de los equipos, herramientas e instalaciones del SENA.</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 text-slate-700">Ser tratado con respeto, dignidad e inclusión sin discriminación alguna.</td>
                      <td className="p-4 text-slate-700">Tratar con respeto a instructores, compañeros, administrativos y personal de la comunidad.</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 text-slate-700">Recibir evaluación objetiva, oportuna y transparente de tus competencias.</td>
                      <td className="p-4 text-slate-700">Participar puntualmente en las evaluaciones y entregar evidencias de aprendizaje a tiempo.</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 text-slate-700">Hacer uso del conducto regular para presentar peticiones, recursos o reclamos.</td>
                      <td className="p-4 text-slate-700">Observar rigurosamente el conducto regular establecido institucionalmente.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Faltas, Medidas Formativas y Conducto Regular */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Faltas y Medidas Formativas</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Las faltas pueden ser de carácter <strong className="text-slate-900">académico</strong> (incumplimiento de evidencias o inasistencia injustificada) o <strong className="text-slate-900">disciplinario</strong> (comportamiento contrario a la convivencia).
                </p>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-xs text-amber-900 space-y-1">
                  <div className="font-bold">Escala de Medidas Formativas:</div>
                  <div>1. Llamado de atención verbal.</div>
                  <div>2. Plan de mejoramiento académico o disciplinario.</div>
                  <div>3. Llamado de atención escrito.</div>
                  <div>4. Condicionamiento de matrícula.</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="w-10 h-10 bg-emerald-50 text-[#39A900] rounded-xl flex items-center justify-center font-bold">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Conducto Regular Institucional</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Para resolver cualquier solicitud, reclamación o conflicto, debes seguir estrictamente los siguientes niveles de jerarquía pedagógica:
                </p>
                <div className="space-y-2 text-xs font-semibold text-slate-700">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span>1. Instructor del área / competencia</span>
                    <span className="text-[#39A900] font-bold">Paso Inicial</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span>2. Coordinador Académico del Centro</span>
                    <span>Segundo Nivel</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span>3. Comité de Evaluación y Mediación</span>
                    <span>Tercer Nivel</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span>4. Subdirector del Centro de Formación</span>
                    <span>Instancia Final</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Simulation / Case Study */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Simulador de Casos: ¿Qué harías según el Acuerdo 009 de 2024?</h3>
              <p className="text-slate-600 text-sm">
                Selecciona un caso práctico para poner a prueba tu conocimiento normativo:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => { setSelectedCase(1); setCaseAnswer(null); }}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedCase === 1 ? 'border-[#39A900] bg-emerald-50/50 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900 mb-2">Caso 1: Inasistencia injustificada a sesiones</div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Un aprendiz lleva 3 días consecutivos sin asistir ni reportar excusa médica válida a sus sesiones de formación presencial...
                  </p>
                </div>

                <div 
                  onClick={() => { setSelectedCase(2); setCaseAnswer(null); }}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedCase === 2 ? 'border-[#39A900] bg-emerald-50/50 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900 mb-2">Caso 2: Inconformidad con nota de evidencia</div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Un aprendiz considera que su evidencia de producto fue calificada injustamente como 'No Aprobada' por su instructor técnico...
                  </p>
                </div>
              </div>

              {selectedCase === 1 && (
                <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4 animate-fadeIn">
                  <div className="font-bold text-emerald-400 text-sm">Análisis Normativo - Caso 1 (Inasistencia):</div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Según el Acuerdo 009 de 2024, la inasistencia injustificada constituye una falta académica. El procedimiento inicia con un llamado de atención verbal por parte del instructor y, de persistir, se suscribe un plan de mejoramiento académico. Si se supera el límite de inasistencias injustificadas reglamentarias, se remite al Comité de Evaluación y Mediación.
                  </p>
                </div>
              )}

              {selectedCase === 2 && (
                <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4 animate-fadeIn">
                  <div className="font-bold text-emerald-400 text-sm">Análisis Normativo - Caso 2 (Inconformidad de Nota):</div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    El aprendiz debe aplicar estrictamente el conducto regular: dialogar primero con el instructor que orientó la competencia en un plazo prudencial para solicitar retroalimentación y revisión de la evidencia. Si no hay acuerdo, se eleva solicitud por escrito al Coordinador Académico.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('jsonModule')}
                className="bg-[#39A900] hover:bg-[#329600] text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                Continuar al Módulo 6: Módulo JSON & Derechos <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: MÓDULO JSON & DERECHOS INTERACTIVOS */}
        {activeTab === 'jsonModule' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-4">
              <span className="text-xs font-bold text-[#39A900] uppercase tracking-wider">Módulo 6 de 8 • Estructura JSON y Derechos</span>
              <h2 className="text-3xl font-extrabold text-slate-900">Conversión a Formato JSON y Explorador de Derechos</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Este módulo presenta la conversión completa del Reglamento del Aprendiz (<strong className="text-slate-900">Acuerdo 009 de 2024</strong>) en un dataset estructurado en formato JSON, permitiendo a los aprendices interactuar con sus derechos, deberes y normativas.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(reglamentoData, null, 2));
                    setCopiedJson(true);
                    setTimeout(() => setCopiedJson(false), 2500);
                  }}
                  className="bg-[#00324D] hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <FileText className="w-4 h-4 text-[#39A900]" />
                  {copiedJson ? '¡JSON Copiado al Portapapeles!' : 'Copiar Dataset JSON'}
                </button>
                <a
                  href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(reglamentoData, null, 2))}`}
                  download="acuerdo_009_2024_sena.json"
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-emerald-200 transition-all"
                >
                  <Download className="w-4 h-4 text-[#39A900]" />
                  Descargar Archivo .JSON
                </a>
              </div>
            </div>

            {/* Interactive Search & Chapters Explorer */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="text-xl font-bold text-slate-900">Explorador Interactivo del Dataset JSON</h3>
                <div className="w-full md:w-72">
                  <input
                    type="text"
                    placeholder="Buscar derecho, deber o norma..."
                    value={jsonSearchQuery}
                    onChange={e => setJsonSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#39A900]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chapters List */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Capítulos del Reglamento</div>
                  {reglamentoData.capitulos.map((cap) => (
                    <div
                      key={cap.id}
                      onClick={() => setSelectedCapitulo(cap.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedCapitulo === cap.id
                          ? 'border-[#39A900] bg-emerald-50/70 shadow-sm'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs font-bold text-[#39A900]">Capítulo {cap.id}</div>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">{cap.nombre}</div>
                      <div className="text-xs text-slate-600 mt-1 line-clamp-2">{cap.descripcion}</div>
                    </div>
                  ))}
                  <div
                    onClick={() => setSelectedCapitulo(null)}
                    className={`p-3 rounded-xl border text-center cursor-pointer text-xs font-bold ${
                      selectedCapitulo === null ? 'bg-[#00324D] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Ver Todo el Dataset
                  </div>
                </div>

                {/* Elements Details */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Elementos Normativos Interactivos</div>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {reglamentoData.capitulos
                      .filter(cap => selectedCapitulo === null || cap.id === selectedCapitulo)
                      .flatMap(cap => cap.elementos.map(el => ({ ...el, capNombre: cap.nombre })))
                      .filter(el => {
                        if (!jsonSearchQuery.trim()) return true;
                        const q = jsonSearchQuery.toLowerCase();
                        const itemAny = el as any;
                        return (
                          el.titulo.toLowerCase().includes(q) ||
                          (itemAny.desc && itemAny.desc.toLowerCase().includes(q)) ||
                          (itemAny.detalle && itemAny.detalle.toLowerCase().includes(q)) ||
                          el.capNombre.toLowerCase().includes(q)
                        );
                      })
                      .map((item, idx) => {
                        const itemAny = item as any;
                        return (
                          <div key={idx} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2 hover:border-[#39A900] transition-all">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold bg-[#00324D] text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {itemAny.tipo || 'Norma SENA'}
                              </span>
                              <span className="text-xs text-slate-400 font-semibold">{item.capNombre}</span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-base">{item.titulo}</h4>
                            <p className="text-slate-600 text-xs leading-relaxed">{itemAny.desc || itemAny.detalle}</p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>



            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('registro')}
                className="bg-[#39A900] hover:bg-[#329600] text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                Continuar al Módulo 7: Datos del Aprendiz <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 7: DATOS BÁSICOS DEL APRENDIZ (REGISTRO) */}
        {activeTab === 'registro' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-4">
              <span className="text-xs font-bold text-[#39A900] uppercase tracking-wider">Módulo 7 de 10 • Perfil y Datos Básicos</span>
              <h2 className="text-3xl font-extrabold text-slate-900">Registro de Datos Básicos del Aprendiz</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Para garantizar la trazabilidad institucional y el almacenamiento seguro de tus respuestas en el repositorio de evaluaciones del SENA, por favor verifica y confirma tus datos básicos.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Nombre Completo del Aprendiz</label>
                  <input
                    type="text"
                    value={apprenticeData.nombreCompleto}
                    onChange={e => setApprenticeData({...apprenticeData, nombreCompleto: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#39A900]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tipo de Documento</label>
                  <select
                    value={apprenticeData.tipoDocumento}
                    onChange={e => setApprenticeData({...apprenticeData, tipoDocumento: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#39A900]"
                  >
                    <option value="Cédula de Ciudadanía">Cédula de Ciudadanía (CC)</option>
                    <option value="Tarjeta de Identidad">Tarjeta de Identidad (TI)</option>
                    <option value="Cédula de Extranjería">Cédula de Extranjería (CE)</option>
                    <option value="Permiso por Protección Temporal">Permiso por Protección Temporal (PPT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Número de Documento</label>
                  <input
                    type="text"
                    value={apprenticeData.numeroDocumento}
                    onChange={e => setApprenticeData({...apprenticeData, numeroDocumento: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#39A900]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Correo Electrónico Institucional</label>
                  <input
                    type="email"
                    value={apprenticeData.correo}
                    onChange={e => setApprenticeData({...apprenticeData, correo: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#39A900]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Regional SENA</label>
                  <input
                    type="text"
                    value={apprenticeData.regional}
                    onChange={e => setApprenticeData({...apprenticeData, regional: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#39A900]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Centro de Formación</label>
                  <input
                    type="text"
                    value={apprenticeData.centro}
                    onChange={e => setApprenticeData({...apprenticeData, centro: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#39A900]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Programa de Formación</label>
                  <input
                    type="text"
                    value={apprenticeData.programa}
                    onChange={e => setApprenticeData({...apprenticeData, programa: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#39A900]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Número de Ficha</label>
                  <input
                    type="text"
                    value={apprenticeData.ficha}
                    onChange={e => setApprenticeData({...apprenticeData, ficha: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#39A900]"
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-between items-center">
                <button
                  onClick={() => setActiveTab('jsonModule')}
                  className="text-slate-600 hover:text-slate-900 font-bold text-sm"
                >
                  ← Volver al Módulo JSON
                </button>
                <button
                  onClick={() => {
                    setApprenticeRegistered(true);
                    setActiveTab('evaluacion');
                  }}
                  className="bg-[#39A900] hover:bg-[#329600] text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  Guardar Datos y Continuar a la Evaluación <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: REPOSITORIO DE EVALUACIONES */}
        {activeTab === 'repositorio' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs font-bold text-[#39A900] uppercase tracking-wider">Módulo 9 de 10 • Repositorio Institucional</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Repositorio de Respuestas y Evaluaciones</h2>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                    Registro centralizado de todas las evaluaciones presentadas por los aprendices, almacenadas en el servidor y sincronizadas con el repositorio.
                  </p>
                </div>
                <div className="flex gap-3">
                  <a
                    href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(evaluationsRepository, null, 2))}`}
                    download="repositorio_evaluaciones_sena.json"
                    className="bg-[#00324D] hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow transition-all"
                  >
                    <Download className="w-4 h-4 text-[#39A900]" /> Exportar Repositorio JSON
                  </a>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-[#39A900] rounded-xl flex items-center justify-center font-bold text-lg">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold uppercase">Total Evaluaciones</div>
                    <div className="text-2xl font-extrabold text-slate-900">{evaluationsRepository.length}</div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-[#00324D] rounded-xl flex items-center justify-center font-bold text-lg">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold uppercase">Aprobados (≥80%)</div>
                    <div className="text-2xl font-extrabold text-slate-900">
                      {evaluationsRepository.filter(e => e.quizScore >= 80).length}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold text-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold uppercase">Promedio Puntaje</div>
                    <div className="text-2xl font-extrabold text-slate-900">
                      {evaluationsRepository.length > 0 
                        ? Math.round(evaluationsRepository.reduce((acc, curr) => acc + curr.quizScore, 0) / evaluationsRepository.length) 
                        : 0}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="pt-2">
                <div className="relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre del aprendiz, número de documento o programa..."
                    value={evalRepoSearch}
                    onChange={e => setEvalRepoSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#39A900]"
                  />
                </div>
              </div>
            </div>

            {/* Evaluations List Table / Cards */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-extrabold text-slate-900 text-base">Registros Almacenados en el Repositorio</h3>
                <span className="text-xs text-slate-500 font-semibold">Mostrando {evaluationsRepository.filter(e => {
                  if (!evalRepoSearch.trim()) return true;
                  const q = evalRepoSearch.toLowerCase();
                  return (
                    e.aprendiz?.nombreCompleto?.toLowerCase().includes(q) ||
                    e.aprendiz?.numeroDocumento?.toLowerCase().includes(q) ||
                    e.aprendiz?.programa?.toLowerCase().includes(q) ||
                    e.aprendiz?.centro?.toLowerCase().includes(q)
                  );
                }).length} registros</span>
              </div>

              <div className="divide-y divide-slate-100">
                {evaluationsRepository.filter(e => {
                  if (!evalRepoSearch.trim()) return true;
                  const q = evalRepoSearch.toLowerCase();
                  return (
                    e.aprendiz?.nombreCompleto?.toLowerCase().includes(q) ||
                    e.aprendiz?.numeroDocumento?.toLowerCase().includes(q) ||
                    e.aprendiz?.programa?.toLowerCase().includes(q) ||
                    e.aprendiz?.centro?.toLowerCase().includes(q)
                  );
                }).length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-sm">
                    No se encontraron evaluaciones registradas que coincidan con la búsqueda.
                  </div>
                ) : (
                  evaluationsRepository.filter(e => {
                    if (!evalRepoSearch.trim()) return true;
                    const q = evalRepoSearch.toLowerCase();
                    return (
                      e.aprendiz?.nombreCompleto?.toLowerCase().includes(q) ||
                      e.aprendiz?.numeroDocumento?.toLowerCase().includes(q) ||
                      e.aprendiz?.programa?.toLowerCase().includes(q) ||
                      e.aprendiz?.centro?.toLowerCase().includes(q)
                    );
                  }).map((item, index) => (
                    <div key={item.id || index} className="p-6 hover:bg-slate-50/80 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-slate-900 text-base">{item.aprendiz?.nombreCompleto || 'Aprendiz SENA'}</span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                            item.status === 'APROBADO' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status || (item.quizScore >= 80 ? 'APROBADO' : 'REPROBADO')}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                          <span><strong>Documento:</strong> {item.aprendiz?.tipoDocumento} {item.aprendiz?.numeroDocumento}</span>
                          <span><strong>Correo:</strong> {item.aprendiz?.correo}</span>
                          <span><strong>Ficha:</strong> {item.aprendiz?.ficha}</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          <strong>Programa:</strong> {item.aprendiz?.programa} • {item.aprendiz?.centro}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Fecha: {new Date(item.createdAt || Date.now()).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-white shadow-xs ${
                          item.quizScore >= 80 ? 'bg-[#39A900]' : 'bg-amber-600'
                        }`}>
                          <span className="text-lg leading-none">{item.quizScore}%</span>
                          <span className="text-[9px] uppercase tracking-wider font-semibold mt-0.5">Puntaje</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setActiveTab('evaluacion')}
                className="bg-[#00324D] hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm"
              >
                Volver a la Evaluación <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 8: EVALUACIÓN Y CERTIFICACIÓN */}
        {activeTab === 'evaluacion' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <span className="text-xs font-bold text-[#39A900] uppercase tracking-wider">Paso Final de la Inducción</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Evaluación de Validación y Certificación</h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Demuestra lo aprendido respondiendo este cuestionario de validación institucional. Para superar la inducción y obtener tu insignia digital, debes alcanzar un puntaje mínimo del 80%.
              </p>
            </div>

            {quizSubmitted ? (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center space-y-6 animate-fadeIn">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg text-white text-2xl font-black ${
                  quizScore >= 80 ? 'bg-[#39A900]' : 'bg-amber-600'
                }`}>
                  {quizScore}%
                </div>
                
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {quizScore >= 80 ? '¡Felicitaciones! Has Superado la Inducción SENA' : 'Has completado la evaluación, pero requieres 80% o más'}
                </h3>
                
                <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
                  {quizScore >= 80 
                    ? 'Has demostrado una excelente apropiación de los principios institucionales, la identidad SENA y el Reglamento del Aprendiz (Acuerdo 009 de 2024).'
                    : 'Te invitamos a repasar los módulos anteriores y reintentar la evaluación para asegurar la apropiación de los conceptos fundamentales.'}
                </p>

                {quizScore >= 80 && (
                  <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl max-w-2xl mx-auto space-y-4 text-left shadow-inner relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-emerald-200/50">
                      <Award className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-lg">
                        <BadgeCheck className="w-6 h-6 text-[#39A900]" /> Certificado de Inducción SENA
                      </div>
                      <div className="text-xs text-emerald-800 space-y-1">
                        <div><strong className="text-emerald-950">Aprendiz:</strong> {apprenticeData.nombreCompleto} ({apprenticeData.tipoDocumento} {apprenticeData.numeroDocumento})</div>
                        <div><strong className="text-emerald-950">Programa:</strong> {apprenticeData.programa} - {apprenticeData.centro}</div>
                        <div><strong className="text-emerald-950">Ficha:</strong> {apprenticeData.ficha}</div>
                        <div><strong className="text-emerald-950">Fecha de Aprobación:</strong> {new Date().toLocaleDateString()}</div>
                        <div><strong className="text-emerald-950">Estado:</strong> APROBADO (Acuerdo 009 de 2024)</div>
                      </div>
                      <div className="pt-2 flex gap-3">
                        <button 
                          onClick={() => window.print()} 
                          className="bg-[#00324D] hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow"
                        >
                          <Printer className="w-4 h-4" /> Imprimir / Guardar Certificado
                        </button>
                        <button
                          onClick={() => setActiveTab('repositorio')}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow"
                        >
                          <Database className="w-4 h-4" /> Ver en Repositorio
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-4 pt-4">
                  <button
                    onClick={() => { 
                      setQuizSubmitted(false); 
                      setQuizAnswers([-1,-1,-1,-1,-1]); 
                      setQuizQuestions(getShuffledQuiz()); 
                    }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Reintentar Evaluación
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-8">
                {quizQuestions.map((q, qIndex) => (
                  <div key={qIndex} className="space-y-3 border-b border-slate-100 pb-6 last:border-b-0">
                    <div className="font-bold text-slate-900 text-base">
                      {qIndex + 1}. {q.question}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {q.options.map((opt, optIndex) => (
                        <label 
                          key={optIndex} 
                          className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all text-sm ${
                            quizAnswers[qIndex] === optIndex 
                              ? 'border-[#39A900] bg-emerald-50/60 font-semibold text-slate-900 shadow-xs' 
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name={`question-${qIndex}`}
                            checked={quizAnswers[qIndex] === optIndex}
                            onChange={() => {
                              const newAns = [...quizAnswers];
                              newAns[qIndex] = optIndex;
                              setQuizAnswers(newAns);
                            }}
                            className="mt-0.5 text-[#39A900] focus:ring-[#39A900]"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleQuizSubmit}
                    disabled={quizAnswers.includes(-1)}
                    className={`font-bold px-8 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 ${
                      quizAnswers.includes(-1)
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-[#39A900] hover:bg-[#329600] text-white'
                    }`}
                  >
                    Enviar y Certificar Inducción <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: TUTOR IA SENA */}
        {activeTab === 'tutor' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[650px] animate-fadeIn">
            {/* Tutor Header */}
            <div className="bg-[#00324D] text-white p-5 flex items-center justify-between border-b-4 border-[#39A900]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#39A900] rounded-xl flex items-center justify-center text-white shadow-md">
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Tutor IA SENA (Asesor Pedagógico)</h3>
                  <p className="text-xs text-emerald-300">Entrenado en el Acuerdo 009 de 2024 y Formación Profesional Integral</p>
                </div>
              </div>
              <div className="text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 font-semibold text-emerald-400">
                Modelo: Gemini 3.8 Flash (Server-Side)
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xl rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-xs ${
                    msg.role === 'user' 
                      ? 'bg-[#00324D] text-white rounded-br-xs' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">
                      {msg.role === 'user' ? 'Tú (Aprendiz)' : 'Tutor IA SENA'}
                    </div>
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-600 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm shadow-xs flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-[#39A900] border-t-transparent rounded-full animate-spin"></div>
                    <span>El Tutor IA está consultando la normativa y redactando su respuesta...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-3 items-center">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Pregúntale al Tutor sobre el Acuerdo 009 de 2024, faltas, conducto regular o tu programa..."
                className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#39A900]"
                disabled={chatLoading}
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className={`px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all shadow-md ${
                  chatLoading || !chatInput.trim() 
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-[#39A900] hover:bg-[#329600]'
                }`}
              >
                <Send className="w-4 h-4" /> Enviar
              </button>
            </form>
          </div>
        )}

        {/* TAB 11: PANEL DE ADMINISTRADOR & ANALÍTICA */}
        {activeTab === 'admin' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Admin Header Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#39A900] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Panel de Control Gerencial</span>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full border border-slate-200">Acceso Administrador</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-2">Analítica Institucional y Respuestas de Aprendices</h2>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                  Monitoreo en tiempo real del progreso de la inducción, métricas de rendimiento, tasas de aprobación y auditoría de las evaluaciones registradas.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <a
                  href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(evaluationsRepository, null, 2))}`}
                  download="analitica_evaluaciones_sena.json"
                  className="bg-[#00324D] hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow transition-all"
                >
                  <Download className="w-4 h-4 text-[#39A900]" /> Exportar Datos (JSON)
                </a>
              </div>
            </div>

            {/* Analytics Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-50 text-[#39A900] rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs border border-emerald-100">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Evaluados</div>
                  <div className="text-3xl font-black text-slate-900 mt-0.5">{evaluationsRepository.length}</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 text-[#00324D] rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs border border-blue-100">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Aprobados (≥80%)</div>
                  <div className="text-3xl font-black text-slate-900 mt-0.5">
                    {evaluationsRepository.filter(e => (e.quizScore || 0) >= 80).length}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs border border-amber-100">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Promedio General</div>
                  <div className="text-3xl font-black text-slate-900 mt-0.5">
                    {evaluationsRepository.length > 0 
                      ? Math.round(evaluationsRepository.reduce((acc, curr) => acc + (curr.quizScore || 0), 0) / evaluationsRepository.length) 
                      : 0}%
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-50 text-purple-700 rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs border border-purple-100">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tasa de Éxito</div>
                  <div className="text-3xl font-black text-slate-900 mt-0.5">
                    {evaluationsRepository.length > 0
                      ? Math.round((evaluationsRepository.filter(e => (e.quizScore || 0) >= 80).length / evaluationsRepository.length) * 100)
                      : 0}%
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analytics Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4 lg:col-span-1">
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#39A900]" /> Distribución de Estados
                </h3>
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Aprobados (≥80%)</span>
                      <span>{evaluationsRepository.filter(e => (e.quizScore || 0) >= 80).length} aprendices</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#39A900] h-full transition-all"
                        style={{ width: `${evaluationsRepository.length > 0 ? (evaluationsRepository.filter(e => (e.quizScore || 0) >= 80).length / evaluationsRepository.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Reprobados (&lt;80%)</span>
                      <span>{evaluationsRepository.filter(e => (e.quizScore || 0) < 80).length} aprendices</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-600 h-full transition-all"
                        style={{ width: `${evaluationsRepository.length > 0 ? (evaluationsRepository.filter(e => (e.quizScore || 0) < 80).length / evaluationsRepository.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-900 space-y-1">
                  <div className="font-bold">💡 Nota de Auditoría SENA:</div>
                  <p>Las evaluaciones cumplen con los estándares de validación institucional del Acuerdo 009 de 2024 para la certificación digital de la inducción.</p>
                </div>
              </div>

              {/* Evaluations Repository & Response Inspector */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2 flex flex-col">
                <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Auditoría de Respuestas de Aprendices</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Listado completo con detalles de puntaje y respuestas individuales</p>
                  </div>
                  <div className="w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Filtrar por aprendiz o documento..."
                      value={evalRepoSearch}
                      onChange={e => setEvalRepoSearch(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#39A900]"
                    />
                  </div>
                </div>

                <div className="divide-y divide-slate-100 overflow-y-auto max-h-[500px]">
                  {evaluationsRepository.filter(e => {
                    if (!evalRepoSearch.trim()) return true;
                    const q = evalRepoSearch.toLowerCase();
                    return (
                      e.aprendiz?.nombreCompleto?.toLowerCase().includes(q) ||
                      e.aprendiz?.numeroDocumento?.toLowerCase().includes(q) ||
                      e.aprendiz?.programa?.toLowerCase().includes(q) ||
                      e.aprendiz?.centro?.toLowerCase().includes(q)
                    );
                  }).length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-sm">
                      No hay registros de evaluaciones en este momento.
                    </div>
                  ) : (
                    evaluationsRepository.filter(e => {
                      if (!evalRepoSearch.trim()) return true;
                      const q = evalRepoSearch.toLowerCase();
                      return (
                        e.aprendiz?.nombreCompleto?.toLowerCase().includes(q) ||
                        e.aprendiz?.numeroDocumento?.toLowerCase().includes(q) ||
                        e.aprendiz?.programa?.toLowerCase().includes(q) ||
                        e.aprendiz?.centro?.toLowerCase().includes(q)
                      );
                    }).map((item, index) => (
                      <div key={item.id || index} className="p-6 hover:bg-slate-50/80 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-slate-900 text-sm">{item.aprendiz?.nombreCompleto || 'Aprendiz SENA'}</span>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                              item.status === 'APROBADO' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {item.status || (item.quizScore >= 80 ? 'APROBADO' : 'REPROBADO')}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                            <span><strong>Documento:</strong> {item.aprendiz?.tipoDocumento} {item.aprendiz?.numeroDocumento}</span>
                            <span><strong>Ficha:</strong> {item.aprendiz?.ficha}</span>
                          </div>
                          <div className="text-xs text-slate-500">
                            <strong>Programa:</strong> {item.aprendiz?.programa} • {item.aprendiz?.centro}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Fecha: {new Date(item.createdAt || Date.now()).toLocaleString()} | Respuestas enviadas: {JSON.stringify(item.quizAnswers)}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-white shadow-xs ${
                            item.quizScore >= 80 ? 'bg-[#39A900]' : 'bg-amber-600'
                          }`}>
                            <span className="text-base leading-none">{item.quizScore}%</span>
                            <span className="text-[9px] uppercase tracking-wider font-semibold mt-0.5">Puntaje</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#00324D] text-white py-6 mt-12 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold">Servicio Nacional de Aprendizaje - SENA • Dirección de Formación Profesional</p>
          <p className="text-slate-400">Plataforma de Inducción Interactiva basada estrictamente en el Acuerdo 009 de 2024.</p>
        </div>
      </footer>
    </div>
  );
}
