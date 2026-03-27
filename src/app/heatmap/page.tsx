"use client";
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { 
    Filter, Search, Plus, Navigation, Loader2, X, ChevronDown, 
    Calendar, Database, Shield, Eye, Flag, Zap, User, Briefcase,
    LayoutDashboard, MapPin
} from 'lucide-react';
import { 
    Chart as ChartJS, 
    CategoryScale, LinearScale, 
    BarElement, ArcElement, 
    Title, Tooltip, Legend 
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { MapEntry, EntryType } from '@/types/map';

// Modals
import FieldObservationModal from '@/components/modals/FieldObservationModal';
import ActionItemModal from '@/components/modals/ActionItemModal';
import EscalationModal from '@/components/modals/EscalationModal';
import CitizenGrievanceModal from '@/components/modals/CitizenGrievanceModal';

ChartJS.register(
    CategoryScale, LinearScale, 
    BarElement, ArcElement, 
    Title, Tooltip, Legend
);

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
    ssr: false,
    loading: () => <div className="h-full bg-navy-900 rounded-[2.5rem] flex items-center justify-center text-navy-500 font-black uppercase tracking-[0.3em] animate-pulse">Initializing Strategic Map Engine...</div>
});

const DELHI_AREAS = ['New Delhi Central', 'Rohini', 'Saket', 'Dwarka', 'South Extension', 'Karol Bagh', 'Connaught Place', 'Lajpat Nagar', 'Janakpuri', 'Pitampura'];

const SAMPLE_ENTRIES: MapEntry[] = [
    { id: 1, type: 'field_observation', title: 'Critical Water Supply Gap', description: 'Visited Main Sector 4. Pipeline leakage observed near primary school.', category: 'Water Supply', priority: 'high', area: 'Karol Bagh', lat: 28.6500, lng: 77.2300, observed_by: 'Minister Sharma', date_observed: '2026-03-20', status: 'open' },
    { id: 2, type: 'action_item', zone_name: 'Industrial Zone Delta', action_required: 'Immediate road surfacing needed before monsoon.', department: 'PWD', urgency: 'Immediate', area: 'Saket', lat: 28.6229, lng: 77.2080, created_by: 'Minister Sharma', deadline: '2026-03-31', status: 'pending' },
    { id: 3, type: 'escalation', zone_name: 'Border Security Hotspot', reason: 'Repeated sewage overflow despite multiple complaints.', escalation_level: 'State', department: 'Jal Board', supporting_observations: [1], escalated_by: 'Minister Sharma', date_escalated: '2026-03-25', lat: 28.6039, lng: 77.1990, area: 'Rohini', status: 'escalated' },
    { id: 4, type: 'citizen_grievance', citizen_name: 'Amit Mittal', citizen_contact: '987XXXXX21', title: 'Public Area Safety', description: 'Whole street is dark at night.', category: 'Electricity', priority: 'medium', area: 'New Delhi Central', lat: 28.6328, lng: 77.2197, logged_by: 'Minister Assistant', source: 'Jan Sunwai', created_at: '2026-03-26', status: 'open' },
];

