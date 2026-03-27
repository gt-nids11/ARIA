"use client";
import { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, Users, ArrowRight, Zap, RefreshCcw, ChevronLeft, ChevronRight, MapPin, Tag, Flag, X } from 'lucide-react';

export default function Scheduler() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // Initialize to March 2026 as per user screenshot
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [showAdd, setShowAdd] = useState(false);
    
    // New Event Form State
    const [formData, setFormData] = useState({
        title: '',
        date: '2026-03-27',
        startTime: '09:00',
        endTime: '10:00',
        location: '',
        attendees: '',
        type: 'meeting',
        priority: 'medium'
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = () => {
        fetch('/api/schedule').then(r => r.json()).then(d => setEvents(d));
    };

    const deleteEvent = async (id: string) => {
        if (!confirm('Are you sure you want to delete this operation?')) return;
        await fetch(`/api/schedule/${id}`, { method: 'DELETE' });
        setSelectedEvent(null);
        fetchEvents();
    };

    const toggleComplete = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        await fetch(`/api/schedule/${id}`, { 
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ status: newStatus }) 
        });
        if (selectedEvent && selectedEvent.id === id) {
            setSelectedEvent({...selectedEvent, status: newStatus});
        }
        fetchEvents();
    };

    const addEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        const start = new Date(`${formData.date}T${formData.startTime}:00`).toISOString();
        const end = new Date(`${formData.date}T${formData.endTime}:00`).toISOString();
        
        const ev = { 
            title: formData.title || 'New Event', 
            start_time: start,
            end_time: end,
            location: formData.location,
            attendees: formData.attendees,
            event_type: formData.type,
            priority: formData.priority,
            status: 'pending'
        };

        await fetch('/api/schedule', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(ev) 
        });
        
        fetchEvents();
        setShowAdd(false);
        setFormData({
            title: '',
            date: '2026-03-27',
            startTime: '09:00',
            endTime: '10:00',
            location: '',
            attendees: '',
            type: 'meeting',
            priority: 'medium'
        });
    };

    // Calendar logic
    const { daysInMonth, firstDayOfMonth, prevMonthDays, monthName, year } = useMemo(() => {
        const y = currentDate.getFullYear();
        const m = currentDate.getMonth();
        const firstDay = new Date(y, m, 1).getDay(); // 0 (Sun) to 6 (Sat)
        // Adjust to Monday start if needed, but standard is Sunday start for calendars.
        // User's screenshot shows Monday start: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; 
        
        const daysCount = new Date(y, m + 1, 0).getDate();
        const prevMonthDaysCount = new Date(y, m, 0).getDate();
        
        return {
            daysInMonth: daysCount,
            firstDayOfMonth: adjustedFirstDay,
            prevMonthDays: prevMonthDaysCount,
            monthName: currentDate.toLocaleDateString('en-US', { month: 'long' }),
            year: y
        };
    }, [currentDate]);

    const calendarGrid = useMemo(() => {
        const grid = [];
        // Previous month days
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            grid.push({ day: prevMonthDays - i, currentMonth: false, date: new Date(year, currentDate.getMonth() - 1, prevMonthDays - i) });
        }
        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            grid.push({ day: i, currentMonth: true, date: new Date(year, currentDate.getMonth(), i) });
        }
        // Next month days to fill 42 cells (6 weeks)
        const remaining = 42 - grid.length;
        for (let i = 1; i <= remaining; i++) {
            grid.push({ day: i, currentMonth: false, date: new Date(year, currentDate.getMonth() + 1, i) });
        }
        return grid;
    }, [daysInMonth, firstDayOfMonth, prevMonthDays, currentDate, year]);

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const changeYear = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear() + offset, currentDate.getMonth(), 1));
    };

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="flex h-full gap-6 overflow-hidden">
            <div className={`flex flex-col flex-1 h-full transition-all duration-500 ${selectedEvent ? 'w-2/3 pr-6 border-r border-navy-700/50' : 'w-full'}`}>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 bg-navy-800/80 p-1.5 rounded-xl border border-navy-700/50 shadow-inner">
                            <button onClick={() => changeYear(-1)} className="p-2 hover:bg-navy-700 rounded-lg text-navy-400 hover:text-white transition-all"><ChevronLeft className="w-4 h-4" /><ChevronLeft className="w-4 h-4 -mt-3" /></button>
                            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-navy-700 rounded-lg text-navy-400 hover:text-white transition-all"><ChevronLeft className="w-5 h-5" /></button>
                            <div className="px-6 py-1 text-center min-w-[180px]">
                                <h2 className="text-xl font-black text-white tracking-tight uppercase">{monthName} <span className="text-blue-500">{year}</span></h2>
                            </div>
                            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-navy-700 rounded-lg text-navy-400 hover:text-white transition-all"><ChevronRight className="w-5 h-5" /></button>
                            <button onClick={() => changeYear(1)} className="p-2 hover:bg-navy-700 rounded-lg text-navy-400 hover:text-white transition-all"><ChevronRight className="w-4 h-4" /><ChevronRight className="w-4 h-4 -mt-3" /></button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => setShowAdd(true)} 
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-blue-500/20 border border-blue-400/30 transition-all hover:-translate-y-0.5"
                        >
                            <Plus className="w-5 h-5" /> <span>CREATE EVENT</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 glass-card border flex flex-col min-h-0 bg-navy-800/40 p-0 overflow-hidden shadow-2xl relative">
                    <div className="grid grid-cols-7 border-b border-navy-700/50 bg-navy-900/80 sticky top-0 z-10 shrink-0 backdrop-blur-md">
                        {days.map(d => (
                            <div key={d} className="p-4 text-center text-[10px] font-black tracking-[0.2em] text-navy-400 uppercase">
                                {d}
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 grid grid-cols-7 overflow-y-auto">
                        {calendarGrid.map((dateObj, i) => {
                            const isToday = dateObj.date.toDateString() === new Date().toDateString();
                            const dayEvents = events.filter(e => {
                                const eventDate = new Date(e.start_time);
                                return eventDate.getDate() === dateObj.day && 
                                       eventDate.getMonth() === dateObj.date.getMonth() && 
                                       eventDate.getFullYear() === dateObj.date.getFullYear();
                            });

                            return (
                                <div 
                                    key={i} 
                                    onClick={() => { if(dayEvents.length) { setSelectedEvent(dayEvents[0]); } }}
                                    className={`min-h-[120px] border-b border-r border-navy-700/30 p-2 flex flex-col group transition-all relative
                                        ${!dateObj.currentMonth ? 'bg-navy-950/40 opacity-40' : 'bg-navy-900/10 hover:bg-navy-800/40 cursor-pointer'} 
                                        ${isToday ? 'bg-blue-500/5' : ''}
                                        ${i % 7 === 6 ? 'border-r-0' : ''}`}>
                                    
                                    <div className={`text-xs font-black w-7 h-7 flex items-center justify-center rounded-lg ml-auto mb-2 transition-all
                                        ${isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 scale-110' : (dateObj.currentMonth ? 'text-navy-300 group-hover:text-blue-400' : 'text-navy-600')}`}>
                                        {dateObj.day}
                                    </div>

                                    <div className="flex-1 flex flex-col space-y-1.5 overflow-hidden">
                                        {dayEvents.map((e, j) => (
                                            <div 
                                                key={j} 
                                                className={`text-[9px] truncate font-bold px-2 py-1.5 rounded-md border transition-all hover:scale-[1.02]
                                                    ${e.status === 'completed' ? 'opacity-40 grayscale blur-[0.2px]' : ''}
                                                    ${e.priority === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                                                      e.priority === 'medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 
                                                      'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className={e.status === 'completed' ? 'line-through' : ''}>{new Date(e.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                    <span className="opacity-60">{e.event_type}</span>
                                                </div>
                                                <div className={`mt-1 truncate ${e.status === 'completed' ? 'line-through' : ''}`}>{e.title}</div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* isToday check removed to avoid overlap as per user request */}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {selectedEvent && (
                <div className="w-1/3 shrink-0 flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="glass-card flex-1 bg-navy-900/70 border border-white/5 overflow-hidden flex flex-col shadow-2xl relative">
                        <div className="p-8 border-b border-white/5 bg-navy-900/40 backdrop-blur-xl">
                            <div className="flex justify-between items-start mb-6">
                                <div className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-[10px] font-black tracking-widest text-blue-400 uppercase">
                                    {new Date(selectedEvent.start_time).toLocaleDateString('en-US', {weekday: 'long', month: 'short', day: 'numeric'})}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button 
                                        onClick={() => toggleComplete(selectedEvent.id, selectedEvent.status)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all border
                                            ${selectedEvent.status === 'completed' 
                                                ? 'bg-amber-500/20 text-amber-500 border-amber-500/30 hover:bg-amber-500/30' 
                                                : 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/30'}`}
                                    >
                                        {selectedEvent.status === 'completed' ? 'REOPEN' : 'COMPLETE'}
                                    </button>
                                    <button 
                                        onClick={() => setSelectedEvent(null)}
                                        className="text-navy-400 hover:text-white transition-all bg-navy-800 p-2 rounded-xl border border-white/5 hover:bg-navy-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className={`text-3xl font-black text-white leading-none mb-6 tracking-tight ${selectedEvent.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                                {selectedEvent.title}
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center text-navy-300 text-xs font-bold">
                                    <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center mr-3 border border-white/5"><Clock className="w-4 h-4 text-blue-400" /></div>
                                    {new Date(selectedEvent.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(selectedEvent.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                                <div className="flex items-center text-navy-300 text-xs font-bold">
                                    <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center mr-3 border border-white/5"><MapPin className="w-4 h-4 text-indigo-400" /></div>
                                    {selectedEvent.location || 'Tactical HQ'}
                                </div>
                                <div className="flex items-center text-navy-300 text-xs font-bold">
                                    <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center mr-3 border border-white/5"><Users className="w-4 h-4 text-emerald-400" /></div>
                                    {selectedEvent.attendees || 'Classified'}
                                </div>
                                <div className="flex items-center text-navy-300 text-xs font-bold">
                                    <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center mr-3 border border-white/5"><Flag className={`w-4 h-4 ${selectedEvent.priority === 'high' ? 'text-red-400' : 'text-amber-400'}`} /></div>
                                    {selectedEvent.priority?.toUpperCase()} PRIORITY
                                </div>
                            </div>
                        </div>

                        <div className="p-8 overflow-y-auto space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-navy-700 pb-2">
                                    <h4 className="font-black tracking-[0.2em] uppercase text-[10px] text-navy-400">Operation Status</h4>
                                    <div className={`w-2 h-2 rounded-full ${selectedEvent.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                                </div>
                                <div className="bg-navy-900/80 p-6 rounded-2xl border border-white/5 text-sm text-navy-200 leading-relaxed font-medium shadow-inner">
                                    This operation is currently marked as <span className={`font-black uppercase ${selectedEvent.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'}`}>{selectedEvent.status || 'pending'}</span>.
                                    {selectedEvent.status === 'completed' 
                                        ? " All tactical objectives have been met and verified." 
                                        : " Operation is active and awaiting execution steps."}
                                </div>
                            </div>

                            <button 
                                onClick={() => deleteEvent(selectedEvent.id)}
                                className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 font-black tracking-widest text-[10px] uppercase hover:bg-red-500/20 transition-all flex items-center justify-center"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Terminate Operation Data
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Event Modal */}
            {showAdd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="glass-card w-full max-w-lg bg-navy-900 border border-white/10 shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-white/5 bg-navy-800/50 flex justify-between items-center">
                            <h3 className="text-2xl font-black text-white tracking-tight italic flex items-center uppercase"><Plus className="w-6 h-6 mr-3 text-blue-500" /> Create Operation</h3>
                            <button onClick={() => setShowAdd(false)} className="text-navy-400 hover:text-white transition-all bg-navy-900 p-2 rounded-xl border border-white/5"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={addEvent} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 mb-2 block">Operation Title</label>
                                    <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Budget Strategy Review" className="w-full bg-navy-800/50 border border-white/5 rounded-xl p-4 text-white font-bold placeholder:text-navy-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 mb-2 block">Date</label>
                                        <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-navy-800/50 border border-white/5 rounded-xl p-4 text-white font-bold focus:border-blue-500/50 transition-all outline-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 mb-2 block">Start</label>
                                            <input type="time" required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full bg-navy-800/50 border border-white/5 rounded-xl p-4 text-xs text-white font-bold focus:border-blue-500/50 transition-all outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 mb-2 block">End</label>
                                            <input type="time" required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full bg-navy-800/50 border border-white/5 rounded-xl p-4 text-xs text-white font-bold focus:border-blue-500/50 transition-all outline-none" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 mb-2 block">Tactical Location</label>
                                    <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Conference Room B" className="w-full bg-navy-800/50 border border-white/5 rounded-xl p-4 text-white font-bold placeholder:text-navy-600 outline-none focus:border-blue-500/50 transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 mb-2 block">Operation Type</label>
                                        <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-navy-800/50 border border-white/5 rounded-xl p-4 text-white font-bold outline-none focus:border-blue-500/50 transition-all">
                                            <option value="meeting">Meeting</option>
                                            <option value="briefing">Briefing</option>
                                            <option value="site_visit">Site Visit</option>
                                            <option value="press">Press Conference</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 mb-2 block">Security Priority</label>
                                        <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full bg-navy-800/50 border border-white/5 rounded-xl p-4 text-white font-bold outline-none focus:border-blue-500/50 transition-all">
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 over to-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest border-t border-white/20">Authorize Operation</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
