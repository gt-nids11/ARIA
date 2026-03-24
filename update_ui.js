const fs = require('fs');

// 1. UPDATE layout.tsx
let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
layout = layout.replace('import Navbar from "@/components/Navbar";', 'import Navbar from "@/components/Navbar";\nimport { AuthProvider } from "@/components/AuthContext";');
layout = layout.replace('<Sidebar />\n        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">', '<AuthProvider>\n        <Sidebar />\n        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">');
layout = layout.replace('</div>\n      </body>', '</div>\n        </AuthProvider>\n      </body>');
fs.writeFileSync('src/app/layout.tsx', layout);

// 2. UPDATE Navbar.tsx
let navbar = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
navbar = navbar.replace("import { Bell, Search, UserCircle } from 'lucide-react';", "import { Bell, Search, UserCircle, ChevronDown } from 'lucide-react';\nimport { useAuth } from './AuthContext';\nimport { useState } from 'react';");
navbar = navbar.replace("export default function Navbar() {", "export default function Navbar() {\n  const { currentOfficial, officials, setCurrentOfficial } = useAuth();\n  const [dropdownOpen, setDropdownOpen] = useState(false);");

let oldUserBlock = `<div className="flex items-center space-x-3 cursor-pointer group">
          <div className="text-right flex flex-col items-end">
            <span className="text-sm font-medium">Minister Sharma</span>
            <span className="text-[10px] text-navy-400 uppercase tracking-wider">Dept of Defense</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-navy-700 border-2 border-navy-600 flex items-center justify-center overflow-hidden border-blue-500/50 group-hover:border-blue-400 transition-colors shadow-lg">
            <UserCircle className="w-8 h-8 text-navy-300" />
          </div>
        </div>`;

let newUserBlock = `<div className="relative flex items-center space-x-3 cursor-pointer group" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <div className="text-right flex flex-col items-end">
            <span className="text-sm font-medium">{currentOfficial.name}</span>
            <span className="text-[10px] text-navy-400 uppercase tracking-wider">{currentOfficial.department}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-navy-700 border-2 border-navy-600 flex items-center justify-center overflow-hidden border-blue-500/50 group-hover:border-blue-400 transition-colors shadow-lg">
            <UserCircle className="w-8 h-8 text-navy-300" />
          </div>
          <ChevronDown className="w-4 h-4 text-navy-400" />
          
          {dropdownOpen && (
            <div className="absolute top-12 right-0 mt-2 w-56 bg-navy-800 border border-navy-600 rounded-lg shadow-2xl z-50 overflow-hidden">
              <div className="px-4 py-2 border-b border-navy-700 bg-navy-900/50">
                <p className="text-xs text-navy-400 font-bold uppercase tracking-wider">Switch Context</p>
              </div>
              {officials.map(off => (
                <div 
                  key={off.id} 
                  className="px-4 py-3 hover:bg-navy-700 transition-colors"
                  onClick={() => setCurrentOfficial(off)}
                >
                  <p className="text-sm font-bold text-white">{off.name}</p>
                  <p className="text-xs text-navy-300">{off.department}</p>
                </div>
              ))}
            </div>
          )}
        </div>`;

navbar = navbar.replace(oldUserBlock, newUserBlock);
fs.writeFileSync('src/components/Navbar.tsx', navbar);

// 3. UPDATE page.tsx (Dashboard)
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// The file doesn't have use client, so add it
if (!page.includes('"use client"')) {
  page = '"use client";\n' + page;
}

page = page.replace('import { AlertTriangle, Clock, Activity, FileText, CheckCircle, MessageSquare, ShieldCheck } from "lucide-react";', 'import { AlertTriangle, Clock, Activity, FileText, CheckCircle, MessageSquare, ShieldCheck, Upload } from "lucide-react";\nimport { useAuth } from "@/components/AuthContext";\nimport { useRef } from "react";');

page = page.replace('export default function Dashboard() {', 'export default function Dashboard() {\n  const { currentOfficial } = useAuth();\n  const fileInputRef = useRef<HTMLInputElement>(null);');

page = page.replace('<h1 className="text-3xl font-bold tracking-tight text-white mb-1">Good Morning, Minister Sharma</h1>', '<h1 className="text-3xl font-bold tracking-tight text-white mb-1">Good Morning, {currentOfficial.name}</h1>');

let uploadHtml = `<div className="flex items-center">
            <input type="file" ref={fileInputRef} className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg shadow-lg border border-blue-500 transition-all shadow-blue-500/20"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </button>
          </div>`;

page = page.replace('<div className="flex justify-between items-end">\n        <div>', '<div className="flex justify-between items-end">\n        <div>');

page = page.replace('</p>\n        </div>\n      </div>', '</p>\n        </div>\n        ' + uploadHtml + '\n      </div>');

fs.writeFileSync('src/app/page.tsx', page);
console.log("UI Updated!");
