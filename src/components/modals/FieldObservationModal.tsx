"use client";
import React, { useState } from 'react';
import { X, Eye, Shield, Calendar, MapPin } from 'lucide-react';

interface FieldObservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    ministerName: string;
}

const FieldObservationModal: React.FC<FieldObservationModalProps> = ({ isOpen, onClose, onSubmit, ministerName }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Water Supply',
        area: 'New Delhi Central', // Changed from ward to area
        priority: 'medium',
        date_observed: new Date().toISOString().split('T')[0],
        lat: 28.62,
        lng: 77.22
    });

    if (!isOpen) return null;

    const categories = ['Water Supply', 'Roads', 'Electricity', 'Sanitation', 'Public Safety', 'Healthcare', 'Education', 'Other'];
    const areas = ['New Delhi Central', 'Rohini', 'Saket', 'Dwarka', 'South Extension', 'Karol Bagh', 'Connaught Place', 'Lajpat Nagar', 'Janakpuri', 'Pitampura'];

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 backdrop-blur-xl bg-navy-950/80">
            <div className="w-full max-w-xl bg-navy-800 border-2 border-blue-600/30 p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(37,99,235,0.2)] relative animate-in fade-in zoom-in duration-300">
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
                <button onClick={onClose} className="absolute top-8 right-8 text-navy-400 hover:text-white transition-all bg-navy-900 p-2 rounded-xl hover:bg-red-500/20 border border-navy-700">
                    <X size={20} />
                </button>
                
                <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-blue-600/10 rounded-2xl border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
                        <Eye className="w-8 h-8 text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Log Field Observation</h2>
                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-blue-400 mt-2">Personal Ministerial Finding</p>
                </div>
                
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Observation Title</label>
                        <input 
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-navy-900 border border-navy-700/50 rounded-2xl px-5 py-4 text-white text-xs focus:ring-2 focus:ring-blue-500/30 outline-none shadow-inner" 
                            placeholder="E.g. Broken Water Main on 5th Ave..." 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Description</label>
                        <textarea 
                            required
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-navy-900 border border-navy-700/50 rounded-2xl px-5 py-4 text-white text-xs focus:ring-2 focus:ring-blue-500/30 outline-none resize-none shadow-inner" 
                            placeholder="Detail what was observed..." 
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

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Date</label>
                            <input 
                                type="date"
                                required
                                value={formData.date_observed}
                                onChange={(e) => setFormData({ ...formData, date_observed: e.target.value })}
                                className="w-full bg-navy-900 border border-navy-700/50 rounded-2xl px-5 py-4 text-white text-xs outline-none shadow-inner" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 ml-2">Priority</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['high', 'medium', 'low'].map(p => (
                                    <button 
                                        type="button"
                                        key={p}
                                        onClick={() => setFormData({...formData, priority: p as any})}
                                        className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.priority === p ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30' : 'bg-navy-900 text-navy-600 border-navy-700/50 hover:bg-navy-700'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-navy-900/50 p-4 rounded-2xl border border-navy-700/50">
                        <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-navy-500">Observed By</span>
                            <span className="text-xs font-black text-white italic">{ministerName}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[1.5rem] text-xs uppercase tracking-[0.25em] shadow-2xl shadow-blue-600/40 transition-all active:scale-95 flex items-center justify-center"
                    >
                        Publish Finding <Eye className="w-4 h-4 ml-3" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FieldObservationModal;
