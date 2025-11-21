'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons for start and end markers
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface RouteMapProps {
  routeGeometry?: {
    type: 'LineString';
    coordinates: [number, number][]; // [lng, lat]
  };
  center?: [number, number]; // [lat, lng]
  zoom?: number;
  height?: string;
  showMarkers?: boolean;
  interactive?: boolean;
}

// Component to fit bounds when route changes
function FitBounds({ coordinates }: { coordinates: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      // Convert from [lng, lat] to [lat, lng] for Leaflet
      const latLngs: [number, number][] = coordinates.map(coord => [coord[1], coord[0]]);
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coordinates, map]);

  return null;
}

export default function RouteMap({
  routeGeometry,
  center = [52.0705, 4.3007], // The Hague, Netherlands
  zoom = 13,
  height = '400px',
  showMarkers = true,
  interactive = true,
}: RouteMapProps) {
  // Convert GeoJSON coordinates [lng, lat] to Leaflet format [lat, lng]
  const routeCoordinates: [number, number][] = routeGeometry?.coordinates
    ? routeGeometry.coordinates.map(coord => [coord[1], coord[0]])
    : [];

  const startPoint = routeCoordinates.length > 0 ? routeCoordinates[0] : null;
  const endPoint = routeCoordinates.length > 1 ? routeCoordinates[routeCoordinates.length - 1] : null;

  return (
    <div style={{ height, width: '100%' }} className="relative rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render route polyline */}
        {routeCoordinates.length > 0 && (
          <>
            <Polyline
              positions={routeCoordinates}
              pathOptions={{
                color: '#EF4444',
                weight: 4,
                opacity: 0.8,
              }}
            />

            {/* Auto-fit bounds to route */}
            <FitBounds coordinates={routeGeometry!.coordinates} />
          </>
        )}

        {/* Start marker */}
        {showMarkers && startPoint && (
          <Marker position={startPoint} icon={startIcon}>
            <Popup>
              <strong>Start</strong>
            </Popup>
          </Marker>
        )}

        {/* End marker */}
        {showMarkers && endPoint && startPoint !== endPoint && (
          <Marker position={endPoint} icon={endIcon}>
            <Popup>
              <strong>Finish</strong>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
