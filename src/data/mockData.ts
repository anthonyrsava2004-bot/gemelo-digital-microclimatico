import { NbSDefinition, CaseStudyPreset, SlideData, SensitiveReceptor } from '../types';

export const NBS_CATALOG: NbSDefinition[] = [
  {
    id: 'tree_canopy_dense',
    name: 'Arbolado de Copa Densa & Alto LAI',
    category: 'Vegetación de Estrato Alto',
    icon: 'Trees',
    description: 'Árboles maduros de copa amplia (ej. Platanus hispanica, Celtis australis, Quercus ilex). Proporcionan sombra continua y alta evapotranspiración.',
    speciesExamples: ['Platanus hispanica (Plátano de sombra)', 'Celtis australis (Almez)', 'Quercus ilex (Encina urbana)'],
    mechanisms: [
      'Intercepción de radiación solar directa (reducción del 70-90% de radiación de onda corta)',
      'Enfriamiento por evapotranspiración latente (100-300 kWh/árbol/verano)',
      'Captación y deposición seca de partículas PM2.5 y PM10 en superficie foliar y corteza rugosa'
    ],
    coolingEfficiency: 9,
    pmTrappingEfficiency: 8,
    no2UptakeEfficiency: 7,
    runoffRetention: 35,
    costIndex: 'Medio',
    coBenefits: ['Reducción de radiación UV', 'Confort acústico', 'Biodiversidad de avifauna urbana'],
    color: '#10b981'
  },
  {
    id: 'tree_canopy_moderate',
    name: 'Arbolado de Copa Ligera / Alta Ventilación',
    category: 'Vegetación de Estrato Alto',
    icon: 'TreePine',
    description: 'Especies de copa permeable (Fraxinus ornus, Jacaranda mimosifolia, Sophora japonica) diseñadas para cañones estrechos para evitar atrapar contaminantes en el suelo.',
    speciesExamples: ['Fraxinus angustifolia', 'Jacaranda mimosifolia', 'Sophora japonica'],
    mechanisms: [
      'Sombra tamizada sin obstaculizar la ventilación y el vórtice de escape en el cañón',
      'Menor resistencia aerodinámica al flujo de viento que dispersa el NO2',
      'Filtración foliar de aerosoles finos'
    ],
    coolingEfficiency: 7,
    pmTrappingEfficiency: 6,
    no2UptakeEfficiency: 6,
    runoffRetention: 25,
    costIndex: 'Medio',
    coBenefits: ['Permite el paso de luz natural en invierno (caducifolios)', 'Floración estacional'],
    color: '#34d399'
  },
  {
    id: 'vegetated_hedge',
    name: 'Seto Vegetal Antipartículas en Acera',
    category: 'Estrato Arbustivo & Acera',
    icon: 'Shield',
    description: 'Barreras vivas densas (1.2m - 1.8m de altura) entre la calzada de vehículos y la acera peatonal (Ligustrum, Euonymus, Buxus, Hedera).',
    speciesExamples: ['Ligustrum vulgare (Aligustre)', 'Prunus laurocerasus', 'Euonymus japonicus'],
    mechanisms: [
      'Intercepción aerodinámica inmediata de la pluma de escape vehicular a la altura de respiración de niños y cochecitos',
      'Desviación del flujo turbulento de tubos de escape hacia arriba lejos de la acera',
      'Fijación de hollín (Black Carbon) y metales pesados en ceras cuticulares'
    ],
    coolingEfficiency: 6,
    pmTrappingEfficiency: 10,
    no2UptakeEfficiency: 7,
    runoffRetention: 20,
    costIndex: 'Bajo',
    coBenefits: ['Protección física peatón-vehículo', 'Aislamiento acústico de rodadura (-3 a -6 dB)'],
    color: '#059669'
  },
  {
    id: 'green_wall',
    name: 'Muro Vegetal & Fachada Bioclimática',
    category: 'Envolvente Edificatoria',
    icon: 'Building2',
    description: 'Sistemas verticales vivos o enredaderas guiadas sobre fachadas ciegas y medianeras expuestas a radiación solar intensa.',
    speciesExamples: ['Parthenocissus tricuspidata', 'Hedera helix', 'Jasminum polyanthum'],
    mechanisms: [
      'Atenuación térmica de la masa del edificio (reduce temperatura de pared hasta 12°C)',
      'Captura de partículas ultrafinas en turbulencias ascendentes junto a la pared',
      'Absorción de NO2 y CO2 por estomas foliares en el plano vertical'
    ],
    coolingEfficiency: 8,
    pmTrappingEfficiency: 7,
    no2UptakeEfficiency: 8,
    runoffRetention: 15,
    costIndex: 'Alto',
    coBenefits: ['Eficiencia energética en refrigeración del edificio (-20% A/C)', 'Aislamiento acústico'],
    color: '#047857'
  },
  {
    id: 'green_roof_extensive',
    name: 'Techo Verde Extensivo / Retentivo',
    category: 'Envolvente Edificatoria',
    icon: 'Layers',
    description: 'Cubierta vegetal de bajo espesor (8-15 cm) con Sedum y gramíneas resistentes a la sequía en azoteas de edificios.',
    speciesExamples: ['Sedum album', 'Sedum acre', 'Delosperma cooperi', 'Thymus serpyllum'],
    mechanisms: [
      'Sustitución de alquitrán o asfalto caliente (albedo 0.10, >65°C) por vegetación (albedo 0.25, <32°C)',
      'Enfriamiento del aire a nivel de cubierta, mejorando la calidad del aire del vórtice superior',
      'Retención del 60-80% del agua de lluvia evitando sobrecarga en colectores'
    ],
    coolingEfficiency: 8,
    pmTrappingEfficiency: 5,
    no2UptakeEfficiency: 6,
    runoffRetention: 75,
    costIndex: 'Medio',
    coBenefits: ['Prolongación de vida útil de la impermeabilización de cubierta x2', 'Refugio de polinizadores'],
    color: '#22c55e'
  },
  {
    id: 'bioswale_rain_garden',
    name: 'Jardines de Lluvia & Alcorques Infiltrantes (SUDS)',
    category: 'Estrato Arbustivo & Acera',
    icon: 'Droplets',
    description: 'Sistemas Urbanos de Drenaje Sostenible (SUDS) integrados en aceras para infiltración biológica, fitorremediación y microclima húmedo.',
    speciesExamples: ['Iris pseudacorus', 'Juncus effusus', 'Carex pendula', 'Lavandula angustifolia'],
    mechanisms: [
      'Infiltración natural y recarga freática con fitorremediación de hidrocarburos de calzada',
      'Aporte continuo de humedad para potenciar la evapotranspiración del arbolado contiguo',
      'Reducción drástica del polvo resuspendido por secado rápido de charcos'
    ],
    coolingEfficiency: 7,
    pmTrappingEfficiency: 6,
    no2UptakeEfficiency: 5,
    runoffRetention: 90,
    costIndex: 'Bajo',
    coBenefits: ['Prevención de inundaciones urbanas repentinas', 'Diseño de paisaje urbano biofílico'],
    color: '#06b6d4'
  },
  {
    id: 'cool_pavement',
    name: 'Pavimento Frío / Reflectante & Poroso',
    category: 'Superficies & Tráfico',
    icon: 'Sparkles',
    description: 'Superficies con alto Índice de Reflectancia Solar (SRI > 70) y mezclas asfálticas o adoquinadas fotocatalíticas y permeables.',
    speciesExamples: ['Adoquín poroso de drenaje continuo', 'Revestimiento frío fotocatalítico con TiO2'],
    mechanisms: [
      'Reflexión de radiación solar incidente (evita almacenamiento de calor sensible nocturno)',
      'Disminución de temperatura superficial de calzada de 55°C a 38°C',
      'Fotocatálisis superficial para degradación pasiva de NOx en presencia de luz UV'
    ],
    coolingEfficiency: 7,
    pmTrappingEfficiency: 4,
    no2UptakeEfficiency: 6,
    runoffRetention: 50,
    costIndex: 'Medio',
    coBenefits: ['Mayor visibilidad nocturna con menor consumo de alumbrado público', 'Menor desgaste por deformación térmica'],
    color: '#38bdf8'
  },
  {
    id: 'traffic_calming',
    name: 'Zona de Bajas Emisiones & Peatonalización',
    category: 'Superficies & Tráfico',
    icon: 'Footprints',
    description: 'Reducción de carriles de circulación rodada, limitación a 30 km/h, prioridad ciclista y ensanche de aceras peatonales.',
    speciesExamples: ['Superisla urbana', 'Eje cívico peatonal', 'Plataforma única con arbolado continuo'],
    mechanisms: [
      'Eliminación directa de la fuente primaria de emisiones de combustión (NO2 y PM2.5)',
      'Reducción de la fricción de frenado y desgaste de neumáticos (fuente principal de PM10 y microplásticos)',
      'Disminución del calor antropogénico desprendido por motores de combustión y tubos de escape'
    ],
    coolingEfficiency: 6,
    pmTrappingEfficiency: 9,
    no2UptakeEfficiency: 10,
    runoffRetention: 30,
    costIndex: 'Medio',
    coBenefits: ['Cero atropellos graves en zonas 30', 'Revitalización del comercio local a pie', 'Fomento de movilidad activa'],
    color: '#8b5cf6'
  }
];

