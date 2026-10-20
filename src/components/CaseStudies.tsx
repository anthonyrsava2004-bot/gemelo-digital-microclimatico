import React, { useRef, useState } from 'react';
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
  MapPin,
  BarChart3,
  Download,
  Check,
  Table
} from 'lucide-react';
import { exportSvgAsHighResImage, exportTableToCSV } from '../utils/exportUtils';
import { ExplainabilityCard } from './ExplainabilityCard';

interface CaseStudiesProps {
  onSelectPreset: (preset: CaseStudyPreset) => void;
  activePresetId?: string;
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ onSelectPreset, activePresetId }) => {
  const chartSvgRef = useRef<SVGSVGElement | null>(null);
  const [copiedCsv, setCopiedCsv] = useState<boolean>(false);

  // Exportar Matriz Comparativa a CSV
  const handleExportMatrixCSV = () => {
    const headers = [
      'Arquetipo Urbano',
      'Ciudad / Contexto',
      'Relación Aspecto (H/W)',
      'Ancho Calle (m)',
      'Tráfico (veh/h)',
      'Temp. Ola Calor (°C)',
      'Viento Techo (m/s)',
      'Régimen CFD',
      'Reducción PM2.5 Est.',
      'Alivio Térmico Est.',
      'Estrategia NbS Prioritaria'
    ];
    const rows = [
      ['Cañón Denso & Eje Comercial', 'Madrid (Gran Vía / Ensanche)', '2.0', '18m', '2200 veh/h', '38°C', '2.5 m/s', 'Flujo Rasante (Skimming)', '-35%', '-2.8°C', 'Árboles de copa porosa (LAI 2.8) + Muros verdes y techos'],
      ['Entorno Escolar & Bulevar', 'Barcelona (Eixample Escolar)', '1.2', '24m', '1400 veh/h', '34°C', '2.0 m/s', 'Interferencia de Estela', '-46%', '-3.5°C', 'Setos antipartículas en acera (1.4m) + Arbolado de sombra continua'],
      ['Cañón Templado & Plaza', 'Sevilla (Centro Histórico)', '0.8', '14m', '400 veh/h', '42°C', '1.5 m/s', 'Rugosidad Aislada / Abierto', '-28%', '-4.6°C', 'Doseles densos (Platanus) + Pavimentos permeables SUDS'],
    ];

    exportTableToCSV(headers, rows, 'matriz-arquetipos-urbanos.csv');
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  // Exportar Gráfico Comparativo en PNG HD
  const handleExportChartHD = () => {
    if (chartSvgRef.current) {
      exportSvgAsHighResImage(chartSvgRef.current, 'grafico-comparativo-arquetipos-hd.png', 3);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl border border-slate-800 p-5 md:p-8 overflow-y-auto space-y-6">
      {/* Title & Introduction */}
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

      {/* Grid of Case Studies Cards */}
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
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
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

      {/* SECCIÓN COMPARATIVA CUANTITATIVA: GRÁFICO + TABLA (Requisito: "si no hay grafico agregra") */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 mt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-display flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Comparativa Cruzada de Eficiencia entre Arquetipos
            </h3>
            <p className="text-xs text-slate-400">
              Evaluación comparada de reducción de material particulado y descenso de temperatura estival según morfología H/W
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportChartHD}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Descargar gráfico en Ultra-HD PNG"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" /> Grabar Gráfico HD
            </button>
            <button
              onClick={handleExportMatrixCSV}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-700 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Descargar matriz comparativa en CSV para Excel"
            >
              {copiedCsv ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Download className="w-3.5 h-3.5 text-emerald-400" />}
              {copiedCsv ? '¡Matriz Grabada!' : 'Grabar Matriz CSV'}
            </button>
          </div>
        </div>

        {/* GRÁFICO SVG VECTORIAL DE ARQUETIPOS */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="font-semibold text-slate-300">
              Potencial de Mitigación Biofísica: Reducción PM2.5 (%) vs. Descenso Térmico (°C)
            </span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Reducción PM2.5 (%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-sky-400 inline-block" /> Descenso Térmico (°C)
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              ref={chartSvgRef}
              viewBox="0 0 700 180"
              className="w-full h-44 min-w-[580px]"
            >
              {/* Grid Lines */}
              <line x1="80" y1="20" x2="660" y2="20" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="80" y1="60" x2="660" y2="60" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="80" y1="100" x2="660" y2="100" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="80" y1="140" x2="660" y2="140" stroke="#334155" />

              {/* Y Axis */}
              <text x="70" y="24" fill="#64748b" fontSize="10" textAnchor="end">50% / 5°C</text>
              <text x="70" y="64" fill="#64748b" fontSize="10" textAnchor="end">35% / 3.5°C</text>
              <text x="70" y="104" fill="#64748b" fontSize="10" textAnchor="end">20% / 2°C</text>
              <text x="70" y="144" fill="#64748b" fontSize="10" textAnchor="end">0</text>

              {/* Arquetipo 1: Cañón Denso (H/W 2.0) - PM2.5: 35%, Temp: 2.8°C */}
              <g>
                <rect x="140" y={140 - (35 / 50) * 120} width="36" height={(35 / 50) * 120} rx="4" fill="#10b981" />
                <text x="158" y={134 - (35 / 50) * 120} fill="#6ee7b7" fontSize="10" fontWeight="bold" textAnchor="middle">-35%</text>

                <rect x="182" y={140 - (2.8 / 5) * 120} width="36" height={(2.8 / 5) * 120} rx="4" fill="#38bdf8" />
                <text x="200" y={134 - (2.8 / 5) * 120} fill="#7dd3fc" fontSize="10" fontWeight="bold" textAnchor="middle">-2.8°C</text>

                <text x="179" y="158" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">Cañón Denso</text>
                <text x="179" y="172" fill="#94a3b8" fontSize="9" textAnchor="middle">H/W: 2.0 (Gran Vía)</text>
              </g>

              {/* Arquetipo 2: Bulevar Escolar (H/W 1.2) - PM2.5: 46%, Temp: 3.5°C */}
              <g>
                <rect x="340" y={140 - (46 / 50) * 120} width="36" height={(46 / 50) * 120} rx="4" fill="#10b981" />
                <text x="358" y={134 - (46 / 50) * 120} fill="#6ee7b7" fontSize="10" fontWeight="bold" textAnchor="middle">-46%</text>

                <rect x="382" y={140 - (3.5 / 5) * 120} width="36" height={(3.5 / 5) * 120} rx="4" fill="#38bdf8" />
                <text x="400" y={134 - (3.5 / 5) * 120} fill="#7dd3fc" fontSize="10" fontWeight="bold" textAnchor="middle">-3.5°C</text>

                <text x="379" y="158" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">Bulevar Escolar</text>
                <text x="379" y="172" fill="#94a3b8" fontSize="9" textAnchor="middle">H/W: 1.2 (Eixample)</text>
              </g>

              {/* Arquetipo 3: Cañón Templado / Plaza (H/W 0.8) - PM2.5: 28%, Temp: 4.6°C */}
              <g>
                <rect x="540" y={140 - (28 / 50) * 120} width="36" height={(28 / 50) * 120} rx="4" fill="#10b981" />
                <text x="558" y={134 - (28 / 50) * 120} fill="#6ee7b7" fontSize="10" fontWeight="bold" textAnchor="middle">-28%</text>

                <rect x="582" y={140 - (4.6 / 5) * 120} width="36" height={(4.6 / 5) * 120} rx="4" fill="#38bdf8" />
                <text x="600" y={134 - (4.6 / 5) * 120} fill="#7dd3fc" fontSize="10" fontWeight="bold" textAnchor="middle">-4.6°C</text>

                <text x="579" y="158" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">Cañón Abierto / Plaza</text>
                <text x="579" y="172" fill="#94a3b8" fontSize="9" textAnchor="middle">H/W: 0.8 (Sevilla)</text>
              </g>
            </svg>
          </div>
        </div>

        {/* TABLA COMPARATIVA DE ARQUETIPOS */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold">
              <tr className="border-b border-slate-800">
                <th className="p-3">Arquetipo Urbano</th>
                <th className="p-3">Morfología H/W</th>
                <th className="p-3">Tráfico</th>
                <th className="p-3">Régimen CFD</th>
                <th className="p-3">Eficacia PM2.5</th>
                <th className="p-3">Alivio Térmico</th>
                <th className="p-3">Estrategia NbS Recomendada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 bg-slate-900/40">
              <tr className="hover:bg-slate-850/50 transition-colors">
                <td className="p-3 font-medium text-slate-200">
                  🏢 Cañón Denso (Madrid Gran Vía)
                </td>
                <td className="p-3 font-mono text-slate-300">H/W = 2.0 (18m)</td>
                <td className="p-3 font-mono text-purple-300">2,200 veh/h</td>
                <td className="p-3 text-sky-300">Flujo Rasante (Skimming)</td>
                <td className="p-3 font-mono font-bold text-emerald-400">-35%</td>
                <td className="p-3 font-mono font-bold text-sky-300">-2.8°C</td>
                <td className="p-3 text-slate-300 text-[11px]">Árboles permeables (LAI &lt; 3.0) + Muros Verdes verticales</td>
              </tr>
              <tr className="hover:bg-slate-850/50 transition-colors">
                <td className="p-3 font-medium text-slate-200">
                  🏫 Bulevar Escolar (Barcelona Eixample)
                </td>
                <td className="p-3 font-mono text-slate-300">H/W = 1.2 (24m)</td>
                <td className="p-3 font-mono text-purple-300">1,400 veh/h</td>
                <td className="p-3 text-emerald-300">Interferencia de Estela</td>
                <td className="p-3 font-mono font-bold text-emerald-400">-46%</td>
                <td className="p-3 font-mono font-bold text-sky-300">-3.5°C</td>
                <td className="p-3 text-slate-300 text-[11px]">Setos antipartículas en acera (1.4m) frente a escuelas</td>
              </tr>
              <tr className="hover:bg-slate-850/50 transition-colors">
                <td className="p-3 font-medium text-slate-200">
                  ☀️ Cañón Abierto / Plaza (Sevilla)
                </td>
                <td className="p-3 font-mono text-slate-300">H/W = 0.8 (14m)</td>
                <td className="p-3 font-mono text-purple-300">400 veh/h</td>
                <td className="p-3 text-amber-300">Rugosidad Aislada</td>
                <td className="p-3 font-mono font-bold text-emerald-400">-28%</td>
                <td className="p-3 font-mono font-bold text-sky-300">-4.6°C</td>
                <td className="p-3 text-slate-300 text-[11px]">Dosel arbóreo denso y continuo de sombra + SUDS drenantes</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ExplainabilityCard para la Sección de Casos de Estudio */}
        <ExplainabilityCard
          title="Regímenes Aerodinámicos CFD y Selección Tipológica según H/W"
          physicsPrinciple="La clasificación de Oke (1988) divide los cañones en tres regímenes fluidodinámicos: (1) Rugosidad Aislada (H/W < 0.3), donde el aire circula sin interferencias; (2) Interferencia de Estela (0.3 ≤ H/W < 0.7), donde los vórtices de fachada comienzan a interactuar; y (3) Flujo Rasante o Skimming Flow (H/W ≥ 0.7-1.5), donde el viento salta por encima de los tejados y crea un circuito cerrado de recirculación que atrapa el escape vehicular en la calzada."
          regulatoryThreshold="Directiva 2008/50/CE y Criterios UNE-EN ISO 7730 de Ergonomía del Ambiente Térmico."
          decisionImpact="Evita el error común de aplicar la misma solución verde en cualquier calle: en cañones muy profundos (H/W = 2.0), un árbol excesivamente frondoso bloquea el vórtice y aumenta la contaminación a nivel de peatón; en cambio, en cañones abiertos (H/W = 0.8), la prioridad absoluta es la sombra densa."
          recommendedAction="Calcular siempre la relación H/W antes de redactar el pliego de prescripciones técnicas de arbolado municipal."
          onExportImage={handleExportChartHD}
          onExportCSV={handleExportMatrixCSV}
          exportImageLabel="Grabar Gráfico Arquetipos (PNG HD)"
          exportCSVLabel="Grabar Matriz Arquetipos (CSV)"
        />
      </div>
    </div>
  );
};
