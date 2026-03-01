"use client";
import { useState } from 'react';
import { Calendar, Plus, Clock, Users, ArrowRight, Zap } from 'lucide-react';

export default function Scheduler() {
  const [selectedDate, setSelectedDate] = useState(false);

  // Simplified calendar generation
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dates = Array.from({ length: 35 }, (_, i) => {
    const day = i - 2; // start a bit earlier to simulate month start
    if (day <= 0) return { d: 30 + day, cur: false, events: [] };
    if (day > 31) return { d: day - 31, cur: false, events: [] };
    
    // add some events
    const evt = [];
    if (day === 4) evt.push({ title: 'Union Leader Sync', time: '10 AM', prio: 'high', bg: 'bg-red-500/20 text-red-500 border-red-500/30' });
    if (day === 8) evt.push({ title: 'City Planning', time: '3 PM', prio: 'low', bg: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' });
    if (day === 12) {
      evt.push({ title: 'Media Brief', time: '9 AM', prio: 'med', bg: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' });
      evt.push({ title: 'Site Visit', time: '2 PM', prio: 'low', bg: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' });
    }
    if (day === 22) evt.push({ title: 'Cabinet Sync', time: '11 AM', prio: 'high', bg: 'bg-red-500/20 text-red-500 border-red-500/30' });

    return { d: day, cur: true, today: day === 12, events: evt };
  });

  return (
    <div className="flex h-full gap-6">
      <div className={`flex flex-col flex-1 h-full transition-all duration-300 ${selectedDate ? 'w-2/3 pr-6 border-r border-navy-700/50' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-blue-500" /> October 2026
            </h2>
            <div className="flex group bg-navy-800 rounded-lg p-1 border border-navy-700/50 shadow-sm">
              <button className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 shadow-sm transition-colors text-xs font-bold uppercase tracking-wider">Month</button>
              <button className="px-3 py-1 text-navy-400 hover:text-navy-100 transition-colors text-xs font-bold uppercase tracking-wider">Week</button>
              <button className="px-3 py-1 text-navy-400 hover:text-navy-100 transition-colors text-xs font-bold uppercase tracking-wider">Day</button>
            </div>
          </div>
          <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 border border-blue-400/30">
            <Plus className="w-5 h-5" /> <span>Add Event</span>
          </button>
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
                onClick={() => date.events.length > 0 && setSelectedDate(true)}
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
                    <div key={j} className={`text-[10px] sm:text-xs truncate font-bold px-2 py-1.5 rounded-md border ${e.bg} shadow-sm group-hover:shadow transition-all group-hover:-translate-y-0.5`}>
                      <span className="opacity-80 font-normal mr-1">{e.time}</span> {e.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className="w-1/3 shrink-0 flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-300">
          <div className="glass-card flex-1 bg-navy-800/60 border border-navy-700/50 overflow-hidden flex flex-col shadow-2xl relative">
            <div className="p-6 border-b border-navy-700/50 bg-navy-900/60 sticky top-0 z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="text-sm font-bold tracking-widest text-blue-400 uppercase">October 12, 2026</div>
                <button onClick={() => setSelectedDate(false)} className="text-navy-400 hover:text-red-400 transition-colors bg-navy-800 p-1.5 rounded-full border border-navy-700 group">
                  <ArrowRight className="w-4 h-4 text-navy-400 group-hover:text-red-400" />
                </button>
              </div>
              <h3 className="text-xl font-black text-white leading-tight mb-2">Media Briefing on Infrastructure Package</h3>
              
              <div className="flex items-center space-x-3 mt-4 text-xs font-bold">
                <span className="flex items-center text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded border border-yellow-500/20">
                  <Clock className="w-3.5 h-3.5 mr-1" /> 09:00 AM - 10:00 AM
                </span>
                <span className="flex items-center text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                  <Users className="w-3.5 h-3.5 mr-1" /> 14 Attendees
                </span>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <button className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 hover:-translate-y-1 hover:shadow-xl shadow-blue-500/20 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all group border-t border-blue-400/30">
                <Zap className="w-5 h-5 mr-3 group-hover:rotate-12 group-hover:scale-110 transition-transform" /> Generate Auto Briefing
              </button>
              
              <div className="space-y-4">
                <h4 className="font-bold tracking-widest uppercase text-xs text-navy-400 mb-2 border-b border-navy-700/50 pb-2">Location & Context</h4>
                <div className="bg-navy-900/50 p-4 rounded-xl border border-navy-700/30 text-sm text-navy-200 leading-relaxed font-medium">
                  Main Press Room, Sector 2. Major local news networks will be present. Focus is expected to be on the Ward 7 water pipeline timeline and overall budget allocation.
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold tracking-widest uppercase text-xs text-navy-400 mb-2 border-b border-navy-700/50 pb-2">Key Attachments</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-navy-800/80 border border-navy-700 cursor-pointer hover:border-blue-500/30 hover:bg-navy-700/80 transition-all font-medium group">
                    <span className="text-sm text-gray-200 group-hover:text-blue-200 transition-colors">Q3_Infrastructure_Bill_Draft.pdf</span>
                    <ArrowRight className="w-4 h-4 text-navy-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-navy-800/80 border border-navy-700 cursor-pointer hover:border-blue-500/30 hover:bg-navy-700/80 transition-all font-medium group">
                    <span className="text-sm text-gray-200 group-hover:text-blue-200 transition-colors">Press_Release_V2.docx</span>
                    <ArrowRight className="w-4 h-4 text-navy-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
