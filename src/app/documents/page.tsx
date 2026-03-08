"use client";
import { useState, useRef } from 'react';
import { UploadCloud, FileText, X, AlertCircle, Users, Calendar, CheckSquare, RefreshCcw } from 'lucide-react';

export default function Documents() {
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [docs, setDocs] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/documents', { method: 'POST', body: formData });
            const data = await res.json();
            const newDoc = { name: file.name, date: new Date().toLocaleDateString(), data };
            setDocs([newDoc, ...docs]);
            setSelectedDoc(newDoc);
        } catch (e) {
            console.error(e);
            alert('Upload failed');
        }
        setLoading(false);
    };

    return (
        <div className="flex h-full gap-6 relative overflow-hidden">
            <div className="flex-1 flex flex-col space-y-6 transition-all duration-500">
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.txt" onChange={handleUpload} />
                <div onClick={() => !loading && fileInputRef.current?.click()} className={`glass-card p-10 border-2 border-dashed border-navy-600 flex flex-col items-center justify-center bg-navy-800/20 ${!loading ? 'hover:bg-navy-800/40 cursor-pointer' : ''} transition-colors group`}>
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {loading ? <RefreshCcw className="w-8 h-8 text-blue-400 animate-spin" /> : <UploadCloud className="w-8 h-8 text-blue-400 group-hover:text-blue-300" />}
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{loading ? 'Processing Document...' : 'Drag & Drop Intel Documents'}</h3>
                <p className="text-sm text-navy-400">{loading ? 'Calling ARIA Intelligence' : 'or click to browse local secure files (PDF, TXT)'}</p>
            </div>

            <div className="glass-card flex-1 p-6 relative">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-white">Recent Uploads</h3>
                    <span className="text-xs font-semibold uppercase text-blue-400 tracking-wider">{docs.length} Files</span>
                </div>
                <div className="space-y-3">
                    {docs.map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-navy-800/50 border border-navy-700/50 hover:border-blue-500/30 transition-colors group">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-navy-900 rounded-lg group-hover:bg-blue-900/40 transition-colors border border-navy-700">
                                    <FileText className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <div className="font-medium text-sm text-gray-200">{doc.name}</div>
                                    <div className="text-xs text-navy-400 mt-1 uppercase tracking-wider">{doc.date}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedDoc(doc)}
                                className="px-4 py-2 rounded bg-navy-700/50 text-blue-400 font-semibold text-xs border border-navy-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                View Summary
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      {
        selectedDoc && (
            <div className="w-[450px] shrink-0 glass-card h-full overflow-y-auto border-l border-blue-500/30 p-0 animate-in slide-in-from-right-8 fade-in duration-300 relative bg-navy-800/95">
                <div className="p-6 border-b border-navy-700/50 sticky top-0 bg-navy-800/95 backdrop-blur z-10 flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-1">AI Intelligence Summary</h3>
                        <h2 className="text-lg font-bold text-white leading-tight">{selectedDoc.name}</h2>
                    </div>
                    <button onClick={() => setSelectedDoc(null)} className="p-2 hover:bg-navy-700 rounded-full transition-colors">
                        <X className="w-5 h-5 text-navy-300" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <p className="text-sm text-gray-300 italic mb-4">{selectedDoc.data.summary}</p>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                        <h4 className="flex items-center font-bold text-blue-300 text-sm mb-3">
                            <AlertCircle className="w-4 h-4 mr-2" /> Key Decisions
                        </h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-blue-100/80">
                            {(selectedDoc.data.key_decisions || '').split('\\n').filter(Boolean).map((t: string, i: number) => <li key={i}>{t.replace(/^- /, '')}</li>)}
                        </ul>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                        <h4 className="flex items-center font-bold text-emerald-300 text-sm mb-3">
                            <CheckSquare className="w-4 h-4 mr-2" /> Action Items
                        </h4>
                        <ul className="list-decimal pl-5 space-y-2 text-sm text-emerald-100/80">
                            {(selectedDoc.data.action_items || '').split('\\n').filter(Boolean).map((t: string, i: number) => <li key={i}>{t.replace(/^- /, '')}</li>)}
                        </ul>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                        <h4 className="flex items-center font-bold text-yellow-300 text-sm mb-3">
                            <Calendar className="w-4 h-4 mr-2" /> Critical Deadlines
                        </h4>
                        <div className="space-y-3">
                            {(selectedDoc.data.deadlines || '').split('\\n').filter(Boolean).map((t: string, i: number) => <div key={i} className="text-sm text-yellow-100/80 pb-2">{t}</div>)}
                        </div>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                        <h4 className="flex items-center font-bold text-purple-300 text-sm mb-3">
                            <Users className="w-4 h-4 mr-2" /> Key Stakeholders
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {(selectedDoc.data.stakeholders || '').split('\\n').filter(Boolean).map((t: string, i: number) => <span key={i} className="px-3 py-1 bg-navy-800 rounded border border-purple-500/30 text-xs font-semibold text-purple-200">{t}</span>)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    </div >
  );
}
