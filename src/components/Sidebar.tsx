import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Hammer, Database, ScrollText, Settings } from "lucide-react";

interface SidebarProps {
  currentPage: string;
}

export default function Sidebar({ currentPage }: SidebarProps) {
  const navItems = [
    { href: "#/devices", icon: Smartphone, label: "Devices" },
    { href: "#/runners", icon: ScrollText, label: "Runners" },
    { href: "#/workflows", icon: Hammer, label: "Workflows" },
    { href: "#/datasets", icon: Database, label: "Datasets" },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
              item.href === `#/${currentPage.toLowerCase()}` 
                ? "bg-accent text-accent-foreground" 
                : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="sr-only">{item.label}</span>
          </a>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <a
          href="#/settings"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </a>
      </nav>
    </aside>
  );
}