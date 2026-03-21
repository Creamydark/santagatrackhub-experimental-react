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

const LiveTrackingMap = () => {
  // Center coordinates (e.g., Manila, Philippines)
  const center = [14.5995, 120.9842];

  const vehicles = [
    { id: "001", pos: [14.605, 120.989], driver: "Juan Dela Cruz" },
    { id: "002", pos: [14.590, 120.975], driver: "Maria Santos" },
  ];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-slate-200">
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '350px', width: '100%' }} // Matches your original CSS height
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {vehicles.map((v) => (
          <Marker key={v.id} position={v.pos}>
            <Popup>
              <div className="text-sm font-sans">
                <p className="font-bold">Vehicle #{v.id}</p>
                <p className="text-slate-600">{v.driver}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveTrackingMap;