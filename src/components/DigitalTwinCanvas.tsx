import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { UrbanCanyonConfig, AmbientMeteorology, PlacedNbS, LayerMode, SimulationMetrics, SensitiveReceptor, NbSType } from '../types';
import { sampleCanyonPoint, CanyonPointState } from '../utils/physicsEngine';
import { NBS_CATALOG } from '../data/mockData';
import { 
  Eye, 
  Wind, 
  Flame, 
  Sparkles, 
  Layers, 
  Maximize2, 
  Volume2, 
  Info, 
  Plus, 
  Trash2, 
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Building,
  Camera,
  Check,
  BookOpen
} from 'lucide-react';
import { exportCanvasAsHighResImage } from '../utils/exportUtils';
import { ExplainabilityCard } from './ExplainabilityCard';

interface DigitalTwinCanvasProps {
  canyon: UrbanCanyonConfig;
  meteo: AmbientMeteorology;
  placedNbS: PlacedNbS[];
  onAddNbS: (nbs: PlacedNbS) => void;
  onRemoveNbS: (id: string) => void;
  onClearNbS: () => void;
  activeLayer: LayerMode;
  onChangeLayer: (layer: LayerMode) => void;
  metrics: SimulationMetrics;
  receptors: SensitiveReceptor[];
  selectedTool: NbSType | null;
  onSelectTool: (tool: NbSType | null) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const DigitalTwinCanvas: React.FC<DigitalTwinCanvasProps> = ({
  canyon,
  meteo,
  placedNbS,
  onAddNbS,
  onRemoveNbS,
  onClearNbS,
  activeLayer,
  onChangeLayer,
  metrics,
  receptors,
  selectedTool,
  onSelectTool,
  isPlaying,
  onTogglePlay,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Split-screen comparison slider (0 to 100% of canvas width)
  const [splitSliderPos, setSplitSliderPos] = useState<number>(100); // 100 = full NbS, 50 = split
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [showSplitMode, setShowSplitMode] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [showExplainability, setShowExplainability] = useState<boolean>(true);

  const EXPLAINABILITY_BY_LAYER: Record<LayerMode, {
    title: string;
    physicsPrinciple: string;
    regulatoryThreshold: string;
    decisionImpact: string;
    recommendedAction: string;
  }> = {
    pm25: {
      title: 'Dispersión y Atrapamiento de Partículas Finas (PM2.5)',
      physicsPrinciple: 'En cañones urbanos profundos (H/W > 1.2), la velocidad del viento decae cerca del pavimento y el vórtice helicoidal arrastra las emisiones vehiculares hacia la acera de sotavento. Las NbS retienen partículas por impacto inercial y difusión estomática.',
      regulatoryThreshold: 'Directriz OMS 2021: Máximo 15 µg/m³ (promedio diario). Concentraciones superiores a 25 µg/m³ activan alertas de salud pública para grupos vulnerables.',
      decisionImpact: 'Permite certificar si las especies arbóreas colocadas facilitan la ventilación o si su dosel es excesivamente tupido y actúa como techo trampa para el humo del tráfico.',
      recommendedAction: 'Utilizar árboles con porosidad foliar moderada (LAI 2.5-3.5) y setos bajos a 1.4m que desvíen la pluma vehicular fuera de la acera.',
    },
    temperature: {
      title: 'Temperatura Superficial e Isla de Calor a Microescala',
      physicsPrinciple: 'El asfalto y hormigón convierten la radiación solar directa en calor sensible (alcanzando >50°C en horas punta). La vegetación disipa esta energía mediante enfriamiento evaporativo latente (~150-300 W/m²).',
      regulatoryThreshold: 'Confort bioclimático estival: Una reducción de 2°C a 4°C en temperatura de aire peatonal mitiga hasta un 40% el riesgo de hospitalización por choque térmico.',
      decisionImpact: 'Identifica los puntos críticos de sobrecalentamiento en aceras peatonales para priorizar la asignación presupuestaria en sombra vegetal.',
      recommendedAction: 'Maximizar el porcentaje de sombra en aceras transitadas superando el 40% y sustituir pavimentos impermeables por pavimentos drenantes con albedo reflectante.',
    },
    wind: {
      title: 'Aerodinámica CFD k-ε y Régimen de Ventilación del Cañón',
      physicsPrinciple: 'Régimen de Skimming Flow: El viento que sopla sobre los tejados induce un gradiente de corte turbulento que genera un vórtice rotatorio principal en el cañón. Si el viento a cota de suelo cae bajo 0.8 m/s, se pierde la capacidad de autolimpieza atmosférica.',
      regulatoryThreshold: 'Velocidad de confort y ventilación urbana: 1.0 m/s a 2.5 m/s garantiza dispersión sin causar molestias aerodinámicas a peatones.',
      decisionImpact: 'Evita crear barreras continuas impenetrables a cotas bajas que ahoguen la circulación de aire fresco.',
      recommendedAction: 'Mantener un gálibo libre de ramas de al menos 3 metros de altura entre el suelo y la base de las copas para preservar el canal de ventilación peatonal.',
    },
    no2: {
      title: 'Concentración de Dióxido de Nitrógeno (NO2) de Tubos de Escape',
      physicsPrinciple: 'Gas reactivo emitido por la combustión vehicular. Por ser un contaminante gaseoso, no se filtra mecánicamente como el polvo; su remoción biológica ocurre por absorción fotoquímica en estomas abiertos durante horas diurnas.',
      regulatoryThreshold: 'Guía OMS: 25 µg/m³ (24h) y umbral horario de 200 µg/m³ (Directiva Europea de Calidad del Aire 2008/50/CE).',
      decisionImpact: 'Permite diseñar barreras vegetales que incrementen la distancia aerodinámica efectiva entre el escape vehicular y la zona de respiración ciudadana.',
      recommendedAction: 'Interponer setos densos perimetrales entre calzada y carril bici/acera para forzar a la pluma de NO2 a ascender antes de diluirse.',
    },
    utci_comfort: {
      title: 'Índice Universal de Confort Térmico (UTCI)',
      physicsPrinciple: 'Modelo termofisiológico humano de 7 nodos que computa el intercambio térmico neto entre radiación solar/infrarroja, convección del aire, sudoración y resistencia de la vestimenta.',
      regulatoryThreshold: 'Categorías UTCI: 9°C a 26°C (Confort Óptimo); 26°C a 32°C (Estrés Moderado); 32°C a 38°C (Estrés Fuerte); >38°C (Estrés Muy Fuerte).',
      decisionImpact: 'Es el indicador de referencia municipal para declarar zonas de refugio climático y evaluar el bienestar de la población transeúnte.',
      recommendedAction: 'Reducir la Temperatura Radiante Media (Tmrt) instalando pérgolas o doseles de árboles de sombra amplia (Platanus / Celtis).',
    },
  };

  const handleExportCanvasHD = useCallback(() => {
    if (!canvasRef.current) return;
    const layerNames: Record<LayerMode, string> = {
      pm25: 'Calidad del Aire PM2.5 (Aerosoles Finos)',
      temperature: 'Campo Térmico Superficial y Radiación',
      wind: 'Aerodinámica CFD y Vectores de Vórtice',
      no2: 'Dióxido de Nitrógeno (Tráfico Vehicular)',
      utci_comfort: 'Índice Universal de Confort Térmico (UTCI)',
    };

    exportCanvasAsHighResImage(canvasRef.current, `gemelo-digital-canyon-${activeLayer}-hd.png`, {
      title: 'GEMELO DIGITAL MICROCLIMÁTICO URBANO — AUDITORÍA BIOFÍSICA',
      subtitle: `Simulación Dinámica: ${layerNames[activeLayer]} | ${placedNbS.length} Soluciones NbS Desplegadas`,
      layer: layerNames[activeLayer],
      canyonRatio: canyon.aspectRatioHW,
      windSpeed: meteo.windSpeedRoof,
      temp: meteo.ambientTemp,
      timestamp: new Date().toLocaleString('es-ES'),
    });

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2500);
  }, [activeLayer, placedNbS.length, canyon.aspectRatioHW, meteo.windSpeedRoof, meteo.ambientTemp]);

  // Hover Probe Telemetry
  const [probeState, setProbeState] = useState<{
    visible: boolean;
    xPx: number;
    yPx: number;
    normX: number;
    normY: number;
    data: CanyonPointState | null;
  }>({
    visible: false,
    xPx: 0,
    yPx: 0,
    normX: 0,
    normY: 0,
    data: null,
  });

  // Selected Placed NbS for inspection
  const [selectedNbSId, setSelectedNbSId] = useState<string | null>(null);

  // Particles for wind and pollution
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    type: 'wind' | 'smoke' | 'heat' | 'pollen';
    size: number;
    color: string;
  }>>([]);

