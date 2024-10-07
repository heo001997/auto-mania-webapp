import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export default function Layout({ children, currentPage }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar currentPage={currentPage} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header currentPage={currentPage} />
        <main className="flex items-start gap-4 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}