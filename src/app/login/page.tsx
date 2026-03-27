"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { auth as authApi } from '@/lib/api';
import { Shield, Lock, User, UserPlus, Loader2, Info } from 'lucide-react';

export default function LoginPage() {
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [regName, setRegName] = useState('');
    const [regUser, setRegUser] = useState('');
    const [regPass, setRegPass] = useState('');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [isRegLoading, setIsRegLoading] = useState(false);
    
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoginLoading(true);

        try {
            const data = await authApi.login(loginUser, loginPass);
            if (data && data.access_token) {
                login(data.access_token, {
                    id: data.user_id,
                    name: data.name,
                    username: data.username,
                    role: data.role,
                    clearance: data.clearance
                });
            }
        } catch (err: any) {
            if (err.message.includes('404') || err.message.toLowerCase().includes('not found')) {
                setError('PERSONNEL RECORD NOT FOUND. PLEASE REGISTER IN THE ACCOUNTS REGISTRY SECTION TO THE RIGHT.');
            } else {
                setError(err.message || 'AUTHORIZATION FAILED');
            }
        } finally {
            setIsLoginLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsRegLoading(true);

        try {
            await authApi.register(regName, regUser, regPass, 'viewer');
            setSuccess('REGISTRATION SUCCESSFUL. LEVEL-1 CLEARANCE GRANTED. YOU MAY NOW AUTHORIZE ACCESS.');
            setLoginUser(regUser);
            setRegName('');
            setRegUser('');
            setRegPass('');
        } catch (err: any) {
            setError(err.message || 'REGISTRATION FAILED');
        } finally {
            setIsRegLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-navy-950 px-4 py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]"></div>
            
            <div className="text-center mb-12 relative z-10">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-blue-600/10 mb-6 border border-blue-500/20 shadow-2xl backdrop-blur-sm">
                    <Shield className="w-12 h-12 text-blue-500" />
                </div>
                <h1 className="text-4xl font-black text-white tracking-widest uppercase">ARIA Protocol Entry</h1>
                <p className="mt-3 text-navy-400 font-bold tracking-widest uppercase text-xs">Secure Personnel Authentication & Registry System</p>
            </div>

            {error && (
                <div className="max-w-4xl w-full mb-8 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center animate-pulse z-10 shadow-lg shadow-red-500/5">
                    [SYSTEM ERROR] {error}
                </div>
            )}

            {success && (
                <div className="max-w-4xl w-full mb-8 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center z-10 shadow-lg shadow-emerald-500/5">
                    [SYSTEM NOTIFICATION] {success}
                </div>
            )}

            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Login Section */}
                <div className="glass-card p-10 space-y-8 border-t-4 border-t-blue-500 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Lock className="w-32 h-32 text-white" />
                    </div>
                    
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center">
                            <Lock className="w-6 h-6 mr-3 text-blue-500" /> Authorized Login
                        </h2>
                        <p className="text-navy-400 text-xs font-bold uppercase tracking-widest mt-1">Existing Personnel Credentials</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={loginUser}
                                    onChange={(e) => setLoginUser(e.target.value)}
                                    className="w-full bg-navy-900/50 border border-navy-700/50 rounded-2xl p-4 pl-12 text-sm text-white placeholder:text-navy-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner"
                                    placeholder="Username"
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={loginPass}
                                    onChange={(e) => setLoginPass(e.target.value)}
                                    className="w-full bg-navy-900/50 border border-navy-700/50 rounded-2xl p-4 pl-12 text-sm text-white placeholder:text-navy-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner"
                                    placeholder="Clearance Key"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoginLoading}
                            className="w-full py-4 px-6 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-black rounded-2xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center uppercase tracking-widest border-t border-blue-400/30 active:scale-[0.98]"
                        >
                            {isLoginLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Authorize Access'
                            )}
                        </button>
                    </form>
                </div>

                {/* Signup Section */}
                <div className="glass-card p-10 space-y-8 border-t-4 border-t-emerald-500 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <UserPlus className="w-32 h-32 text-white" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center">
                            <UserPlus className="w-6 h-6 mr-3 text-emerald-500" /> Accounts Registry
                        </h2>
                        <p className="text-navy-400 text-xs font-bold uppercase tracking-widest mt-1">New Personnel Enrollment</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <Info className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={regName}
                                    onChange={(e) => setRegName(e.target.value)}
                                    className="w-full bg-navy-900/50 border border-navy-700/50 rounded-2xl p-4 pl-12 text-sm text-white placeholder:text-navy-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner"
                                    placeholder="Full Name"
                                />
                            </div>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={regUser}
                                    onChange={(e) => setRegUser(e.target.value)}
                                    className="w-full bg-navy-900/50 border border-navy-700/50 rounded-2xl p-4 pl-12 text-sm text-white placeholder:text-navy-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner"
                                    placeholder="New Username"
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={regPass}
                                    onChange={(e) => setRegPass(e.target.value)}
                                    className="w-full bg-navy-900/50 border border-navy-700/50 rounded-2xl p-4 pl-12 text-sm text-white placeholder:text-navy-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner"
                                    placeholder="Set Clearance Pass"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isRegLoading}
                            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-700 to-emerald-500 hover:from-emerald-600 hover:to-emerald-400 text-white font-black rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center uppercase tracking-widest border-t border-emerald-400/30 active:scale-[0.98]"
                        >
                            {isRegLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Execute Registration'
                            )}
                        </button>
                    </form>
                </div>
            </div>
            
            <div className="mt-12 flex items-center space-x-2 text-[10px] text-navy-600 uppercase font-black tracking-[0.3em] relative z-10">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span>Server Online: ARIA Intelligence v2.0 - Authenticated Node</span>
            </div>
        </div>
    );
}
