/**
 * Brazukas Delivery - Track Map Component
 * Mapa interativo com Leaflet para rastreamento de pedido
 */

import { useEffect, useState, useMemo, lazy } from "react";
import { Suspense } from "react";

// Lazy load Leaflet components
let MapContainer: any = null;
let TileLayer: any = null;
let Marker: any = null;
let Popup: any = null;
let Polyline: any = null;

if (typeof window !== "undefined") {
  try {
    const rl = require("react-leaflet");
    MapContainer = rl.MapContainer;
    TileLayer = rl.TileLayer;
    Marker = rl.Marker;
    Popup = rl.Popup;
    Polyline = rl.Polyline;
  } catch (e) {
    console.warn("Leaflet não disponível");
  }
}

interface Location {
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  ts?: string;
}

interface TrackMapProps {
  orderId: string;
  driverLocation: Location | null;
  driverHistory: Location[];
  pickupLocation?: { lat: number; lng: number; name?: string };
  dropoffLocation?: { lat: number; lng: number; name?: string };
}

export default function TrackMap({
  orderId,
  driverLocation,
  driverHistory,
  pickupLocation,
  dropoffLocation,
}: TrackMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calcular bounds do mapa
  const bounds = useMemo(() => {
    const lats: number[] = [];
    const lngs: number[] = [];

    if (driverLocation) {
      lats.push(driverLocation.lat);
      lngs.push(driverLocation.lng);
    }

    if (pickupLocation) {
      lats.push(pickupLocation.lat);
      lngs.push(pickupLocation.lng);
    }

    if (dropoffLocation) {
      lats.push(dropoffLocation.lat);
      lngs.push(dropoffLocation.lng);
    }

    if (lats.length === 0) {
      return { center: [-25.5, -54.6], zoom: 13 }; // Ciudad del Este default
    }

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    return {
      center: [(minLat + maxLat) / 2, (minLng + maxLng) / 2],
      zoom: 15,
    };
  }, [driverLocation, pickupLocation, dropoffLocation]);

  if (!mounted) {
    return (
      <div className="w-full h-96 rounded-lg border border-border bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Carregando mapa...</p>
      </div>
    );
  }

  const polylinePoints = driverHistory.map((loc) => [loc.lat, loc.lng]);

  return (
    <div className="w-full h-96 rounded-lg border border-border overflow-hidden">
      <MapContainer
        center={[bounds.center[0], bounds.center[1]]}
        zoom={bounds.zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Rota do entregador */}
        {polylinePoints.length > 1 && (
          <Polyline
            positions={polylinePoints as [number, number][]}
            color="#006A3A"
            weight={3}
            opacity={0.7}
          />
        )}

        {/* Localização atual do entregador */}
        {driverLocation && (
          <Marker position={[driverLocation.lat, driverLocation.lng]}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Entregador</p>
                <p>Velocidade: {(driverLocation.speed || 0).toFixed(1)} km/h</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(driverLocation.ts || "").toLocaleTimeString("pt-BR")}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Localização de coleta */}
        {pickupLocation && (
          <Marker position={[pickupLocation.lat, pickupLocation.lng]}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Coleta</p>
                <p>{pickupLocation.name || "Loja"}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Localização de entrega */}
        {dropoffLocation && (
          <Marker position={[dropoffLocation.lat, dropoffLocation.lng]}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Entrega</p>
                <p>{dropoffLocation.name || "Endereço"}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