  // Vehicles animation on street
  const vehiclesRef = useRef<Array<{
    x: number;
    speed: number;
    direction: 1 | -1;
    type: 'car' | 'bus' | 'truck' | 'cyclist';
    color: string;
  }>>([
    { x: 35, speed: 0.18, direction: 1, type: 'car', color: '#64748b' },
    { x: 55, speed: 0.12, direction: -1, type: 'bus', color: '#0284c7' },
    { x: 42, speed: 0.22, direction: 1, type: 'car', color: '#e11d48' },
    { x: 62, speed: 0.08, direction: -1, type: 'truck', color: '#d97706' },
  ]);

  // Animation frame loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    // Initialize wind and smoke particles
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 90; i++) {
        particlesRef.current.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random() * 100,
          maxLife: 80 + Math.random() * 60,
          type: i % 4 === 0 ? 'smoke' : i % 5 === 0 ? 'heat' : 'wind',
          size: 1.5 + Math.random() * 2,
          color: 'rgba(255,255,255,0.6)'
        });
      }
    }

    const render = () => {
      tick++;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Sky Background with solar azimuth
      const sunY = 40 + Math.sin(((meteo.timeOfDayHour - 6) / 12) * Math.PI) * -30;
      const sunX = (meteo.timeOfDayHour / 24) * width;

      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      if (meteo.timeOfDayHour > 6 && meteo.timeOfDayHour < 20) {
        skyGradient.addColorStop(0, '#0f172a');
        skyGradient.addColorStop(0.4, '#1e293b');
        skyGradient.addColorStop(1, '#0f172a');
      } else {
        skyGradient.addColorStop(0, '#020617');
        skyGradient.addColorStop(1, '#0f172a');
      }
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw Sun Glow
      if (meteo.timeOfDayHour >= 6 && meteo.timeOfDayHour <= 20) {
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 90);
        sunGlow.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
        sunGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.15)');
        sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 90, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 12, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dimensions mapping
      // Left building: x from 0 to width * 0.22
      // Right building: x from width * 0.78 to width
      // Street canyon width: x from width * 0.22 to width * 0.78
      const leftBuildingRight = width * 0.22;
      const rightBuildingLeft = width * 0.78;
      const groundY = height * 0.84;
      const sidewalkLeftWidth = (rightBuildingLeft - leftBuildingRight) * 0.25;
      const sidewalkRightWidth = (rightBuildingLeft - leftBuildingRight) * 0.25;
      const roadwayLeft = leftBuildingRight + sidewalkLeftWidth;
      const roadwayRight = rightBuildingLeft - sidewalkRightWidth;

      const leftRoofY = height * (1 - (canyon.buildingHeightLeft / 40) * 0.8);
      const rightRoofY = height * (1 - (canyon.buildingHeightRight / 40) * 0.8);

      // 2. Render Heatmap Overlay if active
      if (activeLayer !== 'wind') {
        const gridCols = 32;
        const gridRows = 24;
        const cellW = width / gridCols;
        const cellH = height / gridRows;

        ctx.save();
        for (let r = 0; r < gridRows; r++) {
          for (let c = 0; c < gridCols; c++) {
            const pxX = (c + 0.5) * cellW;
            const pxY = (r + 0.5) * cellH;

            // Inside buildings, skip heatmap unless green roof/wall
            const isInsideLeftBuilding = pxX < leftBuildingRight && pxY > leftRoofY;
            const isInsideRightBuilding = pxX > rightBuildingLeft && pxY > rightRoofY;
            const isBelowGround = pxY > groundY;

            if (isInsideLeftBuilding || isInsideRightBuilding || isBelowGround) continue;

            const normX = (pxX / width) * 100;
            const normY = ((groundY - pxY) / groundY) * 100;

            // Check if on the left or right of split slider
            const isEffectiveNbS = !showSplitMode || (pxX < (width * splitSliderPos) / 100);
            const activeNbSToUse = isEffectiveNbS ? placedNbS : [];

            const sample = sampleCanyonPoint(normX, normY, canyon, meteo, activeNbSToUse, metrics);

            let alpha = 0.45;
            let color = 'transparent';

            if (activeLayer === 'pm25') {
              const val = sample.pm25;
              if (val < 15) color = `rgba(16, 185, 129, ${alpha * 0.7})`; // Bueno
              else if (val < 25) color = `rgba(234, 179, 8, ${alpha * 0.8})`; // Moderado
              else if (val < 40) color = `rgba(249, 115, 22, ${alpha * 0.9})`; // No saludable
              else color = `rgba(239, 68, 68, ${alpha * 0.95})`; // Peligroso
            } else if (activeLayer === 'temperature') {
              const val = sample.tempAir;
              if (val < 30) color = `rgba(56, 189, 248, ${alpha * 0.6})`;
              else if (val < 33) color = `rgba(52, 211, 153, ${alpha * 0.7})`;
              else if (val < 36) color = `rgba(251, 146, 60, ${alpha * 0.85})`;
              else color = `rgba(225, 29, 72, ${alpha * 0.95})`;
            } else if (activeLayer === 'no2') {
              const val = sample.no2;
              if (val < 20) color = `rgba(16, 185, 129, ${alpha * 0.6})`;
              else if (val < 35) color = `rgba(245, 158, 11, ${alpha * 0.8})`;
              else color = `rgba(220, 38, 38, ${alpha * 0.9})`;
            } else if (activeLayer === 'utci_comfort') {
              if (sample.utciComfort === 'Confort') color = `rgba(16, 185, 129, ${alpha * 0.7})`;
              else if (sample.utciComfort === 'Estrés Ligero') color = `rgba(132, 204, 22, ${alpha * 0.75})`;
              else if (sample.utciComfort === 'Estrés Moderado') color = `rgba(234, 179, 8, ${alpha * 0.85})`;
              else color = `rgba(239, 68, 68, ${alpha * 0.95})`;
            }

            ctx.fillStyle = color;
            ctx.fillRect(c * cellW, r * cellH, cellW + 1, cellH + 1);
          }
        }
        ctx.restore();
      }

      // 3. Draw Buildings Architecture
      // Left Building
      const leftBuildingGrad = ctx.createLinearGradient(0, leftRoofY, leftBuildingRight, groundY);
      leftBuildingGrad.addColorStop(0, '#1e293b');
      leftBuildingGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = leftBuildingGrad;
      ctx.fillRect(0, leftRoofY, leftBuildingRight, groundY - leftRoofY);

      // Right Building
      const rightBuildingGrad = ctx.createLinearGradient(rightBuildingLeft, rightRoofY, width, groundY);
      rightBuildingGrad.addColorStop(0, '#1e293b');
      rightBuildingGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = rightBuildingGrad;
      ctx.fillRect(rightBuildingLeft, rightRoofY, width - rightBuildingLeft, groundY - rightRoofY);

      // Building Borders & Accents
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, leftRoofY, leftBuildingRight, groundY - leftRoofY);
      ctx.strokeRect(rightBuildingLeft, rightRoofY, width - rightBuildingLeft, groundY - rightRoofY);

      // Architectural Windows on Left Building
      const windowRowsLeft = Math.floor((groundY - leftRoofY) / 36);
      const windowColsLeft = 3;
      for (let r = 1; r < windowRowsLeft; r++) {
        for (let c = 0; c < windowColsLeft; c++) {
          const winX = 14 + c * ((leftBuildingRight - 28) / windowColsLeft);
          const winY = leftRoofY + 12 + r * 34;
          ctx.fillStyle = (r + c + Math.floor(tick / 40)) % 7 === 0 ? '#fef08a' : '#090d16';
          ctx.fillRect(winX, winY, 18, 22);
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1;
          ctx.strokeRect(winX, winY, 18, 22);
        }
      }

      // Architectural Windows on Right Building
      const windowRowsRight = Math.floor((groundY - rightRoofY) / 36);
      const windowColsRight = 3;
      for (let r = 1; r < windowRowsRight; r++) {
        for (let c = 0; c < windowColsRight; c++) {
          const winX = rightBuildingLeft + 14 + c * ((width - rightBuildingLeft - 28) / windowColsRight);
          const winY = rightRoofY + 12 + r * 34;
          ctx.fillStyle = (r * 2 + c + Math.floor(tick / 30)) % 6 === 0 ? '#bae6fd' : '#090d16';
          ctx.fillRect(winX, winY, 18, 22);
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1;
          ctx.strokeRect(winX, winY, 18, 22);
        }
      }

      // 4. Draw Street Surface & Infrastructure
      // Ground / Subsurface
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, groundY, width, height - groundY);
      ctx.strokeStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Sidewalks
      // Left Sidewalk
      const isCoolPave = placedNbS.some((n) => n.type === 'cool_pavement');
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(leftBuildingRight, groundY - 6, sidewalkLeftWidth, 6);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(leftBuildingRight, groundY - 6, sidewalkLeftWidth, 6);

      // Right Sidewalk
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(roadwayRight, groundY - 6, sidewalkRightWidth, 6);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(roadwayRight, groundY - 6, sidewalkRightWidth, 6);

      // Roadway
      ctx.fillStyle = isCoolPave ? '#334155' : '#0f172a';
      ctx.fillRect(roadwayLeft, groundY - 4, roadwayRight - roadwayLeft, 4);

      // Road Lane Markings
      ctx.strokeStyle = isCoolPave ? '#94a3b8' : '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      const midRoad = (roadwayLeft + roadwayRight) / 2;
      ctx.moveTo(midRoad, groundY - 4);
      ctx.lineTo(midRoad, groundY);
      ctx.stroke();
      ctx.setLineDash([]);

      // 5. Draw Placed NbS Interventions (Clipped to left side if in Split Comparison mode)
      ctx.save();
      if (showSplitMode) {
        const splitX = (width * splitSliderPos) / 100;
        ctx.beginPath();
        ctx.rect(0, 0, splitX, height);
        ctx.clip();
      }

      placedNbS.forEach((item) => {
        const isSelected = item.id === selectedNbSId;

        if (item.type.startsWith('tree_canopy')) {
          // Trees on sidewalks or median
          const treeX = leftBuildingRight + (item.x / 100) * (rightBuildingLeft - leftBuildingRight);
          const treeY = groundY - 6;
          const isDense = item.type === 'tree_canopy_dense';
          const canopyRadius = isDense ? 36 : 28;
          const trunkHeight = 44;

          // Tree Shadow on ground
          const shadowOffset = ((meteo.timeOfDayHour - 12) / 12) * 28;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.beginPath();
          ctx.ellipse(treeX + shadowOffset, groundY - 4, canopyRadius * 1.1, 5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Tree Trunk
          ctx.fillStyle = '#78350f';
          ctx.fillRect(treeX - 4, treeY - trunkHeight, 8, trunkHeight);

          // Canopy Leaves
          const sway = Math.sin(tick * 0.05 + item.x) * 2;
          const canopyGrad = ctx.createRadialGradient(
            treeX + sway,
            treeY - trunkHeight - canopyRadius * 0.6,
            5,
            treeX,
            treeY - trunkHeight - canopyRadius * 0.6,
            canopyRadius
          );
          canopyGrad.addColorStop(0, isDense ? '#34d399' : '#6ee7b7');
          canopyGrad.addColorStop(0.7, isDense ? '#059669' : '#10b981');
          canopyGrad.addColorStop(1, '#064e3b');

          ctx.fillStyle = canopyGrad;
          ctx.beginPath();
          ctx.arc(treeX + sway, treeY - trunkHeight - canopyRadius * 0.6, canopyRadius, 0, Math.PI * 2);
          ctx.fill();

          // Selection highlight
          if (isSelected) {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Evapotranspiration cooling halo
          ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
          ctx.beginPath();
          ctx.arc(treeX, treeY - trunkHeight - canopyRadius * 0.6, canopyRadius + 12, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'vegetated_hedge') {
          // Sidewalk barrier hedge
          const hedgeX = leftBuildingRight + (item.x / 100) * (rightBuildingLeft - leftBuildingRight);
          const hedgeY = groundY - 6;
          const hedgeW = 18;
          const hedgeH = 24;

          ctx.fillStyle = '#047857';
          ctx.beginPath();
          ctx.roundRect(hedgeX - hedgeW / 2, hedgeY - hedgeH, hedgeW, hedgeH, [6, 6, 0, 0]);
          ctx.fill();
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Particulate trapping dots visual
          ctx.fillStyle = '#a7f3d0';
          for (let i = 0; i < 4; i++) {
            ctx.fillRect(hedgeX - 4 + i * 2, hedgeY - 18 + (i % 2) * 6, 2, 2);
          }
        } else if (item.type.startsWith('green_roof')) {
          // Green roof
          const isLeft = item.locationType === 'roof_left';
          const roofX = isLeft ? 0 : rightBuildingLeft;
          const roofY = isLeft ? leftRoofY : rightRoofY;
          const roofW = isLeft ? leftBuildingRight : width - rightBuildingLeft;

          ctx.fillStyle = '#059669';
          ctx.fillRect(roofX, roofY - 8, roofW, 8);
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(roofX, roofY - 8, roofW, 8);

          // Little plant tufts
          ctx.fillStyle = '#10b981';
          for (let px = roofX + 8; px < roofX + roofW - 8; px += 10) {
            ctx.beginPath();
            ctx.arc(px, roofY - 8, 3.5, 0, Math.PI, true);
            ctx.fill();
          }
        } else if (item.type === 'green_wall') {
          // Living facade
          const isLeft = item.locationType === 'facade_left';
          const wallX = isLeft ? leftBuildingRight - 8 : rightBuildingLeft;
          const wallY = isLeft ? leftRoofY + 20 : rightRoofY + 20;
          const wallH = (groundY - wallY) * 0.75;

          ctx.fillStyle = 'rgba(5, 150, 105, 0.85)';
          ctx.fillRect(wallX, wallY, 8, wallH);
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1;
          ctx.strokeRect(wallX, wallY, 8, wallH);
        } else if (item.type === 'bioswale_rain_garden') {
          // Rain garden in sidewalk
          const bioX = leftBuildingRight + (item.x / 100) * (rightBuildingLeft - leftBuildingRight);
          ctx.fillStyle = '#0891b2';
          ctx.fillRect(bioX - 16, groundY - 6, 32, 6);
          ctx.fillStyle = '#22d3ee';
          ctx.fillRect(bioX - 12, groundY - 4, 24, 3);
        }
      });
      ctx.restore();

      // 6. Animate Vehicles & Exhaust Plumes
      vehiclesRef.current.forEach((veh) => {
        if (isPlaying) {
          veh.x += veh.speed * veh.direction;
          if (veh.x > 68) {
            veh.x = 68;
            veh.direction = -1;
          }
          if (veh.x < 32) {
            veh.x = 32;
            veh.direction = 1;
          }
        }

        const vehPxX = leftBuildingRight + (veh.x / 100) * (rightBuildingLeft - leftBuildingRight);
        const vehPxY = groundY - 14;

        // Draw vehicle body
        const isBus = veh.type === 'bus';
        const vW = isBus ? 38 : 24;
        const vH = isBus ? 16 : 10;

        ctx.fillStyle = veh.color;
        ctx.beginPath();
        ctx.roundRect(vehPxX - vW / 2, vehPxY, vW, vH, 3);
        ctx.fill();

        // Wheels
        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.arc(vehPxX - vW / 2 + 5, vehPxY + vH, 3, 0, Math.PI * 2);
        ctx.arc(vehPxX + vW / 2 - 5, vehPxY + vH, 3, 0, Math.PI * 2);
        ctx.fill();

        // Spawn exhaust smoke particle from tailpipe
        if (tick % 6 === 0 && isPlaying) {
          const tailpipeX = veh.direction === 1 ? vehPxX - vW / 2 : vehPxX + vW / 2;
          particlesRef.current.push({
            x: (tailpipeX / width) * 100,
            y: ((groundY - (vehPxY + vH)) / groundY) * 100,
            vx: (Math.random() - 0.5) * 0.3 - (veh.direction * 0.2),
            vy: 0.2 + Math.random() * 0.4,
            life: 0,
            maxLife: 45 + Math.random() * 30,
            type: 'smoke',
            size: 2.5 + Math.random() * 2,
            color: 'rgba(239, 68, 68, 0.7)'
          });
        }
      });

      // 7. Render Particle Systems (Wind stream, Smoke dispersion, Heat)
      particlesRef.current.forEach((p, idx) => {
        if (isPlaying) {
          p.life++;
          // Sample wind at particle position
          const sample = sampleCanyonPoint(p.x, p.y, canyon, meteo, placedNbS, metrics);
          p.x += (sample.windU * 0.25 + p.vx);
          p.y += (sample.windV * 0.25 + p.vy);

          // Wrap or respawn
          if (p.life >= p.maxLife || p.x < 0 || p.x > 100 || p.y < 0 || p.y > 100) {
            p.life = 0;
            p.x = Math.random() * 100;
            p.y = p.type === 'smoke' ? Math.random() * 20 : Math.random() * 100;
          }
        }

        const px = (p.x / 100) * width;
        const py = groundY - (p.y / 100) * groundY;
        const alpha = Math.max(0, 1 - p.life / p.maxLife);

        if (p.type === 'smoke') {
          ctx.fillStyle = `rgba(239, 68, 68, ${alpha * 0.65})`;
          ctx.beginPath();
          ctx.arc(px, py, p.size * (1 + p.life * 0.05), 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'wind' && activeLayer === 'wind') {
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.8})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + p.vx * 15, py - p.vy * 15);
          ctx.stroke();
        }
      });

      // Keep particles array bounded
      if (particlesRef.current.length > 140) {
        particlesRef.current.splice(0, particlesRef.current.length - 140);
      }

      // 8. Draw Sensitive Receptors Markers (School, Bus Stop, Clinic)
      receptors.forEach((rec) => {
        const recPxX = leftBuildingRight + (rec.x / 100) * (rightBuildingLeft - leftBuildingRight);
        const recPxY = groundY - 26;

        ctx.save();
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;

        // Pulsing alert ring if PM2.5 > 25
        if (rec.currentExposure.pm25 > 25) {
          const pulse = Math.sin(tick * 0.1) * 4;
          ctx.strokeStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(recPxX, recPxY, 14 + pulse, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Marker pin
        ctx.beginPath();
        ctx.arc(recPxX, recPxY, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Pin Label
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(rec.type === 'school' ? '🏫' : rec.type === 'bus_stop' ? '🚏' : '🏥', recPxX, recPxY + 4);

        // Exposure badge
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.beginPath();
        ctx.roundRect(recPxX - 32, recPxY - 28, 64, 16, 4);
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = rec.currentExposure.pm25 > 25 ? '#f87171' : '#4ade80';
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillText(`${rec.currentExposure.pm25} µg/m³`, recPxX, recPxY - 17);

        ctx.restore();
      });

      // 9. Split Slider Overlay Line if active
      if (showSplitMode) {
        const splitX = (width * splitSliderPos) / 100;
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(splitX, 0);
        ctx.lineTo(splitX, height);
        ctx.stroke();

        // Handle knob
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(splitX, height / 2, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Left / Right tags
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(splitX - 110, 16, 95, 24);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('🌿 Con NbS', splitX - 100, 32);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(splitX + 15, 16, 110, 24);
        ctx.fillStyle = '#f87171';
        ctx.fillText('⚠️ Línea Base (Sin NbS)', splitX + 22, 32);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [canyon, meteo, placedNbS, activeLayer, metrics, receptors, isPlaying, showSplitMode, splitSliderPos, selectedNbSId]);

  // Handle Canvas Resizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = Math.max(480, containerRef.current.clientHeight);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Mouse move for interactive probe
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const groundY = height * 0.84;

    const normX = (xPx / width) * 100;
    const normY = Math.max(0, Math.min(100, ((groundY - yPx) / groundY) * 100));

    const sample = sampleCanyonPoint(normX, normY, canyon, meteo, placedNbS, metrics);

    setProbeState({
      visible: true,
      xPx,
      yPx,
      normX,
      normY,
      data: sample
    });

    if (isDraggingSlider) {
      const newPos = Math.max(5, Math.min(95, (xPx / width) * 100));
      setSplitSliderPos(newPos);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!showSplitMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const width = canvas.width;
    const splitX = (width * splitSliderPos) / 100;
    if (Math.abs(xPx - splitX) < 45) {
      setIsDraggingSlider(true);
    }
  };

  const handleMouseUp = () => {
    setIsDraggingSlider(false);
  };

  const handleMouseLeave = () => {
    setProbeState((prev) => ({ ...prev, visible: false }));
    setIsDraggingSlider(false);
  };

  // Canvas Click to Place NbS or Select Existing
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;
    const width = canvas.width;
    const height = canvas.height;
    const groundY = height * 0.84;
    const leftBuildingRight = width * 0.22;
    const rightBuildingLeft = width * 0.78;

    const canyonWidthPx = rightBuildingLeft - leftBuildingRight;
    const relX = ((xPx - leftBuildingRight) / canyonWidthPx) * 100;
    const normY = Math.max(0, Math.min(100, ((groundY - yPx) / groundY) * 100));

    if (selectedTool) {
      let locType: PlacedNbS['locationType'] = 'sidewalk_left';
      if (xPx < leftBuildingRight) {
        locType = yPx < height * 0.4 ? 'roof_left' : 'facade_left';
      } else if (xPx > rightBuildingLeft) {
        locType = yPx < height * 0.4 ? 'roof_right' : 'facade_right';
      } else if (relX >= 35 && relX <= 65) {
        locType = selectedTool === 'cool_pavement' || selectedTool === 'traffic_calming' ? 'roadway' : 'median_strip';
      } else if (relX > 65) {
        locType = 'sidewalk_right';
      }

      const newNbS: PlacedNbS = {
        id: `nbs_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: selectedTool,
        x: Math.max(5, Math.min(95, relX)),
        y: normY,
        locationType: locType,
        health: 100,
        ageYears: selectedTool.startsWith('tree') ? 6 : 2
      };

      onAddNbS(newNbS);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-lg text-xs">
        {/* Layer Selectors */}
        <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
          <span className="text-slate-400 font-semibold px-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400" /> Capa:
          </span>
          <button
            onClick={() => onChangeLayer('pm25')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              activeLayer === 'pm25'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            PM2.5 / PM10
          </button>
          <button
            onClick={() => onChangeLayer('temperature')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              activeLayer === 'temperature'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Temperatura (°C)
          </button>
          <button
            onClick={() => onChangeLayer('wind')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              activeLayer === 'wind'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Viento & Vórtice
          </button>
          <button
            onClick={() => onChangeLayer('no2')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              activeLayer === 'no2'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            NO2 (ppb)
          </button>
          <button
            onClick={() => onChangeLayer('utci_comfort')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              activeLayer === 'utci_comfort'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Confort UTCI
          </button>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          {/* Split Mode Comparator Toggle */}
          <button
            onClick={() => {
              const nextMode = !showSplitMode;
              setShowSplitMode(nextMode);
              if (nextMode && splitSliderPos >= 90) {
                setSplitSliderPos(50);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
              showSplitMode
                ? 'bg-indigo-600/40 text-indigo-200 border-indigo-500 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            {showSplitMode ? 'Comparador Activo (50/50)' : 'Comparar Antes/Después'}
          </button>

          {/* Reset / Clear */}
          {placedNbS.length > 0 && (
            <button
              onClick={onClearNbS}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-950/50 text-rose-300 border border-rose-800/50 hover:bg-rose-900/60 transition-colors"
              title="Limpiar todas las soluciones colocadas"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpiar ({placedNbS.length})
            </button>
          )}

          {/* Play / Pause simulation */}
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              isPlaying
                ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500'
                : 'bg-amber-600 text-white shadow-sm hover:bg-amber-500'
            }`}
          >
            {isPlaying ? '▶ Simulación en Vivo' : '⏸ Pausado'}
          </button>

          {/* Grabar Figura HD */}
          <button
            onClick={handleExportCanvasHD}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold border border-emerald-500/50 shadow-md transition-all cursor-pointer"
            title="Grabar figura del cañón en Ultra-Alta Calidad (PNG 4K con metadatos y sellos)"
          >
            {exportSuccess ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Camera className="w-3.5 h-3.5 text-emerald-200" />}
            <span>{exportSuccess ? '¡Grabado!' : 'Grabar Figura HD'}</span>
          </button>

          {/* Toggle Explicabilidad XAI */}
          <button
            onClick={() => setShowExplainability(!showExplainability)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showExplainability
                ? 'bg-sky-600/30 text-sky-200 border-sky-400 shadow-sm'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
            title="Mostrar u ocultar tarjeta de interpretabilidad y física de la capa"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>{showExplainability ? 'Ocultar XAI' : 'Ver Explicabilidad'}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Container */}
      <div ref={containerRef} className="relative flex-1 w-full min-h-[500px]">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onClick={handleCanvasClick}
          className={`w-full h-full cursor-${selectedTool ? 'crosshair' : showSplitMode ? 'ew-resize' : 'default'}`}
        />

        {/* Floating Split Mode Position Controller */}
        {showSplitMode && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/60 backdrop-blur-md shadow-2xl text-xs">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              🌿 Con NbS ({Math.round(splitSliderPos)}%)
            </span>
            <input
              type="range"
              min="10"
              max="90"
              value={Math.round(splitSliderPos)}
              onChange={(e) => setSplitSliderPos(Number(e.target.value))}
              className="w-32 sm:w-44 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-ew-resize accent-indigo-400"
            />
            <span className="text-rose-400 font-bold flex items-center gap-1">
              ⚠️ Sin NbS ({100 - Math.round(splitSliderPos)}%)
            </span>
          </div>
        )}

        {/* Interactive Hover Probe HUD */}
        {probeState.visible && probeState.data && (
          <div
            className="absolute pointer-events-none z-30 p-3 rounded-xl bg-slate-950/95 backdrop-blur-md border border-slate-700 shadow-2xl text-xs space-y-1.5 min-w-[210px]"
            style={{
              left: Math.min(probeState.xPx + 16, (containerRef.current?.clientWidth || 600) - 230),
              top: Math.max(16, probeState.yPx - 90),
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 font-mono text-[11px] text-slate-400">
              <span>SONDA MICROCLIMA</span>
              <span className="text-emerald-400 font-semibold">
                X:{Math.round(probeState.normX)}m Y:{Math.round(probeState.normY)}m
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-0.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">PM2.5:</span>
                <span
                  className={`font-mono font-bold ${
                    probeState.data.pm25 < 15
                      ? 'text-emerald-400'
                      : probeState.data.pm25 < 25
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {probeState.data.pm25} µg/m³
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">NO2:</span>
                <span className="font-mono font-bold text-purple-400">
                  {probeState.data.no2} ppb
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">T. Aire:</span>
                <span className="font-mono font-bold text-amber-300">
                  {probeState.data.tempAir}°C
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">T. Radiante:</span>
                <span className="font-mono font-bold text-rose-300">
                  {probeState.data.tempMrt}°C
                </span>
              </div>
              <div className="flex items-center justify-between col-span-2">
                <span className="text-slate-400">Viento local:</span>
                <span className="font-mono text-sky-300">
                  {probeState.data.windMagnitude} m/s (u:{probeState.data.windU}, v:{probeState.data.windV})
                </span>
              </div>
              <div className="flex items-center justify-between col-span-2 pt-1 border-t border-slate-850">
                <span className="text-slate-400">Sensación UTCI:</span>
                <span className="font-medium text-emerald-300 font-mono">
                  {probeState.data.utciComfort}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Selected Tool Banner Guide */}
        {selectedTool && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-950/90 border border-emerald-500/80 backdrop-blur-md shadow-xl text-emerald-200 text-xs">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>
              Herramienta activa: <strong>{NBS_CATALOG.find((n) => n.id === selectedTool)?.name}</strong>. Haz clic en el cañón para desplegarla.
            </span>
            <button
              onClick={() => onSelectTool(null)}
              className="ml-2 px-2 py-0.5 rounded-full bg-emerald-800/60 hover:bg-emerald-700 text-white font-medium"
            >
              Terminar
            </button>
          </div>
        )}

        {/* Legend Overlay at Bottom Left */}
        <div className="absolute bottom-3 left-3 z-10 p-2.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 space-y-1">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-sky-400" />
            {activeLayer === 'pm25' && 'Calidad de Aire PM2.5 (Guías OMS)'}
            {activeLayer === 'temperature' && 'Temperatura de Aire Superficial'}
            {activeLayer === 'wind' && 'Vectores de Ventilación & Vórtice'}
            {activeLayer === 'no2' && 'Dióxido de Nitrógeno (Tráfico)'}
            {activeLayer === 'utci_comfort' && 'Índice Universal de Confort Térmico'}
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            {activeLayer === 'pm25' && (
              <>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"/> &lt;15 Bueno</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"/> 15-25 Mod.</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"/> 25-40 Alto</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"/> &gt;40 Crítico</span>
              </>
            )}
            {activeLayer === 'temperature' && (
              <>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block"/> &lt;30°C</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"/> 30-33°C</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"/> 33-36°C</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"/> &gt;36°C</span>
              </>
            )}
            {activeLayer === 'wind' && (
              <span className="text-sky-300">
                Flujo turbulento de cañón k-ε con velocidad en azotea de {meteo.windSpeedRoof} m/s
              </span>
            )}
            {activeLayer === 'no2' && (
              <>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"/> &lt;20 ppb</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"/> 20-35 ppb</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"/> &gt;35 ppb</span>
              </>
            )}
            {activeLayer === 'utci_comfort' && (
              <>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"/> Confort</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"/> Estrés Mod.</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"/> Estrés Fuerte</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Scientific Explainability & Interpretability Card */}
      {showExplainability && (
        <div className="p-3 bg-slate-950/95 border-t border-slate-800">
          <ExplainabilityCard
            title={EXPLAINABILITY_BY_LAYER[activeLayer].title}
            physicsPrinciple={EXPLAINABILITY_BY_LAYER[activeLayer].physicsPrinciple}
            regulatoryThreshold={EXPLAINABILITY_BY_LAYER[activeLayer].regulatoryThreshold}
            decisionImpact={EXPLAINABILITY_BY_LAYER[activeLayer].decisionImpact}
            recommendedAction={EXPLAINABILITY_BY_LAYER[activeLayer].recommendedAction}
            defaultExpanded={false}
            onExportImage={handleExportCanvasHD}
            exportImageLabel="Grabar Figura Canvas (PNG 4K)"
          />
        </div>
      )}
    </div>
  );
};
