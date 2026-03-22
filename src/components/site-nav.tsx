"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/analyze", label: "Risk Report", icon: "◎" },
  { href: "/regions", label: "Regions", icon: "◫" },
  { href: "/about", label: "About", icon: "◈" }
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="site-nav">
      <Link className="nav-logo" href="/">
        <div>
          <div className="nav-logo-text">MEKONG WATCH</div>
          <span className="nav-logo-sub">FLOOD RISK INTELLIGENCE</span>
        </div>
      </Link>

      <div className="nav-tabs">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-tab${isActive ? " active" : ""}`}
            >
              <span className="nav-tab-icon">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="nav-right">
        <div className="nav-avatar">MW</div>
      </div>
    </nav>
  );
}
