import { UrbanCanyonConfig, AmbientMeteorology, PlacedNbS, SimulationMetrics, SensitiveReceptor } from '../types';
import { NBS_CATALOG } from '../data/mockData';

export interface CanyonPointState {
  x: number; // 0 to 100
  y: number; // 0 to 100
  tempAir: number; // °C
  tempMrt: number; // °C
  pm25: number; // µg/m³
  no2: number; // ppb
  windU: number; // m/s horizontal
  windV: number; // m/s vertical
  windMagnitude: number; // m/s
  isShaded: boolean;
  vegetationDensity: number; // 0 to 1
  utciComfort: string;
}

/**
 * Computes global and receptor metrics for the canyon given config, meteo, and placed NbS.
 */
export function calculateCanyonSimulation(
  canyon: UrbanCanyonConfig,
  meteo: AmbientMeteorology,
  placedNbS: PlacedNbS[],
  receptors: SensitiveReceptor[]
): {
  metrics: SimulationMetrics;
  updatedReceptors: SensitiveReceptor[];
} {
  // 1. Calculate baseline vehicular emission load
  const vehFactor = (canyon.trafficVolume / 1000) * (1 + (canyon.heavyDutyShare / 100) * 2.5);
  const baselinePM25Peak = meteo.backgroundPM25 + vehFactor * 22;
  const baselineNO2Peak = meteo.backgroundNO2 + vehFactor * 26;

  // Aspect ratio trap factor
  const aspectTrapFactor = Math.min(2.2, Math.max(0.8, canyon.aspectRatioHW * 0.9));

  // Baseline temperatures
  const sunAngle = Math.sin(Math.max(0, Math.min(Math.PI, ((meteo.timeOfDayHour - 6) / 12) * Math.PI)));
  const solarHeating = (meteo.solarRadiation / 1000) * sunAngle * 7.5;
  const baselineAvgTemp = meteo.ambientTemp + solarHeating * (0.8 + aspectTrapFactor * 0.3);
  const baselineMaxMrt = baselineAvgTemp + (meteo.solarRadiation / 100) * 2.6;

  // 2. Compute NbS mitigation contributions
  let totalCoolingPower = 0;
  let totalPMMitigation = 0;
  let totalNO2Mitigation = 0;
  let totalShadeArea = 0;
  let totalEvapoFlux = 0;
  let totalStormwaterRetained = 0;
  let totalCarbonSeq = 0;

  placedNbS.forEach((item) => {
    const def = NBS_CATALOG.find((n) => n.id === item.type);
    if (!def) return;
    const healthWeight = item.health / 100;
    const maturity = Math.min(1.2, 0.4 + (item.ageYears / 10) * 0.8);

    // Specific contribution by type
    if (item.type.startsWith('tree_canopy')) {
      const isDense = item.type === 'tree_canopy_dense';
      totalCoolingPower += (isDense ? 1.2 : 0.8) * healthWeight * maturity;
      totalPMMitigation += (isDense ? 1.0 : 0.7) * healthWeight * maturity;
      totalNO2Mitigation += 0.8 * healthWeight * maturity;
      totalShadeArea += (isDense ? 22 : 15) * maturity;
      totalEvapoFlux += (isDense ? 220 : 140) * healthWeight;
      totalStormwaterRetained += 4.5 * maturity;
      totalCarbonSeq += (isDense ? 32 : 18) * maturity;
    } else if (item.type === 'vegetated_hedge') {
      totalCoolingPower += 0.4 * healthWeight;
      totalPMMitigation += 1.8 * healthWeight * maturity; // Very high near-ground particulate trapping
      totalNO2Mitigation += 1.1 * healthWeight * maturity;
      totalEvapoFlux += 60 * healthWeight;
      totalStormwaterRetained += 2.0;
      totalCarbonSeq += 8 * maturity;
    } else if (item.type.startsWith('green_roof')) {
      const isIntensive = item.type === 'green_roof_intensive';
      totalCoolingPower += (isIntensive ? 0.9 : 0.6) * healthWeight;
      totalPMMitigation += 0.4 * healthWeight;
      totalNO2Mitigation += 0.6 * healthWeight;
      totalStormwaterRetained += isIntensive ? 18.0 : 12.0;
      totalEvapoFlux += 120 * healthWeight;
      totalCarbonSeq += 15 * maturity;
    } else if (item.type === 'green_wall') {
      totalCoolingPower += 0.8 * healthWeight;
      totalPMMitigation += 0.9 * healthWeight;
      totalNO2Mitigation += 0.9 * healthWeight;
      totalEvapoFlux += 90 * healthWeight;
      totalCarbonSeq += 12 * maturity;
    } else if (item.type === 'bioswale_rain_garden') {
      totalCoolingPower += 0.5 * healthWeight;
      totalPMMitigation += 0.5 * healthWeight;
      totalNO2Mitigation += 0.4 * healthWeight;
      totalStormwaterRetained += 28.0;
      totalEvapoFlux += 80 * healthWeight;
      totalCarbonSeq += 6 * maturity;
    } else if (item.type === 'cool_pavement') {
      totalCoolingPower += 1.1 * healthWeight;
      totalPMMitigation += 0.2;
      totalNO2Mitigation += 0.5; // Photocatalytic NOx breakdown
      totalStormwaterRetained += 10.0;
    } else if (item.type === 'traffic_calming') {
      totalCoolingPower += 0.4;
      totalPMMitigation += 1.6; // Source reduction
      totalNO2Mitigation += 2.2;
      totalShadeArea += 8;
    }
  });

  // Calculate percentage reductions with saturation curve
  const pmReductionPercent = Math.min(68, totalPMMitigation * 10.5);
  const no2ReductionPercent = Math.min(58, totalNO2Mitigation * 9.2);
  const tempReduction = Math.min(5.8, Math.round(totalCoolingPower * 0.95 * 10) / 10);
  const mrtReduction = Math.min(14.5, Math.round((tempReduction * 2.2 + totalShadeArea * 0.18) * 10) / 10);

  const currentAvgTemp = Math.round((baselineAvgTemp - tempReduction) * 10) / 10;
  const currentMaxMrt = Math.round((baselineMaxMrt - mrtReduction) * 10) / 10;
  const baselineAvgPM25 = Math.round(baselinePM25Peak * 10) / 10;
  const currentAvgPM25 = Math.round((baselineAvgPM25 * (1 - pmReductionPercent / 100)) * 10) / 10;
  const baselineAvgNO2 = Math.round(baselineNO2Peak * 10) / 10;
  const currentAvgNO2 = Math.round((baselineAvgNO2 * (1 - no2ReductionPercent / 100)) * 10) / 10;

  // Determine UTCI Thermal Comfort Class
  let utciThermalComfortCategory: SimulationMetrics['utciThermalComfortCategory'] = 'Estrés Térmico Muy Fuerte';
  if (currentAvgTemp < 26) utciThermalComfortCategory = 'Confort';
  else if (currentAvgTemp < 30) utciThermalComfortCategory = 'Estrés Térmico Ligero';
  else if (currentAvgTemp < 33.5) utciThermalComfortCategory = 'Estrés Térmico Moderado';
  else if (currentAvgTemp < 36.5) utciThermalComfortCategory = 'Estrés Térmico Fuerte';
  else utciThermalComfortCategory = 'Estrés Térmico Muy Fuerte';

  // Economic & health calculation
  // Avoided DALYs and healthcare costs per year based on PM2.5 and Heat mortality reduction
  const avoidedHealthCostAnnualEur = Math.round((pmReductionPercent * 480 + tempReduction * 3200 + totalStormwaterRetained * 35));

  const metrics: SimulationMetrics = {
    baselineAvgTemp: Math.round(baselineAvgTemp * 10) / 10,
    currentAvgTemp,
    tempReduction,
    baselineMaxMrt: Math.round(baselineMaxMrt * 10) / 10,
    currentMaxMrt,
    mrtReduction,
    baselineAvgPM25,
    currentAvgPM25,
    pm25ReductionPercent: Math.round(pmReductionPercent),
    baselineAvgNO2,
    currentAvgNO2,
    no2ReductionPercent: Math.round(no2ReductionPercent),
    pedestrianShadeArea: Math.min(85, Math.round(totalShadeArea + 8)),
    evapotranspirativeFlux: Math.round(totalEvapoFlux),
    stormwaterRetainedAnnualM3: Math.round(totalStormwaterRetained * 12),
    carbonSequesteredAnnualKg: Math.round(totalCarbonSeq),
    avoidedHealthCostAnnualEur,
    utciThermalComfortCategory
  };

  // 3. Update sensitive receptors exposure
  const updatedReceptors = receptors.map((rec) => {
    // Proximity to placed NbS
    let localPMDrop = pmReductionPercent;
    let localTempDrop = tempReduction;

    // Check if hedge is nearby (x: 20-35 or 65-80)
    const hasNearbyHedge = placedNbS.some(
      (n) => n.type === 'vegetated_hedge' && Math.abs(n.x - rec.x) < 18
    );
    if (hasNearbyHedge) {
      localPMDrop = Math.min(75, localPMDrop * 1.35 + 15);
    }

    const hasNearbyTree = placedNbS.some(
      (n) => n.type.startsWith('tree_canopy') && Math.abs(n.x - rec.x) < 22
    );
    if (hasNearbyTree) {
      localTempDrop = Math.min(6.5, localTempDrop * 1.3 + 1.2);
    }

    const currPM = Math.max(5, Math.round((rec.baselineExposure.pm25 * (1 - localPMDrop / 100)) * 10) / 10);
    const currTemp = Math.round((rec.baselineExposure.temp - localTempDrop) * 10) / 10;

    let currUtci = 'Confort';
    if (currTemp > 36) currUtci = 'Estrés Térmico Muy Fuerte';
    else if (currTemp > 33.5) currUtci = 'Estrés Térmico Fuerte';
    else if (currTemp > 30.5) currUtci = 'Estrés Térmico Moderado';
    else if (currTemp > 26.5) currUtci = 'Estrés Térmico Ligero';

    return {
      ...rec,
      currentExposure: {
        pm25: currPM,
        temp: currTemp,
        utci: currUtci
      }
    };
  });

  return { metrics, updatedReceptors };
}

