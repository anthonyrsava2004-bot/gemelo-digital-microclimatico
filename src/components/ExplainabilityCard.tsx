import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, AlertTriangle, Lightbulb, Download, Check } from 'lucide-react';

export interface ExplainabilityData {
  title: string;
  physicsPrinciple: string;
  regulatoryThreshold: string;
  decisionImpact: string;
  recommendedAction?: string;
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
  onExportImage,
  onExportCSV,
  exportImageLabel = 'Grabar Figura HD',
  exportCSVLabel = 'Grabar Tabla CSV',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

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

  return (
    <div className="rounded-xl border border-emerald-900/40 bg-slate-950/70 overflow-hidden shadow-md text-xs transition-all">
      {/* Header Bar */}
      <div className="px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-left font-semibold text-slate-200 hover:text-emerald-300 transition-colors cursor-pointer group"
        >
          <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 border border-emerald-500/30">
            <BookOpen className="w-3.5 h-3.5" />
          </span>
          <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-mono font-bold">
            Interpretabilidad & Explicabilidad:
          </span>
          <span className="text-slate-100 font-medium text-xs truncate max-w-[280px] sm:max-w-md">
            {title}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-1.5">
          {onExportImage && (
            <button
              onClick={() => triggerExport('image')}
              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-emerald-700 text-slate-200 hover:text-white text-[10px] font-medium border border-slate-700 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              title="Descargar figura en ultra-alta resolución (PNG/4K)"
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

      {/* Expandable Body */}
      {isExpanded && (
        <div className="p-3.5 space-y-2.5 bg-slate-900/40 text-slate-300 leading-relaxed text-[11px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Underlying Physics */}
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                🔬 Mecanismo Físico / CFD
              </span>
              <p className="text-slate-300 text-[11px]">
                {physicsPrinciple}
              </p>
            </div>

            {/* 2. Regulatory Thresholds */}
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                ⚖️ Umbral Normativo / OMS
              </span>
              <p className="text-slate-300 text-[11px]">
                {regulatoryThreshold}
              </p>
            </div>

            {/* 3. Decision-making Takeaway */}
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                💡 Criterio de Decisión
              </span>
              <p className="text-slate-300 text-[11px]">
                {decisionImpact}
              </p>
            </div>
          </div>

          {recommendedAction && (
            <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-200 text-[11px] flex items-start gap-1.5">
              <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Dictamen Técnico:</strong> {recommendedAction}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
