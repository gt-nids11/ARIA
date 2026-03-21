"use client";
import { Filter, MapPin, Plus, Navigation, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { complaints } from '../../lib/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Dynamic import for Leaflet since it requires window object
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(m => m.CircleMarker), { ssr: false });

export default function MapPage() {
  const [markers, setMarkers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Leaflet icon fix for Next.js
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
      });
    }

    const fetchData = async () => {
      try {
        const [heatmapRes, statsRes] = await Promise.all([
          complaints.heatmap(),
          complaints.stats()
        ]);
        setMarkers(heatmapRes);
        setStats(statsRes);
      } catch(err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const getMarkerColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const barData = {
    labels: stats?.by_ward ? Object.keys(stats.by_ward) : [],
    datasets: [
      {
        label: 'Complaints',
        data: stats?.by_ward ? Object.values(stats.by_ward) : [],
        backgroundColor: '#3B82F6',
      },
    ],
  };

  const doughnutData = {
    labels: stats?.by_category ? Object.keys(stats.by_category) : [],
    datasets: [
      {
        data: stats?.by_category ? Object.values(stats.by_category) : [],
        backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'],
        borderWidth: 0
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#9CA3AF' } }
    },
    scales: {
      y: { ticks: { color: '#9CA3AF' }, grid: { color: '#374151' } },
      x: { ticks: { color: '#9CA3AF' }, grid: { display: false } }
    }
  };

  return (
    <div className="flex h-full gap-6 relative overflow-y-auto">
      <div className="w-72 shrink-0 flex flex-col space-y-4 h-full">
        <div className="glass-card p-5 border border-navy-700/50 bg-navy-800/80 shadow-lg relative">
          <h3 className="font-bold text-lg mb-6 flex items-center text-white border-b border-navy-700/50 pb-3">
            <Filter className="w-5 h-5 mr-3 text-blue-400" /> Live Map Filters
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-navy-300 uppercase tracking-widest mb-2">Target Ward</label>
              <select className="w-full bg-navy-900 border border-navy-600 rounded-lg p-3 text-sm focus:border-blue-500 outline-none text-gray-200 font-medium"><option>All Wards</option><option>Ward 7</option></select>
            </div>
            <div>
              <label className="block text-xs font-bold text-navy-300 uppercase tracking-widest mb-2">Date Range</label>
              <input type="date" className="w-full bg-navy-900 border border-navy-600 rounded-lg p-3 text-sm focus:border-blue-500 outline-none text-gray-200" />
            </div>
            <button className="w-full bg-navy-700 hover:bg-blue-600 border border-navy-600 hover:border-blue-500 text-blue-400 hover:text-white py-3 rounded-lg font-bold shadow transition-colors uppercase tracking-widest text-xs">Apply</button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div className="glass-card bg-navy-900/40 border-navy-700/50 relative overflow-hidden flex flex-col p-1 z-0 h-[500px]">
           <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin=""/>
           <div className="absolute inset-x-0 h-[100px] top-0 bg-gradient-to-b from-navy-900/90 to-transparent z-[400] pointer-events-none p-6 flex justify-between">
             <h2 className="text-2xl font-black text-white drop-shadow-md flex items-center tracking-tight">
               <Navigation className="w-6 h-6 mr-3 text-blue-500" /> Sector 4 Alpha
             </h2>
             {loading && <Loader2 className="w-6 h-6 animate-spin text-blue-400" />}
           </div>
           
           <div className="w-full h-full rounded-lg overflow-hidden relative z-0">
             {typeof window !== 'undefined' && !loading && (
               <MapContainer center={[28.6139, 77.2090]} zoom={11} className="w-full h-full !z-0" zoomControl={false}>
                 <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
                 {markers.map((m:any, i: number) => (
                   <CircleMarker key={i} center={[m.lat, m.lng]} radius={8} pathOptions={{ color: getMarkerColor(m.priority), fillColor: getMarkerColor(m.priority), fillOpacity: 0.7 }}>
                      <Popup className="custom-popup">
                        <div className="font-bold text-navy-900">
                           <p className="text-lg mb-1">{m.title}</p>
                           <p className="text-sm">Ward: {m.ward}</p>
                           <p className="text-sm">Category: {m.category}</p>
                           <p className="text-sm text-red-600 font-bold">Days Open: {m.days_open}</p>
                           <span className="inline-block mt-2 px-2 py-1 text-xs text-white rounded" style={{backgroundColor: getMarkerColor(m.priority)}}>{m.priority}</span>
                        </div>
                      </Popup>
                   </CircleMarker>
                 ))}
               </MapContainer>
             )}
           </div>

           <button className="absolute bottom-6 left-6 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white shadow-lg shadow-blue-500/30 px-6 py-4 rounded-xl font-bold flex items-center transition-all hover:-translate-y-1 z-[400] group border border-blue-400/30">
            <Plus className="w-6 h-6 mr-2 group-hover:rotate-90 transition-transform" /> Log Public Complaint
           </button>
        </div>
        
        <div className="grid grid-cols-2 gap-6 h-[300px] mb-6">
          <div className="glass-card p-6 bg-navy-800/80 border-navy-700/50">
            <h3 className="text-white font-bold mb-4">Complaints by Ward</h3>
            <div className="h-full pb-8">
              {!loading && stats && <Bar data={barData} options={chartOptions} />}
            </div>
          </div>
          <div className="glass-card p-6 bg-navy-800/80 border-navy-700/50">
            <h3 className="text-white font-bold mb-4">Complaints by Category</h3>
            <div className="h-full pb-8 flex justify-center">
              {!loading && stats && <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#9CA3AF' } } } }} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
