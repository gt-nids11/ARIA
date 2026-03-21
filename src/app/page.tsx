"use client";
import { AlertTriangle, Clock, Activity, FileText, CheckCircle, MessageSquare, ShieldCheck, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { dashboard, alerts } from "../lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ pending_alerts: 0, todays_meetings: 0, open_complaints: 0, drafts_saved: 0 });
  const [brief, setBrief] = useState("Loading intelligence...");
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("Official");

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
      setBrief(briefRes.brief);
      setActiveAlerts(alertsRes.filter((a:any) => a.severity === "high" && !a.resolved).slice(0, 3));
    } catch (err) {
      setBrief("Failed to load intelligence brief. Ensure securely connected via internal API network.");
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Good Morning, {name}</h1>
          <p className="text-navy-400 text-sm font-medium tracking-wide">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button onClick={fetchData} className="px-4 py-2 bg-navy-800 hover:bg-navy-700 rounded-lg text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center border border-navy-600 transition-colors shadow">
          {loading ? <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-2" />} Sync Data
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <div className="glass-card p-6 border-l-4 border-l-blue-500 relative overflow-hidden group">
            <h2 className="text-xl font-bold mb-4 flex items-center text-blue-100">
              <Activity className="w-5 h-5 mr-2 text-blue-400" /> Morning Briefing Summary
            </h2>
            <div className="text-navy-200 indent-4 tracking-wide leading-relaxed text-sm bg-navy-900/50 p-4 rounded-xl border border-navy-700 shadow-inner min-h-[80px]">
              {loading ? (
                <div className="flex justify-center my-4"><RefreshCcw className="animate-spin text-blue-500 w-6 h-6" /></div>
              ) : (
                <div className="whitespace-pre-line">{brief}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Pending Alerts', val: stats.pending_alerts, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
              { label: "Today's Meetings", val: stats.todays_meetings, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Open Complaints', val: stats.open_complaints, icon: MessageSquare, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              { label: 'Drafts Saved', val: stats.drafts_saved, icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
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
