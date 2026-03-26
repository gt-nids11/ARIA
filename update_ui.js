const fs = require('fs');
const path = require('path');

// Helper to check if file exists before reading
const safeRead = (filePath) => {
    if (!fs.existsSync(filePath)) {
        console.error(`Error: ${filePath} not found.`);
        return null;
    }
    return fs.readFileSync(filePath, 'utf8');
};

// 1. UPDATE layout.tsx
let layout = safeRead('src/app/layout.tsx');
if (layout) {
    layout = layout.replace(
        'import Navbar from "@/components/Navbar";',
        'import Navbar from "@/components/Navbar";\nimport { AuthProvider } from "@/components/AuthContext";'
    );
    // Wrap Sidebar and content in AuthProvider
    layout = layout.replace(
        '<Sidebar />',
        '<AuthProvider>\n        <Sidebar />'
    );
    layout = layout.replace(
        '</body>',
        '        </AuthProvider>\n      </body>'
    );
    fs.writeFileSync('src/app/layout.tsx', layout);
    console.log("✓ layout.tsx updated");
}

// 2. UPDATE Navbar.tsx
let navbar = safeRead('src/components/Navbar.tsx');
if (navbar) {
    // Add imports
    navbar = navbar.replace(
        /import\s+{[^}]*UserCircle[^}]*}\s+from\s+['"]lucide-react['"];/,
        "import { Bell, Search, UserCircle, ChevronDown } from 'lucide-react';\nimport { useAuth } from './AuthContext';\nimport { useState } from 'react';"
    );

    // Inject Hook logic
    navbar = navbar.replace(
        'export default function Navbar() {',
        'export default function Navbar() {\n  const { currentOfficial, officials, setCurrentOfficial } = useAuth();\n  const [dropdownOpen, setDropdownOpen] = useState(false);'
    );

    // Replace the User Profile Block with the Dynamic Dropdown
    // Note: We use a more generic regex to find the profile block regardless of exact indentation
    const newUserBlock = `
        <div className="relative flex items-center space-x-3 cursor-pointer group" onClick={() => setDropdownOpen(!dropdownOpen)}>
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
                  onClick={() => {
                    setCurrentOfficial(off);
                    setDropdownOpen(false);
                  }}
                >
                  <p className="text-sm font-bold text-white">{off.name}</p>
                  <p className="text-xs text-navy-300">{off.department}</p>
                </div>
              ))}
            </div>
          )}
        </div>`.trim();

    // Replace the static Minister Sharma block
    navbar = navbar.replace(/<div className="flex items-center space-x-3 cursor-pointer group">[\s\S]*?<\/div>\s*<\/div>/, newUserBlock);
    
    fs.writeFileSync('src/components/Navbar.tsx', navbar);
    console.log("✓ Navbar.tsx updated");
}

// 3. UPDATE page.tsx (Dashboard)
let page = safeRead('src/app/page.tsx');
if (page) {
    if (!page.includes('"use client"')) {
        page = '"use client";\n' + page;
    }

    // Update Imports
    page = page.replace(
        "import { AlertTriangle, Clock, Activity, FileText, CheckCircle, MessageSquare, ShieldCheck } from \"lucide-react\";",
        "import { AlertTriangle, Clock, Activity, FileText, CheckCircle, MessageSquare, ShieldCheck, Upload } from \"lucide-react\";\nimport { useAuth } from '@/components/AuthContext';\nimport { useRef } from 'react';"
    );

    // Inject Auth and Ref
    page = page.replace(
        "export default function Dashboard() {",
        "export default function Dashboard() {\n  const { currentOfficial } = useAuth();\n  const fileInputRef = useRef(null);"
    );

    // Personalized Greeting
    page = page.replace(
        /Good Morning, Minister Sharma/g,
        "Good Morning, {currentOfficial.name}"
    );

    // Add Upload Button
    const uploadBtnHtml = `
          <div className="flex items-center">
            <input type="file" ref={fileInputRef} className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg shadow-lg border border-blue-500 transition-all shadow-blue-500/20"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </button>
          </div>`.trim();

    // Insertion point: After the dashboard description paragraph
    page = page.replace(
        /<\/p>\s*<\/div>\s*<\/div>/,
        `</p>\n        </div>\n        ${uploadBtnHtml}\n      </div>`
    );

    fs.writeFileSync('src/app/page.tsx', page);
    console.log("✓ page.tsx updated");
}
