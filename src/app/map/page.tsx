"use client";
import { Filter, MapPin, Plus, Navigation } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="flex h-full gap-6 relative">
      <div className="w-72 shrink-0 flex flex-col space-y-4 h-full">
        <div className="glass-card p-5 border border-navy-700/50 bg-navy-800/80 shadow-lg">
          <h3 className="font-bold text-lg mb-6 flex items-center text-white border-b border-navy-700/50 pb-3">
            <Filter className="w-5 h-5 mr-3 text-blue-400" />
            Live Map Filters
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-navy-300 uppercase tracking-widest mb-2">Target Ward</label>
              <select className="w-full bg-navy-900 border border-navy-600 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-200 font-medium">
                <option>All Wards</option>
                <option>Ward 1</option>
                <option>Ward 2</option>
                <option>Ward 3</option>
                <option>Ward 4</option>
                <option>Ward 5</option>
                <option>Ward 6</option>
                <option>Ward 7</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-300 uppercase tracking-widest mb-2">Category</label>
              <select className="w-full bg-navy-900 border border-navy-600 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-200 font-medium">
                <option>All Infrastructure</option>
                <option>Water & Sanitation</option>
                <option>Roads & Transport</option>
                <option>Power Grid</option>
                <option>Public Safety</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-300 uppercase tracking-widest mb-2">Date Range</label>
              <input type="date" className="w-full bg-navy-900 border border-navy-600 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-200" defaultValue="2026-10-25" />
            </div>
            
            <button className="w-full bg-navy-700 hover:bg-blue-600 border border-navy-600 hover:border-blue-500 text-blue-400 hover:text-white py-3 rounded-lg font-bold shadow transition-colors uppercase tracking-widest text-xs">
              Apply Filters
            </button>
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
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-navy-900 flex items-center justify-center font-bold text-navy-500 text-lg group-hover/map:text-blue-500/20 transition-all z-0 bg-gradient-to-tr from-navy-900 via-navy-800 to-navy-900">
           <div className="flex flex-col items-center">
             <MapPin className="w-24 h-24 mb-6 opacity-20 text-blue-500 animate-bounce" />
             <span className="uppercase tracking-widest font-black text-2xl text-navy-400 opacity-50 shadow-sm border border-navy-700 bg-navy-900/80 backdrop-blur-sm p-4 rounded-2xl">
               Constituency Map Rendering Engine Offline
             </span>
             <p className="mt-4 text-xs tracking-widest uppercase font-bold text-navy-600 bg-navy-950 px-4 py-1 rounded-full shadow-inner border border-navy-800">[ Geospatial Data Layer Pending Connection ]</p>
           </div>
        </div>

        <button className="absolute bottom-6 left-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/30 px-6 py-4 rounded-xl font-bold flex items-center transition-all hover:-translate-y-1 hover:shadow-xl z-20 group">
          <Plus className="w-6 h-6 mr-2 group-hover:rotate-90 transition-transform" /> Log Public Complaint
        </button>
      </div>

      <div className="w-80 shrink-0 flex flex-col space-y-4 h-full">
        <div className="glass-card p-5 border border-navy-700/50 bg-navy-800/80 shadow-lg h-full flex flex-col">
          <h3 className="font-bold text-lg mb-4 flex items-center justify-between text-white border-b border-navy-700/50 pb-3">
            Critical Hotspots
            <span className="bg-red-500/20 text-red-500 font-bold px-2 py-0.5 rounded text-[10px] tracking-widest uppercase shadow border border-red-500/30">Live Data</span>
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-4 pt-2">
            {[
              { ward: 'Ward 7', issues: 142, days: '4', stat: 'Water Pressure', color: 'red' },
              { ward: 'Ward 3', issues: 89, days: '2', stat: 'Potholes', color: 'yellow' },
              { ward: 'Ward 1', issues: 54, days: '1', stat: 'Street Lights', color: 'yellow' },
              { ward: 'Ward 4', issues: 23, days: '5', stat: 'Garbage', color: 'blue' },
              { ward: 'Ward 6', issues: 12, days: '1', stat: 'Stray Dogs', color: 'blue' }
            ].map((cluster, i) => (
              <div key={i} className="bg-navy-900/60 p-4 flex flex-col relative overflow-hidden rounded-xl border border-navy-700/50 hover:border-blue-500/30 transition-colors cursor-pointer group hover:-translate-y-0.5 shadow-sm">
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
      </div>
    </div>
  );
}
