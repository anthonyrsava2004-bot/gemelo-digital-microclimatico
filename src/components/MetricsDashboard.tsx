import React from 'react';
import { SimulationMetrics, SensitiveReceptor, AmbientMeteorology, UrbanCanyonConfig } from '../types';
import { 
  Thermometer, 
  Wind, 
  Activity, 
  ShieldAlert, 
  HeartPulse, 
  Droplets, 
  Sun, 
  Coins, 
  Sparkles, 
  TrendingDown, 
  Clock, 
  Car,
  AlertCircle,
  CheckCircle,
  FileText
} from 'lucide-react';

interface MetricsDashboardProps {
  metrics: SimulationMetrics;
  receptors: SensitiveReceptor[];
  meteo: AmbientMeteorology;
  onUpdateMeteo: (updates: Partial<AmbientMeteorology>) => void;
  canyon: UrbanCanyonConfig;
  onUpdateCanyon: (updates: Partial<UrbanCanyonConfig>) => void;
  onOpenAIDiagnostic: () => void;
  onOpenReport: () => void;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  metrics,
  receptors,
  meteo,
  onUpdateMeteo,
  canyon,
  onUpdateCanyon,
  onOpenAIDiagnostic,
  onOpenReport,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* 1. High-Impact KPI Comparison Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* KPI 1: PM2.5 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Activity className="w-4 h-4 text-rose-400" />
              Exposición PM2.5
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[11px] border border-emerald-500/20">
              -{metrics.pm25ReductionPercent}%
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-100 font-mono">
              {metrics.currentAvgPM25}
            </span>
            <span className="text-xs text-slate-400">µg/m³</span>
            <span className="text-xs text-slate-500 line-through font-mono">
              {metrics.baselineAvgPM25}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Guía OMS: 15 µg/m³</span>
            <span
              className={`font-semibold ${
                metrics.currentAvgPM25 <= 15
                  ? 'text-emerald-400'
                  : metrics.currentAvgPM25 <= 25
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {metrics.currentAvgPM25 <= 15 ? '✓ Conforme OMS' : '⚠️ Supera OMS'}
            </span>
          </div>
        </div>

        {/* KPI 2: Temperature Reduction */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Thermometer className="w-4 h-4 text-amber-400" />
              Alivio Térmico
            </span>
            <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 font-mono font-bold text-[11px] border border-sky-500/20">
              -{metrics.tempReduction}°C
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-100 font-mono">
              {metrics.currentAvgTemp}°C
            </span>
            <span className="text-xs text-slate-500 line-through font-mono">
              {metrics.baselineAvgTemp}°C
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Sombra: {metrics.pedestrianShadeArea}% acera</span>
            <span className="text-sky-300 font-mono font-medium">
              ΔTmrt: -{metrics.mrtReduction}°C
            </span>
          </div>
        </div>

        {/* KPI 3: UTCI Comfort & NO2 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <HeartPulse className="w-4 h-4 text-emerald-400" />
              Confort UTCI
            </span>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 font-mono font-bold text-[11px] border border-purple-500/20">
              NO2 -{metrics.no2ReductionPercent}%
            </span>
          </div>

          <div className="mt-2 text-sm font-bold text-emerald-300 font-display truncate">
            {metrics.utciThermalComfortCategory}
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Flujo Evapotransp.:</span>
            <span className="text-cyan-300 font-mono font-medium">
              {metrics.evapotranspirativeFlux} W/m²
            </span>
          </div>
        </div>

        {/* KPI 4: SROI & Stormwater */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Coins className="w-4 h-4 text-yellow-400" />
              Ahorro Sanitario & SUDS
            </span>
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 font-mono font-bold text-[11px] border border-cyan-500/20">
              {metrics.stormwaterRetainedAnnualM3} m³ H2O
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-yellow-400 font-mono">
              +{metrics.avoidedHealthCostAnnualEur.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">€/año</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>CO2 fijado:</span>
            <span className="text-emerald-300 font-mono font-medium">
              {metrics.carbonSequesteredAnnualKg} kg/año
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Environmental & Canyon Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Controladores Ambientales & Condiciones en Vivo
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAIDiagnostic}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 border border-emerald-400/40 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              title="Auditar escenario con Agente NbS (Langflow)"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Consultor IA (Langflow)</span>
            </button>
            <button
              onClick={onOpenReport}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" /> Informe Técnico
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Time of Day Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Hora del Día:
              </span>
              <span className="font-mono font-bold text-amber-300">
                {Math.floor(meteo.timeOfDayHour).toString().padStart(2, '0')}:
                {Math.floor((meteo.timeOfDayHour % 1) * 60).toString().padStart(2, '0')}h
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              step="0.5"
              value={meteo.timeOfDayHour}
              onChange={(e) => onUpdateMeteo({ timeOfDayHour: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>00:00 Noche</span>
              <span>12:00 Cenit</span>
              <span>24:00</span>
            </div>
          </div>

          {/* Ambient Heat Temperature */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" /> T. Ambiente Ola Calor:
              </span>
              <span className="font-mono font-bold text-rose-300">
                {meteo.ambientTemp}°C
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="45"
              step="1"
              value={meteo.ambientTemp}
              onChange={(e) => onUpdateMeteo({ ambientTemp: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>20°C Templado</span>
              <span>35°C Alerta</span>
              <span>45°C Extrema</span>
            </div>
          </div>

          {/* Wind Speed at Roof */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-sky-400" /> Viento en Cubierta:
              </span>
              <span className="font-mono font-bold text-sky-300">
                {meteo.windSpeedRoof} m/s
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8"
              step="0.2"
              value={meteo.windSpeedRoof}
              onChange={(e) => onUpdateMeteo({ windSpeedRoof: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.5 Calma</span>
              <span>3.5 Brisa</span>
              <span>8.0 Fuerte</span>
            </div>
          </div>

          {/* Traffic Volume Intensity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-purple-400" /> Flujo Tráfico:
              </span>
              <span className="font-mono font-bold text-purple-300">
                {canyon.trafficVolume} veh/h
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="3500"
              step="100"
              value={canyon.trafficVolume}
              onChange={(e) => onUpdateCanyon({ trafficVolume: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>200 Calmo</span>
              <span>1500 Denso</span>
              <span>3500 Autovía</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sensitive Receptors Exposure Table */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            Exposición en Receptores Sensibles & Población Vulnerable
          </h3>
          <span className="text-[11px] text-slate-400">
            Monitorización a cota respiratoria (0.8m - 1.8m)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-2">Receptor / Ubicación</th>
                <th className="pb-2">Población Afectada</th>
                <th className="pb-2">PM2.5 Base vs. Actual</th>
                <th className="pb-2">Temperatura Base vs. Actual</th>
                <th className="pb-2">Confort Térmico</th>
                <th className="pb-2">Estado Sanitario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {receptors.map((rec) => {
                const isSafe = rec.currentExposure.pm25 <= 15;
                return (
                  <tr key={rec.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-2.5 font-medium text-slate-200 flex items-center gap-2">
                      <span className="text-base">
                        {rec.type === 'school' ? '🏫' : rec.type === 'bus_stop' ? '🚏' : '🏥'}
                      </span>
                      {rec.name}
                    </td>
                    <td className="py-2.5 text-slate-400 text-[11px]">
                      {rec.vulnerablePop}
                    </td>
                    <td className="py-2.5 font-mono">
                      <span className="text-slate-500 line-through mr-1.5">
                        {rec.baselineExposure.pm25}
                      </span>
                      <span
                        className={`font-bold ${
                          rec.currentExposure.pm25 < 15
                            ? 'text-emerald-400'
                            : rec.currentExposure.pm25 < 25
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {rec.currentExposure.pm25} µg/m³
                      </span>
                    </td>
                    <td className="py-2.5 font-mono">
                      <span className="text-slate-500 line-through mr-1.5">
                        {rec.baselineExposure.temp}°C
                      </span>
                      <span className="font-bold text-sky-300">
                        {rec.currentExposure.temp}°C
                      </span>
                    </td>
                    <td className="py-2.5 text-[11px] font-medium text-emerald-300">
                      {rec.currentExposure.utci}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isSafe
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                        }`}
                      >
                        {isSafe ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {isSafe ? 'Protegido' : 'Exposición Moderada'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
