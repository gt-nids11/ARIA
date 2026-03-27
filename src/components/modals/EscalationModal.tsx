"use client";
import React, { useState } from 'react';
import { X, Zap, Shield, AlertTriangle, Briefcase, Plus, ChevronRight } from 'lucide-react';

interface EscalationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    ministerName: string;
    existingObservations: any[];
}

const EscalationModal: React.FC<EscalationModalProps> = ({ isOpen, onClose, onSubmit, ministerName, existingObservations }) => {
    const [formData, setFormData] = useState({
        zone_name: '',
        reason: '',
        escalation_level: 'District',
        department: 'PWD',
        area: 'New Delhi Central',
        supporting_observations: [] as string[],
        lat: 28.62,
        lng: 77.22,
        date: new Date().toISOString().split('T')[0]
    });

    if (!isOpen) return null;

    const levels = ['District', 'State', 'Central'];
    const departments = ['PWD', 'Jal Board', 'BSES', 'MCD', 'Delhi Police', 'Health Dept', 'Education Dept'];
    const areas = ['New Delhi Central', 'Rohini', 'Saket', 'Dwarka', 'South Extension', 'Karol Bagh', 'Connaught Place', 'Lajpat Nagar', 'Janakpuri', 'Pitampura'];

    const toggleObservation = (id: string) => {
        setFormData(prev => ({
            ...prev,
            supporting_observations: prev.supporting_observations.includes(id) 
                ? prev.supporting_observations.filter(x => x !== id) 
                : [...prev.supporting_observations, id]
        }));
    };

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 backdrop-blur-2xl bg-navy-950/90">
            <div className="w-full max-w-xl bg-navy-800 border-2 border-red-600/50 p-10 rounded-[2.5rem] shadow-[0_0_150px_rgba(239,68,68,0.3)] relative animate-in fade-in zoom-in duration-300">
                <div className="absolute top-0 left-0 w-full h-2 bg-red-600 animate-pulse"></div>
                <button onClick={onClose} className="absolute top-8 right-8 text-navy-400 hover:text-white transition-all bg-navy-900 p-2 rounded-xl hover:bg-red-500/20 border border-navy-700">
                    <X size={20} />
                </button>
                
                <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-red-600/10 rounded-2xl border border-red-500/30 flex items-center justify-center mx-auto mb-6">
                        <Zap className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Escalate Zone</h2>
                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-red-500 mt-2">Highest Priority Administrative Alert</p>
                </div>
                
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Zone / Area Name</label>
                            <input 
                                required
                                value={formData.zone_name}
                                onChange={(e) => setFormData({ ...formData, zone_name: e.target.value })}
                                className="w-full bg-navy-900 border border-navy-700/50 rounded-2xl px-5 py-4 text-white text-xs focus:ring-2 focus:ring-red-500/30 outline-none shadow-inner" 
                                placeholder="E.g. Rohini Sector 11..." 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Department</label>
                            <select 
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full bg-navy-900 border border-navy-700/50 rounded-2xl px-5 py-4 text-white text-xs outline-none shadow-inner"
                            >
                                {departments.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Escalation Reason</label>
                        <textarea 
                            required
                            rows={2}
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            className="w-full bg-navy-900 border border-navy-700/50 rounded-2xl px-5 py-4 text-white text-xs focus:ring-2 focus:ring-red-500/30 outline-none resize-none shadow-inner" 
                            placeholder="State the reason for formal escalation..." 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Delhi Area</label>
                          <select 
                              value={formData.area}
                              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                              className="w-full bg-navy-900 border border-navy-700/50 rounded-2xl px-5 py-4 text-white text-xs outline-none shadow-inner"
                          >
                              {areas.map(a => <option key={a}>{a}</option>)}
                          </select>
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Escalation Level</label>
                          <div className="flex gap-2 p-1 bg-navy-900 border border-navy-700/50 rounded-xl">
                              {levels.map(l => (
                                  <button 
                                      type="button"
                                      key={l}
                                      onClick={() => setFormData({...formData, escalation_level: l as any})}
                                      className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${formData.escalation_level === l ? 'bg-red-600 text-white shadow-lg' : 'text-navy-500 hover:text-navy-300'}`}
                                  >
                                      {l}
                                  </button>
                              ))}
                          </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Supporting Observations</label>
                        <div className="max-h-32 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                            {existingObservations.filter(o => o.type === 'field_observation').map(obs => (
                                <button
                                    type="button"
                                    key={obs.id}
                                    onClick={() => toggleObservation(obs.id.toString())}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${formData.supporting_observations.includes(obs.id.toString()) ? 'bg-red-500/10 border-red-500/40 text-red-400' : 'bg-navy-900 border-navy-700/50 text-navy-500 hover:bg-navy-700'}`}
                                >
                                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${formData.supporting_observations.includes(obs.id.toString()) ? 'bg-red-500 border-red-500' : 'border-navy-600'}`}>
                                        {formData.supporting_observations.includes(obs.id.toString()) && <X className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="text-[10px] font-black text-left uppercase tracking-wider flex-1 truncate">{obs.title}</span>
                                    <span className="text-[9px] opacity-50">{obs.area}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-navy-900/50 p-4 rounded-2xl border border-navy-700/50">
                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-navy-500">Escalated By</span>
                            <span className="text-xs font-black text-white italic">{ministerName}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-5 rounded-[1.5rem] text-xs uppercase tracking-[0.25em] shadow-2xl shadow-red-600/50 transition-all active:scale-95 flex items-center justify-center"
                    >
                        Execute Formal Escalation <Zap className="w-4 h-4 ml-3" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EscalationModal;
