import React, { useRef, useState } from 'react';
import { UrbanCanyonConfig, AmbientMeteorology, PlacedNbS, SimulationMetrics, SensitiveReceptor } from '../types';
import { NBS_CATALOG } from '../data/mockData';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  X, 
  Building, 
  Leaf, 
  Coins, 
  ShieldCheck, 
  Calendar,
  Download,
  BarChart3,
  Activity,
  Droplets,
  HeartPulse
} from 'lucide-react';
import { exportSvgAsHighResImage, exportTableToCSV } from '../utils/exportUtils';
import { ExplainabilityCard } from './ExplainabilityCard';

interface ImpactReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  canyon: UrbanCanyonConfig;
  meteo: AmbientMeteorology;
  placedNbS: PlacedNbS[];
  metrics: SimulationMetrics;
  receptors: SensitiveReceptor[];
}

export const ImpactReportModal: React.FC<ImpactReportModalProps> = ({
  isOpen,
  onClose,
  canyon,
  meteo,
  placedNbS,
  metrics,
  receptors,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedCsv, setCopiedCsv] = useState<boolean>(false);
  const reportChartSvgRef = useRef<SVGSVGElement | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Exportar el dictamen cuantitativo completo en formato CSV
  const handleExportFullReportCSV = () => {
    const headers = ['Sección', 'Parámetro / Métrica', 'Valor', 'Unidad / Referencia'];
    const rows = [
      ['Morfología Urbana', 'Ancho de Calle', canyon.canyonWidth, 'metros'],
      ['Morfología Urbana', 'Relación de Aspecto (H/W)', canyon.aspectRatioHW, 'adimensional'],
      ['Morfología Urbana', 'Intensidad Tráfico Vehicular', canyon.trafficVolume, 'vehículos/hora'],
      ['Meteorología', 'Temperatura Ambiente Canicular', meteo.ambientTemp, '°C'],
      ['Meteorología', 'Velocidad de Viento en Cubierta', meteo.windSpeedRoof, 'm/s'],
      ['Meteorología', 'Radiación Solar Incidente', meteo.solarRadiation, 'W/m²'],
      ['Calidad del Aire', 'PM2.5 Línea Base (Sin NbS)', metrics.baselineAvgPM25, 'µg/m³'],
      ['Calidad del Aire', 'PM2.5 Actual (Con NbS)', metrics.currentAvgPM25, 'µg/m³'],
      ['Calidad del Aire', 'Reducción Neta PM2.5', `-${metrics.pm25ReductionPercent}%`, 'Porcentaje'],
      ['Calidad del Aire', 'NO2 Línea Base', metrics.baselineAvgNO2, 'ppb'],
      ['Calidad del Aire', 'NO2 Actual', metrics.currentAvgNO2, 'ppb'],
      ['Calidad del Aire', 'Reducción Neta NO2', `-${metrics.no2ReductionPercent}%`, 'Porcentaje'],
      ['Microclima & Confort', 'Temperatura Aire Peatonal Base', metrics.baselineAvgTemp, '°C'],
      ['Microclima & Confort', 'Temperatura Aire Peatonal Actual', metrics.currentAvgTemp, '°C'],
      ['Microclima & Confort', 'Alivio Térmico Peatonal', `-${metrics.tempReduction}°C`, '°C'],
      ['Microclima & Confort', 'Descenso Temp. Radiante Media (Tmrt)', `-${metrics.mrtReduction}°C`, '°C'],
      ['Microclima & Confort', 'Sombra Peatonal Lograda', `${metrics.pedestrianShadeArea}%`, '% acera'],
      ['Microclima & Confort', 'Sensación Térmica UTCI', metrics.utciThermalComfortCategory, 'Escala UTCI'],
      ['Hidrología & SUDS', 'Retención Pluvial Anual', metrics.stormwaterRetainedAnnualM3, 'm³/año'],
      ['Economía & SROI', 'Ahorro Sanitario Anual Estimado', `+€${metrics.avoidedHealthCostAnnualEur.toLocaleString()}`, '€/año evitados'],
      ['Secuestro Carbono', 'Fijación Anual de CO2', metrics.carbonSequesteredAnnualKg, 'kg/año'],
    ];

    exportTableToCSV(headers, rows, `informe-tecnico-impacto-${Date.now()}.csv`);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  // Exportar Gráficos de Impacto en Ultra-HD PNG
  const handleExportReportChartHD = () => {
    if (reportChartSvgRef.current) {
      exportSvgAsHighResImage(reportChartSvgRef.current, 'grafico-dictamen-impacto-hd.png', 3);
    }
  };

  // Exportar Tabla de Receptores
  const handleExportReceptorsCSV = () => {
    const headers = ['Receptor', 'Población Vulnerable', 'PM2.5 Actual (µg/m³)', 'Confort UTCI'];
    const rows = receptors.map((r) => [r.name, r.vulnerablePop, r.currentExposure.pm25, r.currentExposure.utci]);
    exportTableToCSV(headers, rows, 'receptores-reporte.csv');
  };

  const handleCopyText = () => {
    const reportText = `DICTAMEN TÉCNICO: GEMELO DIGITAL DE CALIDAD DEL AIRE & SOLUCIONES EN NATURALEZA URBANA
Fecha: ${new Date().toLocaleDateString('es-ES')}
Morfología: Ancho ${canyon.canyonWidth}m | Relación Aspecto H/W: ${canyon.aspectRatioHW} | Tráfico: ${canyon.trafficVolume} veh/h
Meteorología: T. Ambiente ${meteo.ambientTemp}°C | Viento en Techo: ${meteo.windSpeedRoof} m/s

RESULTADOS DE MITIGACIÓN (LÍNEA BASE vs CON NbS):
- Reducción PM2.5: -${metrics.pm25ReductionPercent}% (${metrics.baselineAvgPM25} -> ${metrics.currentAvgPM25} µg/m³)
- Descenso Térmico Peatonal: -${metrics.tempReduction}°C (${metrics.baselineAvgTemp}°C -> ${metrics.currentAvgTemp}°C)
- Descenso T. Radiante Media (Tmrt): -${metrics.mrtReduction}°C
- Sombra Peatonal Lograda: ${metrics.pedestrianShadeArea}%
- Retención de Escorrentía Pluvial: ${metrics.stormwaterRetainedAnnualM3} m³/año
- Retorno Sanitario Estimado: +${metrics.avoidedHealthCostAnnualEur.toLocaleString()} €/año en costes sanitarios evitados

INTERVENCIONES NbS DESPLEGADAS (${placedNbS.length}):
${placedNbS.map((n) => `- ${NBS_CATALOG.find((cat) => cat.id === n.type)?.name} en ${n.locationType} (Edad: ${n.ageYears} años)`).join('\n')}
`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-750 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 font-display">
              Informe Técnico de Impacto & Resiliencia Biofísica
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportFullReportCSV}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-700 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer shadow-sm"
              title="Descargar todos los datos cuantitativos en CSV"
            >
              {copiedCsv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5 text-emerald-400" />}
              {copiedCsv ? '¡Reporte Grabado!' : 'Grabar Reporte (CSV)'}
            </button>
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado' : 'Copiar Texto'}
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimir / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Document Content */}
        <div className="flex-1 p-5 md:p-6 overflow-y-auto space-y-5 text-xs text-slate-200 bg-slate-950/40">
          {/* Official Document Banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                DICTAMEN TÉCNICO MUNICIPAL • CLIMA & CALIDAD DEL AIRE
              </span>
              <h2 className="text-base font-bold text-slate-100 font-display">
                Evaluación de Rendimiento Biofísico de Soluciones Basadas en la Naturaleza
              </h2>
              <p className="text-[11px] text-slate-400">
                Gemelo Digital a Microescala acoplado a CFD (RANS k-ε) e Índice Universal de Confort Térmico (UTCI)
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-400 font-mono">
              <div>Fecha: {new Date().toLocaleDateString('es-ES')}</div>
              <div className="text-emerald-400 font-bold">Estado: Calibrado</div>
            </div>
          </div>

          {/* Morphological & Boundary Conditions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <span className="text-slate-400 text-[10px]">Ancho de Calle:</span>
              <div className="font-mono font-bold text-slate-100">{canyon.canyonWidth} metros</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">Relación Aspecto H/W:</span>
              <div className="font-mono font-bold text-slate-100">{canyon.aspectRatioHW}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">Intensidad Tráfico:</span>
              <div className="font-mono font-bold text-purple-300">{canyon.trafficVolume} veh/h</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">T. Ola de Calor:</span>
              <div className="font-mono font-bold text-rose-400">{meteo.ambientTemp}°C</div>
            </div>
          </div>

          {/* Explicabilidad de Condiciones de Contorno */}
          <ExplainabilityCard
            title="Morfología del Cañón y Condiciones de Contorno Microclimático"
            defaultExpanded={false}
            physicsPrinciple="La relación de aspecto H/W (altura de edificios respecto al ancho de calle) gobierna el número de vórtices de recirculación en el cañón. En cañones con H/W > 1.5, el intercambio turbulento con el aire exterior se estrangula, requiriendo estrategias de diseño botánico de alta porosidad."
            regulatoryThreshold="Criterio de clasificación morfológica Oke (1988): Régimen de flujo rasante (H/W > 0.7) genera acumulación de pluma contaminante en la acera de sotavento."
            decisionImpact="Determina la capacidad de absorción máxima de tráfico del eje viario antes de generar concentraciones que violen la directiva europea."
            recommendedAction="En cañones estrechos (H/W > 1.5), priorizar pacificación del tráfico y arbolado de porte vertical para evitar el efecto pantalla."
          />

          {/* Key Quantitative Deltas + GRÁFICO DE MITIGACIÓN MULTIOBJETIVO */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                1. Balance Cuantitativo de Mitigación & Gráfico de Eficiencia
              </h4>
              <button
                onClick={handleExportReportChartHD}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                title="Descargar este gráfico en Ultra-HD PNG"
              >
                <Download className="w-3 h-3 text-sky-400" /> Grabar Gráfico HD
              </button>
            </div>

            {/* Tarjetas KPI del Reporte */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px]">Material Particulado (PM2.5):</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-emerald-400 font-mono">
                    -{metrics.pm25ReductionPercent}%
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    ({metrics.baselineAvgPM25} → {metrics.currentAvgPM25} µg/m³)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px]">Descenso Térmico (T. Aire Peatonal):</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-sky-400 font-mono">
                    -{metrics.tempReduction}°C
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    ({metrics.baselineAvgTemp}°C → {metrics.currentAvgTemp}°C)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px]">Retorno Social en Salud (SROI):</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-yellow-400 font-mono">
                    +{metrics.avoidedHealthCostAnnualEur.toLocaleString()} €
                  </span>
                  <span className="text-slate-400 text-[11px]">/año evitados</span>
                </div>
              </div>
            </div>

            {/* GRÁFICO SVG VECTORIAL DE EFICIENCIA MULTIOBJETIVO (Requisito: "si no hay grafico agregra") */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-300 font-semibold text-xs mb-2 block">
                Porcentajes de Mitigación Biofísica & Ganancia en Salud (%):
              </span>
              <svg
                ref={reportChartSvgRef}
                viewBox="0 0 680 180"
                className="w-full h-44"
              >
                {/* Background Grid */}
                <line x1="160" y1="20" x2="640" y2="20" stroke="#1e293b" strokeDasharray="3,3" />
                <line x1="160" y1="50" x2="640" y2="50" stroke="#1e293b" strokeDasharray="3,3" />
                <line x1="160" y1="80" x2="640" y2="80" stroke="#1e293b" strokeDasharray="3,3" />
                <line x1="160" y1="110" x2="640" y2="110" stroke="#1e293b" strokeDasharray="3,3" />
                <line x1="160" y1="140" x2="640" y2="140" stroke="#1e293b" strokeDasharray="3,3" />
                <line x1="160" y1="10" x2="160" y2="160" stroke="#334155" />

                {/* Bars */}
                {/* 1. PM2.5 */}
                <text x="150" y="32" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">Reducción PM2.5</text>
                <rect x="160" y="22" width={(metrics.pm25ReductionPercent / 100) * 440} height="14" rx="3" fill="#10b981" />
                <text x={168 + (metrics.pm25ReductionPercent / 100) * 440} y="33" fill="#6ee7b7" fontSize="10" fontWeight="bold">-{metrics.pm25ReductionPercent}%</text>

                {/* 2. NO2 */}
                <text x="150" y="62" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">Reducción NO2</text>
                <rect x="160" y="52" width={(metrics.no2ReductionPercent / 100) * 440} height="14" rx="3" fill="#a855f7" />
                <text x={168 + (metrics.no2ReductionPercent / 100) * 440} y="63" fill="#d8b4fe" fontSize="10" fontWeight="bold">-{metrics.no2ReductionPercent}%</text>

                {/* 3. Temperatura */}
                <text x="150" y="92" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">Alivio Térmico</text>
                <rect x="160" y="82" width={(metrics.tempReduction / 6.0) * 440} height="14" rx="3" fill="#38bdf8" />
                <text x={168 + (metrics.tempReduction / 6.0) * 440} y="93" fill="#7dd3fc" fontSize="10" fontWeight="bold">-{metrics.tempReduction}°C (ΔTmrt -{metrics.mrtReduction}°C)</text>

                {/* 4. Sombra Peatonal */}
                <text x="150" y="122" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">Sombra Peatonal</text>
                <rect x="160" y="112" width={(metrics.pedestrianShadeArea / 100) * 440} height="14" rx="3" fill="#f59e0b" />
                <text x={168 + (metrics.pedestrianShadeArea / 100) * 440} y="123" fill="#fde68a" fontSize="10" fontWeight="bold">+{metrics.pedestrianShadeArea}% acera</text>

                {/* 5. Retención SUDS */}
                <text x="150" y="152" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">Retención Pluvial</text>
                <rect x="160" y="142" width={Math.min(440, (metrics.stormwaterRetainedAnnualM3 / 800) * 440)} height="14" rx="3" fill="#06b6d4" />
                <text x={168 + Math.min(400, (metrics.stormwaterRetainedAnnualM3 / 800) * 440)} y="153" fill="#67e8f9" fontSize="10" fontWeight="bold">+{metrics.stormwaterRetainedAnnualM3} m³ H2O</text>
              </svg>
            </div>
          </div>

          {/* Explicabilidad de los Resultados Cuantitativos */}
          <ExplainabilityCard
            title="Eficiencia Biofísica y Modelo de Retorno en Salud SROI"
            defaultExpanded={false}
            physicsPrinciple="La reducción de PM2.5 responde al régimen de deposición seca turbulenta descrito por el modelo de Slinn. El descenso de temperatura radica en la atenuación de radiación solar de onda corta y el enfriamiento evaporativo latente de 180-260 W/m² generado por las especies botánicas calibradas."
            regulatoryThreshold="Directiva de Calidad del Aire de la UE y Guías de la OMS (2021). Umbral máximo admisible de 15 µg/m³ para PM2.5."
            decisionImpact="Permite justificar solicitudes de fondos europeos de recuperación (NextGen / Resiliencia Urbana) mediante indicadores cuantitativos verificables."
            recommendedAction="Documentar este balance de mitigación como anexo biofísico obligatorio en proyectos de reurbanización de cañones."
            onExportImage={handleExportReportChartHD}
            onExportCSV={handleExportFullReportCSV}
            exportImageLabel="Grabar Gráfico Impacto (PNG HD)"
            exportCSVLabel="Grabar Balance (CSV)"
          />

          {/* Receptors Protection Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                2. Protección de Colectivos Vulnerables (Cota Peatonal)
              </h4>
              <button
                onClick={handleExportReceptorsCSV}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                title="Descargar tabla de receptores en CSV"
              >
                <Download className="w-3 h-3 text-emerald-400" /> Grabar Receptores (CSV)
              </button>
            </div>
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400">
                  <tr>
                    <th className="p-2.5">Receptor</th>
                    <th className="p-2.5">Población</th>
                    <th className="p-2.5">Exposición PM2.5</th>
                    <th className="p-2.5">Confort Térmico</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 bg-slate-950">
                  {receptors.map((rec) => (
                    <tr key={rec.id}>
                      <td className="p-2.5 font-medium text-slate-200">{rec.name}</td>
                      <td className="p-2.5 text-slate-400 text-[11px]">{rec.vulnerablePop}</td>
                      <td className="p-2.5 font-mono text-emerald-400 font-bold">{rec.currentExposure.pm25} µg/m³</td>
                      <td className="p-2.5 text-sky-300">{rec.currentExposure.utci}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Installed Interventions Checklist */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              3. Inventario de Soluciones Basadas en la Naturaleza ({placedNbS.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {placedNbS.map((n) => {
                const def = NBS_CATALOG.find((c) => c.id === n.type);
                return (
                  <div key={n.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="font-medium text-slate-200">{def?.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Ubicación: {n.locationType}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
