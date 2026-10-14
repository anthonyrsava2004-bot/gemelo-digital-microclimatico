import React, { useState } from 'react';
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
  Calendar 
} from 'lucide-react';

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

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 rounded-2xl border border-slate-750 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 font-display">
              Informe Técnico de Impacto & Resiliencia
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado' : 'Copiar Texto'}
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimir / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Document Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs text-slate-200 bg-slate-950/40">
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

          {/* Key Quantitative Deltas */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              1. Balance Cuantitativo de Mitigación
            </h4>
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
          </div>

          {/* Receptors Protection Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              2. Protección de Colectivos Vulnerables (Cota Peatonal)
            </h4>
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
