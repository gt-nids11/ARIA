"use client";
import { AlertTriangle, Clock, Activity, FileText, CheckCircle, MessageSquare, ShieldCheck, UploadCloud } from "lucide-react";
import { useAuth } from '@/components/AuthContext';
import { useRef, useState, useEffect } from 'react';

export default function Dashboard() {
    const { currentOfficial } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [brief, setBrief] = useState('');
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loadingBrief, setLoadingBrief] = useState(true);

    useEffect(() => {
        fetch('/api/brief').then(r => r.json()).then(d => {
            setBrief(d.brief);
            setLoadingBrief(false);
        }).catch(e => {
            console.error(e);
            setLoadingBrief(false);
        });

        fetch('/api/alerts').then(r => r.json()).then(data => setAlerts(data));
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            alert(`Selected file: ${e.target.files[0].name}`);
        }
    };

    const markResolved = async (id: string) => {
        const res = await fetch('/api/alerts', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (res.ok) {
            const updated = await res.json();
            setAlerts(updated);
            alert('Alert resolved successfully!');
        }
    };

    const activeAlerts = alerts.filter(a => !a.resolved);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Good Morning, {currentOfficial.name}</h1>
                    <p className="text-navy-400 text-sm font-medium tracking-wide">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg shadow-lg border border-blue-500 transition-all shadow-blue-500/20 group"
                    >
                        <UploadCloud className="w-5 h-5 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                        Upload Intelligence File
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8 space-y-6">
                    <div className="glass-card p-6 border-l-4 border-l-blue-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-blue-400/20 transition-all duration-700"></div>
                        <h2 className="text-xl font-bold mb-4 flex items-center text-blue-100">
                            <Activity className="w-5 h-5 mr-2 text-blue-400" />
                            Morning Briefing Summary
                        </h2>
                        {loadingBrief ? (
                            <div className="animate-pulse flex flex-col space-y-2">
                                <div className="h-4 bg-navy-600 rounded w-full"></div>
                                <div className="h-4 bg-navy-600 rounded w-full"></div>
                                <div className="h-4 bg-navy-600 rounded w-3/4"></div>
                            </div>
                        ) : (
                            <p className="text-navy-200 indent-4 tracking-wide leading-relaxed text-sm whitespace-pre-line">
                                {brief || "No brief available."}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { label: 'Pending Alerts', val: activeAlerts.length, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
                            { label: "Today's Meetings", val: 5, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                            { label: 'Open Complaints', val: 47, icon: MessageSquare, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                            { label: 'Drafts Saved', val: 12, icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
                        ].map((stat, i) => (
                            <div key={i} className="glass-card p-5 group hover:-translate-y-1 transition-transform duration-300">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.bg}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div className="text-3xl font-black text-white">{stat.val}</div>
                                <div className="text-[10px] text-navy-400 mt-2 uppercase tracking-widest font-bold">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <h3 className="text-lg font-bold tracking-tight pt-4 text-blue-50 border-b border-navy-700/50 pb-2">Active Intelligence Alerts</h3>
                    <div className="space-y-4">
                        {activeAlerts.slice(0, 3).map((alert, i) => {
                            const color = alert.severity === 'high' ? 'red' : alert.severity === 'medium' ? 'yellow' : 'blue';
                            return (
                                <div key={i} className="glass-card p-4 flex items-center justify-between group">
                                    <div className="flex items-start space-x-4">
                                        <div className={`mt-2 h-2.5 w-2.5 rounded-full bg-${color}-500 ring-4 ring-navy-900 group-hover:animate-pulse mt-1`}></div>
                                        <div>
                                            <div className="flex items-center space-x-3 mb-1">
                                                <h4 className="font-bold text-sm text-gray-100">{alert.title}</h4>
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-navy-700/50 text-${color}-400`}>{alert.severity}</span>
                                            </div>
                                            <p className="text-[11px] text-navy-400">{alert.description}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => markResolved(alert.id)} className="px-4 py-2 bg-navy-800 hover:bg-blue-600 hover:border-blue-500 rounded border border-navy-600/50 text-xs font-semibold text-blue-400 hover:text-white transition-all shadow-sm shrink-0">
                                        Review Action
                                    </button>
                                </div>
                            )
                        })}
                        {activeAlerts.length === 0 && <p className="text-navy-400 text-sm">No active alerts.</p>}
                    </div>
                </div>

                <div className="col-span-4 glass-card h-full p-6 flex flex-col min-h-[600px]">
                    <h3 className="font-bold text-lg mb-8 flex items-center justify-between border-b border-navy-700/50 pb-2">
                        Recent Activity
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 cursor-pointer hover:text-blue-300 transition-colors">Log</span>
                    </h3>
                    <div className="flex-1 relative">
                        <div className="absolute top-0 bottom-0 left-5 w-px bg-navy-700/50"></div>
                        <div className="space-y-8 relative z-10">
                            {[
                                { type: 'AI Draft', title: 'Infrastructure Speech V2', time: '10 mins ago', icon: FileText, border: 'border-blue-500/50' },
                                { type: 'Resolved', title: 'Ward 2 Complaint #440', time: '1 hr ago', icon: CheckCircle, border: 'border-emerald-500/50' },
                                { type: 'Intel', title: 'Threat level downgraded', time: '3 hrs ago', icon: ShieldCheck, border: 'border-yellow-500/50' },
                                { type: 'Meeting', title: 'Transcript: Urban Plan', time: 'Yesterday, 14:00', icon: MessageSquare, border: 'border-purple-500/50' }
                            ].map((act, i) => (
                                <div key={i} className="flex relative items-start group">
                                    <div className={`w-10 h-10 rounded-full bg-navy-900 border-2 ${act.border} flex items-center justify-center shrink-0 z-10 shadow-lg group-hover:bg-navy-800 transition-colors`}>
                                        <act.icon className="w-4 h-4 text-navy-200 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="ml-4 pt-1 flex-1">
                                        <div className="flex items-baseline justify-between">
                                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{act.type}</span>
                                            <span className="text-[10px] text-navy-500 font-medium">{act.time}</span>
                                        </div>
                                        <div className="text-sm font-medium text-navy-100 mt-1">{act.title}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
