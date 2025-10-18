import React, { useEffect, useRef } from 'react';
import { HeatmapPoint } from '../types';

// Esto le dice a TypeScript que heatmap.js ha adjuntado un objeto al window global.
declare global {
  interface Window {
    h337: any;
  }
}

interface HeatmapOverlayProps {
  data: HeatmapPoint[];
}

const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ data }) => {
  const heatmapContainerRef = useRef<HTMLDivElement>(null);
  const heatmapInstanceRef = useRef<any>(null); // para almacenar la instancia del mapa de calor

  useEffect(() => {
    // Asegurarse de que el contenedor y la librería heatmap.js estén listos
    if (heatmapContainerRef.current && window.h337) {
      // Crear la instancia del mapa de calor solo una vez
      if (!heatmapInstanceRef.current) {
        heatmapInstanceRef.current = window.h337.create({
          container: heatmapContainerRef.current,
          radius: 90, // Radio de cada punto de datos
          maxOpacity: 0.6, // Opacidad máxima de los puntos calientes
          minOpacity: 0.1, // Opacidad mínima
          blur: 0.9, // Cantidad de desenfoque
        });
      }

      // Preparar los datos para la librería
      const heatmapData = {
        max: 5, // Un valor máximo bajo hace que los clics iniciales sean más visibles
        data: data,
      };

      // Actualizar el mapa de calor con los nuevos datos
      heatmapInstanceRef.current.setData(heatmapData);
    }
  }, [data]); // Este efecto se ejecuta cada vez que los datos del mapa de calor cambian

  return (
    <div
      ref={heatmapContainerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10"
      aria-hidden="true"
    />
  );
};

export default HeatmapOverlay;