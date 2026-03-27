"use client";
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapEntry } from '@/types/map';

// Fix for default marker icons in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function MapUpdater({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        if (center.lat && center.lng) {
            map.setView([center.lat, center.lng], zoom);
        }
    }, [center, zoom, map]);
    return null;
}

interface MapComponentProps {
    entries: MapEntry[];
    center: { lat: number; lng: number };
    zoom?: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ entries, center, zoom = 11 }) => {
    return (
        <div style={{ height: '100%', width: '100%' }}>
            <style jsx global>{`
                .leaflet-container {
                    background: #0F172A !important;
                }
                .pulse-escalation {
                    animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.9); opacity: 0.8; }
                    50% { transform: scale(1.2); opacity: 0.4; }
                    100% { transform: scale(1.4); opacity: 0; }
                }
                .aria-popup .leaflet-popup-content-wrapper {
                    background: #0F172A;
                    color: white;
                    border: 1px solid rgba(59, 130, 246, 0.3);
                    border-radius: 16px;
                    padding: 4px;
                }
                .aria-popup .leaflet-popup-tip {
                    background: #0F172A;
                }
            `}</style>

            <MapContainer 
                center={[center.lat, center.lng]} 
                zoom={zoom} 
                style={{ height: '100%', width: '100%', borderRadius: '32px' }}
                zoomControl={false}
            >
                {/* Google Maps Roadmap Tile Layer (Watermark-Free Fallback) */}
                <TileLayer
                    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    attribution='&copy; Google Maps'
                    maxZoom={20}
                />
                
                <MapUpdater center={center} zoom={zoom} />

                {entries.map((entry, i) => {
                    const color = entry.type === 'field_observation' ? '#3B82F6' : entry.type === 'action_item' ? '#F59E0B' : entry.type === 'escalation' ? '#EF4444' : '#64748B';
                    const badge = entry.type === 'field_observation' ? 'FIELD OBS' : entry.type === 'action_item' ? 'ACTION' : entry.type === 'escalation' ? 'ESCALATED' : 'GRIEVANCE';
                    const title = "title" in entry ? entry.title : "zone_name" in entry ? entry.zone_name : "Strategic Zone";
                    const radius = entry.type === 'escalation' ? 14 : entry.type === 'action_item' ? 12 : entry.type === 'citizen_grievance' ? 8 : 10;

                    return (
                        <React.Fragment key={entry.id || i}>
                            {entry.type === 'escalation' && (
                                <Circle 
                                    center={[entry.lat, entry.lng]}
                                    radius={400}
                                    pathOptions={{
                                        fillColor: color,
                                        fillOpacity: 0.1,
                                        color: color,
                                        weight: 1,
                                        dashArray: '5, 10'
                                    }}
                                />
                            )}
                            <CircleMarker
                                center={[entry.lat, entry.lng]}
                                radius={radius}
                                pathOptions={{
                                    fillColor: color,
                                    color: 'white',
                                    weight: 2,
                                    opacity: 1,
                                    fillOpacity: 0.9
                                }}
                            >
                                <Popup className="aria-popup">
                                    <div style={{ minWidth: '220px', padding: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <span style={{ background: color, color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '8px', fontWeight: '900' }}>{badge}</span>
                                            <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 'bold' }}>{entry.area}</span>
                                        </div>
                                        <div style={{ fontWeight: '900', color: 'white', fontSize: '13px', marginBottom: '4px' }}>{title}</div>
                                        <div style={{ fontSize: '10px', color: '#64748B', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px' }}>
                                            Authority: {"observed_by" in entry ? entry.observed_by : "created_by" in entry ? entry.created_by : "escalated_by" in entry ? entry.escalated_by : "logged_by" in entry ? entry.logged_by : "Minister Sharma"}
                                        </div>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        </React.Fragment>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
