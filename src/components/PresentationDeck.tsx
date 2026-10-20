import React, { useState, useEffect } from 'react';
import { SlideData } from '../types';
import { PRESENTATION_SLIDES } from '../data/mockData';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  BookOpen, 
  Sparkles, 
  Layers, 
  Wind, 
  Thermometer, 
  ShieldCheck, 
  TrendingUp, 
  Building, 
  Leaf, 
  Cpu, 
  Activity,
  ArrowRight,
  CheckCircle2,
  Download,
  Check
} from 'lucide-react';
import { exportTableToCSV } from '../utils/exportUtils';
import { ExplainabilityCard } from './ExplainabilityCard';

interface PresentationDeckProps {
  onGoToTwin: () => void;
}

export const PresentationDeck: React.FC<PresentationDeckProps> = ({ onGoToTwin }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const slide = PRESENTATION_SLIDES[currentSlideIndex];
  const totalSlides = PRESENTATION_SLIDES.length;

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      handleNext();
    }, 9000);
    return () => clearInterval(interval);
  }, [isAutoPlay, currentSlideIndex]);

  const [copiedSlide, setCopiedSlide] = useState<boolean>(false);

  const handleExportSlideCSV = () => {
    const headers = ['Campo', 'Detalle'];
    const rows = [
      ['ID Diapositiva', slide.id],
      ['Categoría', slide.category],
      ['Título', slide.title],
      ['Titular Principal', slide.headline],
      ['Conclusión Clave', slide.keyTakeaway],
      ...slide.contentBlocks.map((b, i) => [`Bloque ${i + 1}: ${b.subtitle}`, `${b.description} | Metricas: ${b.metricsBadge || 'N/A'}`]),
      ['Notas Orador', slide.speakerNotes],
    ];

    exportTableToCSV(headers, rows, `diapositiva-${slide.id}.csv`);
    setCopiedSlide(true);
    setTimeout(() => setCopiedSlide(false), 2000);
  };

  return (
    <div className={`flex flex-col h-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      {/* Top Slide Control Bar */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">
            Slide {currentSlideIndex + 1} / {totalSlides}
          </span>
          <span className="text-slate-400 font-medium hidden sm:inline-block">
            {slide.category}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSlideCSV}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-700 text-slate-200 hover:text-white font-medium border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Descargar contenido de la diapositiva en formato CSV para reportes"
          >
            {copiedSlide ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Download className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{copiedSlide ? '¡Grabado!' : 'Grabar Diapositiva (CSV)'}</span>
          </button>

          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              showSpeakerNotes
                ? 'bg-sky-600/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Notas Orador
          </button>

          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`p-1.5 rounded-lg border transition-all ${
              isAutoPlay
                ? 'bg-amber-600 text-white border-amber-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
            title={isAutoPlay ? 'Pausar avance automático' : 'Reproducción automática'}
          >
            {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750"
            title="Pantalla completa"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onGoToTwin}
            className="ml-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-md shadow-emerald-950/40 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Ir al Prototipo 3D
          </button>
        </div>
      </div>

      {/* Main Slide Canvas */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto flex flex-col justify-between space-y-6">
        {/* Slide Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              {slide.category}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-display leading-tight">
            {slide.title}
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-4xl">
            {slide.headline}
          </p>
        </div>

        {/* Slide Content Grid & Interactive Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Content Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5 flex flex-col justify-center">
            {slide.contentBlocks.map((block, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-lg space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-200 font-display flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    {block.subtitle}
                  </h3>
                  {block.metricsBadge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-mono text-[11px] font-bold">
                      {block.metricsBadge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {block.description}
                </p>

                {block.bulletPoints && (
                  <ul className="space-y-1 pt-1">
                    {block.bulletPoints.map((bp, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Right: Technical Diagram & Schematic Callout (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 border-b border-slate-800 pb-2">
                <span>MODELADO BIOFÍSICO & COMPUTACIONAL</span>
                <span className="font-mono text-emerald-400">CFD k-ε / UTCI</span>
              </div>

              {/* Dynamic Diagram Visual based on diagramType */}
              {slide.diagramType === 'canyon_cfd' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-3">
                  <div className="h-36 rounded-lg bg-slate-900 relative overflow-hidden border border-slate-800 flex items-center justify-center">
                    {/* Simulated Canyon Cross Section Sketch */}
                    <div className="absolute left-3 bottom-0 w-10 h-28 bg-slate-800 border-t border-r border-slate-700" />
                    <div className="absolute right-3 bottom-0 w-10 h-24 bg-slate-800 border-t border-l border-slate-700" />
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-slate-950 border-t border-slate-800" />
                    {/* Vortex arrow */}
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-sky-400/80 animate-spin flex items-center justify-center" style={{ animationDuration: '8s' }}>
                      <Wind className="w-6 h-6 text-sky-400" />
                    </div>
                    <div className="absolute bottom-6 left-16 text-[10px] font-mono text-rose-400 bg-slate-950/80 px-2 py-0.5 rounded border border-rose-900">
                      Pluma PM2.5 atrapada
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-snug">
                    <strong className="text-slate-200">Efecto Cañón (H/W &gt; 1.5):</strong> El aire en cubierta pasa rozando, generando un vórtice rotatorio que confina los contaminantes en la acera de sotavento.
                  </div>
                </div>
              )}

              {slide.diagramType === 'digital_twin_arch' && (
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-sky-500/30 flex items-center gap-2.5">
                    <Cpu className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <strong className="text-sky-300">Capa 1: Ingestión IoT & Morfología</strong>
                      <p className="text-[10px] text-slate-400">Microestaciones ópticas, modelos LiDAR 3D, flujos vehiculares en tiempo real.</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-500/30 flex items-center gap-2.5">
                    <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <strong className="text-emerald-300">Capa 2: Motor CFD & Físico-Químico</strong>
                      <p className="text-[10px] text-slate-400">Navier-Stokes RANS, balance de radiación de onda corta/larga, deposición seca.</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-purple-500/30 flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                    <div>
                      <strong className="text-purple-300">Capa 3: Sandbox NbS & Prescripción IA</strong>
                      <p className="text-[10px] text-slate-400">Optimización multiobjetivo con Gemini AI para selección botánica y salud pública.</p>
                    </div>
                  </div>
                </div>
              )}

              {slide.diagramType === 'nbs_matrix' && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[11px] text-slate-400 border-b border-slate-850 pb-1">
                    <span>Estrategia NbS</span>
                    <span>Efecto Clave</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5"><Leaf className="w-3.5 h-3.5 text-emerald-400" /> Arbolado permeable</span>
                    <span className="font-mono text-sky-300 font-bold">-4.5°C Sombra</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Setos en acera</span>
                    <span className="font-mono text-emerald-300 font-bold">-50% PM2.5</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-emerald-400" /> Techos Verdes</span>
                    <span className="font-mono text-cyan-300 font-bold">80% Retención H2O</span>
                  </div>
                </div>
              )}

              {slide.diagramType === 'biophysical_fluxes' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="font-mono text-xs text-amber-300 bg-slate-900 p-2 rounded text-center border border-amber-500/20">
                    Rn = H + LE + G
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    La vegetación desvía la radiación neta (<span className="text-amber-300 font-mono">Rn</span>) hacia calor latente (<span className="text-cyan-300 font-mono">LE</span>, transpiración de vapor de agua), reduciendo drásticamente el calor sensible (<span className="text-rose-400 font-mono">H</span>) que calienta el aire urbano.
                  </p>
                </div>
              )}

              {slide.diagramType === 'health_equity' && (
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs space-y-2">
                  <h4 className="font-bold text-emerald-300">Retorno Social de Inversión (SROI):</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-400 font-mono">4.8x</span>
                    <span className="text-xs text-slate-300">Retorno por cada 1€ invertido</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/80">
                    Reducción de ingresos hospitalarios de urgencia por asma y patologías cardiovasculares en días de ola de calor.
                  </p>
                </div>
              )}

              {slide.diagramType === 'roadmap' && (
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded bg-slate-950 border-l-2 border-emerald-500">
                    <span className="font-bold text-slate-200">Paso 1: Mapeo y Calibración</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border-l-2 border-sky-500">
                    <span className="font-bold text-slate-200">Paso 2: Co-diseño con el Gemelo</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border-l-2 border-purple-500">
                    <span className="font-bold text-slate-200">Paso 3: Ejecución & Sensorización Post</span>
                  </div>
                </div>
              )}
            </div>

            {/* Key Takeaway Callout */}
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-emerald-500/30 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Conclusión Clave:
              </div>
              <p className="text-slate-300 italic">
                "{slide.keyTakeaway}"
              </p>
            </div>
          </div>
        </div>

        {/* Speaker Notes Drawer */}
        {showSpeakerNotes && (
          <div className="p-4 rounded-xl bg-slate-900 border border-sky-500/40 text-xs text-sky-200 space-y-1">
            <strong className="text-sky-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Guía para el Expositor:
            </strong>
            <p className="leading-relaxed">{slide.speakerNotes}</p>
          </div>
        )}

        {/* Dynamic Slide Explainability */}
        <ExplainabilityCard
          title={`Interpretabilidad Metodológica: ${slide.title}`}
          physicsPrinciple={`Fundamento físico del eje: ${slide.category}. Modela los gradientes de transporte turbulento k-ε y balance energético superficial mediante simulaciones RANS acopladas con el modelo UTCI humano.`}
          regulatoryThreshold="Cumplimiento de la Directiva 2008/50/CE y Estándares de Confort Bioclimático ISO 7730."
          decisionImpact={`Conclusión técnica aplicable: ${slide.keyTakeaway}`}
          recommendedAction="Utilizar estos gráficos y evidencias en informes de planeamiento general municipal para justificar la renaturalización de ejes viarios."
          onExportCSV={handleExportSlideCSV}
          exportCSVLabel="Grabar Diapositiva (CSV)"
        />

        {/* Bottom Slide Navigation Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          <button
            onClick={handlePrev}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>

          {/* Slide Dots / Thumbnails */}
          <div className="flex items-center gap-2">
            {PRESENTATION_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlideIndex
                    ? 'w-8 bg-emerald-500'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Ir a diapositiva ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/50"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
