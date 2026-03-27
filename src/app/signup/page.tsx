"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Shield, Lock, Mail, User, Loader2 } from 'lucide-react';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                alert('Personnel account created. Level-1 Viewer clearance granted by default. Please login.');
                router.push('/login');
            } else {
                setError(data.detail || 'Registration failed');
            }
        } catch (err) {
            setError('Connection to security server failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-navy-950 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]"></div>
            
            <div className="max-w-md w-full glass-card p-10 space-y-8 relative border-t-4 border-t-emerald-500 shadow-2xl">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-600/10 mb-6 border border-emerald-500/20 shadow-inner">
                        <UserPlus className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Registry Entry</h2>
                    <p className="mt-2 text-navy-400 font-medium tracking-wide">Register new personnel in the ARIA database</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs font-black uppercase tracking-widest text-center animate-pulse">
                            [ERROR] {error}
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-navy-900 border border-navy-700 rounded-2xl p-4 pl-12 text-sm text-white placeholder:text-navy-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner"
                                placeholder="Full Personnel Name"
                            />
                        </div>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-navy-900 border border-navy-700 rounded-2xl p-4 pl-12 text-sm text-white placeholder:text-navy-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner"
                                placeholder="government@email.gov.in"
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-navy-900 border border-navy-700 rounded-2xl p-4 pl-12 text-sm text-white placeholder:text-navy-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner"
                                placeholder="Clearance Password"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-navy-900/50 rounded-xl border border-white/5 space-y-2">
                        <div className="flex items-center text-[10px] text-navy-400 font-bold uppercase tracking-wider">
                            <Shield className="w-3 h-3 mr-2 text-emerald-500" /> Automatic Assignment
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-navy-200">Starting Role</span>
                            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Viewer</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-navy-200">Default Clearance</span>
                            <span className="text-xs font-black text-emerald-400 tracking-widest">LEVEL 1</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-6 bg-gradient-to-r from-emerald-700 to-emerald-500 hover:from-emerald-600 hover:to-emerald-400 text-white font-black rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center uppercase tracking_widest border-t border-emerald-400/30"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            'Execute Registration'
                        )}
                    </button>
                    
                    <div className="text-center">
                        <Link href="/login" className="text-xs font-black text-navy-400 hover:text-emerald-400 transition-colors uppercase tracking-[0.2em]">
                            Existing Personnel Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
