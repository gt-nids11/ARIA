"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { AuthProvider, useAuth } from "@/components/AuthContext";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-navy-900 text-foreground`}>
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-navy-950">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-navy-400 font-black uppercase tracking-[0.2em] text-[10px]">Initializing ARIA Core...</p>
        </div>
      </div>
    );
  }

  if (isAuthPage) {
    return <main className="h-screen w-screen">{children}</main>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-navy-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
