import React from 'react';
import { AppMode, SimulationMetrics } from '../types';
import { 
  Layers, 
  Presentation, 
  Building2, 
  Bot, 
  Sparkles, 
  Leaf, 
  Activity, 
  Thermometer, 
  RotateCcw,
  FileText
} from 'lucide-react';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  metrics: SimulationMetrics;
  placedNbSCount: number;
  onResetScenario: () => void;
  onOpenReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  metrics,
  placedNbSCount,
  onResetScenario,
  onOpenReport,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
      {/* Brand / Logo */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-900/30 flex items-center justify-center">
          <Leaf className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-extrabold text-slate-100 font-display tracking-tight">
              AeroTwin <span className="text-emerald-400 font-normal">| Naturaleza Urbana</span>
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hidden sm:inline-block">
              Gemelo Digital Microescala
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Simulación de Calidad del Aire (PM2.5, NO2), Islas de Calor & Soluciones NbS
          </p>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => onSelectMode('digital_twin')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            currentMode === 'digital_twin'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Gemelo Digital</span>
        </button>

        <button
          onClick={() => onSelectMode('presentation')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            currentMode === 'presentation'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Presentation className="w-3.5 h-3.5" />
          <span>Presentación</span>
        </button>

        <button
          onClick={() => onSelectMode('case_studies')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            currentMode === 'case_studies'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Casos de Estudio</span>
        </button>

        <button
          onClick={() => onSelectMode('ai_assistant')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            currentMode === 'ai_assistant'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
              : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Consultor IA</span>
        </button>
      </nav>

      {/* Quick Summary Pill & Actions */}
      <div className="flex items-center gap-2">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <Activity className="w-3 h-3" /> -{metrics.pm25ReductionPercent}% PM2.5
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1 text-sky-400 font-bold">
            <Thermometer className="w-3 h-3" /> -{metrics.tempReduction}°C
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">
            {placedNbSCount} NbS
          </span>
        </div>

        {/* Dedicated Prominent Consultor IA (Langflow) Button */}
        <button
          onClick={() => onSelectMode('ai_assistant')}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 border border-emerald-400/40 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          title="Abrir Agente Auditor NbS (Langflow)"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
          <span>Consultor IA</span>
          <span className="text-[10px] bg-slate-950/60 px-1.5 py-0.5 rounded text-emerald-300 font-mono border border-emerald-500/30">
            Langflow
          </span>
        </button>

        <button
          onClick={onOpenReport}
          className="px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-750 flex items-center gap-1.5 transition-colors"
          title="Generar Dictamen Técnico"
        >
          <FileText className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Dictamen</span>
        </button>

        <button
          onClick={onResetScenario}
          className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-750 transition-colors"
          title="Restablecer valores por defecto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