export const INITIAL_RECEPTORS: SensitiveReceptor[] = [
  {
    id: 'rec_school',
    name: 'Escuela Infantil & Primaria "Sol Naciente"',
    type: 'school',
    x: 18,
    y: 1.5,
    vulnerablePop: '180 niños (0-11 años) - Alta vulnerabilidad pulmonar',
    baselineExposure: { pm25: 38.5, temp: 37.8, utci: 'Estrés Térmico Muy Fuerte' },
    currentExposure: { pm25: 18.2, temp: 33.4, utci: 'Estrés Térmico Moderado' }
  },
  {
    id: 'rec_bus_stop',
    name: 'Parada de Transporte Público (Líneas 14, 27, C3)',
    type: 'bus_stop',
    x: 32,
    y: 1.2,
    vulnerablePop: '1,200 pasajeros/día, alta proporción de adultos mayores',
    baselineExposure: { pm25: 46.2, temp: 41.5, utci: 'Estrés Térmico Muy Fuerte' },
    currentExposure: { pm25: 22.0, temp: 34.1, utci: 'Estrés Térmico Moderado' }
  },
  {
    id: 'rec_health_center',
    name: 'Centro de Salud y Atención Primaria',
    type: 'hospital',
    x: 82,
    y: 2.0,
    vulnerablePop: 'Pacientes con patologías respiratorias (asma, EPOC) y cardiovasculares',
    baselineExposure: { pm25: 34.0, temp: 36.9, utci: 'Estrés Térmico Fuerte' },
    currentExposure: { pm25: 16.5, temp: 32.8, utci: 'Confort' }
  },
  {
    id: 'rec_terrace',
    name: 'Zona Peatonal y Terrazas Comerciales',
    type: 'outdoor_cafe',
    x: 70,
    y: 1.5,
    vulnerablePop: 'Transeúntes, trabajadores de hostelería y familias',
    baselineExposure: { pm25: 31.8, temp: 39.2, utci: 'Estrés Térmico Fuerte' },
    currentExposure: { pm25: 15.1, temp: 33.0, utci: 'Confort' }
  }
];

