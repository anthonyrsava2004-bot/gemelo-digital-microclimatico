import React, { useState } from 'react';
import { NbSType, NbSDefinition, PlacedNbS } from '../types';
import { NBS_CATALOG } from '../data/mockData';
import { 
  Trees, 
  TreePine, 
  Shield, 
  Building2, 
  Layers, 
  Droplets, 
  Sparkles, 
  Footprints, 
  Plus, 
  Trash2, 
  Info, 
  Sliders, 
  HeartHandshake, 
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Leaf,
  Download,
  Check
} from 'lucide-react';
import { exportTableToCSV } from '../utils/exportUtils';
import { ExplainabilityCard } from './ExplainabilityCard';

interface NbSToolboxProps {
  selectedTool: NbSType | null;
  onSelectTool: (tool: NbSType | null) => void;
  placedNbS: PlacedNbS[];
  onAddNbS: (nbs: PlacedNbS) => void;
  onRemoveNbS: (id: string) => void;
  onUpdateNbS: (id: string, updates: Partial<PlacedNbS>) => void;
}

const ICONS_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Trees,
  TreePine,
  Shield,
  Building2,
  Layers,
  Droplets,
  Sparkles,
  Footprints
};

export const NbSToolbox: React.FC<NbSToolboxProps> = ({
  selectedTool,
  onSelectTool,
  placedNbS,
  onAddNbS,
  onRemoveNbS,
  onUpdateNbS
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [inspectingNbs, setInspectingNbs] = useState<NbSDefinition | null>(null);

  const categories = [
    { id: 'all', label: 'Todas las Soluciones' },
    { id: 'Vegetación de Estrato Alto', label: 'Arbolado Urbano' },
    { id: 'Estrato Arbustivo & Acera', label: 'Setos & SUDS' },
    { id: 'Envolvente Edificatoria', label: 'Techos & Muros' },
    { id: 'Superficies & Tráfico', label: 'Pavimentos & ZBE' }
  ];

  const filteredCatalog = NBS_CATALOG.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  const handleQuickAdd = (type: NbSType) => {
    let locType: PlacedNbS['locationType'] = 'sidewalk_left';
    let x = 25;
    let y = 15;

    if (type.startsWith('tree')) {
      locType = placedNbS.filter((n) => n.type.startsWith('tree')).length % 2 === 0 ? 'sidewalk_left' : 'sidewalk_right';
      x = locType === 'sidewalk_left' ? 24 : 76;
      y = 20;
    } else if (type === 'vegetated_hedge') {
      locType = 'sidewalk_left';
      x = 28;
      y = 6;
    } else if (type.startsWith('green_roof')) {
      locType = placedNbS.some((n) => n.locationType === 'roof_left') ? 'roof_right' : 'roof_left';
      x = locType === 'roof_left' ? 10 : 90;
      y = 95;
    } else if (type === 'green_wall') {
      locType = 'facade_left';
      x = 12;
      y = 45;
    } else if (type === 'bioswale_rain_garden') {
      locType = 'sidewalk_left';
      x = 22;
      y = 2;
    } else if (type === 'cool_pavement' || type === 'traffic_calming') {
      locType = 'roadway';
      x = 50;
      y = 0;
    }

    const newNbs: PlacedNbS = {
      id: `nbs_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type,
      x,
      y,
      locationType: locType,
      health: 100,
      ageYears: type.startsWith('tree') ? 6 : 2
    };

    onAddNbS(newNbs);
  };

  const [copiedCatalog, setCopiedCatalog] = useState<boolean>(false);

  const handleExportCatalogCSV = () => {
    const headers = [
      'Nombre de la Solución NbS',
      'Categoría',
      'Especies Típicas',
      'Eficiencia Refrigeración (0-10)',
      'Captación PM2.5 (0-10)',
      'Absorción NO2 (0-10)',
      'Retención Pluvial (%)',
      'Índice de Coste',
      'Mecanismos Biofísicos Clave'
    ];
    const rows = NBS_CATALOG.map((item) => [
      item.name,
      item.category,
      item.speciesExamples.join('; '),
      item.coolingEfficiency,
      item.pmTrappingEfficiency,
      item.no2UptakeEfficiency,
      `${item.runoffRetention}%`,
      item.costIndex,
      item.mechanisms.join(' | ')
    ]);

    exportTableToCSV(headers, rows, 'catalogo-soluciones-nbs.csv');
    setCopiedCatalog(true);
    setTimeout(() => setCopiedCatalog(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 font-display">
              Caja de Soluciones NbS
            </h2>
            <p className="text-xs text-slate-400">
              Despliega infraestructura verde y evalúa su impacto biofísico
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCatalogCSV}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-700 text-slate-200 hover:text-white text-[11px] font-medium border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
            title="Descargar catálogo botánico y técnico en CSV"
          >
            {copiedCatalog ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Download className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{copiedCatalog ? '¡Grabado!' : 'Grabar Catálogo CSV'}</span>
          </button>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-semibold shrink-0">
            {placedNbS.length} Activas
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-4 py-2 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-emerald-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Scrollable Tool Cards List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        <div className="grid grid-cols-1 gap-2.5">
          {filteredCatalog.map((item) => {
            const IconComponent = ICONS_MAP[item.icon] || Trees;
            const isSelected = selectedTool === item.id;
            const placedCount = placedNbS.filter((n) => n.type === item.id).length;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div
                      className="p-2 rounded-lg text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-100">
                          {item.name}
                        </h4>
                        {placedCount > 0 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                            x{placedCount}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Efficiency Gauges */}
                <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2 border-t border-slate-850 text-[10px]">
                  <div>
                    <span className="text-slate-400">Enfriamiento:</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sky-400 rounded-full"
                          style={{ width: `${item.coolingEfficiency * 10}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-sky-400">
                        {item.coolingEfficiency}/10
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400">Filtro PM2.5:</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${item.pmTrappingEfficiency * 10}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-emerald-400">
                        {item.pmTrappingEfficiency}/10
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400">Retención H2O:</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${item.runoffRetention}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-cyan-400">
                        {item.runoffRetention}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-850">
                  <button
                    onClick={() => setInspectingNbs(item)}
                    className="text-[11px] text-slate-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" /> Ficha Biofísica
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleQuickAdd(item.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-emerald-400" /> Auto-Ubicar
                    </button>
                    <button
                      onClick={() => onSelectTool(isSelected ? null : item.id)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                      }`}
                    >
                      {isSelected ? 'Colocando...' : 'Puntero'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Interventions Manager */}
        {placedNbS.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Intervenciones en el Gemelo ({placedNbS.length})
            </h4>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {placedNbS.map((item, idx) => {
                const def = NBS_CATALOG.find((n) => n.id === item.type);
                return (
                  <div
                    key={item.id}
                    className="p-2 rounded-lg bg-slate-950/80 border border-slate-850 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: def?.color || '#10b981' }} />
                      <span className="font-medium text-slate-200 truncate max-w-[140px]">
                        {def?.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({item.ageYears}a, {item.health}%)
                      </span>
                    </div>

                    <button
                      onClick={() => onRemoveNbS(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Eliminar intervención"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal for Bio-physical Profile */}
      {inspectingNbs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-semibold text-emerald-400 uppercase">
                  {inspectingNbs.category}
                </span>
                <h3 className="text-lg font-bold text-slate-100 font-display">
                  {inspectingNbs.name}
                </h3>
              </div>
              <button
                onClick={() => setInspectingNbs(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {inspectingNbs.description}
            </p>

            {/* Species */}
            {inspectingNbs.speciesExamples && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <h4 className="font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  Especies Botánicas Recomendadas:
                </h4>
                <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                  {inspectingNbs.speciesExamples.map((sp, i) => (
                    <li key={i} className="font-mono text-[11px] text-slate-300">
                      {sp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mechanisms */}
            <div className="space-y-2 text-xs">
              <h4 className="font-semibold text-slate-200">
                Mecanismos Físicos & Termodinámicos:
              </h4>
              <ul className="space-y-1.5">
                {inspectingNbs.mechanisms.map((mech, i) => (
                  <li
                    key={i}
                    className="p-2 rounded-lg bg-slate-950/50 border border-slate-800 text-slate-300 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{mech}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Co-Benefits */}
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs">
              <h4 className="font-semibold text-emerald-300 mb-1">
                Co-Beneficios Ecosistémicos:
              </h4>
              <p className="text-emerald-200/80">
                {inspectingNbs.coBenefits.join(' • ')}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  handleQuickAdd(inspectingNbs.id);
                  setInspectingNbs(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Desplegar en el Gemelo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botanic Bio-Physics Explainability */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <ExplainabilityCard
          title="Biofísica Botánica: Área Foliar (LAI) y Porosidad Aerodinámica"
          physicsPrinciple="El equilibrio botánico en el cañón requiere optimizar dos fenómenos contrapuestos: la sombra/enfriamiento evaporativo (que mejora con copas frondosas) y la autolimpieza por ventilación (que requiere que el viento penetre a través del dosel). Un LAI de 2.5 a 3.5 con poda de copa abierta optimiza ambas variables."
          regulatoryThreshold="Recomendaciones de Infraestructura Verde Urbana (Comisión Europea y Directrices de Renaturalización Municipal)."
          decisionImpact="Seleccionar especies adecuadas para cada estrato: árboles permeables para el centro de calle y setos tupidos en la línea de acera para desviar la pluma vehicular."
          recommendedAction="Evitar especies de hoja perenne hiperselladas a baja cota en cañones con H/W > 1.2."
          onExportCSV={handleExportCatalogCSV}
          exportCSVLabel="Grabar Catálogo NbS (CSV)"
        />
      </div>
    </div>
  );
};
