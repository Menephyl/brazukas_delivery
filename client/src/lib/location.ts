/**
 * Brazukas Delivery - Driver Location Tracking
 * GPS tracking com envio automático de localização
 */

export async function sendDriverLocation(
  orderId: string,
  coords: GeolocationCoordinates,
  dropoff?: { lat: number; lng: number },
  orderMeta?: any
): Promise<void> {
  const token = localStorage.getItem("bz_driver_token");

  try {
    await fetch("/api/driver/location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        orderId,
        lat: coords.latitude,
        lng: coords.longitude,
        speed: coords.speed || 0,
        heading: coords.heading || 0,
        ts: new Date().toISOString(),
        ...(dropoff && { dropoff }),
        ...(orderMeta && { orderMeta }),
      }),
    });
  } catch (err) {
    console.error("Erro ao enviar localização:", err);
  }
}

let _watchId: number | null = null;
let _currentOrderData: any = null;

export function setCurrentOrderData(data: any): void {
  _currentOrderData = data;
}

export function watchLocation(orderId: string): void {
  if (!navigator.geolocation) {
    console.warn("Geolocation não disponível");
    return;
  }

  // Limpar watch anterior se existir
  if (_watchId !== null) {
    navigator.geolocation.clearWatch(_watchId);
  }

  _watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const dropoff = _currentOrderData?.dropoff;
      const orderMeta = _currentOrderData
        ? {
            confirmedAt: _currentOrderData.confirmedAt,
            createdAt: _currentOrderData.createdAt,
            id: orderId,
          }
        : null;
      sendDriverLocation(orderId, pos.coords, dropoff, orderMeta);
    },
    (err) => console.error("Erro GPS:", err),
    {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 20000,
    }
  );
}

export function stopWatch(): void {
  if (_watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(_watchId);
    _watchId = null;
  }
}
