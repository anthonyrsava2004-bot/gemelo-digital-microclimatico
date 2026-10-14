import React, { useState, useMemo, useCallback } from 'react';
import { 
  AppMode, 
  LayerMode, 
  UrbanCanyonConfig, 
  AmbientMeteorology, 
  PlacedNbS, 
  NbSType, 
  SensitiveReceptor,
  CaseStudyPreset
} from './types';
import { CASE_STUDY_PRESETS, INITIAL_RECEPTORS } from './data/mockData';
import { calculateCanyonSimulation } from './utils/physicsEngine';
import { Header } from './components/Header';
import { DigitalTwinCanvas } from './components/DigitalTwinCanvas';
import { NbSToolbox } from './components/NbSToolbox';
import { MetricsDashboard } from './components/MetricsDashboard';
import { PresentationDeck } from './components/PresentationDeck';
import { CaseStudies } from './components/CaseStudies';
import { AIConsultantModal } from './components/AIConsultantModal';
import { ImpactReportModal } from './components/ImpactReportModal';
import { Sparkles } from 'lucide-react';

export default function App() {
  // App State
  const [currentMode, setCurrentMode] = useState<AppMode>('digital_twin');
  const [activeLayer, setActiveLayer] = useState<LayerMode>('pm25');
  const [selectedTool, setSelectedTool] = useState<NbSType | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activePresetId, setActivePresetId] = useState<string>('dense_canyon');

  // Modals
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Canyon & Environment State
  const defaultPreset = CASE_STUDY_PRESETS[0];
  const [canyon, setCanyon] = useState<UrbanCanyonConfig>(defaultPreset.canyonConfig);
  const [meteo, setMeteo] = useState<AmbientMeteorology>(defaultPreset.ambientMeteo);
  const [placedNbS, setPlacedNbS] = useState<PlacedNbS[]>(defaultPreset.defaultInterventions);
  const [receptors, setReceptors] = useState<SensitiveReceptor[]>(INITIAL_RECEPTORS);

  // Compute live physics simulation metrics
  const { metrics, updatedReceptors } = useMemo(() => {
    return calculateCanyonSimulation(canyon, meteo, placedNbS, receptors);
  }, [canyon, meteo, placedNbS, receptors]);

  // Handlers
  const handleAddNbS = useCallback((newNbS: PlacedNbS) => {
    setPlacedNbS((prev) => [...prev, newNbS]);
  }, []);

  const handleRemoveNbS = useCallback((id: string) => {
    setPlacedNbS((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleUpdateNbS = useCallback((id: string, updates: Partial<PlacedNbS>) => {
    setPlacedNbS((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const handleClearNbS = useCallback(() => {
    setPlacedNbS([]);
  }, []);

  const handleResetScenario = useCallback(() => {
    const preset = CASE_STUDY_PRESETS.find((p) => p.id === activePresetId) || CASE_STUDY_PRESETS[0];
    setCanyon(preset.canyonConfig);
    setMeteo(preset.ambientMeteo);
    setPlacedNbS(preset.defaultInterventions);
  }, [activePresetId]);

  const handleSelectPreset = useCallback((preset: CaseStudyPreset) => {
    setActivePresetId(preset.id);
    setCanyon(preset.canyonConfig);
    setMeteo(preset.ambientMeteo);
    setPlacedNbS(preset.defaultInterventions);
    setCurrentMode('digital_twin');
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Global Top Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => {
          if (mode === 'ai_assistant') {
            setIsAIOpen(true);
          } else {
            setCurrentMode(mode);
          }
        }}
        metrics={metrics}
        placedNbSCount={placedNbS.length}
        onResetScenario={handleResetScenario}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 p-3 md:p-5 max-w-[1720px] w-full mx-auto">
        {currentMode === 'digital_twin' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
            {/* Left: Simulation Canvas (8 cols) */}
            <div className="xl:col-span-8 flex flex-col gap-4">
              <div className="h-[520px] md:h-[580px] w-full">
                <DigitalTwinCanvas
                  canyon={canyon}
                  meteo={meteo}
                  placedNbS={placedNbS}
                  onAddNbS={handleAddNbS}
                  onRemoveNbS={handleRemoveNbS}
                  onClearNbS={handleClearNbS}
                  activeLayer={activeLayer}
                  onChangeLayer={setActiveLayer}
                  metrics={metrics}
                  receptors={updatedReceptors}
                  selectedTool={selectedTool}
                  onSelectTool={setSelectedTool}
                  isPlaying={isPlaying}
                  onTogglePlay={() => setIsPlaying(!isPlaying)}
                />
              </div>

              {/* Real-time Environmental Dashboard */}
              <MetricsDashboard
                metrics={metrics}
                receptors={updatedReceptors}
                meteo={meteo}
                onUpdateMeteo={(updates) => setMeteo((prev) => ({ ...prev, ...updates }))}
                canyon={canyon}
                onUpdateCanyon={(updates) => setCanyon((prev) => ({ ...prev, ...updates }))}
                onOpenAIDiagnostic={() => setIsAIOpen(true)}
                onOpenReport={() => setIsReportOpen(true)}
              />
            </div>

            {/* Right: NbS Solutions Toolbox (4 cols) */}
            <div className="xl:col-span-4 h-[580px] xl:h-[calc(100vh-100px)] sticky top-20">
              <NbSToolbox
                selectedTool={selectedTool}
                onSelectTool={setSelectedTool}
                placedNbS={placedNbS}
                onAddNbS={handleAddNbS}
                onRemoveNbS={handleRemoveNbS}
                onUpdateNbS={handleUpdateNbS}
              />
            </div>
          </div>
        )}

        {currentMode === 'presentation' && (
          <div className="h-[calc(100vh-90px)] w-full">
            <PresentationDeck onGoToTwin={() => setCurrentMode('digital_twin')} />
          </div>
        )}

        {currentMode === 'case_studies' && (
          <div className="min-h-[calc(100vh-90px)] w-full">
            <CaseStudies
              onSelectPreset={handleSelectPreset}
              activePresetId={activePresetId}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button for AI Consultant (Agente Auditor NbS) */}
      <button
        onClick={() => setIsAIOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-2xl shadow-emerald-950/80 border border-emerald-400/50 hover:scale-105 active:scale-95 transition-all group backdrop-blur-md cursor-pointer"
        title="Consultar Agente Auditor NbS (Langflow)"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
        </span>
        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        <span className="font-display">Consultor IA</span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950/60 text-emerald-200 border border-emerald-400/30">
          Langflow
        </span>
      </button>

      {/* AI Consultant Modal */}
      <AIConsultantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        canyon={canyon}
        meteo={meteo}
        placedNbS={placedNbS}
        metrics={metrics}
      />

      {/* Impact & Resilience Report Modal */}
      <ImpactReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        canyon={canyon}
        meteo={meteo}
        placedNbS={placedNbS}
        metrics={metrics}
        receptors={updatedReceptors}
      />
    </div>
  );
}
