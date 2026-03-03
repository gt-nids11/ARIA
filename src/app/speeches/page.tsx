"use client";
import { useState } from 'react';
import { PenTool, Copy, Download, Edit3, Sparkles, Wand2, RefreshCcw } from 'lucide-react';

export default function Speeches() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState('');

  const generateDraft = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setDraft("Ladies and gentlemen, esteemed colleagues, and citizens of our great state.\n\nToday, we gather not just to witness the unveiling of the new water infrastructure project, but to reaffirm our commitment to the fundamental right of every citizen to clean, reliable water.\n\nOver the past year, we have seen the challenges faced by the residents of Ward 7. I have heard your voices, registered your complaints, and understood your frustration. This administration does not just listen; we act.\n\nThis $40 million investment will replace over 150 kilometers of aging pipelines, ensuring that erratic water supply becomes a thing of the past. It is a testament to our continuous pursuit of sustainable urban development.\n\nWe are building an infrastructure that our children can rely on. Thank you.");
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex h-full gap-6">
      <div className="flex-1 flex flex-col space-y-6">
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Left Form */}
          <div className="glass-card p-6 flex flex-col min-h-0 bg-navy-800/50">
            <h3 className="font-bold text-lg mb-4 flex items-center text-white border-b border-navy-700/50 pb-3">
              <PenTool className="w-5 h-5 mr-3 text-blue-400" />
              Speech Parameters
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-navy-600">
              <div>
                <label className="block text-xs font-bold text-navy-300 uppercase tracking-wider mb-1.5">Event Type</label>
                <select className="w-full bg-navy-900 border border-navy-600 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner text-gray-200">
                  <option>Public Inauguration</option>
                  <option>Press Conference</option>
                  <option>Parliament Session</option>
                  <option>Internal Briefing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-300 uppercase tracking-wider mb-1.5">Audience</label>
                <input type="text" placeholder="e.g. Ward 7 Residents, Media" className="w-full bg-navy-900 border border-navy-600 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner placeholder:text-navy-500 text-gray-200" />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-300 uppercase tracking-wider mb-1.5">Topic</label>
                <input type="text" placeholder="e.g. New Water Pipeline Project" className="w-full bg-navy-900 border border-navy-600 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner placeholder:text-navy-500 text-gray-200" />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-300 uppercase tracking-wider mb-1.5">Tone</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Formal', 'Neutral', 'Inspiring'].map((tone, i) => (
                    <button key={tone} className={`p-2 border rounded-lg text-sm font-semibold transition-colors shadow-sm ${i === 2 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-navy-900 border-navy-600 text-navy-300 hover:text-white hover:border-navy-500'}`}>
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-300 uppercase tracking-wider mb-1.5">Key Points</label>
                <textarea rows={4} className="w-full bg-navy-900 border border-navy-600 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner resize-none placeholder:text-navy-500 text-gray-200" placeholder="- Acknowledge past issues&#10;- Emphasize $40M investment&#10;- Future sustainability"></textarea>
              </div>
            </div>

            <button 
              onClick={generateDraft}
              disabled={isGenerating}
              className={`mt-6 w-full py-4 rounded-lg font-bold shadow-lg transition-all flex items-center justify-center text-white text-lg group ${isGenerating ? 'bg-blue-600/50 cursor-not-allowed border outline-none' : 'bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 hover:shadow-blue-500/25 border-t border-blue-400/30'}`}>
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

          {/* Right Draft Area */}
          <div className="glass-card flex flex-col min-h-0 relative z-10 p-0 border border-navy-600 shadow-xl overflow-hidden group/draft">
            <div className="p-4 border-b border-navy-600 bg-navy-900/80 backdrop-blur-sm flex justify-between items-center z-20 sticky top-0">
              <div className="flex items-center">
                <Wand2 className="w-5 h-5 mr-2 text-blue-400" />
                <h3 className="font-bold text-white">AI Generated Output</h3>
              </div>
              
              {draft && (
                <div className="flex space-x-2">
                  <button className="p-2 bg-navy-800 border border-navy-600 hover:border-blue-500 rounded text-navy-300 hover:text-blue-400 transition-colors shadow">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-navy-800 border border-navy-600 hover:border-emerald-500 rounded text-navy-300 hover:text-emerald-400 transition-colors shadow">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-navy-800 border border-navy-600 hover:border-purple-500 rounded text-navy-300 hover:text-purple-400 transition-colors shadow">
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
                  <p className="text-navy-500 text-sm max-w-xs leading-relaxed">Fill out the speech criteria on the left and click &quot;Generate&quot; to instruct ARIA to draft the content.</p>
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
      </div>

      <div className="w-72 shrink-0 glass-card bg-navy-800/40 border border-navy-700/50 h-full p-0 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-navy-700/50 bg-navy-900/60 font-bold text-white shadow-sm flex items-center justify-between sticky top-0 z-10">
          History
          <span className="bg-navy-700 text-[10px] text-navy-300 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Archive</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {[
            { title: 'Inauguration - V2', time: '10 mins ago', tone: 'Inspiring' },
            { title: 'Press Conf - Water', time: 'Yesterday', tone: 'Formal' },
            { title: 'Internal Brief - Budget', time: 'Oct 24', tone: 'Neutral' },
            { title: 'Townhall Ward 3', time: 'Oct 23', tone: 'Inspiring' },
            { title: 'Transport Strike Address', time: 'Oct 21', tone: 'Formal' }
          ].map((h, i) => (
            <div key={i} className="p-4 rounded-xl border border-navy-700/50 bg-navy-900/50 hover:bg-navy-800 hover:border-blue-500/30 cursor-pointer transition-all hover:shadow group flex flex-col">
              <div className="font-bold text-sm text-gray-200 group-hover:text-blue-200 transition-colors">{h.title}</div>
              <div className="flex justify-between items-end mt-3">
                <span className="text-[10px] text-navy-500 font-bold tracking-wider uppercase">{h.time}</span>
                <span className="text-[10px] bg-navy-800 border border-navy-600 text-navy-300 px-2 py-0.5 rounded shadow tracking-wider font-semibold group-hover:border-blue-500/50 group-hover:text-blue-300">{h.tone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
