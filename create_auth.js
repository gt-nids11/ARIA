const fs = require('fs');
const path = require('path');

const authContextCode = "use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Official = { id: string; name: string; department: string };

export const officialsList: Official[] = [
  { id: '1', name: 'Minister Sharma', department: 'Dept of Defense' },
  { id: '2', name: 'Secretary Patel', department: 'Urban Planning' },
  { id: '3', name: 'Director Singh', department: 'Intelligence' },
  { id: '4', name: 'Officer Gupta', department: 'Local Administration' }
];

type AuthContextType = {
  currentOfficial: Official;
  setCurrentOfficial: (official: Official) => void;
  officials: Official[];
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentOfficial, setCurrentOfficial] = useState<Official>(officialsList[0]);

  return (
    <AuthContext.Provider value={{ currentOfficial, setCurrentOfficial, officials: officialsList }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
;
fs.writeFileSync('src/components/AuthContext.tsx', authContextCode);

// Modifying layout.tsx to include AuthProvider
let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
layout = layout.replace('import Navbar from "@/components/Navbar";', 'import Navbar from "@/components/Navbar";\nimport { AuthProvider } from "@/components/AuthContext";');
layout = layout.replace('<Sidebar />', '<AuthProvider>\n        <Sidebar />');
layout = layout.replace('</div>\n      </body>', '</div>\n        </AuthProvider>\n      </body>');
fs.writeFileSync('src/app/layout.tsx', layout);