/**
 * Calculates aerodynamic and thermodynamic field state at normalized coordinates (0..100)
 */
export function sampleCanyonPoint(
  x: number, // 0 = left building wall, 50 = roadway center, 100 = right building wall
  y: number, // 0 = ground level (sidewalk/road), 100 = roof top / sky boundary
  canyon: UrbanCanyonConfig,
  meteo: AmbientMeteorology,
  placedNbS: PlacedNbS[],
  metrics: SimulationMetrics
): CanyonPointState {
  const isSidewalkLeft = x < 30;
  const isRoadway = x >= 30 && x <= 70;
  const isSidewalkRight = x > 70;

  // 1. Aerodynamic recirculation vortex
  // In a street canyon with perpendicular roof wind, a primary vortex rotates counter-clockwise
  // Center is roughly at (50, 50)
  const normX = (x - 50) / 50; // -1 to 1
  const normY = (y - 50) / 50; // -1 to 1
  const radius = Math.sqrt(normX * normX + normY * normY);

  // Vortex tangential velocity
  const vortexStrength = meteo.windSpeedRoof * 0.45;
  // Wind vector: u = -normY, v = normX (counter-clockwise rotation)
  let windU = -normY * vortexStrength * (1.2 - radius * 0.4);
  let windV = normX * vortexStrength * (1.2 - radius * 0.4);

  // Roof shear layer: strong horizontal wind near top
  if (y > 75) {
    const shearWeight = (y - 75) / 25;
    windU = windU * (1 - shearWeight) + meteo.windSpeedRoof * shearWeight;
    windV = windV * (1 - shearWeight) * 0.2;
  }

  // 2. Pollutant emission plume (source at roadway ground y < 15, x: 35-65)
  const distFromRoadCenter = Math.abs(x - 50);
  const roadProximity = Math.max(0, 1 - distFromRoadCenter / 30);
  const heightAttenuation = Math.max(0.15, 1 - y / 80);

  // Raw emission
  const baseEmission = (canyon.trafficVolume / 1000) * 25 * roadProximity * heightAttenuation;
  let pointPM25 = meteo.backgroundPM25 + baseEmission;
  let pointNO2 = meteo.backgroundNO2 + baseEmission * 1.2;

  // Vortex advection: wind blows from right to left at ground (y < 30),
  // so left sidewalk (leeward side) accumulates more pollutants
  if (y < 40 && x < 40) {
    pointPM25 += baseEmission * 0.4;
    pointNO2 += baseEmission * 0.45;
  }

  // 3. Temperature field
  const solarAngle = Math.sin(Math.max(0, Math.min(Math.PI, ((meteo.timeOfDayHour - 6) / 12) * Math.PI)));
  const groundHeating = isRoadway ? 7.5 : 5.0;
  let pointTemp = meteo.ambientTemp + groundHeating * solarAngle * Math.max(0.2, 1 - y / 70);
  let pointMrt = pointTemp + meteo.solarRadiation * 0.02 * solarAngle;

  // 4. NbS Local Impact at (x, y)
  let localVegDensity = 0;
  let isShaded = false;

  placedNbS.forEach((item) => {
    const distSq = Math.pow(item.x - x, 2) + Math.pow(item.y - y, 2);
    const dist = Math.sqrt(distSq);

    if (item.type.startsWith('tree_canopy')) {
      // Tree effect zone
      if (dist < 22) {
        const factor = Math.max(0, 1 - dist / 22);
        localVegDensity = Math.max(localVegDensity, factor);
        pointPM25 *= 1 - 0.45 * factor;
        pointNO2 *= 1 - 0.35 * factor;
        pointTemp -= 3.8 * factor;
        pointMrt -= 12.0 * factor;
        isShaded = true;
        // tree slows wind down slightly
        windU *= 0.65;
        windV *= 0.65;
      }
    } else if (item.type === 'vegetated_hedge') {
      // Hedge effect near ground and near hedge x
      if (Math.abs(item.x - x) < 14 && y < 25) {
        const factor = Math.max(0, 1 - Math.abs(item.x - x) / 14);
        localVegDensity = Math.max(localVegDensity, factor * 0.8);
        pointPM25 *= 1 - 0.60 * factor; // Strong particulate trapping
        pointNO2 *= 1 - 0.40 * factor;
        pointTemp -= 1.8 * factor;
        pointMrt -= 4.0 * factor;
        // Hedge deflects horizontal wind upward
        windV += Math.abs(windU) * 0.5;
      }
    } else if (item.type.startsWith('green_roof') && y > 75) {
      if (Math.abs(item.x - x) < 30) {
        pointTemp -= 2.5;
        pointMrt -= 8.0;
        localVegDensity = Math.max(localVegDensity, 0.7);
      }
    } else if (item.type === 'green_wall') {
      const isNearWall = x < 15 || x > 85;
      if (isNearWall && Math.abs(item.y - y) < 35) {
        pointTemp -= 2.2;
        pointPM25 *= 0.75;
        pointNO2 *= 0.7;
        localVegDensity = Math.max(localVegDensity, 0.75);
      }
    } else if (item.type === 'cool_pavement' && isRoadway && y < 15) {
      pointTemp -= 2.8;
      pointMrt -= 6.0;
    } else if (item.type === 'traffic_calming' && isRoadway) {
      pointPM25 *= 0.65;
      pointNO2 *= 0.55;
    }
  });

  const windMagnitude = Math.sqrt(windU * windU + windV * windV);

  let utci = 'Confort';
  if (pointTemp > 36) utci = 'Estrés Muy Fuerte';
  else if (pointTemp > 33) utci = 'Estrés Fuerte';
  else if (pointTemp > 30) utci = 'Estrés Moderado';
  else if (pointTemp > 26) utci = 'Estrés Ligero';

  return {
    x,
    y,
    tempAir: Math.round(pointTemp * 10) / 10,
    tempMrt: Math.round(pointMrt * 10) / 10,
    pm25: Math.max(2, Math.round(pointPM25 * 10) / 10),
    no2: Math.max(2, Math.round(pointNO2 * 10) / 10),
    windU: Math.round(windU * 100) / 100,
    windV: Math.round(windV * 100) / 100,
    windMagnitude: Math.round(windMagnitude * 100) / 100,
    isShaded,
    vegetationDensity: Math.round(localVegDensity * 100) / 100,
    utciComfort: utci
  };
}
