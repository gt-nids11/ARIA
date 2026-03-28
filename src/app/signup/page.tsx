"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Shield, Lock, Mail, User, Loader2, Info } from 'lucide-react';
import { auth as authApi } from '@/lib/api';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authApi.register(name, username, password, 'admin');
            alert('Minister account created successfully. Please log in with your credentials.');
            router.push('/login');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-navy-950 px-4 relative overflow-hidden text-slate-100">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]"></div>
            
            <div className="max-w-md w-full glass-card p-10 space-y-8 relative border-t-4 border-t-blue-500 shadow-2xl">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-600/10 mb-6 border border-blue-500/20 shadow-inner">
                        <Shield className="w-10 h-10 text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight uppercase">Minister Registry</h2>
                    <p className="mt-2 text-navy-400 font-medium tracking-wide">Enter your credentials for governance access</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs font-black uppercase tracking-widest text-center animate-pulse">
                            [ERROR] {error}
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-navy-900 border border-navy-700 rounded-2xl p-4 pl-12 text-sm text-white placeholder:text-navy-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner"
                                placeholder="Full Minister Name"
                            />
                        </div>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-navy-900/50 border border-navy-700/50 rounded-2xl p-4 pl-12 text-sm text-white placeholder:text-navy-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner"
                                placeholder="Minister Username"
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-navy-900 border border-navy-700 rounded-2xl p-4 pl-12 text-sm text-white placeholder:text-navy-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner"
                                placeholder="Clearance Password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-black rounded-2xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center uppercase tracking_widest border-t border-blue-400/30"
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