export const CASE_STUDY_PRESETS: CaseStudyPreset[] = [
  {
    id: 'dense_canyon',
    title: 'Cañón Urbano de Alta Densidad (Avenida Central)',
    subtitle: 'Relación de aspecto profunda H/W = 2.0 con tráfico intenso (2,200 veh/h)',
    cityContext: 'Eje comercial central en clima mediterráneo / continental interior',
    description: 'Cañón estrecho flanqueado por edificios de 7-8 plantas. El viento predominante perpendicular genera un vórtice cerrado de recirculación que acumula el humo de tubos de escape en la acera de sotavento, mientras que el calor queda atrapado por la baja reflectancia de las fachadas.',
    canyonConfig: {
      canyonWidth: 18,
      buildingHeightLeft: 32,
      buildingHeightRight: 28,
      aspectRatioHW: 1.7,
      orientation: 'E-W',
      trafficVolume: 2200,
      heavyDutyShare: 14,
      pedestrianFlow: 85
    },
    ambientMeteo: {
      ambientTemp: 36,
      windSpeedRoof: 2.8,
      windDirection: 'perpendicular',
      solarRadiation: 880,
      relativeHumidity: 32,
      timeOfDayHour: 15.0,
      backgroundPM25: 18,
      backgroundNO2: 24
    },
    defaultInterventions: [
      { id: 'p1', type: 'vegetated_hedge', x: 28, y: 5, locationType: 'sidewalk_left', health: 95, ageYears: 4 },
      { id: 'p2', type: 'green_roof_extensive', x: 10, y: 95, locationType: 'roof_left', health: 90, ageYears: 3 },
      { id: 'p3', type: 'green_wall', x: 12, y: 40, locationType: 'facade_left', health: 85, ageYears: 5 },
      { id: 'p4', type: 'tree_canopy_moderate', x: 75, y: 20, locationType: 'sidewalk_right', health: 92, ageYears: 6 },
      { id: 'p5', type: 'cool_pavement', x: 50, y: 2, locationType: 'roadway', health: 100, ageYears: 1 }
    ],
    challenges: [
      'Atrapamiento severo de NO2 a nivel de acera por efecto cañón profundo',
      'Temperaturas radiantes medias (Tmrt) > 52°C durante horas centrales',
      'Poco espacio en subsuelo para raíces profundas'
    ],
    expectedImpact: 'Reducción de PM2.5 en un 42% y descenso térmico de -3.4°C a nivel peatonal mediante setos densos y arbolado de copa semi-permeable.'
  },
  {
    id: 'school_district',
    title: 'Entorno Escolar y Residencial Vulnerable',
    subtitle: 'Zona de recogida de colegios con picos de emisiones matinales y vespertinas',
    cityContext: 'Barrio residencial consolidado con centro escolar y parque infantil anexo',
    description: 'Calle de 22 metros con colegios y guarderías. El estacionamiento en doble fila y los arranques en frío de vehículos provocan picos críticos de partículas ultrafinas (PM2.5, Black Carbon) exactamente a la altura respiratoria de los menores (0.8m - 1.2m).',
    canyonConfig: {
      canyonWidth: 22,
      buildingHeightLeft: 20,
      buildingHeightRight: 18,
      aspectRatioHW: 0.9,
      orientation: 'N-S',
      trafficVolume: 1200,
      heavyDutyShare: 6,
      pedestrianFlow: 140
    },
    ambientMeteo: {
      ambientTemp: 33,
      windSpeedRoof: 3.2,
      windDirection: 'oblique_45',
      solarRadiation: 750,
      relativeHumidity: 40,
      timeOfDayHour: 14.0,
      backgroundPM25: 14,
      backgroundNO2: 16
    },
    defaultInterventions: [
      { id: 's1', type: 'vegetated_hedge', x: 22, y: 5, locationType: 'sidewalk_left', health: 98, ageYears: 3 },
      { id: 's2', type: 'tree_canopy_dense', x: 25, y: 22, locationType: 'sidewalk_left', health: 95, ageYears: 8 },
      { id: 's3', type: 'bioswale_rain_garden', x: 20, y: 2, locationType: 'sidewalk_left', health: 90, ageYears: 2 },
      { id: 's4', type: 'traffic_calming', x: 50, y: 0, locationType: 'roadway', health: 100, ageYears: 1 },
      { id: 's5', type: 'tree_canopy_dense', x: 78, y: 22, locationType: 'sidewalk_right', health: 90, ageYears: 7 }
    ],
    challenges: [
      'Exposición de menores a niveles de PM2.5 300% por encima de guías OMS durante la entrada/salida escolar',
      'Estrés térmico extremo en patios de recreo pavimentados'
    ],
    expectedImpact: 'Eliminación del 58% de la exposición directa a aerosoles vehiculares y creación de una "burbuja de aire limpio y fresco" en el acceso escolar.'
  },
  {
    id: 'civic_plaza_heat_island',
    title: 'Plaza Cívica & Cruce con Isla de Calor Extrema',
    subtitle: 'Espacio abierto sobre-mineralizado con efecto "horno urbano" en olas de calor',
    cityContext: 'Gran nodo peatonal y de transbordo modal en centro urbano',
    description: 'Amplia explanada de pavimento impermeable sin arbolado suficiente. La radiación solar acumulada genera una isla de calor diurna y nocturna extrema, disuadiendo el tránsito peatonal y disparando el riesgo de golpes de calor.',
    canyonConfig: {
      canyonWidth: 35,
      buildingHeightLeft: 18,
      buildingHeightRight: 18,
      aspectRatioHW: 0.5,
      orientation: 'E-W',
      trafficVolume: 800,
      heavyDutyShare: 10,
      pedestrianFlow: 210
    },
    ambientMeteo: {
      ambientTemp: 38.5,
      windSpeedRoof: 1.8,
      windDirection: 'parallel',
      solarRadiation: 950,
      relativeHumidity: 26,
      timeOfDayHour: 15.5,
      backgroundPM25: 22,
      backgroundNO2: 20
    },
    defaultInterventions: [
      { id: 'c1', type: 'tree_canopy_dense', x: 20, y: 22, locationType: 'sidewalk_left', health: 96, ageYears: 10 },
      { id: 'c2', type: 'tree_canopy_dense', x: 45, y: 22, locationType: 'median_strip', health: 95, ageYears: 10 },
      { id: 'c3', type: 'tree_canopy_dense', x: 80, y: 22, locationType: 'sidewalk_right', health: 94, ageYears: 10 },
      { id: 'c4', type: 'bioswale_rain_garden', x: 45, y: 2, locationType: 'median_strip', health: 90, ageYears: 3 },
      { id: 'c5', type: 'cool_pavement', x: 50, y: 1, locationType: 'roadway', health: 100, ageYears: 1 },
      { id: 'c6', type: 'green_roof_intensive', x: 90, y: 95, locationType: 'roof_right', health: 92, ageYears: 4 }
    ],
    challenges: [
      'Temperatura superficial del suelo > 58°C a las 15:00h',
      'Ausencia total de sombra proyectada en el 80% de la superficie',
      'Estrés térmico UTCI en categoría de peligro fisiológico grave'
    ],
    expectedImpact: 'Aumento de cobertura de sombra del 12% al 68%, descenso térmico de -5.2°C y captura hídrica del 85% de precipitaciones torrenciales.'
  }
];

