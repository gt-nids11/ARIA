"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/components/AuthContext";
import { Upload, FileText, CheckCircle, RefreshCcw, Search, Calendar, Database, Check } from "lucide-react";

function DocumentsContent() {
  const router = useRouter();
  const { currentOfficial } = useAuth();
  
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadMsg, setUploadMsg] = useState<{text: string, type: 'info' | 'success' | 'error'} | null>(null);
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
      } else {
        console.error("Failed to fetch documents:", data.message);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
          text: `SUCCESS: '${file.name}' has been secured in the database.`, 
          type: 'success' 
        });
        // Refresh the document list immediately to show the new file
        await fetchDocuments();
      } else {
        setUploadMsg({ 
          text: `[ERROR] Failed to save '${file.name}': ${data.message}`, 
          type: 'error' 
        });
      }
    } catch (err: any) {
      setUploadMsg({ 
        text: `[ERROR] Network drop during upload of '${file.name}': ${err.message}`, 
        type: 'error' 
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Auto dismiss success message after 5 seconds
      setTimeout(() => setUploadMsg(null), 5000);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Secure Documents</h1>
          <p className="text-navy-400 text-sm font-medium tracking-wide">
            Access and manage highly classified intellectual assets.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white text-xs font-bold rounded shadow-lg shadow-blue-900/50 border border-blue-500/50 transition-all uppercase tracking-widest"
          >
            <Upload className="w-4 h-4 mr-2" /> Upload New File
          </button>
          <button onClick={fetchDocuments} className="px-4 py-2 bg-navy-800 hover:bg-navy-700 rounded text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center border border-navy-600 transition-colors shadow">
            {loading ? <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-2" />} Sync Vault
          </button>
        </div>
      </div>

      {uploadMsg && (
        <div className={`p-4 rounded-xl border flex items-center space-x-3 shadow-lg animate-in fade-in slide-in-from-top-4 duration-500 ${
          uploadMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
          uploadMsg.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
          'bg-blue-500/10 border-blue-500/30 text-blue-400'
        }`}>
          {uploadMsg.type === 'success' ? <Check className="w-5 h-5 flex-shrink-0" /> : 
           uploadMsg.type === 'error' ? <RefreshCcw className="w-5 h-5 flex-shrink-0" /> : 
           <RefreshCcw className="w-5 h-5 flex-shrink-0 animate-spin" />}
          <p className="text-sm font-bold tracking-wide">{uploadMsg.text}</p>
        </div>
      )}

      <div className="glass-card shadow-2xl border-navy-700/50 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"></div>
        
        <div className="p-4 border-b border-navy-700/50 bg-navy-900/30 flex justify-between items-center">
            <div className="flex items-center text-blue-100">
                <Database className="w-5 h-5 mr-2 text-blue-400" /> 
                <h2 className="text-lg font-bold">Database Index: ARIA_db.documents</h2>
            </div>
            <div className="relative">
                <Search className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Filter documents..." className="bg-navy-800/80 border border-navy-600 focus:border-blue-500 text-sm rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-navy-500 w-64 transition-all" />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy-800/30 text-xs uppercase tracking-widest text-navy-300 border-b border-navy-700/50">
                <th className="px-6 py-4 font-bold">File Name</th>
                <th className="px-6 py-4 font-bold">Type</th>
                <th className="px-6 py-4 font-bold">Size</th>
                <th className="px-6 py-4 font-bold">Upload Date</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-navy-400 font-bold bg-navy-800/10">
                    <div className="flex justify-center items-center">
                        <RefreshCcw className="w-5 h-5 mr-3 animate-spin text-blue-500" />
                        INDEXING VAULT...
                    </div>
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-navy-400 font-bold bg-navy-800/10 border-dashed border-b border-navy-700/50">
                    No documents stored in the database yet. Use the upload button to ingest files.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc._id} className="border-b border-navy-700/30 hover:bg-blue-600-[0.03] transition-colors group">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-900/30 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                          <FileText className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                        {doc.filename}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-navy-300 uppercase tracking-wider">
                        {doc.mime_type || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-navy-300">
                      {formatBytes(doc.file_size)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-xs text-navy-300">
                        <Calendar className="w-3 h-3 mr-2 opacity-50" />
                        {new Date(doc.uploaded_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {doc.status || "PROCESSED"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
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
