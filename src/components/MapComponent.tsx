"use client";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Shield, Radio, Activity, MapPin } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

// Sample coordinates for ARIA Hubs (using generic South Asia coords for demo)
const hubs = [
  { id: 1, name: "Strategic Command HQ", type: "Command", lat: 28.6139, lon: 77.2090, status: "Secure", signal: "98%" },
  { id: 2, name: "Regional Intelligence Outpost", type: "Intelligence", lat: 28.5355, lon: 77.3910, status: "Active", signal: "84%" },
  { id: 3, name: "Urban Infrastructure Node", type: "Infrastructure", lat: 28.704100, lon: 77.102500, status: "Monitoring", signal: "92%" },
  { id: 4, name: "Emergency Protocol Station", type: "Emergency", lat: 28.4595, lon: 77.0266, status: "Standby", signal: "100%" },
];

const createCustomIcon = (type: string) => {
  const iconMarkup = renderToStaticMarkup(
    <div className="relative flex items-center justify-center">
      <div className={`absolute w-12 h-12 rounded-full animate-ping opacity-25 ${type === 'Command' ? 'bg-blue-500' : type === 'Emergency' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
      <div className={`relative z-10 p-2.5 rounded-xl border-2 shadow-xl ${
         type === 'Command' ? 'bg-blue-600 border-blue-400' : 
         type === 'Emergency' ? 'bg-red-600 border-red-400' : 
         'bg-emerald-600 border-emerald-400'
      }`}>
        {type === 'Command' ? <Shield className="w-5 h-5 text-white" /> : 
         type === 'Intelligence' ? <Radio className="w-5 h-5 text-white" /> : 
         type === 'Infrastructure' ? <Activity className="w-5 h-5 text-white" /> : 
         <MapPin className="w-5 h-5 text-white" />}
      </div>
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: 'custom-leaflet-icon',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
  });
};

export default function MapComponent() {
  return (
    <div className="h-full w-full bg-navy-950 overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <MapContainer 
        center={[28.6139, 77.2090]} 
        zoom={11} 
        scrollWheelZoom={true} 
        className="h-full w-full z-10 map-vivid-filter"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {hubs.map((hub) => (
          <Marker 
            key={hub.id} 
            position={[hub.lat, hub.lon]} 
            icon={createCustomIcon(hub.type)}
          >
            <Popup className="premium-popup">
              <div className="p-4 bg-navy-900/90 backdrop-blur-md text-white rounded-2xl border border-blue-500/30 min-w-[240px] shadow-2xl shadow-blue-900/50">
                <div className="flex items-center justify-between mb-3 border-b border-navy-700/50 pb-2">
                  <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-blue-400">{hub.name}</h3>
                  <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${hub.status === 'Secure' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'}`}>
                    {hub.status}
                  </div>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <span className="block text-[8px] text-navy-400 font-black uppercase tracking-widest">Signal Strength</span>
                        <span className="text-lg font-black tracking-tighter text-white">{hub.signal}</span>
                      </div>
                      <div className="w-24 bg-navy-800 h-1.5 rounded-full overflow-hidden border border-navy-700">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full" style={{ width: hub.signal }}></div>
                      </div>
                   </div>
                </div>
                <button className="w-full mt-4 py-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-[10px] font-black uppercase tracking-[0.2em] text-white rounded-xl transition-all border border-blue-400/30 shadow-lg shadow-blue-900/20 active:scale-[0.98]">
                  Secure Comms Channel
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* Global Style Enhancements */}
      <style jsx global>{`
        .map-vivid-filter {
          filter: brightness(1.15) contrast(1.1) saturate(1.1);
        }
        .leaflet-container {
          background: #020617 !important;
        }
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-popup-close-button {
          display: none !important;
        }
        .custom-leaflet-icon {
          background: transparent !important;
          border: none !important;
          filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.5));
        }
        .leaflet-tile-pane {
          filter: grayscale(0.2) brightness(1.1);
        }
      `}</style>
    </div>
  );
}
