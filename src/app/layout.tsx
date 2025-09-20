'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { init } from "shiply-sdk";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Note: Metadata export needs to be moved to a separate file for client components
// For now, we'll handle this differently

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Initialize Shiply SDK at app level - same as customers will do
    console.log('🔍 RootLayout: Initializing Shiply SDK...');
    console.log('🔍 RootLayout: API Key:', process.env.NEXT_PUBLIC_SHIPLY_API_KEY || "demo-key");
    
    try {
      const instance = init({
        apiKey: process.env.NEXT_PUBLIC_SHIPLY_API_KEY || "demo-key",
        websiteId: "admin-portal",
        autoShow: false, // Don't auto-show in admin portal
        theme: {
          primaryColor: '#007bff',
          backgroundColor: '#ffffff',
          textColor: '#333333',
          borderColor: '#e1e5e9',
          borderRadius: '8px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: '14px',
        },
        position: {
          bottom: '20px',
          right: '20px',
        },
        size: {
          width: '350px',
          height: '500px',
        },
      });
      console.log('✅ RootLayout: Shiply SDK initialized successfully:', instance);
    } catch (error) {
      console.error('❌ RootLayout: Failed to initialize Shiply SDK:', error);
    }
  }, []);

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
