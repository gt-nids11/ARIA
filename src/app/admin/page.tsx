"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { admin as adminApi } from '@/lib/api';
import { Users, Shield, ShieldCheck, UserCog, Loader2, Save, RefreshCw, UserPlus, Info, Lock } from 'lucide-react';

interface UserData {
    id: number;
    name: string;
    username: string;
    role: string;
    clearance_level: number;
}

export default function AdminPage() {
    const { user, token } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<number | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await adminApi.listUsers();
            if (data) setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin' && token) {
            fetchUsers();
        }
    }, [user, token]);

    const [newName, setNewName] = useState('');
    const [newUser, setNewUser] = useState('');
    const [newPass, setNewPass] = useState('');
    const [newRole, setNewRole] = useState('viewer');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            await adminApi.createUser({
                name: newName,
                username: newUser,
                password: newPass,
                role: newRole
            });
            setNewName('');
            setNewUser('');
            setNewPass('');
            await fetchUsers();
        } catch (err) {
            console.error(err);
            alert("Failed to create user: " + (err instanceof Error ? err.message : String(err)));
        } finally {
            setIsCreating(false);
        }
    };

    const updateRole = async (userId: number, role: string, level: number) => {
        setUpdating(userId);
        try {
            await adminApi.updateRole(userId, role, level);
            await fetchUsers();
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(null);
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <Shield className="w-16 h-16 text-red-500 animate-pulse" />
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Level 4 Clearance Required</h2>
                <p className="text-navy-400 font-bold tracking-widest uppercase text-xs">Unauthorized access attempt logged</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase mb-1">Personnel Management</h1>
                    <p className="text-navy-400 text-sm font-medium tracking-wide">Modify user clearance and authentication roles</p>
                </div>
                <button 
                    onClick={fetchUsers}
                    className="p-3 bg-navy-800 hover:bg-navy-700 border border-navy-700 rounded-xl text-blue-400 transition-all hover:scale-105"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Creation Form */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-8 border-t-4 border-t-emerald-500 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <UserPlus className="w-24 h-24 text-white" />
                        </div>
                        
                        <div className="mb-6">
                            <h2 className="text-xl font-black text-white tracking-tight uppercase flex items-center">
                                <UserPlus className="w-5 h-5 mr-3 text-emerald-500" /> Enroll Personnel
                            </h2>
                            <p className="text-navy-400 text-[10px] font-bold uppercase tracking-widest mt-1">Add to ARIA Security Registry</p>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div className="space-y-3">
                                <div className="relative">
                                    <Info className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
                                    <input
                                        type="text"
                                        required
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="w-full bg-navy-900/50 border border-navy-700/50 rounded-xl p-3 pl-10 text-xs text-white placeholder:text-navy-600 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
                                    <input
                                        type="text"
                                        required
                                        value={newUser}
                                        onChange={(e) => setNewUser(e.target.value)}
                                        className="w-full bg-navy-900/50 border border-navy-700/50 rounded-xl p-3 pl-10 text-xs text-white placeholder:text-navy-600 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="Username"
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
                                    <input
                                        type="password"
                                        required
                                        value={newPass}
                                        onChange={(e) => setNewPass(e.target.value)}
                                        className="w-full bg-navy-900/50 border border-navy-700/50 rounded-xl p-3 pl-10 text-xs text-white placeholder:text-navy-600 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="Set Password"
                                    />
                                </div>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
                                    <select
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                        className="w-full bg-navy-900/50 border border-navy-700/50 rounded-xl p-3 pl-10 text-xs text-white uppercase font-black tracking-widest outline-none focus:border-emerald-500 appearance-none transition-all"
                                    >
                                        <option value="viewer">Viewer (L1)</option>
                                        <option value="editor">Editor (L2)</option>
                                        <option value="manager">Manager (L3)</option>
                                        <option value="admin">Admin (L4)</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isCreating}
                                className="w-full py-3 px-6 bg-gradient-to-r from-emerald-700 to-emerald-500 hover:from-emerald-600 hover:to-emerald-400 text-white font-black rounded-xl transition-all shadow-lg flex items-center justify-center uppercase tracking-widest text-[10px]"
                            >
                                {isCreating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Register Personnel'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Table Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card overflow-hidden border border-white/5 shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-navy-900/80 border-b border-navy-700">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-navy-400">Personnel</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-navy-400">Clearance Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-navy-400">Assignment</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-navy-400 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-navy-800">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center">
                                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-2" />
                                                <span className="text-xs font-bold text-navy-500 uppercase tracking-widest">Decrypting User Registry...</span>
                                            </td>
                                        </tr>
                                    ) : users.map((user_row) => (
                                        <tr key={user_row.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center mr-3 border border-white/5 font-black text-blue-400 italic">
                                                        {user_row.name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-white tracking-wide">{user_row.name}</div>
                                                        <div className="text-[10px] text-navy-400 font-medium">{user_row.username}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <ShieldCheck className={`w-4 h-4 ${user_row.clearance_level >= 3 ? 'text-amber-500' : 'text-blue-500'}`} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Level {user_row.clearance_level}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <select 
                                                        className="bg-navy-900 border border-navy-700 rounded-lg p-2 text-xs font-black text-white uppercase tracking-widest focus:border-blue-500 outline-none"
                                                        value={user_row.role}
                                                        onChange={(e) => {
                                                            const newRole = e.target.value;
                                                            const levels: any = { 'viewer': 1, 'editor': 2, 'manager': 3, 'admin': 4 };
                                                            updateRole(user_row.id, newRole, levels[newRole]);
                                                        }}
                                                        disabled={updating === user_row.id}
                                                    >
                                                        <option value="viewer">Viewer</option>
                                                        <option value="editor">Editor</option>
                                                        <option value="manager">Manager</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {updating === user_row.id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin ml-auto text-blue-500" />
                                                ) : (
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-navy-600">Encrypted</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/20 flex items-start space-x-4">
                        <Shield className="w-6 h-6 text-blue-500 mt-1" />
                        <div className="space-y-1">
                            <h4 className="text-sm font-black text-blue-400 uppercase tracking-widest">Protocol Override Information</h4>
                            <p className="text-xs text-navy-300 leading-relaxed font-medium">As a Level 4 Administrator, you have the authority to override personnel clearance. Updating a role automatically synchronizes their access level across all ARIA communication nodes.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
