import React, { useState, useRef, useEffect } from 'react';
import { UrbanCanyonConfig, AmbientMeteorology, PlacedNbS, SimulationMetrics } from '../types';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  RefreshCw, 
  X, 
  CheckCircle2, 
  Leaf, 
  AlertTriangle,
  Activity,
  Check,
  Copy,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';

interface AIConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  canyon: UrbanCanyonConfig;
  meteo: AmbientMeteorology;
  placedNbS: PlacedNbS[];
  metrics: SimulationMetrics;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIConsultantModal: React.FC<AIConsultantModalProps> = ({
  isOpen,
  onClose,
  canyon,
  meteo,
  placedNbS,
  metrics,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: `Hola, soy el **Agente Auditor NbS**, tu consultor de inteligencia artificial conectado en tiempo real al **Gemelo Digital Microclimático** mediante **Langflow**.

He cargado la geometría actual de tu cañón urbano (Ancho: **${canyon.canyonWidth}m**, Relación H/W: **${canyon.aspectRatioHW}**), las condiciones de viento incidente (**${meteo.windSpeedRoof} m/s**) y las **${placedNbS.length} Soluciones Basadas en la Naturaleza (NbS)** activas.

¿Qué aspecto te gustaría auditar o qué recomendación técnica necesitas hoy?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    '¿Qué especies maximizan la sombra sin atrapar el NO2?',
    'Optimizar con $12,000 de presupuesto',
    'Auditar efecto trampa en este cañón',
    'Evaluar impacto en receptores sensibles (escuela y hospital)',
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        text: `Chat reiniciado. Estoy listo para una nueva auditoría con la configuración actual del Gemelo Digital (${canyon.canyonWidth}m ancho, ${placedNbS.length} NbS activas).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const extractResponseText = (data: any): string => {
    if (!data) return "No se recibió respuesta del agente.";

    // Langflow run endpoint standard output: data.outputs[0].outputs[0].results.message.data.text
    const mainOutput = data?.outputs?.[0]?.outputs?.[0];
    if (mainOutput?.results?.message?.data?.text) {
      return mainOutput.results.message.data.text;
    }
    if (typeof mainOutput?.results?.message?.text === 'string') {
      return mainOutput.results.message.text;
    }
    if (mainOutput?.artifacts?.message) {
      return typeof mainOutput.artifacts.message === 'string'
        ? mainOutput.artifacts.message
        : JSON.stringify(mainOutput.artifacts.message);
    }
    if (mainOutput?.messages?.[0]?.message) {
      return mainOutput.messages[0].message;
    }

    if (data?.analysis) return data.analysis;
    if (typeof data === 'string') return data;

    return JSON.stringify(data, null, 2);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = textToSend.trim();
    const newMsgId = `msg-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      {
        id: newMsgId,
        role: 'user',
        text: userMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputQuery('');
    setIsLoading(true);

    // Empaquetar estado completo de la simulación del Gemelo Digital con la pregunta
    const nbsSummary = placedNbS.length > 0
      ? placedNbS.map((n, i) => `#${i + 1} Tipo: ${n.type} | Ubicación: ${n.locationType} | Edad: ${n.ageYears} años | Altura: ${n.heightMeters || 4}m`).join('; ')
      : 'Ninguna intervención colocada (Escenario Base Degradado)';

    const compiledInputValue = `[CONSULTA DEL USUARIO]:
${userMsg}

[ESTADO ACTUAL DEL GEMELO DIGITAL (SIMULACIÓN MICROCLIMÁTICA A MICROESCALA)]:
- Geometría del Cañón Urbano: Ancho W = ${canyon.canyonWidth}m | Altura Edificio Izq = ${canyon.buildingHeightLeft}m | Altura Edificio Der = ${canyon.buildingHeightRight}m | Relación de Aspecto H/W = ${canyon.aspectRatioHW}
- Tráfico Vehicular: ${canyon.trafficVolume} vehículos/hora (fuente de emisión de NO2 y PM2.5 a cota 0m)
- Meteorología Ambiental: Viento en Azotea = ${meteo.windSpeedRoof} m/s | Dirección = ${meteo.windDirectionDeg}° | Temp. Ambiente = ${meteo.ambientTemp}°C | Radiación Solar = ${meteo.solarRadiation} W/m²
- Intervenciones NbS Desplegadas (${placedNbS.length}):
  ${nbsSummary}
- Resultados Dinámicos de Fluidos y Calidad del Aire:
  * Exposición PM2.5 Promedio: Actual ${metrics.currentAvgPM25} µg/m³ vs. Base ${metrics.baselineAvgPM25} µg/m³ (Reducción: -${metrics.pm25ReductionPercent}%)
  * Alivio Térmico Peatonal: -${metrics.tempReduction}°C
  * Categoría de Confort Térmico UTCI: ${metrics.utciThermalComfortCategory}
  * Retención Anual SUDS: ${metrics.stormwaterRetainedAnnualM3} m³ de agua pluvial
  * Ahorro Sanitario Estimado: +${metrics.avoidedHealthCostAnnualEur.toLocaleString()} €/año

Por favor, actúa como el Agente Auditor NbS experto en CFD y biofísica urbana. Entrega tu análisis estructurado con [DIAGNÓSTICO BIOFÍSICO], [ALERTAS DE DISEÑO] y [DICTAMEN / RECOMENDACIONES TÉCNICAS].`;

    try {
      const res = await fetch('/api/langflow/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputValue: compiledInputValue,
        }),
      });

      const responsePayload = await res.json();

      if (responsePayload.success && responsePayload.data) {
        const agentText = extractResponseText(responsePayload.data);
        setMessages((prev) => [
          ...prev,
          {
            id: `reply-${Date.now()}`,
            role: 'assistant',
            text: agentText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        // En caso de que Langflow devuelva error, informar con detalle amigable
        const errorDetail = responsePayload.error || 'Error al procesar con el Agente de Langflow.';
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            text: `⚠️ **Aviso de Conexión**: No se pudo completar la respuesta con el Agente Langflow.\n\n*Detalle*: ${errorDetail}\n\nVerifica que la instancia de Langflow esté activa en \`http://127.0.0.1:7860\` y que el flujo esté publicado.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err: any) {
      console.error('Error comunicando con Langflow:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: `⚠️ **Error de Red**: No se pudo contactar con el servidor local del Gemelo Digital en \`/api/langflow/run\`.\n\n*Motivo*: ${err.message || 'Error desconocido'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizador estructurado de Markdown y secciones de auditoría
  const renderMessageContent = (text: string) => {
    const paragraphs = text.split('\n\n');

    return (
      <div className="space-y-3">
        {paragraphs.map((p, idx) => {
          const trimmed = p.trim();
          if (!trimmed) return null;

          // Sección de ALERTAS
          if (
            trimmed.includes('[ALERTAS DE DISEÑO]') ||
            trimmed.includes('**[ALERTAS DE DISEÑO]:**') ||
            trimmed.startsWith('⚠️')
          ) {
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs shadow-sm space-y-1.5"
              >
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>ALERTAS DE DISEÑO & RIESGO MICROCLIMÁTICO</span>
                </div>
                <div className="leading-relaxed whitespace-pre-line text-slate-200">
                  {trimmed
                    .replace(/\*\*\[ALERTAS DE DISEÑO\]:\*\*/g, '')
                    .replace(/\[ALERTAS DE DISEÑO\]:?/g, '')
                    .trim()}
                </div>
              </div>
            );
          }

          // Sección de DIAGNÓSTICO BIOFÍSICO
          if (
            trimmed.includes('[DIAGNÓSTICO BIOFÍSICO]') ||
            trimmed.includes('**[DIAGNÓSTICO BIOFÍSICO]:**')
          ) {
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-600/40 text-emerald-200 text-xs shadow-sm space-y-1.5"
              >
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>DIAGNÓSTICO BIOFÍSICO & CFD</span>
                </div>
                <div className="leading-relaxed whitespace-pre-line text-slate-200">
                  {trimmed
                    .replace(/\*\*\[DIAGNÓSTICO BIOFÍSICO\]:\*\*/g, '')
                    .replace(/\[DIAGNÓSTICO BIOFÍSICO\]:?/g, '')
                    .trim()}
                </div>
              </div>
            );
          }

          // Sección de DICTAMEN / RECOMENDACIONES
          if (
            trimmed.includes('[DICTAMEN') ||
            trimmed.includes('[RECOMENDACIONES') ||
            trimmed.includes('**[DICTAMEN')
          ) {
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-600/40 text-sky-200 text-xs shadow-sm space-y-1.5"
              >
                <div className="flex items-center gap-2 font-bold text-sky-300">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>DICTAMEN Y RECOMENDACIONES TÉCNICAS</span>
                </div>
                <div className="leading-relaxed whitespace-pre-line text-slate-200">
                  {trimmed
                    .replace(/\*\*\[DICTAMEN.*?\]:\*\*/g, '')
                    .replace(/\[DICTAMEN.*?\]:?/g, '')
                    .trim()}
                </div>
              </div>
            );
          }

          // Títulos Markdown
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-emerald-300 text-sm mt-2 border-b border-slate-800 pb-1">
                {trimmed.replace('### ', '')}
              </h4>
            );
          }
          if (trimmed.startsWith('#### ')) {
            return (
              <h5 key={idx} className="font-semibold text-slate-100 text-xs mt-1.5">
                {trimmed.replace('#### ', '')}
              </h5>
            );
          }

          // Párrafos normales
          return (
            <p key={idx} className="text-slate-200 text-xs leading-relaxed whitespace-pre-line">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 rounded-3xl border border-slate-750 shadow-2xl flex flex-col h-[88vh] overflow-hidden">
        {/* Header Modal */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-600 text-white shadow-lg shadow-emerald-950/50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-100 font-display flex items-center gap-2">
                  Agente Auditor NbS
                </h3>
                <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Langflow Conectado
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 hidden sm:inline-block">
                  Flow: 5948dff7
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Auditoría en tiempo real de aerodinámica de cañón urbano, dispersión de PM2.5/NO2 y optimización de especies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClearChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Limpiar conversación"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <a
              href="http://localhost:7860"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors hidden sm:block"
              title="Abrir editor de Langflow en nueva pestaña"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Simulation Context Badge Banner */}
        <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 overflow-x-auto gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1 text-slate-300">
              <span className="font-semibold text-emerald-400">Cañón H/W:</span> {canyon.aspectRatioHW} ({canyon.canyonWidth}m)
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="font-semibold text-emerald-400">Viento:</span> {meteo.windSpeedRoof} m/s ({meteo.windDirectionDeg}°)
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="font-semibold text-emerald-400">NbS Activas:</span> {placedNbS.length}
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="font-semibold text-emerald-400">Reducción PM2.5:</span> -{metrics.pm25ReductionPercent}%
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400/80 shrink-0">
            Sincronizado con Gemelo Digital
          </span>
        </div>

        {/* Chat Message List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-950 to-teal-900 border border-emerald-700/60 text-emerald-400 shrink-0 mt-0.5 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-[88%] text-xs leading-relaxed relative group shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                    : 'bg-slate-950/80 text-slate-200 border border-slate-800/90'
                }`}
              >
                {/* Message Header info & copy button */}
                <div className="flex items-center justify-between gap-3 mb-2 border-b border-white/10 pb-1.5 text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-300 flex items-center gap-1">
                    {msg.role === 'user' ? 'Consulta del Urbanista' : 'Agente Auditor NbS (Langflow)'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="opacity-60 group-hover:opacity-100 hover:text-white p-0.5 transition-opacity"
                      title="Copiar texto"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Render Formatted Content */}
                {renderMessageContent(msg.text)}
              </div>

              {msg.role === 'user' && (
                <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 shrink-0 mt-0.5 shadow-md">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-emerald-400 p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-800/50 w-fit shadow-lg animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              <div className="flex flex-col">
                <span className="font-bold">Ejecutando Agente Auditor en Langflow...</span>
                <span className="text-[10px] text-slate-400">
                  Procesando matriz CFD, balance de calor y formulando dictamen botánico
                </span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2.5 bg-slate-950/70 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
          <span className="text-slate-400 shrink-0 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Sugerencias rápidas:
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-emerald-950/80 text-slate-300 hover:text-emerald-300 border border-slate-700/80 hover:border-emerald-700/60 whitespace-nowrap transition-all text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center gap-2.5">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pregunta al Agente Auditor sobre especies, relación H/W, ventilación o presupuesto..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-750 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isLoading}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold transition-all shadow-lg shadow-emerald-950/50 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            title="Enviar consulta a Langflow"
          >
            <span className="hidden sm:inline text-xs font-semibold">Consultar</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

