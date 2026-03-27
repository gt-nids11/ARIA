"use client";
import React, { useState } from 'react';
import { X, Flag, Shield, Calendar, MapPin, ChevronRight, Briefcase } from 'lucide-react';

interface ActionItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    ministerName: string;
}

const ActionItemModal: React.FC<ActionItemModalProps> = ({ isOpen, onClose, onSubmit, ministerName }) => {
    const [formData, setFormData] = useState({
        zone_name: '',
        action_required: '',
        department: 'PWD',
        urgency: 'This Week',
        area: 'New Delhi Central',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lat: 28.62,
        lng: 77.22
    });

    if (!isOpen) return null;

    const departments = ['PWD', 'Jal Board', 'BSES', 'MCD', 'Delhi Police', 'Health Dept', 'Education Dept'];
    const areas = ['New Delhi Central', 'Rohini', 'Saket', 'Dwarka', 'South Extension', 'Karol Bagh', 'Connaught Place', 'Lajpat Nagar', 'Janakpuri', 'Pitampura'];

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 backdrop-blur-xl bg-navy-950/80">
            <div className="w-full max-w-xl bg-navy-800 border-2 border-amber-500/30 p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(245,158,11,0.2)] relative animate-in fade-in zoom-in duration-300">
                <div className="absolute top-0 left-0 w-full h-2 bg-amber-500"></div>
                <button onClick={onClose} className="absolute top-8 right-8 text-navy-400 hover:text-white transition-all bg-navy-900 p-2 rounded-xl hover:bg-red-500/20 border border-navy-700">
                    <X size={20} />
                </button>
                
                <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
                        <Flag className="w-8 h-8 text-amber-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Create Action Item</h2>
                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-amber-500 mt-2">Departmental Direct Action</p>
                </div>
                
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Zone Name</label>
                            <input 
                                required
                                value={formData.zone_name}
                                onChange={(e) => setFormData({ ...formData, zone_name: e.target.value })}
                                className="w-full bg-navy-900 border border-navy-700/50 rounded-2xl px-5 py-4 text-white text-xs focus:ring-2 focus:ring-amber-500/30 outline-none shadow-inner" 
                                placeholder="E.g. Sector 4 East..." 
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
                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Action Required</label>
                        <textarea 
                            required
                            rows={3}
                            value={formData.action_required}
                            onChange={(e) => setFormData({ ...formData, action_required: e.target.value })}
                            className="w-full bg-navy-900 border border-navy-700/50 rounded-2xl px-5 py-4 text-white text-xs focus:ring-2 focus:ring-amber-500/30 outline-none resize-none shadow-inner" 
                            placeholder="Detail what needs to happen immediately..." 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Urgency</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Immediate', 'This Week', 'This Month'].map(u => (
                                    <button 
                                        type="button"
                                        key={u}
                                        onClick={() => setFormData({...formData, urgency: u as any})}
                                        className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${formData.urgency === u ? 'bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-500/20' : 'bg-navy-900 text-navy-600 border-navy-700/50 hover:bg-navy-700'}`}
                                    >
                                        {u.split(' ')[0]}
                                    </button>
                                ))}
                            </div>
                        </div>
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
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Deadline</label>
                        <input 
                            type="date"
                            required
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            className="w-full bg-navy-900 border border-navy-700/50 rounded-2xl px-5 py-4 text-white text-xs outline-none shadow-inner" 
                        />
                    </div>

                    <div className="flex items-center gap-4 bg-navy-900/50 p-4 rounded-2xl border border-navy-700/50">
                        <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-navy-500">Authorized By</span>
                            <span className="text-xs font-black text-white italic">{ministerName}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-400 text-white font-black py-5 rounded-[1.5rem] text-xs uppercase tracking-[0.25em] shadow-2xl shadow-amber-500/40 transition-all active:scale-95 flex items-center justify-center"
                    >
                        Issue Directive <Flag className="w-4 h-4 ml-3" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ActionItemModal;
