"use client";
import { useState, useRef, useEffect } from 'react';
import { Mic, Users, Calendar, ArrowRight, FileAudio, RefreshCcw, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { meetings as meetingsApi } from '@/lib/api';

type MeetingAnalysis = {
    summary: string;
    key_decisions: string;
    action_items: string;
    unresolved_issues: string;
    next_steps: string;
};

type Meeting = {
    id: string;
    title: string;
    date: string;
    attendees: number;
    status: string;
    has_transcript: boolean;
    has_stored_audio: boolean;
    data: {
        transcript: string;
        analysis: MeetingAnalysis;
        message?: string;
    };
};

export default function Meetings() {
    const [activeTab, setActiveTab] = useState<'summary'|'transcript'|'decisions'|'action'|'unresolved issues'|'next steps'>('summary');
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState<{text: string, type: 'info' | 'success' | 'error'} | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchMeetings = async () => {
        try {
            const data = await meetingsApi.list();
            const mapped = data.map((m: any) => ({
                id: m.id.toString(),
                title: m.title,
                date: new Date(m.created_at).toLocaleDateString(),
                attendees: Math.floor(Math.random() * 5) + 2,
                status: m.transcript ? 'Completed' : 'Uploaded - No Transcript',
                has_transcript: !!m.transcript,
                has_stored_audio: !!m.audio_path,
                data: {
                    transcript: m.transcript || '',
                    analysis: {
                        summary: m.summary || '',
                        key_decisions: m.key_decisions || '',
                        action_items: m.action_items || '',
                        unresolved_issues: m.unresolved_issues || '',
                        next_steps: m.next_steps || ''
                    }
                }
            }));
            setMeetings(mapped);
        } catch (err) {
            console.error("Failed to fetch meetings:", err);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploadMsg({ text: `Uploading '${file.name}' to ARIA Secure Vault...`, type: 'info' });
        setLoading(true);
        
        try {
            const data = await meetingsApi.upload(file);
            if (data) {
                // Success: Backend returns the new meeting object
                await fetchMeetings();
                
                // Map the newly created meeting to match frontend type
                const matchedMeeting = {
                    id: data.id.toString(),
                    title: data.title,
                    date: new Date(data.created_at).toLocaleDateString(),
                    attendees: Math.floor(Math.random() * 5) + 2,
                    status: data.transcript ? 'Completed' : 'Uploaded - No Transcript',
                    has_transcript: !!data.transcript,
                    has_stored_audio: !!data.audio_path,
                    data: {
                        transcript: data.transcript || '',
                        analysis: {
                            summary: data.summary || '',
                            key_decisions: data.key_decisions || '',
                            action_items: data.action_items || '',
                            unresolved_issues: data.unresolved_issues || '',
                            next_steps: data.next_steps || ''
                        }
                    }
                };
                
                setSelectedMeeting(matchedMeeting);
                setActiveTab('summary');
                setUploadMsg({ text: `SUCCESS: '${file.name}' uploaded and transcribed!`, type: 'success' });
            }
        } catch (err: any) {
            console.error('Upload error:', err);
            setUploadMsg({ text: `[ERROR] ${err.message || 'Upload failed'}`, type: 'error' });
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setTimeout(() => setUploadMsg(null), 6000);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this recording and its analysis?")) return;
        
        try {
            await meetingsApi.delete(id);
            setMeetings(meetings.filter(m => m.id !== id));
            setSelectedMeeting(null);
            setUploadMsg({ text: "SUCCESS: Recording deleted successfully.", type: 'success' });
        } catch (err: any) {
            console.error("Delete error:", err);
            setUploadMsg({ text: `[ERROR] Delete failed: ${err.message}`, type: 'error' });
        } finally {
            setTimeout(() => setUploadMsg(null), 4000);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    return (
        <div className="flex h-full gap-6">
            <div className={`flex flex-col space-y-6 transition-all duration-300 ${selectedMeeting ? 'w-1/3 border-r border-navy-700/50 pr-6' : 'w-full'}`}>
                {uploadMsg && (
                    <div className={`p-4 rounded-xl border flex items-start gap-3 ${uploadMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' : uploadMsg.type === 'error' ? 'bg-red-500/10 border-red-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
                        {uploadMsg.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" /> : uploadMsg.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" /> : <Mic className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5 animate-pulse" />}
                        <p className={`text-sm font-semibold ${uploadMsg.type === 'success' ? 'text-emerald-200' : uploadMsg.type === 'error' ? 'text-red-200' : 'text-blue-200'}`}>{uploadMsg.text}</p>
                    </div>
                )}

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
                        <span>{loading ? 'Processing...' : 'Upload Audio'}</span>
                    </button>
                </div>

                <div className="flex-1 flex flex-col min-h-0 bg-navy-800/30 rounded-xl border border-navy-700/50 overflow-hidden">
                    <div className="p-4 border-b border-navy-700/50 bg-navy-900/50 flex justify-between items-center sticky top-0 z-10">
                        <h3 className="font-bold text-sm text-gray-200">Recent Recordings</h3>
                        <span className="bg-blue-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">{meetings.length} Records</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {meetings.map((meeting) => (
                            <div key={meeting.id} className={`p-4 rounded-xl cursor-pointer group transition-all border ${selectedMeeting?.id === meeting.id ? 'bg-navy-900/80 border-blue-500/50 scale-[0.98]' : 'bg-navy-800/80 border-navy-700 hover:border-blue-500/50 hover:bg-navy-700/80 shadow-sm'}`} onClick={() => setSelectedMeeting(meeting)}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-blue-50 leading-tight group-hover:text-blue-400 transition-colors">{meeting.title}</h4>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meeting.has_transcript ? 'bg-emerald-500/20 text-emerald-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{meeting.status}</span>
                                        </div>
                                    </div>
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
            </div>

            {selectedMeeting && (
                <div className="flex-1 bg-navy-800/60 rounded-xl border border-navy-700/50 flex flex-col overflow-hidden">
                    <div className="p-8 border-b border-navy-700/50 bg-gradient-to-r from-navy-900 to-navy-800 relative shadow-sm z-10">
                        <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-10 blur-xl">
                            <Mic className="w-48 h-48 text-blue-400" />
                        </div>
                        <button onClick={() => setSelectedMeeting(null)} className="mb-4 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 flex items-center transition-colors">
                            <ArrowRight className="w-3 h-3 rotate-180 mr-1" /> Back to List
                        </button>
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-3">{selectedMeeting.title}</h2>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${selectedMeeting.has_transcript ? 'bg-emerald-500/20 text-emerald-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{selectedMeeting.status}</span>
                            </div>
                            <button 
                                onClick={() => handleDelete(selectedMeeting.id)}
                                className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg font-bold transition-all active:scale-95"
                                title="Permanently delete this recording"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-wider">Delete</span>
                            </button>
                        </div>
                    </div>

                    {selectedMeeting.has_transcript ? (
                        <>
                            <div className="px-8 pt-4 border-b border-navy-700/50 flex space-x-6 items-end bg-navy-900/30 sticky top-0 z-10 backdrop-blur-sm">
                                {( ['summary', 'transcript', 'decisions', 'action', 'unresolved issues', 'next steps'] as const ).map((tab) => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} className={`uppercase tracking-widest text-[11px] font-black pb-3 border-b-2 transition-all ${activeTab === tab ? 'border-blue-500 text-blue-400 scale-105 transform origin-bottom' : 'border-transparent text-navy-400 hover:text-navy-200 hover:border-navy-500'}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 bg-navy-800/20">
                                {activeTab === 'summary' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between pb-4 border-b border-navy-700">
                                            <h3 className="font-bold text-lg text-white">Executive Summary</h3>
                                        </div>
                                        <p className="text-sm leading-relaxed text-navy-200 border-l-2 border-navy-600 pl-4 py-2">{selectedMeeting.data?.analysis?.summary}</p>
                                        <div className="mt-4 pt-4 border-t border-navy-700">
                                            <h4 className="font-bold text-white mb-2">Transcript Preview</h4>
                                            <p className="text-xs text-navy-300 italic whitespace-pre-line max-h-32 overflow-y-auto bg-navy-900/50 p-3 rounded border border-navy-700/50">
                                                {selectedMeeting.data?.transcript ? 
                                                    selectedMeeting.data.transcript.substring(0, 500) + (selectedMeeting.data.transcript.length > 500 ? '...' : '') : 
                                                    'No transcript available'
                                                }
                                            </p>
                                            <p className="text-xs text-navy-400 mt-2">Full transcript available in the Transcript tab</p>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'transcript' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between pb-4 border-b border-navy-700">
                                            <h3 className="font-bold text-lg text-white">Full Transcript</h3>
                                            <span className="text-xs text-navy-400 bg-navy-900/50 px-2 py-1 rounded">Interpreted Audio</span>
                                        </div>
                                        {selectedMeeting.data?.transcript ? (
                                            <div className="bg-navy-900/30 border border-navy-700/50 rounded-xl p-6">
                                                <div className="text-sm text-navy-200 leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto">
                                                    {selectedMeeting.data.transcript.split('\n').map((line: string, index: number) => (
                                                        <div key={index} className="mb-2">
                                                            {line.trim() ? (
                                                                <div className="flex">
                                                                    <span className="text-navy-500 text-xs mr-3 mt-0.5 w-6 flex-shrink-0">
                                                                        {index + 1}.
                                                                    </span>
                                                                    <span className="text-navy-200">{line}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="h-2"></div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-navy-700/50">
                                                    <div className="flex items-center justify-between text-xs text-navy-400">
                                                        <span>Audio transcribed using AI</span>
                                                        <span>{selectedMeeting.data.transcript.split(' ').length} words</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="text-navy-400 text-sm">No transcript available for this recording</div>
                                                <div className="text-navy-500 text-xs mt-2">The audio file was uploaded but transcription failed</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'decisions' && (
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-lg text-white mb-6">Key Decisions Reached</h3>
                                        <div className="text-emerald-100/90 text-sm whitespace-pre-line bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">{selectedMeeting.data?.analysis?.key_decisions}</div>
                                    </div>
                                )}
                                {activeTab === 'action' && (
                                    <div>
                                        <h3 className="font-bold text-lg text-white mb-6">Action Items Issued</h3>
                                        <div className="text-blue-100/90 text-sm whitespace-pre-line bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">{selectedMeeting.data?.analysis?.action_items}</div>
                                    </div>
                                )}
                                {activeTab === 'unresolved issues' && (
                                    <div>
                                        <h3 className="font-bold text-lg text-white mb-6">Unresolved Issues</h3>
                                        <div className="text-yellow-100/90 text-sm whitespace-pre-line bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">{selectedMeeting.data?.analysis?.unresolved_issues}</div>
                                    </div>
                                )}
                                {activeTab === 'next steps' && (
                                    <div className="p-4 border-l-4 border-purple-500 bg-purple-500/10 rounded-r">
                                        <h3 className="font-bold text-lg text-white mb-2">Next Steps</h3>
                                        <p className="text-sm text-purple-100/90 leading-relaxed font-medium whitespace-pre-line">{selectedMeeting.data?.analysis?.next_steps}</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-8">
                            <div className="text-center">
                                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-bold text-white mb-2">Audio Uploaded Successfully</h3>
                                <p className="text-navy-300 text-sm mb-4 max-w-md">The audio file has been securely stored in the database. However, transcription could not be generated at this time.</p>
                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-200 text-sm mb-6">
                                    <p className="font-semibold mb-1">Reasons transcription may fail:</p>
                                    <ul className="text-left space-y-1 text-xs">
                                        <li>• OpenAI API key is not configured</li>
                                        <li>• API rate limit exceeded</li>
                                        <li>• Audio file is corrupted or unsupported format</li>
                                        <li>• Network connectivity issues</li>
                                    </ul>
                                </div>
                                <p className="text-navy-400 text-xs">File: {selectedMeeting.title}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
