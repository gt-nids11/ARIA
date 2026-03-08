"use client";
import { useState, useRef } from 'react';
import { Mic, Users, Calendar, ArrowRight, Play, FileAudio, RefreshCcw } from 'lucide-react';

export default function Meetings() {
    const [activeTab, setActiveTab] = useState('summary');
    const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
    const [meetings, setMeetings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/meetings', { method: 'POST', body: formData });
            const data = await res.json();
            const newMeeting = { id: Date.now(), title: file.name, date: new Date().toLocaleDateString(), attendees: 0, status: 'Completed', data };
            setMeetings([newMeeting, ...meetings]);
            setSelectedMeeting(newMeeting);
            setActiveTab('summary');
        } catch (e) {
            console.error(e);
            alert('Transcription failed');
        }
        setLoading(false);
    };

    return (
        <div className="flex h-full gap-6">
            <div className={\`flex flex-col space-y-6 transition-all duration-300 \${selectedMeeting ? 'w-1/3 border-r border-navy-700/50 pr-6' : 'w-full'}\`}>
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
                <input type="file" accept="audio/*" className="hidden" ref={fileInputRef} onChange={handleUpload} />
                <button onClick={() => !loading && fileInputRef.current?.click()} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                    {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <FileAudio className="w-5 h-5" />}
                    <span>{loading ? 'Transcribing...' : 'Upload Audio'}</span>
                </button>
            </div>

            <div className="flex-1 flex flex-col min-h-0 bg-navy-800/30 rounded-xl border border-navy-700/50 overflow-hidden">
                <div className="p-4 border-b border-navy-700/50 bg-navy-900/50 flex justify-between items-center sticky top-0 z-10">
                    <h3 className="font-bold text-sm text-gray-200">Recent Transcripts</h3>
                    <span className="bg-blue-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">{meetings.length} Records</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {meetings.map((meeting) => (
                        <div
                            key={meeting.id}
                            className={\`p-4 rounded-xl cursor-pointer group transition-all border \${selectedMeeting?.id === meeting.id ? 'bg-navy-900/80 border-blue-500/50 scale-[0.98]' : 'bg-navy-800/80 border-navy-700 hover:border-blue-500/50 hover:bg-navy-700/80 shadow-sm'}\`}
                    onClick={() => setSelectedMeeting(meeting)}
              >
                    <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-sm text-blue-50 leading-tight group-hover:text-blue-400 transition-colors">{meeting.title}</h4>
                        {selectedMeeting?.id !== meeting.id && <ArrowRight className="w-4 h-4 text-navy-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />}
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
      </div >

        { selectedMeeting && (
        <div className="flex-1 bg-navy-800/60 rounded-xl border border-navy-700/50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="p-8 border-b border-navy-700/50 bg-gradient-to-r from-navy-900 to-navy-800 relative shadow-sm z-10">
             <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-10 blur-xl">
               <Mic className="w-48 h-48 text-blue-400" />
             </div>
             <button onClick={() => setSelectedMeeting(null)} className="mb-4 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 flex items-center transition-colors">
                <ArrowRight className="w-3 h-3 rotate-180 mr-1" /> Back to List
             </button>
             <h2 className="text-2xl font-bold text-white mb-3">{selectedMeeting.title}</h2>
          </div>

          <div className="px-8 pt-4 border-b border-navy-700/50 flex space-x-6 items-end bg-navy-900/30 sticky top-0 z-10 backdrop-blur-sm">
            {['summary', 'decisions', 'action', 'unresolved issues', 'next steps'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={\`uppercase tracking-widest text-[11px] font-black pb-3 border-b-2 transition-all \${
                  activeTab === tab ? 'border-blue-500 text-blue-400 scale-105 transform origin-bottom' : 'border-transparent text-navy-400 hover:text-navy-200 hover:border-navy-500'
                }\`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-8 bg-navy-800/20">
            {activeTab === 'summary' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-navy-700">
                  <h3 className="font-bold text-lg text-white">Executive Summary</h3>
                </div>
                <p className="text-sm leading-relaxed text-navy-200 border-l-2 border-navy-600 pl-4 py-2">
                  {selectedMeeting.data.analysis.summary}
                </p>
                <div className="mt-4 pt-4 border-t border-navy-700">
                  <h4 className="font-bold text-white mb-2">Transcript Content</h4>
                  <p className="text-xs text-navy-300 italic whitespace-pre-line">{selectedMeeting.data.transcript}</p>
                </div>
              </div>
            )}
            
            {activeTab === 'decisions' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                <h3 className="font-bold text-lg text-white mb-6">Key Decisions Reached</h3>
                <div className="text-emerald-100/90 text-sm whitespace-pre-line bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                    {selectedMeeting.data.analysis.key_decisions}
                </div>
              </div>
            )}

            {activeTab === 'action' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="font-bold text-lg text-white mb-6">Action Items Issued</h3>
                <div className="text-blue-100/90 text-sm whitespace-pre-line bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                    {selectedMeeting.data.analysis.action_items}
                </div>
              </div>
            )}
            
            {activeTab === 'unresolved issues' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="font-bold text-lg text-white mb-6">Unresolved Issues</h3>
                <div className="text-yellow-100/90 text-sm whitespace-pre-line bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                    {selectedMeeting.data.analysis.unresolved_issues}
                </div>
              </div>
            )}

            {activeTab === 'next steps' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 p-4 border-l-4 border-purple-500 bg-purple-500/10 rounded-r">
                <h3 className="font-bold text-lg text-white mb-2">Next Steps</h3>
                <p className="text-sm text-purple-100/90 leading-relaxed font-medium whitespace-pre-line">
                    {selectedMeeting.data.analysis.next_steps}
                </p>
              </div>
            )}
          </div>
        </div >
      )
}
    </div >
  );
}