export default function HeatmapPage() {
    const [entries, setEntries] = useState<MapEntry[]>(SAMPLE_ENTRIES);
    const [filteredEntries, setFilteredEntries] = useState<MapEntry[]>(SAMPLE_ENTRIES);
    const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
    const [zoom, setZoom] = useState(11);
    const [areaLabel, setAreaLabel] = useState('New Delhi Overview');
    
    // Filter states
    const [selectedArea, setSelectedArea] = useState<string>('All Areas');
    const [selectedTypes, setSelectedTypes] = useState<Set<EntryType>>(new Set(['field_observation', 'action_item', 'escalation', 'citizen_grievance']));
    
    // Modal states
    const [activeModal, setActiveModal] = useState<EntryType | null>(null);
    const [ministerName] = useState('Minister Sharma');
    const [searchValue, setSearchValue] = useState("");

    const toggleType = (type: EntryType) => {
        const next = new Set(selectedTypes);
        if (next.has(type)) next.delete(type);
        else next.add(type);
        setSelectedTypes(next);
    };

    const applyFilters = () => {
        let results = entries;
        if (selectedArea !== 'All Areas') {
            results = results.filter(e => e.area === selectedArea);
        }
        results = results.filter(e => selectedTypes.has(e.type));
        setFilteredEntries(results);
    };

    const addEntry = (data: any) => {
        const type = activeModal as EntryType;
        const newEntry = {
            ...data,
            id: Date.now(),
            type,
            status: type === 'escalation' ? 'escalated' : type === 'action_item' ? 'pending' : 'open'
        } as MapEntry;
        
        setEntries(prev => [newEntry, ...prev]);
        setFilteredEntries(prev => [newEntry, ...prev]);
        setMapCenter({ lat: newEntry.lat, lng: newEntry.lng });
        setZoom(14);
        setActiveModal(null);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        // Use Nominatim for free geocoding
        try {
            const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchValue}, Delhi, India`);
            const data = await resp.json();
            if (data && data[0]) {
                const loc = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
                setMapCenter(loc);
                setZoom(14);
                setAreaLabel(searchValue);
            }
        } catch (err) {
            console.error("Geocoding failed", err);
        }
    };

    // Chart Data
    const areaCounts = DELHI_AREAS.map(a => filteredEntries.filter(e => e.area === a).length);
    const wardData = {
        labels: DELHI_AREAS,
        datasets: [{
            label: 'Total Authority Entries',
            data: areaCounts,
            backgroundColor: '#3B82F6CC',
            borderRadius: 8,
            borderWidth: 0,
        }]
    };

    const typeLabels = ['Field Obs', 'Action Items', 'Escalated', 'Grievances'];
    const typeCounts = [
        filteredEntries.filter(e => e.type === 'field_observation').length,
        filteredEntries.filter(e => e.type === 'action_item').length,
        filteredEntries.filter(e => e.type === 'escalation').length,
        filteredEntries.filter(e => e.type === 'citizen_grievance').length,
    ];
    const typeData = {
        labels: typeLabels,
        datasets: [{
            data: typeCounts,
            backgroundColor: ['#3B82F6', '#F59E0B', '#EF4444', '#64748B'],
            borderWidth: 0,
            hoverOffset: 10
        }]
    };

    const commonOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            x: { ticks: { color: '#64748B', font: { size: 9, weight: 'bold' } }, grid: { display: false } },
            y: { ticks: { color: '#64748B', font: { size: 9, weight: 'bold' } }, grid: { color: 'rgba(255,255,255,0.03)' }, beginAtZero: true }
        }
    };

    return (
        <div className="flex h-full gap-8 flex-col overflow-y-auto pb-10 scrollbar-hide bg-navy-950 px-8">
            <div className="flex h-[620px] gap-8 shrink-0">
                {/* AUTHORITY SIDEBAR */}
                <div className="w-[340px] bg-navy-900 border border-white/5 p-8 flex flex-col space-y-8 shadow-2xl rounded-[3rem] relative overflow-hidden">
                    <div className="relative z-10 flex flex-col h-full">
                        <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8 flex items-center pr-3 border-b border-white/5 pb-5 italic">
                            <Shield className="w-5 h-5 mr-4 text-blue-500" /> Strategic Filter
                        </h3>
                        
                        <div className="space-y-8 flex-1">
                            {/* Entry Type Filter */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy-500 ml-1">Governance Category</label>
                                <div className="space-y-3">
                                    {(['field_observation', 'action_item', 'escalation', 'citizen_grievance'] as EntryType[]).map(type => (
                                        <label key={type} className="flex items-center gap-4 group cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedTypes.has(type)}
                                                onChange={() => toggleType(type)}
                                                className="sr-only"
                                            />
                                            <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${selectedTypes.has(type) ? 'bg-blue-600 border-blue-500 shadow-glow shadow-blue-500/20' : 'bg-navy-950 border-navy-700/50'}`}>
                                                {selectedTypes.has(type) && <X className="w-4 h-4 text-white rotate-45" />}
                                            </div>
                                            <span className={`text-xs font-black uppercase tracking-widest italic transition-colors ${selectedTypes.has(type) ? 'text-white' : 'text-navy-500'}`}>
                                                {type.replace('_', ' ')}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy-500 ml-1">Jurisdiction / Delhi Area</label>
                                <div className="relative group">
                                    <select 
                                        value={selectedArea}
                                        onChange={e => setSelectedArea(e.target.value)}
                                        className="w-full bg-navy-950 border border-navy-700/50 rounded-2xl px-6 py-4 text-white text-xs focus:ring-2 focus:ring-blue-500/30 outline-none transition-all appearance-none cursor-pointer font-black italic tracking-widest"
                                    >
                                        <option>All Areas</option>
                                        {DELHI_AREAS.map(a => <option key={a}>{a}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-600 pointer-events-none group-hover:text-blue-500 transition-colors" />
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={applyFilters}
                            className="mt-10 w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[1.5rem] text-[11px] uppercase tracking-[0.25em] shadow-xl shadow-blue-600/20 transition-all active:scale-95 group"
                        >
                            Sync Dataset <LayoutDashboard className="w-4 h-4 ml-3 inline-block transition-transform group-hover:rotate-12" />
                        </button>
                    </div>
                </div>

                {/* STRATEGIC MAP INTERFACE */}
                <div className="flex-1 flex flex-col relative min-w-0">
                    <div className="flex items-center gap-6 mb-6 p-6 bg-navy-900 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-3xl relative z-20">
                        <div className="bg-navy-950 p-3 rounded-2xl border border-blue-500/20 shadow-inner">
                            <Navigation className="w-6 h-6 text-blue-500" />
                        </div>
                        
                        <form onSubmit={handleSearch} className="flex-1">
                            <input
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                                type="text"
                                placeholder="COMMAND SEARCH: Enter strategic zone name (e.g. Rohini, Saket)..."
                                className="w-full bg-transparent text-white text-sm placeholder:text-navy-600 outline-none font-black italic tracking-widest"
                            />
                        </form>
                        
                        <div className="flex items-center gap-4 border-l border-white/5 pl-8">
                             <div className="text-right">
                                 <span className="block text-[8px] font-black text-navy-500 uppercase tracking-widest">Active Province</span>
                                 <span className="block text-sm font-black text-white italic tracking-tighter truncate max-w-[150px]">{areaLabel}</span>
                             </div>
                             <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                 <MapPin className="w-5 h-5 text-blue-500" />
                             </div>
                        </div>
                    </div>

                    <div className="flex-1 rounded-[3rem] overflow-hidden border border-white/5 relative shadow-inner bg-navy-900 group/map">
                        <MapComponent 
                            entries={filteredEntries} 
                            center={mapCenter} 
                            zoom={zoom}
                        />

                        {/* HIGH COMMAND ACTION BUTTONS (ALWAYS VISIBLE TITLES) */}
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-4">
                            <button 
                                onClick={() => setActiveModal('field_observation')}
                                className="group flex items-center gap-6 bg-navy-900/95 backdrop-blur-xl border border-blue-600/30 px-6 py-4 rounded-3xl hover:bg-blue-600 transition-all hover:translate-x-[-10px] shadow-2xl active:scale-95 min-w-[220px] justify-between"
                            >
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Log Field View</span>
                                <Eye className="w-6 h-6 text-blue-500 group-hover:text-white" />
                            </button>
                            <button 
                                onClick={() => setActiveModal('action_item')}
                                className="group flex items-center gap-6 bg-navy-900/95 backdrop-blur-xl border border-amber-600/30 px-6 py-4 rounded-3xl hover:bg-amber-600 transition-all hover:translate-x-[-10px] shadow-2xl active:scale-95 min-w-[220px] justify-between"
                            >
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Direct Directive</span>
                                <Flag className="w-6 h-6 text-amber-500 group-hover:text-white" />
                            </button>
                            <button 
                                onClick={() => setActiveModal('escalation')}
                                className="group flex items-center gap-6 bg-navy-900/95 backdrop-blur-xl border border-red-600/30 px-6 py-4 rounded-3xl hover:bg-red-600 transition-all hover:translate-x-[-10px] shadow-2xl active:scale-95 min-w-[220px] justify-between"
                            >
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Escalate Alert</span>
                                <Zap className="w-6 h-6 text-red-500 group-hover:text-white" />
                            </button>
                            <div className="w-full h-px bg-white/5 my-2"></div>
                            <button 
                                onClick={() => setActiveModal('citizen_grievance')}
                                className="group flex items-center gap-6 bg-navy-900/95 backdrop-blur-xl border border-slate-600/30 px-6 py-4 rounded-3xl hover:bg-slate-600 transition-all hover:translate-x-[-10px] shadow-2xl active:scale-95 min-w-[220px] justify-between"
                            >
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Log Representation</span>
                                <User className="w-6 h-6 text-slate-500 group-hover:text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* STRATEGIC ANALYTICS DASHBOARD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[380px] shrink-0">
                <div className="bg-navy-900 border border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                        <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs flex items-center italic">
                            <Database className="w-5 h-5 mr-4 text-blue-500" /> Delhi Province Scope
                        </h3>
                    </div>
                    <div className="h-52 relative">
                        <Bar 
                            data={wardData} 
                            options={{
                                ...commonOptions,
                                maintainAspectRatio: false,
                            }} 
                        />
                    </div>
                </div>

                <div className="bg-navy-900 border border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                        <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs flex items-center italic">
                            <Briefcase className="w-5 h-5 mr-4 text-purple-500" /> Operational Distribution
                        </h3>
                    </div>
                    <div className="h-52 flex justify-center items-center">
                        <Doughnut 
                            data={typeData} 
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { 
                                        position: 'right', 
                                        labels: { 
                                            color: '#64748B', 
                                            font: { size: 10, weight: 'bold' },
                                            padding: 20,
                                            usePointStyle: true,
                                            pointStyle: 'rectRounded'
                                        } 
                                    }
                                }
                            }} 
                        />
                    </div>
                </div>
            </div>

            <FieldObservationModal 
                isOpen={activeModal === 'field_observation'} 
                onClose={() => setActiveModal(null)} 
                onSubmit={addEntry} 
                ministerName={ministerName}
            />
            <ActionItemModal 
                isOpen={activeModal === 'action_item'} 
                onClose={() => setActiveModal(null)} 
                onSubmit={addEntry} 
                ministerName={ministerName}
            />
            <EscalationModal 
                isOpen={activeModal === 'escalation'} 
                onClose={() => setActiveModal(null)} 
                onSubmit={addEntry} 
                ministerName={ministerName}
                existingObservations={entries}
            />
            <CitizenGrievanceModal 
                isOpen={activeModal === 'citizen_grievance'} 
                onClose={() => setActiveModal(null)} 
                onSubmit={addEntry} 
                ministerName={ministerName}
            />
        </div>
    );
}
