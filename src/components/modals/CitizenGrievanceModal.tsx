"use client";
import React, { useState } from 'react';
import { X, User, Phone, MapPin, Shield, Calendar, Mail, FileText } from 'lucide-react';

interface CitizenGrievanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    ministerName: string;
}

const CitizenGrievanceModal: React.FC<CitizenGrievanceModalProps> = ({ isOpen, onClose, onSubmit, ministerName }) => {
    const [formData, setFormData] = useState({
        citizen_name: '',
        citizen_contact: '',
        title: '',
        description: '',
        category: 'Water Supply',
        area: 'New Delhi Central',
        priority: 'medium',
        source: 'Jan Sunwai',
        lat: 28.62,
        lng: 77.22,
        created_at: new Date().toISOString().split('T')[0]
    });

    if (!isOpen) return null;

    const sources = ["Constituency Visit", "Jan Sunwai", "Public Event", "Direct Approach", "Phone/Written Request"];
    const categories = ['Water Supply', 'Roads', 'Electricity', 'Sanitation', 'Public Safety', 'Healthcare', 'Education', 'Other'];
    const areas = ['New Delhi Central', 'Rohini', 'Saket', 'Dwarka', 'South Extension', 'Karol Bagh', 'Connaught Place', 'Lajpat Nagar', 'Janakpuri', 'Pitampura'];

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 backdrop-blur-xl bg-navy-950/80">
            <div className="w-full max-w-xl bg-navy-800 border-2 border-slate-600/30 p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(71,85,105,0.2)] relative animate-in fade-in zoom-in duration-300">
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-600"></div>
                <button onClick={onClose} className="absolute top-8 right-8 text-navy-400 hover:text-white transition-all bg-navy-900 p-2 rounded-xl hover:bg-red-500/20 border border-navy-700">
                    <X size={20} />
                </button>
                
                <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-slate-600/10 rounded-2xl border border-slate-500/20 flex items-center justify-center mx-auto mb-6">
                        <User className="w-8 h-8 text-slate-400" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Log Citizen Grievance</h2>
                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-500 mt-2">In-Person Direct Representation</p>
                </div>
                
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Citizen Name</label>
                            <input 
                                required
                                value={formData.citizen_name}
                                onChange={(e) => setFormData({ ...formData, citizen_name: e.target.value })}
                                className="w-full bg-navy-900 border border-navy-700/50 rounded-2xl px-5 py-4 text-white text-xs focus:ring-2 focus:ring-slate-500/30 outline-none shadow-inner" 
                                placeholder="E.g. Rajesh Kumar..." 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Citizen Contact</label>
                            <input 
                                value={formData.citizen_contact}
                                onChange={(e) => setFormData({ ...formData, citizen_contact: e.target.value })}
                                className="w-full bg-navy-900 border border-navy-700/50 rounded-2xl px-5 py-4 text-white text-xs focus:ring-2 focus:ring-slate-500/30 outline-none shadow-inner" 
                                placeholder="Phone/Email..." 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Issue Title</label>
                            <input 
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-navy-900 border border-navy-700/50 rounded-2xl px-5 py-4 text-white text-xs focus:ring-2 focus:ring-slate-500/30 outline-none shadow-inner" 
                                placeholder="Core Issue Summary..." 
                            />
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
                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Issue Description</label>
                        <textarea 
                            required
                            rows={2}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-navy-900 border border-navy-700/50 rounded-2xl px-5 py-4 text-white text-xs focus:ring-2 focus:ring-slate-500/30 outline-none resize-none shadow-inner" 
                            placeholder="Detail the citizen's representation..." 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Category</label>
                            <select 
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-navy-900 border border-navy-700/50 rounded-2xl px-5 py-4 text-white text-xs outline-none shadow-inner"
                            >
                                {categories.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Priority</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['high', 'medium', 'low'].map(p => (
                                    <button 
                                        type="button"
                                        key={p}
                                        onClick={() => setFormData({...formData, priority: p as any})}
                                        className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.priority === p ? 'bg-slate-600 text-white border-slate-500 shadow-lg shadow-slate-900/50' : 'bg-navy-900 text-navy-600 border-navy-700/50 hover:bg-navy-700'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-navy-900/50 p-4 rounded-2xl border border-navy-700/50">
                        <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center text-slate-400 border border-slate-500/20">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-navy-500">Logged By</span>
                            <span className="text-xs font-black text-white italic">{ministerName}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-600 hover:bg-slate-500 text-white font-black py-5 rounded-[1.5rem] text-xs uppercase tracking-[0.25em] shadow-2xl shadow-slate-900/50 transition-all active:scale-95 flex items-center justify-center"
                    >
                        Register Representation <User className="w-4 h-4 ml-3" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CitizenGrievanceModal;
