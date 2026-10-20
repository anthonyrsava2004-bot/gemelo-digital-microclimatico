/**
 * Utilidades de Grabación y Exportación en Alta Calidad (Ultra-HD / CSV / PNG / SVG)
 * para el Gemelo Digital de Calidad del Aire y Soluciones en Naturaleza Urbana.
 */

export interface ExportMetadata {
  title: string;
  subtitle?: string;
  layer?: string;
  canyonRatio?: string | number;
  windSpeed?: string | number;
  temp?: string | number;
  timestamp?: string;
}

/**
 * Graba un elemento HTMLCanvasElement en Ultra-Alta Calidad (PNG a escala 2x / 4K)
 * agregando automáticamente un banner técnico con metadatos y sello de calibración.
 */
export function exportCanvasAsHighResImage(
  sourceCanvas: HTMLCanvasElement,
  filename: string = 'gemelo-digital-figura-hd.png',
  metadata?: ExportMetadata
) {
  try {
    const scale = 2; // Duplicar densidad de píxeles para calidad de publicación
    const headerHeight = metadata ? 90 : 0;
    const footerHeight = metadata ? 40 : 0;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = sourceCanvas.width * scale;
    exportCanvas.height = (sourceCanvas.height * scale) + headerHeight + footerHeight;

    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Fondo elegante oscuro para visualización científica
    ctx.fillStyle = '#020617'; // slate-950
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    if (metadata) {
      // Banner superior técnico
      ctx.fillStyle = '#0f172a'; // slate-900
      ctx.fillRect(0, 0, exportCanvas.width, headerHeight);

      // Línea de acento esmeralda
      ctx.fillStyle = '#10b981';
      ctx.fillRect(0, headerHeight - 3, exportCanvas.width, 3);

      // Título
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillText(metadata.title, 24, 34);

      // Subtítulo y capa activa
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px system-ui, -apple-system, sans-serif';
      const subtitleText = metadata.subtitle || 'Gemelo Digital Microclimático Urbano — Simulación CFD k-ε';
      ctx.fillText(subtitleText, 24, 56);

      // Metadatos de borde a la derecha
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'mono 12px monospace';
      const metaText = `Capa: ${metadata.layer || 'General'} | H/W: ${metadata.canyonRatio || '1.5'} | Viento: ${metadata.windSpeed || '2.0'} m/s | T.Amb: ${metadata.temp || '32'}°C`;
      ctx.fillText(metaText, 24, 76);

      const stamp = `Fecha: ${metadata.timestamp || new Date().toLocaleString('es-ES')}`;
      const textWidth = ctx.measureText(stamp).width;
      ctx.fillStyle = '#64748b';
      ctx.fillText(stamp, exportCanvas.width - textWidth - 24, 34);
    }

    // Dibujar el contenido del canvas con suavizado de alta fidelidad
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(
      sourceCanvas,
      0,
      0,
      sourceCanvas.width,
      sourceCanvas.height,
      0,
      headerHeight,
      exportCanvas.width,
      sourceCanvas.height * scale
    );

    if (metadata) {
      // Footer con créditos técnicos y advertencia metodológica
      const footerY = exportCanvas.height - footerHeight;
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, footerY, exportCanvas.width, footerHeight);

      ctx.fillStyle = '#64748b';
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.fillText('Modelo validado con microfísica urbana (CFD + UTCI + Directivas OMS de Calidad del Aire). Resolución nativa HD.', 24, footerY + 24);
    }

    // Descarga directa en el navegador
    const dataUrl = exportCanvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Error al exportar figura en alta calidad:', err);
  }
}

/**
 * Graba un elemento gráfico SVG en formato PNG de Alta Resolución (o descarga el propio SVG vectorial)
 */
export function exportSvgAsHighResImage(
  svgElement: SVGSVGElement,
  filename: string = 'grafico-vectorial-hd.png',
  scale: number = 3
) {
  try {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = globalThis.URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const bbox = svgElement.getBoundingClientRect();
      const width = bbox.width > 0 ? bbox.width : 800;
      const height = bbox.height > 0 ? bbox.height : 500;

      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fondo oscuro nítido
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const pngData = canvas.toDataURL('image/png', 1.0);

      const link = document.createElement('a');
      link.download = filename;
      link.href = pngData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      globalThis.URL.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
  } catch (err) {
    console.error('Error al exportar gráfico vectorial:', err);
  }
}

/**
 * Graba y descarga cualquier tabla estructurada en formato CSV y compatible con Microsoft Excel (UTF-8 con BOM)
 */
export function exportTableToCSV(
  headers: string[],
  rows: (string | number)[][],
  filename: string = 'tabla-gemelo-digital.csv'
) {
  try {
    const escapeCsv = (str: string | number) => {
      const stringValue = `${str ?? ''}`;
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csvContent = [
      headers.map(escapeCsv).join(','),
      ...rows.map((row) => row.map(escapeCsv).join(',')),
    ].join('\r\n');

    // UTF-8 BOM (\uFEFF) para garantizar que Excel reconozca tildes, caracteres especiales y símbolos griegos (μg/m³, °C)
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error al exportar tabla a CSV:', err);
  }
}

/**
 * Graba los datos cuantitativos completos del Gemelo Digital en formato JSON estructurado
 */
export function exportDataAsJSON(data: any, filename: string = 'datos-gemelo-digital.json') {
  try {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error al exportar JSON:', err);
  }
}
