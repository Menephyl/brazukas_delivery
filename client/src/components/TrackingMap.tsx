/**
 * Brazukas Delivery - Tracking Map Component
 * Mapa interativo para visualizar rota de rastreamento
 */

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface TrackPoint {
  ts?: string | number | Date;
  lat: number;
  lng: number;
  speedKmh?: number;
  heading?: number;
}

interface TrackingMapProps {
  points: TrackPoint[];
  height?: string;
  zoom?: number;
}

// Ícones customizados para Leaflet
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${label}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export default function TrackingMap({
  points,
  height = "400px",
  zoom = 13,
}: TrackingMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layerGroup = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !points || points.length === 0) return;

    // Inicializar mapa se não existir
    if (!map.current) {
      const center: [number, number] = [points[0].lat, points[0].lng];

      map.current = L.map(mapContainer.current, {
        zoomControl: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        scrollWheelZoom: true,
      }).setView(center, zoom);

      // Adicionar tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map.current);

      // Criar layer group para rastreamento
      layerGroup.current = L.layerGroup().addTo(map.current);
    }

    // Limpar camadas anteriores
    if (layerGroup.current) {
      layerGroup.current.clearLayers();
    }

    if (points.length === 0) return;

    // Adicionar pontos de rastreamento
    const latlngs: L.LatLng[] = [];

    points.forEach((point, index) => {
      const latlng = L.latLng(point.lat, point.lng);
      latlngs.push(latlng);

      // Adicionar marcador
      const isStart = index === 0;
      const isEnd = index === points.length - 1;

      let markerColor = "#3b82f6"; // azul padrão
      let label = "";

      if (isStart) {
        markerColor = "#10b981"; // verde para início
        label = "S";
      } else if (isEnd) {
        markerColor = "#ef4444"; // vermelho para fim
        label = "F";
      } else {
        label = (index + 1).toString();
      }

      const marker = L.marker(latlng, {
        icon: createCustomIcon(markerColor, label),
      });

      // Adicionar popup com informações
      const time = point.ts
        ? new Date(point.ts).toLocaleTimeString("pt-BR")
        : "N/A";
      const speed = point.speedKmh ? `${point.speedKmh.toFixed(1)} km/h` : "N/A";
      const heading = point.heading ? `${point.heading.toFixed(0)}°` : "N/A";

      const popupContent = `
        <div style="font-size: 12px; min-width: 150px;">
          <strong>Ponto ${index + 1}</strong><br/>
          <small>Hora: ${time}</small><br/>
          <small>Lat: ${point.lat.toFixed(6)}</small><br/>
          <small>Lng: ${point.lng.toFixed(6)}</small><br/>
          <small>Velocidade: ${speed}</small><br/>
          <small>Direção: ${heading}</small>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(layerGroup.current!);
    });

    // Adicionar linha de rota
    if (latlngs.length > 1) {
      const polyline = L.polyline(latlngs, {
        color: "#3b82f6",
        weight: 3,
        opacity: 0.8,
        smoothFactor: 1,
      });

      polyline.addTo(layerGroup.current!);

      // Ajustar zoom para mostrar toda a rota
      const bounds = L.latLngBounds(latlngs);
      if (map.current) {
        map.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }
    } else if (latlngs.length === 1 && map.current) {
      // Se houver apenas um ponto, centralizar nele
      map.current.setView(latlngs[0], zoom);
    }
  }, [points, zoom]);

  return (
    <div
      ref={mapContainer}
      style={{
        height,
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
      }}
    />
  );
}
