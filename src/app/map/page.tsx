"use client";
import { Filter, MapPin, Plus, Navigation, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MapPage() {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPin, setSelectedPin] = useState<any>(null);

    const [formData, setFormData] = useState({
        title: '',
        category: 'Infrastructure',
        priority: 'medium',
        ward: 'Ward 1'
    });

    useEffect(() => {
        fetch('/api/complaints').then(r => r.json()).then(d => setComplaints(d));
    }, []);

    const addComplaint = async () => {
        const lat = 28.6 + Math.random() * 0.05;
        const lng = 77.2 + Math.random() * 0.05;

        await fetch('/api/complaints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, latitude: lat, longitude: lng })
        });
        setShowModal(false);
        fetch('/api/complaints').then(r => r.json()).then(d => setComplaints(d));
    };

    // Aggregate complaints for the right sidebar (basic mock grouping)
    const aggregated = complaints.reduce((acc, c) => {
        acc[c.ward] = acc[c.ward] || { ward: c.ward, issues: 0, days: c.days_open, stat: c.category, color: c.priority === 'high' ? 'red' : 'yellow' };
        acc[c.ward].issues += 1;
        return acc;
    }, {});
    const clusters = Object.values(aggregated);

    return (
    <div className="flex h-full gap-6 relative">
      <div className="w-72 shrink-0 flex flex-col space-y-4 h-full">
        <div className="glass-card p-5 border border-navy-700/50 bg-navy-800/80 shadow-lg relative z-20">
          <h3 className="font-bold text-lg mb-6 flex items-center text-white border-b border-navy-700/50 pb-3">
            <Filter className="w-5 h-5 mr-3 text-blue-400" />
            Live Map Filters
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-navy-300 uppercase tracking-widest mb-2">Target Ward</label>
              <select className="w-full bg-navy-900 border border-navy-600 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-200 font-medium">
                <option>All Wards</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 glass-card bg-navy-900/40 border border-navy-700/50 relative overflow-hidden flex flex-col group/map">
        <div className="absolute inset-x-0 h-[100px] top-0 bg-gradient-to-b from-navy-900/90 to-transparent z-10 pointer-events-none p-6">
           <h2 className="text-2xl font-black text-white drop-shadow-md flex items-center tracking-tight">
             <Navigation className="w-6 h-6 mr-3 text-blue-500" />
             Strategic Viewport: Sector 4 Alpha
           </h2>
        </div>
        
        {/* Fake Map Rendering */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-navy-900 transition-all z-0 bg-gradient-to-tr from-navy-900 via-navy-800 to-navy-900 overflow-hidden">
            {complaints.map(c => {
                const mapColor = c.priority === 'high' ? 'bg-red-500' : c.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500';
                const xPos = ((c.longitude - 77.2) / 0.05) * 80 + 10;
                const yPos = ((c.latitude - 28.6) / 0.05) * 80 + 10;
                return (
                    <div key={c.id} onClick={() => setSelectedPin(c)} style={{ left: `${xPos}%`, top: `${yPos}%` }} className="absolute cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full ${mapColor} shadow-lg shadow-black/50 border-2 border-white/20`}></div>
                        {selectedPin?.id === c.id && (
                             <div className="absolute bottom-8 -left-20 bg-navy-800 border border-navy-500 p-3 rounded-lg shadow-xl w-48 z-50">
                                 <h4 className="font-bold text-white text-sm">{c.title}</h4>
                                 <p className="text-xs text-navy-300 mt-1">{c.ward} | {c.category}</p>
                                 <p className="text-xs text-navy-400 mt-1 uppercase">Days Open: {c.days_open}</p>
                             </div>
                        )}
                    </div>
                );
            })}
        </div>

        <button onClick={() => setShowModal(true)} className="absolute bottom-6 left-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/30 px-6 py-4 rounded-xl font-bold flex items-center transition-all hover:-translate-y-1 hover:shadow-xl z-20 group">
          <Plus className="w-6 h-6 mr-2 group-hover:rotate-90 transition-transform" /> Log Public Complaint
        </button>
      </div >

        <div className="w-80 shrink-0 flex flex-col space-y-4 h-full">
            <div className="glass-card p-5 border border-navy-700/50 bg-navy-800/80 shadow-lg h-full flex flex-col">
                <h3 className="font-bold text-lg mb-4 flex items-center justify-between text-white border-b border-navy-700/50 pb-3">
                    Critical Hotspots
                    <span className="bg-red-500/20 text-red-500 font-bold px-2 py-0.5 rounded text-[10px] tracking-widest uppercase shadow border border-red-500/30">Live Data</span>
                </h3>
                <div className="flex-1 overflow-y-auto space-y-4 pt-2">
                    {(clusters as any[]).map((cluster, i) => (
              <div key={i} className="bg-navy-900/60 p-4 flex flex-col relative overflow-hidden rounded-xl border border-navy-700/50 transition-colors cursor-pointer hover:-translate-y-0.5 shadow-sm">
                <div className={`absolute top-0 right-0 p-3 bg-${cluster.color}-500/10 text-${cluster.color}-400 text-center border-b border-l border-${cluster.color}-500/30 font-bold text-[10px] uppercase tracking-wider rounded-bl-lg shrink-0 w-12`}>
                  {cluster.days}d<br/>Old
                </div>
                <div className="w-[calc(100%-2rem)]">
                  <div className="font-bold text-gray-100 flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-navy-400 group-hover:text-blue-500 transition-colors" />
                    <span>{cluster.ward}</span>
                  </div>
                  <div className="text-sm font-semibold text-navy-300 mt-2 bg-navy-800 inline-block px-2 py-1 rounded border border-navy-700/50 tracking-wider"><span className="text-white">{cluster.issues}</span> Reports</div>
                  <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-2 flex items-center"><Navigation className="w-3 h-3 mr-1" /> {cluster.stat} Cluster</div>
                </div>
              </div>
            ))}
            </div>
        </div>
      </div >

        { showModal && (
            <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-6 pb-20">
                <div className="bg-navy-800 p-6 rounded-xl border border-navy-600 shadow-2xl w-full max-w-md">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">New Complaint</h3>
                        <button onClick={() => setShowModal(false)}><X className="text-navy-400" /></button>
                    </div>
                    <div className="space-y-4">
                        <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-navy-900 p-3 rounded text-white" placeholder="Complaint Title" />
                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-navy-900 p-3 rounded text-white"><option>Infrastructure</option><option>Sanitation</option></select>
                        <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="w-full bg-navy-900 p-3 rounded text-white"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
                        <select value={formData.ward} onChange={e => setFormData({ ...formData, ward: e.target.value })} className="w-full bg-navy-900 p-3 rounded text-white"><option>Ward 1</option><option>Ward 2</option></select>
                        <button onClick={addComplaint} className="w-full bg-blue-600 p-3 rounded text-white font-bold">Submit</button>
                    </div>
                </div>
            </div>
        )
}
    </div >
  );
}
