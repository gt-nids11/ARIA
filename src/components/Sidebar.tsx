"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, Mic, Map, Calendar, Bell, Shield, ShieldCheck } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Meetings', href: '/meetings', icon: Users },
  { name: 'Speeches', href: '/speeches', icon: Mic },
  { name: 'Map', href: '/map', icon: Map },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Audit Log', href: '/audit', icon: Shield },
];

export default function Sidebar() {
  const pathname = usePathname();
  if (pathname === '/login') return null;

  return (
    <div className="w-64 bg-navy-800/80 backdrop-blur-md border-r border-navy-700/50 flex flex-col h-full text-foreground transition-all shrink-0">
      <div className="p-6 flex items-center space-x-3 border-b border-navy-700/50">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
          <span className="font-bold text-xl tracking-tighter">AR</span>
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-widest text-blue-50">ARIA</h1>
          <p className="text-[10px] text-blue-400 font-medium tracking-wider uppercase">Gov Intelligence</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group ${isActive ? 'bg-blue-600/10 text-blue-500' : 'hover:bg-navy-700/50 text-navy-200 hover:text-blue-400'}`}>
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-500' : 'text-navy-400 group-hover:text-blue-400'}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-navy-700/50">
        <div className="bg-navy-900/50 rounded-xl p-3 flex items-center space-x-3 border border-navy-700/30 shadow-inner">
          <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-200 truncate">Level 4 Clearance</span>
            <span className="text-[10px] text-navy-400 uppercase tracking-wider">Ministerial</span>
          </div>
        </div>
      </div>
    </div>
  );
}
