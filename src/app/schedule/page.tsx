"use client";
import { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, Users, ArrowRight, Zap, RefreshCcw } from 'lucide-react';

export default function Scheduler() {
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [briefing, setBriefing] = useState<string>('');
    const [loadingBrief, setLoadingBrief] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    useEffect(() => {
        fetch('/api/schedule').then(r => r.json()).then(d => setEvents(d));
    }, []);

    const generateBriefing = async () => {
        setLoadingBrief(true);
        try {
            const res = await fetch(`/api/schedule/${selectedEvent.id}/briefing`);
          const data = await res.json();
          setBriefing(data.briefing);
      } catch(e) {
          console.error(e);
      }
      setLoadingBrief(false);
  };

  const addEvent = async () => {
      const ev = { title: newTitle || 'New Event', start_time: new Date().toISOString() };
      await fetch('/api/schedule', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ev) });
      fetch('/api/schedule').then(r => r.json()).then(d => setEvents(d));
      setShowAdd(false);
      setNewTitle('');
  };

  // Setup basic calendar matrix
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dates = Array.from({ length: 35 }, (_, i) => {
    let d = i - 2;
    if (d <= 0) d = 30 + d;
    if (d > 31) d = d - 31;
    // Basic assignment based on day matching 1-31
    const dayEvents = events.filter(e => new Date(e.start_time).getDate() === d && new Date(e.start_time).getMonth() === new Date().getMonth());
    return { d, cur: i >= 2 && i < 33, today: d === new Date().getDate(), events: dayEvents };
  });

  return (
    <div className="flex h-full gap-6">
      <div className={`flex flex-col flex-1 h-full transition-all duration-300 ${selectedEvent ? 'w-2/3 pr-6 border-r border-navy-700/50' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-blue-500" /> {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
             {showAdd && <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Event Title" className="bg-navy-800 p-2 rounded text-white" />}
             <button onClick={() => showAdd ? addEvent() : setShowAdd(!showAdd)} className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg border border-blue-400/30">
               <Plus className="w-5 h-5" /> <span>{showAdd ? 'Save' : 'Add Event'}</span>
             </button>
          </div>
        </div>

        <div className="flex-1 glass-card border flex flex-col min-h-0 bg-navy-800/40 p-0 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-7 border-b border-navy-700/50 bg-navy-900/60 sticky top-0 z-10 shrink-0">
            {days.map(d => (
              <div key={d} className="p-3 text-center text-xs font-bold tracking-widest text-navy-400 uppercase border-r last:border-r-0 border-navy-700/50">
                {d}
              </div>
            ))}
          </div>
          <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-y-auto">
            {dates.map((date, i) => (
              <div 
                key={i} 
                onClick={() => { if(date.events.length) { setSelectedEvent(date.events[0]); setBriefing(''); } }}
                className={`min-h-[100px] border-b border-r border-navy-700/50 p-2 flex flex-col group transition-all
                  ${!date.cur ? 'bg-navy-900/50' : 'bg-navy-800/20 hover:bg-navy-700/30 cursor-pointer'} 
                  ${date.today ? 'ring-2 ring-inset ring-blue-500 bg-blue-500/5' : ''}
                  ${i % 7 === 6 ? 'border-r-0' : ''}`}>
                <div className={`text-right text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full ml-auto mb-1 transition-colors
                  ${date.today ? 'bg-blue-500 text-white shadow-md shadow-blue-500/50' : (!date.cur ? 'text-navy-600' : 'text-navy-300 group-hover:text-blue-400 group-hover:bg-navy-800')}`}>
                  {date.d}
                </div>
                <div className="flex-1 flex flex-col space-y-1.5 overflow-hidden px-1">
                  {date.events.map((e, j) => (
                    <div key={j} className="text-[10px] sm:text-xs truncate font-bold px-2 py-1.5 rounded-md border bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-sm group-hover:shadow transition-all group-hover:-translate-y-0.5">
                      {e.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <div className="w-1/3 shrink-0 flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-300">
          <div className="glass-card flex-1 bg-navy-800/60 border border-navy-700/50 overflow-hidden flex flex-col shadow-2xl relative">
            <div className="p-6 border-b border-navy-700/50 bg-navy-900/60 sticky top-0 z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="text-sm font-bold tracking-widest text-blue-400 uppercase">{new Date(selectedEvent.start_time).toLocaleDateString()}</div>
                <button onClick={() => setSelectedEvent(null)} className="text-navy-400 hover:text-red-400 transition-colors bg-navy-800 p-1.5 rounded-full border border-navy-700 group">
                  <ArrowRight className="w-4 h-4 text-navy-400 group-hover:text-red-400" />
                </button>
              </div>
              <h3 className="text-xl font-black text-white leading-tight mb-2">{selectedEvent.title}</h3>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <button disabled={loadingBrief} onClick={generateBriefing} className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 hover:-translate-y-1 hover:shadow-xl shadow-blue-500/20 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all group border-t border-blue-400/30">
                {loadingBrief ? <RefreshCcw className="w-5 h-5 mr-3 animate-spin"/> : <Zap className="w-5 h-5 mr-3 group-hover:rotate-12 group-hover:scale-110 transition-transform" /> }
                {loadingBrief ? 'Drafting Briefing...' : 'Generate Auto Briefing' }
              </button>
              
              <div className="space-y-4">
                <h4 className="font-bold tracking-widest uppercase text-xs text-navy-400 mb-2 border-b border-navy-700/50 pb-2">AI Pre-Meeting Briefing</h4>
                <div className="bg-navy-900/50 p-4 rounded-xl border border-navy-700/30 text-sm text-navy-200 leading-relaxed font-medium whitespace-pre-line">
                  {briefing || 'Click "Generate Auto Briefing" to create an AI-powered summary.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
