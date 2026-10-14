/**
 * Types and interfaces for the Microscale Air Quality & Urban Nature Digital Twin
 */

export type AppMode = 'digital_twin' | 'presentation' | 'case_studies' | 'ai_assistant';

export type LayerMode = 'pm25' | 'temperature' | 'wind' | 'no2' | 'utci_comfort';

export type ViewPerspective = 'cross_section' | 'top_down_isometric';

export type NbSType = 
  | 'tree_canopy_dense'
  | 'tree_canopy_moderate'
  | 'green_roof_extensive'
  | 'green_roof_intensive'
  | 'green_wall'
  | 'vegetated_hedge'
  | 'bioswale_rain_garden'
  | 'cool_pavement'
  | 'traffic_calming';

export interface NbSDefinition {
  id: NbSType;
  name: string;
  category: 'Vegetación de Estrato Alto' | 'Envolvente Edificatoria' | 'Estrato Arbustivo & Acera' | 'Superficies & Tráfico';
  icon: string;
  description: string;
  speciesExamples?: string[];
  mechanisms: string[];
  coolingEfficiency: number; // 1-10
  pmTrappingEfficiency: number; // 1-10
  no2UptakeEfficiency: number; // 1-10
  runoffRetention: number; // %
  costIndex: 'Bajo' | 'Medio' | 'Alto';
  coBenefits: string[];
  color: string;
}

export interface PlacedNbS {
  id: string;
  type: NbSType;
  x: number; // 0 to 100 (% of canyon width or position)
  y: number; // 0 to 100 (% height or depth)
  locationType: 'sidewalk_left' | 'sidewalk_right' | 'roof_left' | 'roof_right' | 'facade_left' | 'facade_right' | 'median_strip' | 'roadway';
  species?: string;
  health: number; // 0-100%
  ageYears: number;
}

export interface UrbanCanyonConfig {
  canyonWidth: number; // meters (e.g., 20m)
  buildingHeightLeft: number; // meters (e.g., 28m)
  buildingHeightRight: number; // meters (e.g., 22m)
  aspectRatioHW: number; // Height to width ratio
  orientation: 'N-S' | 'E-W' | 'NE-SW' | 'NW-SE';
  trafficVolume: number; // veh/h (e.g., 1400)
  heavyDutyShare: number; // % buses/trucks (e.g., 12%)
  pedestrianFlow: number; // ped/min
}

export interface AmbientMeteorology {
  ambientTemp: number; // °C (e.g., 34°C heatwave)
  windSpeedRoof: number; // m/s at 10m above roof (e.g., 3.5 m/s)
  windDirection: 'perpendicular' | 'parallel' | 'oblique_45';
  solarRadiation: number; // W/m² (e.g., 850 W/m² at 14:00)
  relativeHumidity: number; // % (e.g., 38%)
  timeOfDayHour: number; // 0 to 24 (e.g., 14.5 for 2:30 PM)
  backgroundPM25: number; // µg/m³
  backgroundNO2: number; // ppb
}

export interface SensitiveReceptor {
  id: string;
  name: string;
  type: 'school' | 'hospital' | 'bus_stop' | 'outdoor_cafe' | 'pedestrian_crossing';
  x: number; // % position in canyon
  y: number; // height (m)
  vulnerablePop: string;
  baselineExposure: {
    pm25: number;
    temp: number;
    utci: string;
  };
  currentExposure: {
    pm25: number;
    temp: number;
    utci: string;
  };
}

export interface SimulationMetrics {
  // Baseline vs Current
  baselineAvgTemp: number;
  currentAvgTemp: number;
  tempReduction: number; // °C
  
  baselineMaxMrt: number; // Mean radiant temp
  currentMaxMrt: number;
  mrtReduction: number; // °C

  baselineAvgPM25: number; // µg/m³
  currentAvgPM25: number;
  pm25ReductionPercent: number; // %

  baselineAvgNO2: number; // ppb
  currentAvgNO2: number;
  no2ReductionPercent: number; // %

  pedestrianShadeArea: number; // % of sidewalk shaded
  evapotranspirativeFlux: number; // W/m²
  stormwaterRetainedAnnualM3: number; // m³
  carbonSequesteredAnnualKg: number; // kg/year
  avoidedHealthCostAnnualEur: number; // EUR/year estimated
  utciThermalComfortCategory: 'Confort' | 'Estrés Térmico Ligero' | 'Estrés Térmico Moderado' | 'Estrés Térmico Fuerte' | 'Estrés Térmico Muy Fuerte';
}

export interface CaseStudyPreset {
  id: string;
  title: string;
  subtitle: string;
  cityContext: string;
  description: string;
  canyonConfig: UrbanCanyonConfig;
  ambientMeteo: AmbientMeteorology;
  defaultInterventions: PlacedNbS[];
  challenges: string[];
  expectedImpact: string;
}

export interface SlideData {
  id: number;
  title: string;
  category: string;
  headline: string;
  keyTakeaway: string;
  contentBlocks: {
    subtitle: string;
    description: string;
    bulletPoints?: string[];
    metricsBadge?: string;
  }[];
  diagramType: 'digital_twin_arch' | 'canyon_cfd' | 'nbs_matrix' | 'biophysical_fluxes' | 'health_equity' | 'roadmap';
  speakerNotes: string;
}
