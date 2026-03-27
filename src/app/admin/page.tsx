"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { Users, Shield, ShieldCheck, UserCog, Loader2, Save, RefreshCw } from 'lucide-react';

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
            const res = await fetch('/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
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

    const updateRole = async (userId: number, role: string, level: number) => {
        setUpdating(userId);
        try {
            const res = await fetch(`/api/admin/users/${userId}/role`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role, clearance_level: level }),
            });
            if (res.ok) {
                await fetchUsers();
            }
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

            <div className="grid grid-cols-1 gap-6">
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
    );
}
