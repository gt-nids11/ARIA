"use client";
import { usePathname } from 'next/navigation';
import { Bell, Search, UserCircle } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    switch (pathname) {
      case '/': return 'Dashboard Overview';
      case '/documents': return 'Secure Documents Intelligence';
      case '/meetings': return 'Meeting Transcripts & Briefs';
      case '/speeches': return 'AI Speech Drafting';
      case '/map': return 'Constituency Heatmap';
      case '/schedule': return 'Ministerial Schedule';
      case '/alerts': return 'Critical Alerts & Updates';
      case '/audit': return 'System Security Audit Log';
      default: return 'System Interface';
    }
  };

  return (
    <div className="h-20 bg-navy-900 border-b border-navy-700/50 flex items-center justify-between px-8 shrink-0 relative z-10 shadow-sm">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold tracking-tight">{getPageTitle()}</h2>
        <p className="text-xs text-navy-400">Classified Workspace</p>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative group cursor-pointer">
          <Search className="w-5 h-5 text-navy-400 group-hover:text-blue-400 transition-colors" />
        </div>
        
        <div className="relative cursor-pointer group">
          <Bell className="w-5 h-5 text-navy-400 group-hover:text-blue-400 transition-colors" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-navy-900"></span>
          </span>
        </div>

        <div className="h-8 w-px bg-navy-700/50 mx-2"></div>

        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="text-right flex flex-col items-end">
            <span className="text-sm font-medium">Minister Sharma</span>
            <span className="text-[10px] text-navy-400 uppercase tracking-wider">Dept of Defense</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-navy-700 border-2 border-navy-600 flex items-center justify-center overflow-hidden border-blue-500/50 group-hover:border-blue-400 transition-colors shadow-lg">
            <UserCircle className="w-8 h-8 text-navy-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
