"use client";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the MapComponent with no SSR
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[calc(100vh-180px)] w-full bg-navy-900/50 rounded-2xl border border-navy-700/50 animate-pulse">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-blue-500 font-bold tracking-widest uppercase text-xs">Initializing Territorial Intelligence...</div>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-140px)] w-full relative overflow-hidden rounded-2xl border border-navy-700/50 shadow-2xl bg-navy-900/20 group">
      {/* HUD Overlay Elements */}
      <div className="absolute top-6 left-6 z-[1000] space-y-3 pointer-events-none">
         <div className="backdrop-blur-md bg-navy-950/40 p-5 rounded-xl border border-white/10 shadow-2xl max-w-xs transition-all hover:bg-navy-950/60">
            <h1 className="text-xl font-black text-white tracking-tighter mb-1 uppercase">Strategic Oversight</h1>
            <p className="text-[10px] text-navy-400 font-bold tracking-widest uppercase mb-4 border-b border-navy-700/50 pb-2">Region: South Asia Hub</p>
            
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                  <span className="text-[9px] text-navy-400 uppercase font-black">Active Sectors</span>
                  <span className="text-[9px] text-blue-400 font-black">04</span>
               </div>
               <div className="w-full bg-navy-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[65%] animate-pulse"></div>
               </div>
            </div>
         </div>

         <div className="flex items-center space-x-2 bg-emerald-500/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/20 w-fit">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500"></div>
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Real-Time Sync: Active</span>
         </div>
      </div>

      {/* Map Component Container */}
      <Suspense fallback={null}>
        <div className="h-full w-full grayscale-[0.3] brightness-[0.8] contrast-[1.1] hover:grayscale-0 hover:brightness-100 transition-all duration-700">
           <MapComponent />
        </div>
      </Suspense>

      {/* Scanning Overlay Effect */}
      <div className="absolute inset-0 pointer-events-none border-4 border-blue-500/10 rounded-2xl z-[1001] shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
    </div>
  );
}
