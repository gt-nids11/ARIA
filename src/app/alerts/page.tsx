"use client";
import { useState, useEffect } from 'react';
import { Clock, Activity, CheckCircle, ShieldAlert } from 'lucide-react';

export default function Alerts() {
    const [filter, setFilter] = useState('All');
    const [alerts, setAlerts] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/alerts').then(r => r.json()).then(d => setAlerts(d));
    }, []);

    const markResolved = async (id: string) => {
        const res = await fetch('/api/alerts', { method: 'PATCH', body: JSON.stringify({ id }) });
        if (res.ok) {
            setAlerts(await res.json());
            alert('Alert marked as resolved.');
        }
    };

    const visibleAlerts = alerts.filter(a => filter === 'All' || (filter === 'Resolved' && a.resolved) || (!a.resolved && a.severity.toLowerCase() === filter.toLowerCase()))
        .sort((a, b) => (a.resolved === b.resolved ? 0 : a.resolved ? 1 : -1));

    return (
        <div className="flex h-full gap-6 flex-col">
            <div className="glass-card p-6 flex items-center justify-between shadow-sm border border-navy-700/50 bg-navy-800/80 sticky top-0 z-10">
                <div className="flex items-center space-x-3">
                    <ShieldAlert className="w-6 h-6 text-red-400" />
                    <h2 className="text-xl font-bold text-white tracking-tight">Active Intelligence Alerts</h2>
                </div>
                <div className="flex bg-navy-900 rounded-lg p-1 border border-navy-700/50 shadow-inner">
                    {['All', 'High', 'Medium', 'Low', 'Resolved'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={'px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ' + (filter === f ? 'bg-blue-600/20 text-blue-400 shadow-sm border border-blue-500/30' : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800')}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-navy-600 pb-10">
                {visibleAlerts.map(alert => {
                    const color = alert.severity === 'high' ? 'red' : alert.severity === 'medium' ? 'yellow' : 'blue';
                    return (
                        <div key={alert.id} className={'glass-card p-6 border-l-4 group transition-all duration-300 hover:shadow-lg ' + (alert.resolved ? 'opacity-50 grayscale hover:grayscale-0 border-l-emerald-500/30 bg-navy-900/40' : 'border-l-' + color + '-500 hover:-translate-y-0.5 shadow-md')}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-4 max-w-3xl">
                                    {!alert.resolved ? (
                                        <div className={'mt-1 h-3 w-3 rounded-full bg-' + color + '-500 ring-4 ring-navy-900 group-hover:animate-pulse mt-1.5 shrink-0 shadow-lg shadow-' + color + '-500/50'}></div>
                                    ) : (
                                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h4 className={'font-bold text-lg ' + (alert.resolved ? 'line-through text-navy-400' : 'text-white')}>{alert.title}</h4>
                                            <span className={'text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border ' + (alert.resolved ? 'border-navy-600 text-navy-500' : 'border-' + color + '-500/30 text-' + color + '-400 bg-' + color + '-500/10')}>{alert.severity}</span>
                                        </div>
                                        <p className={'text-sm leading-relaxed ' + (alert.resolved ? 'text-navy-500' : 'text-navy-200')}>{alert.description}</p>
                                        <div className="flex items-center space-x-4 mt-4 text-xs font-bold text-navy-400 uppercase tracking-widest">
                                            <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-navy-500" /> {new Date(alert.created_at).toLocaleTimeString()}</span>
                                            <span className="flex items-center"><Activity className="w-3.5 h-3.5 mr-1 text-navy-500" /> Auto-detected</span>
                                        </div>
                                    </div>
                                </div>

                                {!alert.resolved && (
                                    <button onClick={() => markResolved(alert.id)} className="px-5 py-2.5 bg-navy-800 hover:bg-emerald-600/20 hover:border-emerald-500/50 rounded-lg border border-navy-600/50 text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-all shadow-sm shrink-0 flex items-center group-hover:scale-105 duration-200">
                                        <CheckCircle className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100" /> Mark Resolved
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}

                {visibleAlerts.length === 0 && (
                    <div className="glass-card p-12 text-center text-navy-400 font-bold border-dashed border-2 bg-navy-900/10 border-navy-700/50 flex flex-col items-center">
                        <CheckCircle className="w-16 h-16 text-navy-600 mb-4 opacity-50" />
                        <p className="text-xl text-navy-300">No {filter !== 'All' ? filter : ''} Alerts Currently Active</p>
                        <p className="text-xs uppercase tracking-widest mt-2 opacity-50">System Nominal</p>
                    </div>
                )}
            </div>
        </div>
    );
}
