"use client";
import { useState } from 'react';
import { Mic, Users, Calendar, ArrowRight, Play, FileAudio } from 'lucide-react';

export default function Meetings() {
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedMeeting, setSelectedMeeting] = useState(false);

  return (
    <div className="flex h-full gap-6">
      <div className={`flex flex-col space-y-6 transition-all duration-300 ${selectedMeeting ? 'w-1/3 border-r border-navy-700/50 pr-6' : 'w-full'}`}>
        <div className="flex justify-between items-center bg-navy-800/50 p-6 rounded-xl border border-navy-700/50 shadow-inner">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center border border-blue-500/30">
              <Mic className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Record & Transcribe</h3>
              <p className="text-xs text-navy-400 uppercase tracking-widest font-semibold mt-1">AI Audio Analysis</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
            <FileAudio className="w-5 h-5" />
            <span>Upload Audio</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col min-h-0 bg-navy-800/30 rounded-xl border border-navy-700/50 overflow-hidden">
          <div className="p-4 border-b border-navy-700/50 bg-navy-900/50 flex justify-between items-center sticky top-0 z-10">
            <h3 className="font-bold text-sm text-gray-200">Recent Transcripts</h3>
            <span className="bg-blue-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">14 Records</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {[
              { id: 1, title: 'Disaster Relief Coordination - Q4', date: 'Oct 25, 2026', attendees: 8, status: 'Completed' },
              { id: 2, title: 'Ward 3 Townhall Pre-Brief', date: 'Oct 24, 2026', attendees: 4, status: 'Completed' },
              { id: 3, title: 'Transport Union Demands Negotiation', date: 'Oct 23, 2026', attendees: 12, status: 'Archived' },
              { id: 4, title: 'Weekly Core Cabinet Sync', date: 'Oct 20, 2026', attendees: 6, status: 'Completed' },
            ].map((meeting) => (
              <div 
                key={meeting.id} 
                className={`p-4 rounded-xl cursor-pointer group transition-all border ${selectedMeeting ? 'bg-navy-900/80 border-blue-500/50 scale-[0.98]' : 'bg-navy-800/80 border-navy-700 hover:border-blue-500/50 hover:bg-navy-700/80 shadow-sm'}`}
                onClick={() => setSelectedMeeting(true)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-sm text-blue-50 leading-tight group-hover:text-blue-400 transition-colors">{meeting.title}</h4>
                  {!selectedMeeting && <ArrowRight className="w-4 h-4 text-navy-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />}
                </div>
                <div className="flex items-center space-x-4 text-xs font-semibold text-navy-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-navy-500" />
                    <span>{meeting.date}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-navy-900 px-2 py-0.5 rounded border border-navy-700/50">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-gray-300">{meeting.attendees}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedMeeting && (
        <div className="flex-1 bg-navy-800/60 rounded-xl border border-navy-700/50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="p-8 border-b border-navy-700/50 bg-gradient-to-r from-navy-900 to-navy-800 relative shadow-sm z-10">
             <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-10 blur-xl">
               <Mic className="w-48 h-48 text-blue-400" />
             </div>
             <button onClick={() => setSelectedMeeting(false)} className="mb-4 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 flex items-center transition-colors">
                <ArrowRight className="w-3 h-3 rotate-180 mr-1" /> Back to List
             </button>
             <h2 className="text-2xl font-bold text-white mb-3">Disaster Relief Coordination - Q4</h2>
             <div className="flex space-x-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-navy-300 bg-navy-900/80 px-3 py-1.5 rounded-lg border border-navy-700/50">
                  <Calendar className="w-4 h-4 text-blue-400" /><span>Oct 25, 2026 &bull; 10:00 AM - 11:30 AM</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold text-navy-300 bg-navy-900/80 px-3 py-1.5 rounded-lg border border-navy-700/50">
                  <Users className="w-4 h-4 text-blue-400" /><span>8 Attendees</span>
                </div>
             </div>
          </div>

          <div className="px-8 pt-4 border-b border-navy-700/50 flex space-x-6 items-end bg-navy-900/30 sticky top-0 z-10 backdrop-blur-sm">
            {['summary', 'decisions', 'action', 'next steps'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`uppercase tracking-widest text-[11px] font-black pb-3 border-b-2 transition-all ${
                  activeTab === tab ? 'border-blue-500 text-blue-400 scale-105 transform origin-bottom' : 'border-transparent text-navy-400 hover:text-navy-200 hover:border-navy-500'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-8 bg-navy-800/20">
            {activeTab === 'summary' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-navy-700">
                  <h3 className="font-bold text-lg text-white">Executive Summary</h3>
                  <button className="flex items-center text-xs font-bold bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-colors">
                    <Play className="w-3 h-3 mr-2" /> Play Highlights
                  </button>
                </div>
                <p className="text-sm leading-relaxed text-navy-200 border-l-2 border-navy-600 pl-4 py-2">
                  The committee reviewed the Q4 disaster relief readiness protocols for coastal and low-lying wards. Primary focus was placed on the procurement of 40 new specialized amphibious rescue vehicles and the stockpiling of emergency rations. The finance department raised budget constraints regarding the vehicles, which were ultimately resolved by reallocating funds from the delayed tech park project.
                </p>
                <p className="text-sm leading-relaxed text-navy-200 border-l-2 border-navy-600 pl-4 py-2">
                  Additionally, the local police chief confirmed that their coordination framework with the centralized disaster response force is fully operational and awaiting a mock drill next month.
                </p>
              </div>
            )}
            
            {activeTab === 'decisions' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                <h3 className="font-bold text-lg text-white mb-6">Key Decisions Reached</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded mr-4 mt-0.5 shadow-sm border border-emerald-500/30">
                      <Mic className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-bold text-emerald-50">Approve Amphibious Vehicles</h4>
                      <p className="text-xs text-navy-300 mt-1">Authorized the immediate tender release for 40 units.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-yellow-500/20 text-yellow-400 p-1.5 rounded mr-4 mt-0.5 shadow-sm border border-yellow-500/30">
                      <Mic className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-bold text-yellow-50">Budget Reallocation</h4>
                      <p className="text-xs text-navy-300 mt-1">Shifted $2.5M from tech park fund to emergency relief immediately.</p>
                    </div>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'action' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="font-bold text-lg text-white mb-6">Action Items Issued</h3>
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 p-3 bg-navy-900/50 border border-navy-700 rounded-lg cursor-pointer hover:border-blue-500/30 transition-colors">
                    <input type="checkbox" className="mt-1 flex-shrink-0 w-4 h-4 rounded border-navy-600 text-blue-500 focus:ring-offset-navy-900 bg-navy-800" defaultChecked />
                    <span className="text-sm font-medium text-gray-300 line-through">Draft tender specifications for vehicles (Procurement team)</span>
                  </label>
                  <label className="flex items-start space-x-3 p-3 bg-navy-900/50 border border-navy-700 rounded-lg cursor-pointer hover:border-blue-500/30 transition-colors shadow-sm">
                    <input type="checkbox" className="mt-1 flex-shrink-0 w-4 h-4 rounded border-navy-600 text-blue-500 focus:ring-offset-navy-900 bg-navy-800" />
                    <span className="text-sm font-medium text-gray-100">Schedule mock drill with central response force (Police Chief)</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'next steps' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 p-4 border-l-4 border-blue-500 bg-blue-500/5 rounded-r">
                <h3 className="font-bold text-lg text-white mb-2">Next Steps</h3>
                <p className="text-sm text-blue-100/90 leading-relaxed font-medium">Follow-up meeting scheduled for Nov 5 to review tender bids and report on the mock drill outcomes. Minister requires daily evening briefings on any changes to the weather forecast models.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
