'use client';

import { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons
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

interface RouteDrawerProps {
  onRouteChange: (coordinates: [number, number][]) => void; // [lng, lat]
  initialCoordinates?: [number, number][];
  height?: string;
}

// Component to handle map clicks
function MapClickHandler({
  points,
  setPoints
}: {
  points: [number, number][];
  setPoints: (points: [number, number][]) => void;
}) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setPoints([...points, [lat, lng]]);
    },
  });

  return null;
}

export default function RouteDrawer({
  onRouteChange,
  initialCoordinates = [],
  height = '500px',
}: RouteDrawerProps) {
  // Store points as [lat, lng] for Leaflet, convert to [lng, lat] for GeoJSON when needed
  const [points, setPoints] = useState<[number, number][]>(
    initialCoordinates.map(coord => [coord[1], coord[0]])
  );

  // Notify parent when points change
  useEffect(() => {
    // Convert from [lat, lng] to [lng, lat] for GeoJSON
    const geoJsonCoords: [number, number][] = points.map(p => [p[1], p[0]]);
    onRouteChange(geoJsonCoords);
  }, [points, onRouteChange]);

  const handleUndo = () => {
    if (points.length > 0) {
      setPoints(points.slice(0, -1));
    }
  };

  const handleClear = () => {
    setPoints([]);
  };

  const startPoint = points.length > 0 ? points[0] : null;
  const endPoint = points.length > 1 ? points[points.length - 1] : null;

  return (
    <div className="relative">
      {/* Map */}
      <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden border-2 border-gray-300">
        <MapContainer
          center={[52.0705, 4.3007]} // The Hague
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Handle map clicks */}
          <MapClickHandler points={points} setPoints={setPoints} />

          {/* Draw polyline */}
          {points.length > 1 && (
            <Polyline
              positions={points}
              pathOptions={{
                color: '#EF4444',
                weight: 4,
                opacity: 0.8,
              }}
            />
          )}

          {/* Start marker */}
          {startPoint && (
            <Marker position={startPoint} icon={startIcon} />
          )}

          {/* End marker */}
          {endPoint && startPoint !== endPoint && (
            <Marker position={endPoint} icon={endIcon} />
          )}
        </MapContainer>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={handleUndo}
          disabled={points.length === 0}
          className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
          title="Undo last point"
        >
          ↶ Undo
        </button>
        <button
          onClick={handleClear}
          disabled={points.length === 0}
          className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
          title="Clear all points"
        >
          ✕ Clear
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>How to draw:</strong> Click on the map to add points along your route.
          The route will automatically connect the points. Click "Undo" to remove the last point or "Clear" to start over.
        </p>
        <p className="text-sm text-blue-700 mt-2">
          Points: {points.length} {points.length > 1 && `• Route segments: ${points.length - 1}`}
        </p>
      </div>
    </div>
  );
}
