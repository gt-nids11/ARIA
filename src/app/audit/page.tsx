"use client";
import { Download, Search, ShieldCheck, Activity, Users, Database } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AuditLog() {
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/audit').then(r => r.json()).then(d => setLogs(d));
    }, []);

    const exportCSV = () => {
        const header = ['ID,User,Action,Module,Details,IP Address,Created At'];
        const rows = logs.map(l => `${l.id},${l.user_name},${l.action},${l.module},"${l.details}",${l.ip_address},${l.created_at}`);
    const csvContent = header.concat(rows).join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit_logs.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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

        <button onClick={exportCSV} className="flex items-center space-x-2 bg-navy-700 hover:bg-blue-600 border border-navy-600 hover:border-blue-500 text-blue-400 hover:text-white px-5 py-2.5 rounded-lg font-bold shadow-lg transition-all text-xs uppercase tracking-widest group">
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
          {logs.map((log) => {
            const Icon = log.module.includes('Auth') ? Users : (log.module.includes('Speech') || log.module.toLowerCase().includes('doc') ? Database : (log.action.includes('Alert') ? ShieldCheck : Activity));
            return (
            <div key={log.id} className="grid grid-cols-12 gap-4 p-4 border-b border-navy-800/50 hover:bg-navy-800 text-sm items-center transition-colors group relative overflow-hidden">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-navy-700/10 pointer-events-none group-hover:text-blue-500/5 group-hover:-translate-x-8 transition-all scale-[4] z-0 delay-75">
                <Icon className="w-24 h-24" />
              </div>

              <div className="col-span-2 font-mono text-xs text-navy-400 pl-4 z-10 font-medium tracking-wider group-hover:text-blue-300 transition-colors uppercase">{new Date(log.created_at).toLocaleString()}</div>
              <div className="col-span-2 font-bold text-gray-200 z-10 flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${log.user_name.includes('Admin') ? 'bg-red-500/50' : 'bg-blue-500/50'}`}></div>
                <span>{log.user_name}</span>
              </div>
              <div className="col-span-3 text-navy-100 font-medium z-10">{log.action}</div>
              <div className="col-span-3 text-navy-300 z-10 italic">{log.module}: {log.details}</div>
              <div className="col-span-2 font-mono text-xs text-navy-500 z-10 tracking-widest">{log.ip_address}</div>
            </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
