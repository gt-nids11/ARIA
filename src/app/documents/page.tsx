"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/components/AuthContext";
import { 
  Upload, FileText, CheckCircle, RefreshCcw, Search, 
  Calendar, Database, Check, X, ShieldAlert, FileSearch 
} from "lucide-react";

function DocumentsContent() {
  const router = useRouter();
  const { currentOfficial } = useAuth();
  
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadMsg, setUploadMsg] = useState<{text: string, type: 'info' | 'success' | 'error'} | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authenticate access
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchDocuments();
    }
  }, [router]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/documents/list");
      const data = await res.json();
      if (res.ok && data.success) {
        setDocuments(data.documents);
        // Auto-select first document if none selected
        if (data.documents.length > 0 && !selectedDoc) {
          // setSelectedDoc(data.documents[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setUploadMsg({ text: `Uploading '${file.name}' to ARIA Secure Vault...`, type: 'info' });
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUploadMsg({ 
          text: `SUCCESS: '${file.name}' has been secured and analyzed.`, 
          type: 'success' 
        });
        
        // Construct the new document object to select it locally
        const newDoc = {
          _id: data.documentId,
          filename: file.name,
          uploaded_at: new Date(),
          intelligence: data.intelligence
        };
        
        setSelectedDoc(newDoc);
        await fetchDocuments();
      } else {
        setUploadMsg({ text: `[ERROR] Failed to save '${file.name}': ${data.message}`, type: 'error' });
      }
    } catch (err: any) {
      setUploadMsg({ text: `[ERROR] Network drop during upload: ${err.message}`, type: 'error' });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setUploadMsg(null), 5000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="flex flex-col h-full -m-6">
      {/* Header Area */}
      <div className="px-8 py-6 border-b border-navy-700/50 bg-navy-900/20">
        <h1 className="text-2xl font-black text-white tracking-tight">Secure Documents Intelligence</h1>
        <p className="text-navy-400 text-xs font-bold uppercase tracking-widest mt-1">Classified Workspace</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Drag & Drop Area */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative group cursor-pointer border-2 border-dashed rounded-2xl p-12 transition-all duration-300
              flex flex-col items-center justify-center space-y-4
              ${isDragging ? 'bg-blue-600/10 border-blue-500 scale-[1.01]' : 'bg-navy-800/20 border-navy-700 hover:border-navy-600 hover:bg-navy-800/30'}
            `}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} 
            />
            <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-1">Drag & Drop Intel Documents</h3>
                <p className="text-navy-400 text-xs font-medium tracking-wide">or click to browse local secure files (PDF, TXT)</p>
            </div>
          </div>

          {/* Recent Uploads Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Recent Uploads</h2>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                {documents.length} Files
              </span>
            </div>

            {loading ? (
               <div className="p-12 text-center text-navy-500 font-bold uppercase tracking-widest text-xs animate-pulse">
                  Synchronizing with Vault...
               </div>
            ) : documents.length === 0 ? (
               <div className="p-12 text-center rounded-2xl border-2 border-dashed border-navy-700/50 text-navy-500 font-bold uppercase tracking-widest text-xs">
                  No Intel Assets Indexed
               </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div 
                    key={doc._id} 
                    className={`
                      group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300
                      ${selectedDoc?._id === doc._id ? 'bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-900/20' : 'bg-navy-800/30 border-navy-700/50 hover:bg-navy-800/50 hover:border-navy-600'}
                    `}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center border transition-all
                        ${selectedDoc?._id === doc._id ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/30' : 'bg-navy-900/50 border-navy-700 text-blue-400'}
                      `}>
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white group-hover:text-blue-100 transition-colors">{doc.filename}</h4>
                        <p className="text-[10px] text-navy-400 font-bold tracking-widest uppercase mt-0.5">
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedDoc(doc)}
                      className={`
                        px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all
                        ${selectedDoc?._id === doc._id ? 'bg-blue-600 text-white' : 'bg-navy-900/50 text-blue-400 border border-navy-700 hover:bg-navy-800'}
                      `}
                    >
                      View Summary
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Intelligence Panel */}
        <div className="w-[450px] border-l border-navy-700/50 bg-navy-900/30 flex flex-col p-8 overflow-y-auto relative">
          {!selectedDoc ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-30 select-none">
                <FileSearch className="w-20 h-20 text-navy-400 stroke-1" />
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white uppercase tracking-tighter">No Active Intel</h3>
                    <p className="text-xs text-navy-400 font-bold uppercase tracking-widest max-w-[200px]">Select a document to begin AI intelligence processing</p>
                </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">AI Intelligence Summary</h2>
                    <h3 className="text-2xl font-black text-white tracking-tight leading-none truncate max-w-[300px]">{selectedDoc.filename}</h3>
                </div>
                <button onClick={() => setSelectedDoc(null)} className="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-400 transition-colors">
                    <X className="w-5 h-5" />
                </button>
              </div>

              {/* Document Summary */}
              <div className="space-y-4">
                  <p className="text-sm italic text-navy-200 leading-relaxed font-medium">
                    {selectedDoc.intelligence?.summary || "Analyzing intelligence assets... Initializing extraction protocols."}
                  </p>
              </div>

              {/* Key Decisions */}
              <div className="bg-blue-600/10 rounded-2xl border border-blue-500/20 p-6 space-y-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <CheckCircle className="w-16 h-16 text-blue-400" />
                  </div>
                  <h4 className="flex items-center text-xs font-black text-blue-100 uppercase tracking-widest">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                    Key Decisions
                  </h4>
                  <ul className="space-y-3 relative z-10">
                    {selectedDoc.intelligence?.key_decisions?.map((item: string, i: number) => (
                      <li key={i} className="flex gap-3 text-xs font-semibold text-blue-200/80 leading-relaxed">
                        <span className="text-blue-400 mt-1.5">•</span>
                        <span>{item}</span>
                      </li>
                    )) || <li className="text-xs text-navy-500 animate-pulse">Processing decision vectors...</li>}
                  </ul>
              </div>

              {/* Action Items */}
              <div className="bg-emerald-500/10 rounded-2xl border border-emerald-500/20 p-6 space-y-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Database className="w-16 h-16 text-emerald-400" />
                  </div>
                  <h4 className="flex items-center text-xs font-black text-emerald-100 uppercase tracking-widest">
                    <Check className="w-4 h-4 text-emerald-500 mr-2" />
                    Action Items
                  </h4>
                  <div className="space-y-3 relative z-10">
                    {selectedDoc.intelligence?.action_items?.map((item: string, i: number) => (
                      <div key={i} className="flex gap-4 p-3 rounded-xl bg-navy-950/40 border border-emerald-500/10">
                        <span className="text-xs font-black text-emerald-500/70">{i + 1}.</span>
                        <p className="text-xs font-semibold text-emerald-100/90 leading-relaxed">{item}</p>
                      </div>
                    )) || <div className="text-xs text-navy-500 animate-pulse">Generating action parameters...</div>}
                  </div>
              </div>

              {/* Grid for Stakeholders and Deadlines */}
              <div className="grid grid-cols-2 gap-4">
                  {/* Stakeholders */}
                  <div className="bg-amber-500/10 rounded-2xl border border-amber-500/20 p-5 space-y-3">
                      <h4 className="flex items-center text-[10px] font-black text-amber-200 uppercase tracking-widest">
                        <Database className="w-3.5 h-3.5 mr-2 text-amber-500" />
                        Stakeholders
                      </h4>
                      <div className="space-y-2">
                        {selectedDoc.intelligence?.stakeholders?.map((s: string, i: number) => (
                          <div key={i} className="text-[11px] font-bold text-amber-100/80 bg-amber-950/30 px-2 py-1 rounded border border-amber-500/10">
                            {s}
                          </div>
                        )) || <span className="text-[10px] text-navy-500 italic">No stakeholders identified</span>}
                      </div>
                  </div>

                  {/* Deadlines */}
                  <div className="bg-purple-500/10 rounded-2xl border border-purple-500/20 p-5 space-y-3">
                      <h4 className="flex items-center text-[10px] font-black text-purple-200 uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5 mr-2 text-purple-500" />
                        Deadlines
                      </h4>
                      <div className="space-y-2">
                        {selectedDoc.intelligence?.deadlines?.map((d: any, i: number) => (
                          <div key={i} className="space-y-0.5">
                            <div className="text-[10px] font-black text-purple-400">{d.date}</div>
                            <div className="text-[10px] font-bold text-purple-100/70 truncate">{d.task}</div>
                          </div>
                        )) || <span className="text-[10px] text-navy-500 italic">No critical deadlines</span>}
                      </div>
                  </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Notification Overlay */}
      {uploadMsg && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-bottom-8 fade-in duration-500">
           <div className={`px-6 py-4 rounded-2xl border flex items-center space-x-4 shadow-2xl backdrop-blur-xl ${
              uploadMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-100' : 
              uploadMsg.type === 'error' ? 'bg-red-500/10 border-red-500/40 text-red-100' :
              'bg-blue-500/10 border-blue-500/40 text-blue-100'
           }`}>
              {uploadMsg.type === 'success' ? <Check className="w-5 h-5 text-emerald-400" /> : 
               uploadMsg.type === 'error' ? <ShieldAlert className="w-5 h-5 text-red-400" /> : 
               <RefreshCcw className="w-5 h-5 text-blue-400 animate-spin" />}
              <span className="text-sm font-bold tracking-tight">{uploadMsg.text}</span>
           </div>
        </div>
      )}
    </div>
  );
}

export default function DocumentsPage() {
    return (
        <AuthProvider>
            <DocumentsContent />
        </AuthProvider>
    );
}
