"use client";
// Force refresh
import { AlertTriangle, Clock, Activity, FileText, CheckCircle, MessageSquare, ShieldCheck, RefreshCcw, Upload, Check } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/components/AuthContext";
import { dashboard, alerts } from "../lib/api";

const DEFAULT_BRIEF = `MORNING TO-DO LIST:

1. 09:30 AM - Review overnight security intelligence drops.
2. 12:00 PM - Sign off on urban infrastructure grants.
3. 02:45 PM - Emergency protocol drill with local administration.
4. 05:00 PM - Finalize Level-4 clearance audit logs.`;

export default function Dashboard() {
  const { currentOfficial } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stats, setStats] = useState({ pending_alerts: 0, todays_meetings: 0, open_complaints: 0, drafts_saved: 0 });
  const [brief, setBrief] = useState(DEFAULT_BRIEF);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("Official");
  
  // New state for file upload notifications
  const [uploadMsg, setUploadMsg] = useState<{text: string, type: 'info' | 'success'} | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setName(localStorage.getItem("name") || "Official");
    try {
      const [statsRes, briefRes, alertsRes] = await Promise.all([
        dashboard.getStats(),
        dashboard.getBrief(),
        alerts.list()
      ]);
      setStats({
          pending_alerts: statsRes.pending_alerts || 0,
          todays_meetings: statsRes.todays_meetings || 0,
          open_complaints: statsRes.open_complaints || 0,
          drafts_saved: statsRes.drafts_saved || 0
      });
      setBrief(briefRes.brief || DEFAULT_BRIEF);
      setActiveAlerts(alertsRes.filter((a:any) => a.severity === "high" && !a.resolved).slice(0, 3));
    } catch (err) {
      // Backend is offline, show offline default state
      setBrief(DEFAULT_BRIEF);
      setStats({ pending_alerts: 4, todays_meetings: 2, open_complaints: 12, drafts_saved: 8 });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadMsg({ text: `Intercepting and analyzing '${file.name}'...`, type: 'info' });
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUploadMsg({ 
          text: `File uploaded and stored in the data base`, 
          type: 'success' 
        });
        setStats(prev => ({ ...prev, drafts_saved: prev.drafts_saved + 1 }));
      } else {
        setUploadMsg({ 
          text: `[ERROR] Failed to save to database: ${data.message}`, 
          type: 'info' 
        });
      }
    } catch (err: any) {
      setUploadMsg({ 
        text: `[ERROR] Network error during database upload: ${err.message}`, 
        type: 'info' 
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => { fetchData() }, []);

  const resolveAlert = async (id: number) => {
    try {
      await alerts.resolve(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Good Morning, {currentOfficial?.name || name}</h1>
          <p className="text-navy-400 text-sm font-medium tracking-wide">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded shadow-lg border border-blue-500 transition-all uppercase tracking-widest"
          >
            <Upload className="w-4 h-4 mr-2" /> Upload Files
          </button>
          <button onClick={fetchData} className="px-4 py-2 bg-navy-800 hover:bg-navy-700 rounded text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center border border-navy-600 transition-colors shadow">
            {loading ? <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-2" />} Sync Data
          </button>
        </div>
      </div>

      {uploadMsg && (
        <div className={`p-4 rounded-xl border flex items-center space-x-3 shadow-lg animate-in fade-in slide-in-from-top-4 duration-500 ${uploadMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>
          {uploadMsg.type === 'success' ? <Check className="w-5 h-5 flex-shrink-0" /> : <RefreshCcw className="w-5 h-5 flex-shrink-0 animate-spin" />}
          <p className="text-sm font-bold tracking-wide">{uploadMsg.text}</p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <div className="glass-card p-6 border-l-4 border-l-blue-500 relative overflow-hidden group">
            <h2 className="text-xl font-bold mb-4 flex items-center text-blue-100">
              <Activity className="w-5 h-5 mr-2 text-blue-400" /> Morning Briefing Summary
            </h2>
            <div className="text-navy-200 indent-4 tracking-wide leading-relaxed text-sm bg-navy-900/50 p-4 rounded-xl border border-navy-700 shadow-inner min-h-[120px]">
              {loading ? (
                <div className="flex justify-center my-4"><RefreshCcw className="animate-spin text-blue-500 w-6 h-6" /></div>
              ) : (
                <div className="whitespace-pre-line leading-relaxed">{brief}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Pending Alerts', val: stats.pending_alerts, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
              { label: "Today's Meetings", val: stats.todays_meetings, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Open Complaints', val: stats.open_complaints, icon: MessageSquare, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              { label: 'Files Secured', val: stats.drafts_saved, icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-5 hover:-translate-y-1 transition-transform duration-300">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-3xl font-black text-white">{stat.val}</div>
                <div className="text-[10px] text-navy-400 mt-2 uppercase tracking-widest font-bold">{stat.label}</div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-bold tracking-tight pt-4 text-white border-b border-navy-700/50 pb-2">Active High-Priority Alerts</h3>
          <div className="space-y-4">
            {activeAlerts.length === 0 ? (
               <div className="p-6 text-center text-navy-400 font-bold bg-navy-800/30 border border-navy-700/50 rounded-xl border-dashed">No High severity alerts active.</div>
            ) : activeAlerts.map((alert, i) => (
              <div key={alert.id || i} className="glass-card p-4 flex items-center justify-between border-l-2 border-l-red-500 bg-red-500/5">
                <div className="flex items-start space-x-4">
                  <div className="mt-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-4 ring-navy-900 animate-pulse shadow-sm shadow-red-500"></div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="font-bold text-sm text-gray-100">{alert.title}</h4>
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-red-500/30 text-red-400 bg-red-500/10">{alert.severity}</span>
                    </div>
                    <p className="text-xs text-navy-300 pr-12">{alert.description}</p>
                  </div>
                </div>
                <button onClick={() => resolveAlert(alert.id)} className="px-4 py-2 bg-navy-800 hover:bg-emerald-600 border border-navy-600 hover:border-emerald-500 text-xs font-bold text-emerald-400 hover:text-white transition-all shadow-sm shrink-0 rounded uppercase tracking-wider h-10">
                  Resolve
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}