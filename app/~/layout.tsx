"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { gradient } from "@/components/Gradient";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  BarChart3,
  Menu,
  X,
  Home
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/~", icon: LayoutDashboard, exact: true },
  { name: "Resume", href: "/~/resume", icon: FileText },
  { name: "Interviews", href: "/~/interviews", icon: MessageSquare },
  { name: "Reports", href: "/~/reports", icon: BarChart3 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    gradient.initGradient("#gradient-canvas");
  }, []);

  const isActive = (item: typeof navigation[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen bg-[#F2F3F5] font-inter">
      {/* Background Elements */}

      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-gray-600/75" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="flex">
        {/* Mobile sidebar */}
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
            >
              <SidebarContent
                navigation={navigation}
                isActive={isActive}
                onClose={() => setSidebarOpen(false)}
                mobile={true}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white shadow-lg border-r border-gray-200/50 relative z-10">
            <SidebarContent
              navigation={navigation}
              isActive={isActive}
              mobile={false}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          {/* Mobile header */}
          <div className="lg:hidden sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 text-sm font-semibold leading-6 text-[#1E2B3A]">
              Liftoff Dashboard
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 relative z-10">
            <div className="px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  navigation,
  isActive,
  onClose,
  mobile
}: {
  navigation: typeof navigation;
  isActive: (item: typeof navigation[0]) => boolean;
  onClose?: () => void;
  mobile: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-200/50">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-[#1E2B3A]">Liftoff</span>
        </Link>
        {mobile && onClose && (
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={mobile ? onClose : undefined}
                className={`
                  group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium transition-all duration-200
                  ${isActive(item)
                    ? "bg-[#407BBF]/10 text-[#407BBF] shadow-sm"
                    : "text-gray-700 hover:text-[#407BBF] hover:bg-gray-50"
                  }
                `}
              >
                <item.icon
                  className={`h-5 w-5 shrink-0 transition-colors ${isActive(item) ? "text-[#407BBF]" : "text-gray-400 group-hover:text-[#407BBF]"
                    }`}
                />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Home link */}
        <div className="mt-auto pt-6 border-t border-gray-200/50">
          <Link
            href="/"
            onClick={mobile ? onClose : undefined}
            className="group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium text-gray-700 hover:text-[#407BBF] hover:bg-gray-50 transition-all duration-200"
          >
            <Home className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-[#407BBF] transition-colors" />
            Back to Home
          </Link>
        </div>
      </nav>
    </div>
  );
}