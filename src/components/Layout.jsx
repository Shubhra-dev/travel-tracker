import { NavLink, Outlet } from "react-router-dom";

import { Home, Receipt, RefreshCw, Shield, Users, Wallet } from "lucide-react";

import { useTripData } from "../context/TripDataContext";
import { formatDate } from "../lib/format";

const navigation = [
  {
    to: "/",
    label: "Overview",
    icon: Home,
    end: true,
  },
  {
    to: "/expenses",
    label: "Expenses",
    icon: Receipt,
  },
  {
    to: "/deposits",
    label: "Deposits",
    icon: Wallet,
  },
  {
    to: "/travellers",
    label: "Travellers",
    icon: Users,
  },
  {
    to: "/admin",
    label: "Admin",
    icon: Shield,
  },
];

function DesktopNavigation() {
  return (
    <nav className="hidden items-center gap-1 md:flex">
      {navigation.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            [
              "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
              isActive
                ? "bg-emerald-700 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            ].join(" ")
          }
        >
          <Icon size={16} />

          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function MobileNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {navigation.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                "flex min-w-0 flex-col items-center justify-center rounded-xl px-1 py-1.5 text-[10px] font-medium transition",
                isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-500",
              ].join(" ")
            }
          >
            <Icon size={19} />

            <span className="mt-1 truncate">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default function Layout() {
  const { trip, refresh, loading, error } = useTripData();

  return (
    <div className="min-h-screen bg-[#f5f7f5]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-sm font-bold text-white">
                ॐ
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                  {trip?.trip_name || "Char Dham Yatra"}
                </h1>

                <p className="truncate text-[11px] text-slate-500 sm:text-xs">
                  {trip?.start_date
                    ? `Journey starts ${formatDate(trip.start_date)}`
                    : "Trip Expense Tracker"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DesktopNavigation />

            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              aria-label="Refresh data"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-5 sm:px-6 md:pb-10 lg:px-8">
        <Outlet />
      </main>

      <MobileNavigation />
    </div>
  );
}
