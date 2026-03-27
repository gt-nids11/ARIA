"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    clearance: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedToken = localStorage.getItem('aria_token');
        const storedUser = localStorage.getItem('aria_user');
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!isLoading) {
            const publicPaths = ['/login', '/signup'];
            if (!token && !publicPaths.includes(pathname)) {
                router.push('/login');
            }
        }
    }, [token, pathname, isLoading, router]);

    const login = (newToken: string, userData: User) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('aria_token', newToken);
        localStorage.setItem('aria_user', JSON.stringify(userData));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('aria_token');
        localStorage.removeItem('aria_user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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