export const PRESENTATION_SLIDES: SlideData[] = [
  {
    id: 1,
    category: 'Contexto & Desafío Global',
    title: 'La Doble Crisis Urbana: Contaminación Atmosférica y Calor Extremo',
    headline: 'El 99% de la población urbana mundial respira aire que supera las directrices de la OMS, agravado por el efecto Isla de Calor Urbano (UHI).',
    keyTakeaway: 'Los cañones urbanos compactos atrapan calor y contaminantes a ras de suelo; se requiere modelado a microescala para diseñar intervenciones biofísicas de máxima eficacia.',
    contentBlocks: [
      {
        subtitle: 'El Fenómeno del Cañón Urbano',
        description: 'La morfología de calles flanqueadas por edificios altos genera vórtices de recirculación aerodinámica que impiden la dispersión natural de PM2.5, PM10 y NO2 emitidos por el tráfico.',
        metricsBadge: '7M muertes prematuras/año (OMS)'
      },
      {
        subtitle: 'Sinergia Letal: Calor + Contaminación',
        description: 'Durante las olas de calor, la formación de ozono troposférico (O3) y la radiación infrarroja de superficies impermeables multiplican los ingresos hospitalarios por crisis cardiorrespiratorias.',
        metricsBadge: '+4.5°C UHI en centros urbanos'
      },
      {
        subtitle: 'La Necesidad de Precisión Métrica',
        description: 'Las estaciones meteorológicas tradicionales (a macroescala) no capturan los gradientes hiperlocales de exposición peatonal donde se concentran los colectivos más vulnerables.',
        metricsBadge: 'Resolución micro < 2 metros'
      }
    ],
    diagramType: 'canyon_cfd',
    speakerNotes: 'Iniciar destacando que el diseño urbano actual sigue planificándose sin herramientas de cálculo a microescala. Explicar cómo el gemelo digital resuelve esta brecha entre el urbanismo y la física ambiental.'
  },
  {
    id: 2,
    category: 'Tecnología & Metodología',
    title: 'Arquitectura del Gemelo Digital a Microescala',
    headline: 'Integración en tiempo real de Dinámica de Fluidos Computacional (CFD), IoT micrometeorológico y balance de energía superficial.',
    keyTakeaway: 'Simulamos mallas de resolución submétrica (1m x 1m) acoplando turbulencia k-ε, transferencia radiativa y dispersión Lagrangiana de partículas.',
    contentBlocks: [
      {
        subtitle: 'Malla Morfológica 3D Hiperlocal',
        description: 'Digitalización del cañón urbano considerando altura de cornisas, relación de aspecto H/W, albedos de fachada, permeabilidad de calzadas y perfil de rugosidad.',
        metricsBadge: 'Malla CFD 3D Acoplada'
      },
      {
        subtitle: 'Trazado de Plumas y Reacciones Químicas',
        description: 'Modelado dinámico de emisiones vehiculares en frío y aceleración, dispersión de aerosoles y fotoquímica de NO-NO2-O3 en función de la radiación solar y la sombra.',
        metricsBadge: 'Pluma de Emisión Dinámica'
      },
      {
        subtitle: 'Módulo de Balance Bioclimático (UTCI & Tmrt)',
        description: 'Cálculo continuo del Índice Universal de Confort Térmico (UTCI) y Temperatura Radiante Media ($T_{mrt}$) para cuantificar el confort fisiológico humano.',
        metricsBadge: 'Fisiología Humana Real'
      }
    ],
    diagramType: 'digital_twin_arch',
    speakerNotes: 'Detallar las tres capas del Gemelo Digital: Capa de Datos (IoT/Morfología), Capa de Física Numérica (CFD/Termodinámica), y Capa de Simulación de Decisiones NbS.'
  },
  {
    id: 3,
    category: 'Soluciones Basadas en la Naturaleza (NbS)',
    title: 'Catálogo de Soluciones Basadas en la Naturaleza Urbana',
    headline: 'Estrategias multifuncionales de infraestructura verde estratificada: de la copa arbórea a la piel del edificio y el pavimento.',
    keyTakeaway: 'No toda la vegetación funciona igual: la selección incorrecta de especies o densidades puede sellar el cañón urbano y empeorar la calidad del aire.',
    contentBlocks: [
      {
        subtitle: 'Estrato Arbóreo (Arbolado Urbano)',
        description: 'Dosel de copa permeable que proporciona sombra masiva y evapotranspiración sin bloquear el vórtice de ventilación natural del cañón.',
        bulletPoints: ['Especies de copa ligera en cañones estrechos', 'Índice de Área Foliar (LAI) calibrado 2.5 - 3.5', 'Reducción de radiación UV > 80%']
      },
      {
        subtitle: 'Estrato Arbustivo (Setos Antipartículas)',
        description: 'Barreras porosas a cota de calzada (1.2m - 1.5m) que desvían e interceptan físicamente el escape vehicular antes de llegar a la zona de respiración de niños y transeúntes.',
        bulletPoints: ['Reducción de PM2.5 en acera de hasta 50%', 'Aislamiento acústico de rodadura vehicular']
      },
      {
        subtitle: 'Envolvente & Superficies (Techos Verdes y Pavimentos Fríos)',
        description: 'Cubiertas vegetales retentivas para enfriar el vórtice superior y pavimentos drenantes con alto albedo solar (SRI > 70) para erradicar la acumulación térmica nocturna.',
        bulletPoints: ['Retención de escorrentía 70-85%', 'Descenso de temperatura superficial de -15°C a -20°C']
      }
    ],
    diagramType: 'nbs_matrix',
    speakerNotes: 'Hacer énfasis en el principio de diseño biofísico: vegetación de bajo estrato para retención de partículas cerca de la fuente + vegetación de alto estrato para sombra y microclima sin asfixiar la ventilación.'
  },
  {
    id: 4,
    category: 'Mecanismos Biofísicos',
    title: 'Mecanismos Biofísicos de Mitigación y Termodinámica Urbana',
    headline: 'Cómo la infraestructura verde altera los flujos de calor sensible y la deposición de contaminantes a microescala.',
    keyTakeaway: 'La combinación de sombra, transpiración vegetal (enfriamiento latente) y captura electrostática/mecánica de partículas transforma cañones inhóspitos en oasis de salud.',
    contentBlocks: [
      {
        subtitle: '1. Reparto del Flujo de Energía (Enfriamiento Latente)',
        description: 'Un árbol maduro evapotranspira entre 150 y 400 litros de agua al día, transformando la radiación solar en calor latente en lugar de calentar el aire (calor sensible).',
        metricsBadge: '-2.5°C a -5.0°C $T_{aire}$'
      },
      {
        subtitle: '2. Deposición Seca en Superficie Foliar ($V_d$)',
        description: 'Las hojas con micro-rugosidades, vellosidades (tricomas) y ceras capturan mecánicamente aerosoles PM2.5 y PM10, retirándolos de la atmósfera hasta el siguiente lavado pluvial.',
        metricsBadge: 'Hasta 4.2 kg PM/árbol/año'
      },
      {
        subtitle: '3. Modificación del Campo de Vientos y Vórtices',
        description: 'Los setos perimetrales generan micro-deflexiones aerodinámicas que expulsan la pluma de contaminantes hacia la capa de mezcla superior, alejándola del nivel peatonal.',
        metricsBadge: 'Blindaje de Acera Activo'
      }
    ],
    diagramType: 'biophysical_fluxes',
    speakerNotes: 'Explicar las ecuaciones básicas: Balance de energía $R_n = H + LE + G$ y la velocidad de deposición seca $F = -V_d \\cdot C$. Mostrar cómo las NbS optimizan estos dos términos simultáneamente.'
  },
  {
    id: 5,
    category: 'Impacto, Salud & Justicia Ambiental',
    title: 'Evaluación de Impacto en Salud Pública y Retorno Social (SROI)',
    headline: 'Proteger a los grupos más vulnerables (niños en escuelas, ancianos en paradas de bus y pacientes respiratorios) es la mayor prioridad.',
    keyTakeaway: 'Cada euro invertido en Soluciones Basadas en la Naturaleza a microescala genera entre 3.8€ y 5.2€ en costes sanitarios evitados y valor ecosistémico.',
    contentBlocks: [
      {
        subtitle: 'Protección Hiperlocal de Receptores Sensibles',
        description: 'El Gemelo Digital monitoriza la reducción de exposición directamente en puntos neurálgicos: puertas de colegios, centros de mayores y corredores peatonales.',
        bulletPoints: ['-48% de crisis asmáticas en entornos escolares', 'Reducción de riesgo de golpe de calor en un 64%']
      },
      {
        subtitle: 'Justicia Ambiental y Cobertura Equitativa',
        description: 'Identificación de "islas de calor desfavorecidas" en barrios con baja densidad de arbolado para priorizar inversiones públicas donde mayor es la vulnerabilidad socioeconómica.',
        bulletPoints: ['Cierre de la brecha térmica interbarrios', 'Creación de refugios climáticos urbanos accesibles']
      },
      {
        subtitle: 'Retorno de Inversión Ecosistémico (SROI)',
        description: 'Ahorro masivo en climatización de edificios colindantes (-18% consumo A/C), menor gasto hospitalario y mayor resiliencia ante lluvias torrenciales (prevención de inundaciones).',
        bulletPoints: ['SROI estimado: 4.5x a 10 años', 'Créditos de carbono y biodiversidad urbana']
      }
    ],
    diagramType: 'health_equity',
    speakerNotes: 'Conectar la ciencia pura con la política pública y la financiación urbana (fondos de resiliencia climática, fondos europeos NextGen, planes de renaturalización urbana).'
  },
  {
    id: 6,
    category: 'Hoja de Ruta & Futuro',
    title: 'Hoja de Ruta: De la Simulación a la Ciudad Resiliente',
    headline: 'Fases de despliegue para integrar el Gemelo Digital en el planeamiento urbano municipal y la toma de decisiones basada en datos.',
    keyTakeaway: 'El Gemelo Digital no es solo un visor; es una plataforma de toma de decisiones predictiva que optimiza millones de euros en obras públicas.',
    contentBlocks: [
      {
        subtitle: 'Fase 1: Diagnóstico de Línea Base & Sensorización IoT',
        description: 'Mapeo CFD de toda la trama urbana y despliegue de micro-sensores calibrados en cañones críticos para alimentar el modelo en tiempo real.',
        metricsBadge: 'Meses 1-3'
      },
      {
        subtitle: 'Fase 2: Gemelo Predictivo & Sandbox de Co-Diseño NbS',
        description: 'Uso de la plataforma por técnicos municipales, urbanistas y ciudadanía para simular escenarios de renaturalización y seleccionar el mix óptimo de especies.',
        metricsBadge: 'Meses 4-6'
      },
      {
        subtitle: 'Fase 3: Ejecución, Monitorización Post-Intervención & IA',
        description: 'Implantación física de arbolado, setos y techos verdes; validación continua del rendimiento biofísico y gemelo autónomo con recomendaciones de mantenimiento asistidas por IA.',
        metricsBadge: 'Meses 7+'
      }
    ],
    diagramType: 'roadmap',
    speakerNotes: 'Cerrar la presentación invitando a los asistentes a interactuar con el prototipo interactivo del Gemelo Digital para experimentar con distintas intervenciones en vivo.'
  }
];
