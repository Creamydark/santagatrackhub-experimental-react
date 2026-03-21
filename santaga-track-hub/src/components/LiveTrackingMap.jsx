import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon paths in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Accept vehicles from the parent component
const LiveTrackingMap = ({ vehicles = [] }) => {
  // Centered around General Trias, Calabarzon
  const center = [14.3838, 120.8809];

  return (
    // Added z-0 to prevent the map from overlapping your modals/dropdowns
    <div className="h-full w-full overflow-hidden z-0 relative">
      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {vehicles.map((v, index) => {
          // Fallback: If your database doesn't have lat/lng yet, we offset them
          // slightly from the center based on their index so they don't stack perfectly on top of each other.
          const lat = v.lat || center[0] + (index * 0.015 - 0.03);
          const lng = v.lng || center[1] + (index * 0.015 - 0.03);

          return (
            <Marker key={v._id || index} position={[lat, lng]}>
              <Popup>
                <div className="text-sm font-sans min-w-[140px]">
                  <p className="font-black text-slate-800 border-b border-slate-100 pb-1.5 mb-1.5 uppercase tracking-wide">
                    {v.name}
                  </p>
                  <div className="space-y-1 mt-2">
                    <p className="text-xs text-slate-600 flex justify-between">
                      <span className="font-bold">Plate:</span> 
                      <span className="font-mono text-blue-600 bg-blue-50 px-1 rounded">{v.id}</span>
                    </p>
                    <p className="text-xs text-slate-600 flex justify-between">
                      <span className="font-bold">Status:</span> 
                      <span className={v.status === 'Moving' ? 'text-green-600 font-bold' : 'text-amber-600 font-bold'}>
                        {v.status}
                      </span>
                    </p>
                    <p className="text-xs text-slate-600 flex justify-between">
                      <span className="font-bold">Speed:</span> 
                      <span>{v.speed}</span>
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default LiveTrackingMap;