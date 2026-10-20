import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  AlertTriangle, 
  Lightbulb, 
  Download, 
  Check, 
  Maximize2, 
  X, 
  Copy, 
  Scale, 
  Flame, 
  Wind, 
  ShieldCheck 
} from 'lucide-react';

export interface ExplainabilityData {
  title: string;
  physicsPrinciple: string;
  regulatoryThreshold: string;
  decisionImpact: string;
  recommendedAction?: string;
  defaultExpanded?: boolean;
  onExportImage?: () => void;
  onExportCSV?: () => void;
  exportImageLabel?: string;
  exportCSVLabel?: string;
}

export const ExplainabilityCard: React.FC<ExplainabilityData> = ({
  title,
  physicsPrinciple,
  regulatoryThreshold,
  decisionImpact,
  recommendedAction,
  defaultExpanded = false,
  onExportImage,
  onExportCSV,
  exportImageLabel = 'Grabar Figura HD',
  exportCSVLabel = 'Grabar Tabla CSV',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const triggerExport = (type: 'image' | 'csv') => {
    if (type === 'image' && onExportImage) {
      onExportImage();
      setDownloadSuccess('image');
      setTimeout(() => setDownloadSuccess(null), 2000);
    } else if (type === 'csv' && onExportCSV) {
      onExportCSV();
      setDownloadSuccess('csv');
      setTimeout(() => setDownloadSuccess(null), 2000);
    }
  };

  const handleCopyFullText = () => {
    const fullText = `INTERPRETABILIDAD & EXPLICABILIDAD CIENTÍFICA: ${title}
---------------------------------------------------------------
1. MECANISMO FÍSICO / CFD:
${physicsPrinciple}

2. UMBRAL NORMATIVO / OMS:
${regulatoryThreshold}

3. CRITERIO DE DECISIÓN URBANÍSTICA:
${decisionImpact}

${recommendedAction ? `DICTAMEN TÉCNICO:\n${recommendedAction}` : ''}
`;
    navigator.clipboard.writeText(fullText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <>
      {/* Inline Collapsible Card */}
      <div className="rounded-xl border border-emerald-900/50 bg-slate-950/80 shadow-md text-xs transition-all overflow-hidden">
        {/* Header Bar */}
        <div className="px-3.5 py-2.5 bg-slate-900/95 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Toggle Button & Title (Responsive, sin cortes) */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-start sm:items-center gap-2 text-left font-semibold text-slate-200 hover:text-emerald-300 transition-colors cursor-pointer group flex-1"
          >
            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 border border-emerald-500/30 shrink-0 mt-0.5 sm:mt-0">
              <BookOpen className="w-3.5 h-3.5" />
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-mono font-bold whitespace-nowrap">
                Explicabilidad & Interpretabilidad:
              </span>
              <span className="text-slate-100 font-medium text-xs break-words">
                {title}
              </span>
            </div>
            <span className="ml-auto sm:ml-1 text-slate-400 p-0.5">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </span>
          </button>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-800/60 w-full sm:w-auto justify-end">
            {/* Modal Fullscreen Reader Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-sky-700 text-slate-300 hover:text-white text-[10px] font-medium border border-slate-700 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              title="Abrir en ventana amplia / Modo Lectura completa"
            >
              <Maximize2 className="w-3 h-3 text-sky-400" />
              <span>Ampliar</span>
            </button>

            {onExportImage && (
              <button
                onClick={() => triggerExport('image')}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-emerald-700 text-slate-200 hover:text-white text-[10px] font-medium border border-slate-700 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                title="Descargar figura en ultra-alta resolución (PNG 4K)"
              >
                {downloadSuccess === 'image' ? (
                  <Check className="w-3 h-3 text-emerald-300" />
                ) : (
                  <Download className="w-3 h-3 text-sky-400" />
                )}
                <span>{downloadSuccess === 'image' ? '¡Grabado!' : exportImageLabel}</span>
              </button>
            )}

            {onExportCSV && (
              <button
                onClick={() => triggerExport('csv')}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-emerald-700 text-slate-200 hover:text-white text-[10px] font-medium border border-slate-700 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                title="Descargar datos tabulares en formato CSV para Excel"
              >
                {downloadSuccess === 'csv' ? (
                  <Check className="w-3 h-3 text-emerald-300" />
                ) : (
                  <Download className="w-3 h-3 text-emerald-400" />
                )}
                <span>{downloadSuccess === 'csv' ? '¡Grabado!' : exportCSVLabel}</span>
              </button>
            )}
          </div>
        </div>

        {/* Expandable Content (Texto completo, responsive y con scroll si necesario) */}
        {isExpanded && (
          <div className="p-3.5 sm:p-4 space-y-3 bg-slate-900/50 text-slate-300 leading-relaxed text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* 1. Underlying Physics */}
              <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    🔬 Mecanismo Físico / CFD
                  </span>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed break-words">
                    {physicsPrinciple}
                  </p>
                </div>
              </div>

              {/* 2. Regulatory Thresholds */}
              <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    ⚖️ Umbral Normativo / OMS
                  </span>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed break-words">
                    {regulatoryThreshold}
                  </p>
                </div>
              </div>

              {/* 3. Decision-making Takeaway */}
              <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    💡 Criterio de Decisión
                  </span>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed break-words">
                    {decisionImpact}
                  </p>
                </div>
              </div>
            </div>

            {recommendedAction && (
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-200 text-xs flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed break-words">
                  <strong className="text-emerald-300">Dictamen Técnico:</strong> {recommendedAction}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL MODO LECTURA COMPLETA (Para leer el 100% del texto sin restricciones de espacio) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Modo Lectura • Interpretabilidad Científica
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 font-display">
                    {title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyFullText}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copiar texto completo al portapapeles"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Copiado' : 'Copiar'}</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Cerrar ventana"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body with Full Responsive Text */}
            <div className="p-5 md:p-6 overflow-y-auto space-y-4 text-slate-200 text-xs md:text-sm leading-relaxed">
              {/* Bloque 1: Física */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-mono font-bold text-sky-400 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  🔬 1. Mecanismo Físico y Dinámica de Fluidos (CFD)
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {physicsPrinciple}
                </p>
              </div>

              {/* Bloque 2: Normativa */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-mono font-bold text-amber-400 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  ⚖️ 2. Umbrales Normativos y Estándares de Salud Pública (OMS)
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {regulatoryThreshold}
                </p>
              </div>

              {/* Bloque 3: Toma de Decisiones */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-mono font-bold text-emerald-400 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  💡 3. Criterio de Decisión e Impacto en Planificación
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {decisionImpact}
                </p>
              </div>

              {recommendedAction && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 space-y-1.5 text-emerald-200">
                  <h4 className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4" /> Dictamen & Prescripción Técnica:
                  </h4>
                  <p className="leading-relaxed">
                    {recommendedAction}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer with Action Exports */}
            <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                Validado con microfísica urbana (CFD RANS k-ε + Directivas OMS).
              </span>
              <div className="flex items-center gap-2">
                {onExportImage && (
                  <button
                    onClick={() => {
                      triggerExport('image');
                      setIsModalOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{exportImageLabel}</span>
                  </button>
                )}
                {onExportCSV && (
                  <button
                    onClick={() => {
                      triggerExport('csv');
                      setIsModalOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{exportCSVLabel}</span>
                  </button>
                )}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs cursor-pointer border border-slate-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
