"use client";
import { useState } from 'react';
import { PenTool, Copy, Download, Edit3, Sparkles, Wand2, RefreshCcw } from 'lucide-react';

export default function Speeches() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [draft, setDraft] = useState('');

    const [formData, setFormData] = useState({
        event_type: 'Public Inauguration',
        audience: '',
        topic: '',
        tone: 'Formal',
        key_points: ''
    });

    const generateDraft = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch('/api/speeches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            const data = await res.json();
            setDraft(data.draft);
        } catch (e) {
            console.error(e);
            alert('Failed to generate draft');
        }
        setIsGenerating(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(draft);
        alert('Copied to clipboard!');
    };

    const handleDownload = () => {
        const blob = new Blob([draft], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'speech_draft.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex h-full gap-6">
            <div className="flex-1 flex flex-col space-y-6">
                <div className="grid grid-cols-2 gap-6 h-full">
                    <div className="glass-card p-6 flex flex-col min-h-0 bg-navy-800/50">
                        <h3 className="font-bold text-lg mb-4 flex items-center text-white border-b border-navy-700/50 pb-3">
                            <PenTool className="w-5 h-5 mr-3 text-blue-400" />
                            Speech Parameters
                        </h3>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-navy-600">
                            <div>
                                <label className="block text-xs font-bold text-navy-300 uppercase tracking-wider mb-1.5">Event Type</label>
                                <select value={formData.event_type} onChange={e => setFormData({ ...formData, event_type: e.target.value })} className="w-full bg-navy-900 border border-navy-600 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner text-gray-200">
                                    <option>Public Inauguration</option>
                                    <option>Press Conference</option>
                                    <option>Parliament Session</option>
                                    <option>Internal Briefing</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-navy-300 uppercase tracking-wider mb-1.5">Audience</label>
                                <input value={formData.audience} onChange={e => setFormData({ ...formData, audience: e.target.value })} type="text" placeholder="e.g. Ward 7 Residents, Media" className="w-full bg-navy-900 border border-navy-600 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner placeholder:text-navy-500 text-gray-200" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-navy-300 uppercase tracking-wider mb-1.5">Topic</label>
                                <input value={formData.topic} onChange={e => setFormData({ ...formData, topic: e.target.value })} type="text" placeholder="e.g. New Water Pipeline Project" className="w-full bg-navy-900 border border-navy-600 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner placeholder:text-navy-500 text-gray-200" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-navy-300 uppercase tracking-wider mb-1.5">Tone</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Formal', 'Neutral', 'Inspiring'].map((tone) => (
                                        <button key={tone} onClick={() => setFormData({ ...formData, tone })} className={\`p-2 border rounded-lg text-sm font-semibold transition-colors shadow-sm \${formData.tone === tone ? 'bg-blue-600 border-blue-500 text-white' : 'bg-navy-900 border-navy-600 text-navy-300 hover:text-white hover:border-navy-500'}\`}>
                                    {tone}
                                </button>
                  ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-navy-300 uppercase tracking-wider mb-1.5">Key Points</label>
                            <textarea value={formData.key_points} onChange={e => setFormData({ ...formData, key_points: e.target.value })} rows={4} className="w-full bg-navy-900 border border-navy-600 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner resize-none placeholder:text-navy-500 text-gray-200" placeholder="- Acknowledge past issues..."></textarea>
                        </div>
                    </div>

                    <button
                        onClick={generateDraft}
                        disabled={isGenerating}
                        className={\`mt-6 w-full py-4 rounded-lg font-bold shadow-lg transition-all flex items-center justify-center text-white text-lg group \${isGenerating ? 'bg-blue-600/50 cursor-not-allowed border outline-none' : 'bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 hover:shadow-blue-500/25 border-t border-blue-400/30'}\`}>
                    {isGenerating ? (
                        <>
                            <RefreshCcw className="w-5 h-5 mr-3 animate-spin text-blue-200" /> Generating Intelligence Draft...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-3 group-hover:scale-125 transition-transform" /> Generate Speech Draft
                        </>
                    )}
                </button>
            </div>

            <div className="glass-card flex flex-col min-h-0 relative z-10 p-0 border border-navy-600 shadow-xl overflow-hidden group/draft">
                <div className="p-4 border-b border-navy-600 bg-navy-900/80 backdrop-blur-sm flex justify-between items-center z-20 sticky top-0">
                    <div className="flex items-center">
                        <Wand2 className="w-5 h-5 mr-2 text-blue-400" />
                        <h3 className="font-bold text-white">AI Generated Output</h3>
                    </div>

                    {draft && (
                        <div className="flex space-x-2">
                            <button onClick={handleCopy} className="p-2 bg-navy-800 border border-navy-600 hover:border-emerald-500 rounded text-navy-300 hover:text-emerald-400 transition-colors shadow">
                                <Copy className="w-4 h-4" />
                            </button>
                            <button onClick={handleDownload} className="p-2 bg-navy-800 border border-navy-600 hover:border-purple-500 rounded text-navy-300 hover:text-purple-400 transition-colors shadow">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex-1 p-6 overflow-y-auto relative bg-navy-800/20">
                    {!draft && !isGenerating && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                                <Sparkles className="w-8 h-8 text-blue-500/50" />
                            </div>
                            <h4 className="text-navy-300 font-bold mb-2">Awaiting Parameters</h4>
                            <p className="text-navy-500 text-sm max-w-xs leading-relaxed">Fill out the speech criteria on the left and click "Generate" to instruct ARIA to draft the content.</p>
                        </div>
                    )}

                    {draft && (
                        <div className="prose prose-invert prose-blue max-w-none w-full whitespace-pre-line text-navy-100 leading-relaxed font-serif text-lg tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {draft}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div >
    </div >
  );
}
