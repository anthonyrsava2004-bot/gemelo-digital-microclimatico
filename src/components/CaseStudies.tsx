import React from 'react';
import { CaseStudyPreset } from '../types';
import { CASE_STUDY_PRESETS } from '../data/mockData';
import { 
  Building2, 
  GraduationCap, 
  Sun, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Wind, 
  Thermometer, 
  Sparkles,
  MapPin
} from 'lucide-react';

interface CaseStudiesProps {
  onSelectPreset: (preset: CaseStudyPreset) => void;
  activePresetId?: string;
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ onSelectPreset, activePresetId }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl border border-slate-800 p-6 md:p-8 overflow-y-auto space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          Tipologías & Casos de Estudio Reales
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-display">
          Arquetipos Urbanos Preconfigurados
        </h2>
        <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Selecciona un escenario urbano para cargar su morfología de cañón (H/W), condiciones de tráfico vehicular, meteorología de ola de calor y paquete calibrado de Soluciones Basadas en la Naturaleza.
        </p>
      </div>

      {/* Grid of Case Studies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {CASE_STUDY_PRESETS.map((preset) => {
          const isCurrent = activePresetId === preset.id;
          return (
            <div
              key={preset.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
                isCurrent
                  ? 'bg-emerald-950/40 border-emerald-500 shadow-xl ring-1 ring-emerald-500/40'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-300 border border-slate-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sky-400" />
                    {preset.cityContext}
                  </span>
                  {isCurrent && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white">
                      Activo
                    </span>
                  )}
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base font-bold text-slate-100 font-display">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {preset.subtitle}
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {preset.description}
                </p>

                {/* Metrics snapshot */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-850 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px]">Relación Cañón (H/W):</span>
                    <div className="font-mono font-bold text-slate-200">
                      {preset.canyonConfig.aspectRatioHW}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Tráfico Vehicular:</span>
                    <div className="font-mono font-bold text-purple-300">
                      {preset.canyonConfig.trafficVolume} veh/h
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">T. Ola de Calor:</span>
                    <div className="font-mono font-bold text-rose-400">
                      {preset.ambientMeteo.ambientTemp}°C
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Viento en Techo:</span>
                    <div className="font-mono font-bold text-sky-400">
                      {preset.ambientMeteo.windSpeedRoof} m/s
                    </div>
                  </div>
                </div>

                {/* Challenges */}
                <div className="space-y-1 text-xs">
                  <h4 className="font-semibold text-slate-300 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Desafíos Clave:
                  </h4>
                  <ul className="space-y-0.5 text-slate-400 text-[11px] list-disc list-inside">
                    {preset.challenges.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Expected Impact */}
                <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-200">
                  <strong>Impacto Esperado:</strong> {preset.expectedImpact}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => onSelectPreset(preset)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isCurrent ? 'Escenario Cargado en el Gemelo' : 'Cargar en el Gemelo Digital'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
