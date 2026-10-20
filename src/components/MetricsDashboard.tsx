import React, { useRef, useState } from 'react';
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
  FileText,
  Download,
  BarChart3,
  Check,
  Layers
} from 'lucide-react';
import { exportSvgAsHighResImage, exportTableToCSV } from '../utils/exportUtils';
import { ExplainabilityCard } from './ExplainabilityCard';

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
  const receptorsChartSvgRef = useRef<SVGSVGElement | null>(null);
  const [copiedKpis, setCopiedKpis] = useState<boolean>(false);
  const [copiedReceptors, setCopiedReceptors] = useState<boolean>(false);
  const [chartMetric, setChartMetric] = useState<'pm25' | 'temp'>('pm25');

  // Exportar KPIs globales a CSV (compatible con Excel)
  const handleExportKpisCSV = () => {
    const headers = ['Indicador Ambiental / Sanitario', 'Línea Base (Sin NbS)', 'Escenario Con NbS', 'Delta / Mitigación', 'Unidad'];
    const rows = [
      ['Exposición PM2.5 Promedio', metrics.baselineAvgPM25, metrics.currentAvgPM25, `-${metrics.pm25ReductionPercent}%`, 'µg/m³'],
      ['Dióxido de Nitrógeno (NO2)', metrics.baselineAvgNO2, metrics.currentAvgNO2, `-${metrics.no2ReductionPercent}%`, 'ppb'],
      ['Temperatura Aire Peatonal', metrics.baselineAvgTemp, metrics.currentAvgTemp, `-${metrics.tempReduction}°C`, '°C'],
      ['Temperatura Radiante Media (Tmrt)', 52.0, (52.0 - metrics.mrtReduction).toFixed(1), `-${metrics.mrtReduction}°C`, '°C'],
      ['Cobertura Sombra Peatonal', '12%', `${metrics.pedestrianShadeArea}%`, `+${metrics.pedestrianShadeArea - 12}%`, '% acera'],
      ['Categoría Confort UTCI', 'Estrés Térmico Fuerte', metrics.utciThermalComfortCategory, 'Mejora bioclimática', 'Escala UTCI'],
      ['Flujo Evapotranspirativo Latente', 0, metrics.evapotranspirativeFlux, `+${metrics.evapotranspirativeFlux} W/m²`, 'W/m²'],
      ['Retención Pluvial Anual (SUDS)', 0, metrics.stormwaterRetainedAnnualM3, `+${metrics.stormwaterRetainedAnnualM3} m³`, 'm³/año'],
      ['Ahorro en Costes Sanitarios Evitados', 0, metrics.avoidedHealthCostAnnualEur, `+€${metrics.avoidedHealthCostAnnualEur.toLocaleString()}`, '€/año'],
      ['Fijación Anual de Carbono (CO2)', 0, metrics.carbonSequesteredAnnualKg, `+${metrics.carbonSequesteredAnnualKg} kg`, 'kg/año'],
    ];

    exportTableToCSV(headers, rows, 'kpis-impacto-gemelo-digital.csv');
    setCopiedKpis(true);
    setTimeout(() => setCopiedKpis(false), 2000);
  };

  // Exportar Tabla de Receptores Sensibles a CSV
  const handleExportReceptorsCSV = () => {
    const headers = ['Receptor Sensible', 'Tipología', 'Población Vulnerable', 'PM2.5 Base (µg/m³)', 'PM2.5 Actual (µg/m³)', 'Temp Base (°C)', 'Temp Actual (°C)', 'Confort UTCI', 'Estado Sanitario'];
    const rows = receptors.map((r) => [
      r.name,
      r.type,
      r.vulnerablePop,
      r.baselineExposure.pm25,
      r.currentExposure.pm25,
      r.baselineExposure.temp,
      r.currentExposure.temp,
      r.currentExposure.utci,
      r.currentExposure.pm25 <= 15 ? 'Protegido (Conforme OMS)' : 'Exposición Moderada',
    ]);

    exportTableToCSV(headers, rows, 'receptores-sensibles-exposicion.csv');
    setCopiedReceptors(true);
    setTimeout(() => setCopiedReceptors(false), 2000);
  };

  // Exportar Gráfico de Receptores Sensibles en Ultra-HD PNG
  const handleExportReceptorsChartHD = () => {
    if (receptorsChartSvgRef.current) {
      exportSvgAsHighResImage(
        receptorsChartSvgRef.current,
        `grafico-receptores-${chartMetric}-hd.png`,
        3
      );
    }
  };

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

      {/* Explicabilidad de los KPIs Globales y Botón de Grabación CSV */}
      <ExplainabilityCard
        title="Balance Multiobjetivo de Mitigación Ambiental y Sanitaria (KPIs)"
        defaultExpanded={false}
        physicsPrinciple="La combinación sinérgica de arbolado de sombra, setos deflectores y techos verdes genera un desacoplamiento térmico y de contaminantes: el dosel intercepta la radiación directa reduciendo Tmrt (-4.8°C), mientras que las superficies permeables y la deposición seca atrapan el material particulado vehicular antes de alcanzar el nivel respiratorio."
        regulatoryThreshold="Alineado con los Objetivos de Desarrollo Sostenible (ODS 3 Salud y Bienestar, ODS 11 Ciudades Resilientes) y la Directriz de Calidad del Aire de la OMS (límite anual 5 µg/m³, diario 15 µg/m³)."
        decisionImpact="Permite a los ayuntamientos cuantificar el retorno social y económico de la infraestructura verde (SROI), justificando la inversión pública mediante costes sanitarios evitados en asma e ingresos hospitalarios."
        recommendedAction="Mantener una tasa de cobertura vegetal superior al 30% en ejes viarios con tráfico mayor a 1,000 veh/hora para estabilizar los niveles bajo el umbral OMS."
        onExportCSV={handleExportKpisCSV}
        exportCSVLabel={copiedKpis ? '¡Tabla Grabada!' : 'Grabar KPIs (CSV)'}
      />

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
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
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

      {/* 3. Sensitive Receptors Exposure Section: Gráfico Comparativo + Tabla de Datos */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              Exposición en Receptores Sensibles & Población Vulnerable
            </h3>
            <span className="text-[11px] text-slate-400">
              Monitorización diferencial a cota respiratoria (0.8m para niños/cochecitos - 1.8m para adultos)
            </span>
          </div>

          {/* Action buttons for Chart/Table */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-[11px]">
              <button
                onClick={() => setChartMetric('pm25')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  chartMetric === 'pm25'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                PM2.5
              </button>
              <button
                onClick={() => setChartMetric('temp')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  chartMetric === 'temp'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Temperatura
              </button>
            </div>

            <button
              onClick={handleExportReceptorsChartHD}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Grabar gráfico de barras en Ultra-HD PNG"
            >
              <BarChart3 className="w-3.5 h-3.5 text-sky-400" /> Grabar Gráfico HD
            </button>

            <button
              onClick={handleExportReceptorsCSV}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-700 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Descargar tabla en formato CSV para Excel"
            >
              {copiedReceptors ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Download className="w-3.5 h-3.5 text-emerald-400" />}
              {copiedReceptors ? '¡Grabado!' : 'Grabar Tabla CSV'}
            </button>
          </div>
        </div>

        {/* GRÁFICO COMPARATIVO SVG INTEGRADO (Requisito: "si no hay grafico agregra") */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Gráfico Comparativo: Línea Base vs. Escenario con NbS ({chartMetric === 'pm25' ? 'Concentración PM2.5 en µg/m³' : 'Temperatura en °C'})
            </span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-rose-500/80 inline-block" /> Línea Base
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Con Soluciones NbS
              </span>
              {chartMetric === 'pm25' && (
                <span className="flex items-center gap-1 text-amber-300 font-mono">
                  <span className="w-3 h-0.5 bg-amber-400 inline-block border-t border-dashed" /> Guía OMS (15 µg/m³)
                </span>
              )}
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              ref={receptorsChartSvgRef}
              viewBox="0 0 740 220"
              className="w-full h-48 min-w-[620px]"
            >
              {/* Grid Lines */}
              <line x1="60" y1="20" x2="710" y2="20" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="60" y1="70" x2="710" y2="70" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="60" y1="120" x2="710" y2="120" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="60" y1="170" x2="710" y2="170" stroke="#334155" />

              {/* Y Axis Labels */}
              {chartMetric === 'pm25' ? (
                <>
                  <text x="50" y="24" fill="#64748b" fontSize="10" textAnchor="end">50</text>
                  <text x="50" y="74" fill="#64748b" fontSize="10" textAnchor="end">35</text>
                  <text x="50" y="124" fill="#64748b" fontSize="10" textAnchor="end">20</text>
                  <text x="50" y="174" fill="#64748b" fontSize="10" textAnchor="end">0</text>
                  {/* WHO Guideline line at 15 µg/m³ (y = 170 - (15/50)*150 = 125) */}
                  <line x1="60" y1="125" x2="710" y2="125" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3" />
                  <text x="705" y="120" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="end">Límite OMS (15 µg/m³)</text>
                </>
              ) : (
                <>
                  <text x="50" y="24" fill="#64748b" fontSize="10" textAnchor="end">45°C</text>
                  <text x="50" y="74" fill="#64748b" fontSize="10" textAnchor="end">35°C</text>
                  <text x="50" y="124" fill="#64748b" fontSize="10" textAnchor="end">25°C</text>
                  <text x="50" y="174" fill="#64748b" fontSize="10" textAnchor="end">15°C</text>
                </>
              )}

              {/* Bars per receptor */}
              {receptors.map((rec, idx) => {
                const groupX = 100 + idx * 210;
                let baseVal = chartMetric === 'pm25' ? rec.baselineExposure.pm25 : rec.baselineExposure.temp;
                let currVal = chartMetric === 'pm25' ? rec.currentExposure.pm25 : rec.currentExposure.temp;

                let baseH = chartMetric === 'pm25' 
                  ? Math.min(150, (baseVal / 50) * 150)
                  : Math.min(150, ((baseVal - 15) / 30) * 150);
                let currH = chartMetric === 'pm25' 
                  ? Math.min(150, (currVal / 50) * 150)
                  : Math.min(150, ((currVal - 15) / 30) * 150);

                return (
                  <g key={rec.id}>
                    {/* Baseline Bar */}
                    <rect
                      x={groupX}
                      y={170 - baseH}
                      width="34"
                      height={baseH}
                      rx="4"
                      fill="#f43f5e"
                      opacity="0.85"
                    />
                    <text
                      x={groupX + 17}
                      y={164 - baseH}
                      fill="#fda4af"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {baseVal}
                    </text>

                    {/* Current with NbS Bar */}
                    <rect
                      x={groupX + 42}
                      y={170 - currH}
                      width="34"
                      height={currH}
                      rx="4"
                      fill="#10b981"
                    />
                    <text
                      x={groupX + 59}
                      y={164 - currH}
                      fill="#6ee7b7"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {currVal}
                    </text>

                    {/* Receptor Label */}
                    <text
                      x={groupX + 38}
                      y="192"
                      fill="#e2e8f0"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {rec.name}
                    </text>
                    <text
                      x={groupX + 38}
                      y="207"
                      fill="#94a3b8"
                      fontSize="9"
                      textAnchor="middle"
                    >
                      {rec.vulnerablePop}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Tabla Detallada de Receptores */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold">
              <tr className="border-b border-slate-800">
                <th className="p-3">Receptor / Ubicación</th>
                <th className="p-3">Población Afectada</th>
                <th className="p-3">PM2.5 Base vs. Actual</th>
                <th className="p-3">Temperatura Base vs. Actual</th>
                <th className="p-3">Confort Térmico</th>
                <th className="p-3">Estado Sanitario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 bg-slate-900/40">
              {receptors.map((rec) => {
                const isSafe = rec.currentExposure.pm25 <= 15;
                return (
                  <tr key={rec.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-3 font-medium text-slate-200 flex items-center gap-2">
                      <span className="text-base">
                        {rec.type === 'school' ? '🏫' : rec.type === 'bus_stop' ? '🚏' : '🏥'}
                      </span>
                      {rec.name}
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">
                      {rec.vulnerablePop}
                    </td>
                    <td className="p-3 font-mono">
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
                    <td className="p-3 font-mono">
                      <span className="text-slate-500 line-through mr-1.5">
                        {rec.baselineExposure.temp}°C
                      </span>
                      <span className="font-bold text-sky-300">
                        {rec.currentExposure.temp}°C
                      </span>
                    </td>
                    <td className="p-3 text-[11px] font-medium text-emerald-300">
                      {rec.currentExposure.utci}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isSafe
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                        }`}
                      >
                        {isSafe ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {isSafe ? 'Protegido (OMS)' : 'Exposición Moderada'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ExplainabilityCard para la Tabla y Gráfica de Receptores */}
        <ExplainabilityCard
          title="Exposición en Receptores Sensibles y Protección a Cota Respiratoria"
          defaultExpanded={false}
          physicsPrinciple="La altura respiratoria de los niños en edad escolar (0.8m a 1.2m) coincide exactamente con la altura de máxima concentración de la pluma de escape vehicular en acera. Los setos vivos de media altura actúan como pantallas acústicas y filtros de deposición seca, reduciendo la exposición en escuelas y paradas hasta un 45% sin bloquear la ventilación superior."
          regulatoryThreshold="Guía de Calidad del Aire OMS 2021: 15 µg/m³ para PM2.5. Ningún equipamiento escolar o sociosanitario debería registrar promedios continuos superiores a este umbral."
          decisionImpact="Permite a los planificadores justificar la colocación prioritaria de intervenciones botánicas frente a puertas de colegios, residencias y marquesinas de transporte público."
          recommendedAction="Instalar una barrera continua de setos perimetrales (Ligustrum vulgare o Euonymus) de 1.4m entre la calzada y las zonas estanciales de la escuela."
          onExportImage={handleExportReceptorsChartHD}
          onExportCSV={handleExportReceptorsCSV}
          exportImageLabel="Grabar Gráfico Receptores (PNG HD)"
          exportCSVLabel="Grabar Tabla Receptores (CSV)"
        />
      </div>
    </div>
  );
};
