"use client";
import { Download, Search, ShieldCheck, Activity, Users, Database } from 'lucide-react';

export default function AuditLog() {
  const logs = [
    { user: 'sys_admin', act: 'System Login', mod: 'Authentication', time: 'Oct 25, 08:12:44', ip: '10.5.2.14', icon: Users },
    { user: 'min_sharma', act: 'Viewed Document', mod: 'Q3_Infrastructure_Bill', time: 'Oct 25, 08:45:11', ip: '192.168.1.5', icon: Activity },
    { user: 'ai_engine', act: 'Generated Draft', mod: 'Speech Module', time: 'Oct 25, 09:02:05', ip: 'Localhost', icon: Database },
    { user: 'sec_chief', act: 'Resolved Alert', mod: 'Ward 4 Water Breach', time: 'Oct 24, 23:15:30', ip: '10.5.8.99', icon: ShieldCheck },
    { user: 'sys_admin', act: 'Data Export', mod: 'Complaint Logs (SEP)', time: 'Oct 24, 18:00:00', ip: '10.5.2.14', icon: Database },
    { user: 'min_sharma', act: 'Created Event', mod: 'Scheduler', time: 'Oct 24, 15:30:22', ip: '192.168.1.5', icon: Activity },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="glass-card p-6 flex items-center justify-between border border-navy-700/50 bg-navy-800/80 sticky top-0 z-20 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 shadow-inner">
            <ShieldCheck className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center">
              Security Audit Log
              <span className="bg-red-500 text-white ml-3 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest leading-none">Admin Only</span>
            </h2>
            <p className="text-xs text-navy-400 mt-1 uppercase tracking-widest font-bold">Immutable System Records</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 flex-1 max-w-2xl px-8">
          <div className="relative flex-1 group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 group-focus-within:text-blue-400 transition-colors" />
            <input type="text" placeholder="Filter by User ID or Action..." className="w-full bg-navy-900/50 border border-navy-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-200 shadow-inner transition-all placeholder:text-navy-500" />
          </div>
          <input type="date" className="bg-navy-900/50 border border-navy-600 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-navy-300 font-medium tracking-wider shadow-inner" defaultValue="2026-10-25" />
        </div>

        <button className="flex items-center space-x-2 bg-navy-700 hover:bg-blue-600 border border-navy-600 hover:border-blue-500 text-blue-400 hover:text-white px-5 py-2.5 rounded-lg font-bold shadow-lg transition-all text-xs uppercase tracking-widest group">
          <Download className="w-4 h-4 mr-1 group-hover:-translate-y-0.5 transition-transform" /> Export CSV
        </button>
      </div>

      <div className="glass-card flex-1 overflow-hidden flex flex-col p-0 border border-navy-700/50 bg-navy-900/40">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-navy-700/50 bg-navy-800/80 sticky top-0 shrink-0 text-xs font-bold uppercase tracking-widest text-blue-400 shadow-sm">
          <div className="col-span-2 pl-4">Timestamp</div>
          <div className="col-span-2">User ID</div>
          <div className="col-span-3">Action Completed</div>
          <div className="col-span-3">Target Module / Doc</div>
          <div className="col-span-2">Origin IP</div>
        </div>
        
        <div className="flex-1 overflow-y-auto w-full relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
          {logs.map((log, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 p-4 border-b border-navy-800/50 hover:bg-navy-800 text-sm items-center transition-colors group relative overflow-hidden">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-navy-700/10 pointer-events-none group-hover:text-blue-500/5 group-hover:-translate-x-8 transition-all scale-[4] z-0 delay-75">
                <log.icon className="w-24 h-24" />
              </div>

              <div className="col-span-2 font-mono text-xs text-navy-400 pl-4 z-10 font-medium tracking-wider group-hover:text-blue-300 transition-colors uppercase">{log.time}</div>
              <div className="col-span-2 font-bold text-gray-200 z-10 flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${log.user.includes('admin') || log.user.includes('sec') ? 'bg-red-500/50' : 'bg-blue-500/50'}`}></div>
                <span>{log.user}</span>
              </div>
              <div className="col-span-3 text-navy-100 font-medium z-10">{log.act}</div>
              <div className="col-span-3 text-navy-300 z-10 italic">{log.mod}</div>
              <div className="col-span-2 font-mono text-xs text-navy-500 z-10 tracking-widest">{log.ip}</div>
            </div>
          ))}

          {logs.map((log, i) => (
            <div key={`dup-${i}`} className="grid grid-cols-12 gap-4 p-4 border-b border-navy-800/50 hover:bg-navy-800 text-sm items-center transition-colors group relative overflow-hidden opacity-60">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-navy-700/10 pointer-events-none group-hover:text-blue-500/5 group-hover:-translate-x-8 transition-all scale-[4] z-0 delay-75">
                <log.icon className="w-24 h-24" />
              </div>

              <div className="col-span-2 font-mono text-xs text-navy-400 pl-4 z-10 font-medium tracking-wider group-hover:text-blue-300 transition-colors uppercase">Oct 23, 11:21:0{i}</div>
              <div className="col-span-2 font-bold text-gray-400 z-10 flex items-center space-x-2">
                 <div className="w-2 h-2 rounded-full bg-navy-600"></div>
                 <span>{log.user}</span>
              </div>
              <div className="col-span-3 text-navy-300 font-medium z-10">{log.act}</div>
              <div className="col-span-3 text-navy-500 z-10 italic">{log.mod}</div>
              <div className="col-span-2 font-mono text-xs text-navy-600 z-10 tracking-widest">{log.ip}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
