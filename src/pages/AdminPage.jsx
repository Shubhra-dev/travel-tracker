import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

import { supabase } from "../lib/supabase";

import ExpenseManager from "../components/admin/ExpenseManager";
import DepositManager from "../components/admin/DepositManager";
import TravelerManager from "../components/admin/TravelerManager";

const tabs = [
  {
    id: "expenses",
    label: "খরচ",
  },
  {
    id: "deposits",
    label: "জমা",
  },
  {
    id: "travellers",
    label: "যাত্রী",
  },
];

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [activeTab, setActiveTab] = useState("expenses");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (mounted) {
        setSession(currentSession);
      }
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) {
        setSession(newSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function verifyAdmin() {
      if (!session?.user?.id) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }

      setChecking(true);

      const { data, error } = await supabase
        .from("app_admins")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error || !data) {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }

      setChecking(false);
    }

    verifyAdmin();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  async function handleLogin(event) {
    event.preventDefault();

    if (!email || !password) {
      setLoginError("ইমেইল এবং পাসওয়ার্ড দিন।");
      return;
    }

    setLoggingIn(true);
    setLoginError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError("ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।");
    }

    setLoggingIn(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (checking) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-slate-500">অ্যাডমিন তথ্য যাচাই হচ্ছে...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-md pt-6 sm:pt-12">
        <form
          onSubmit={handleLogin}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">অ্যাডমিন লগইন</h2>
          </div>

          <div>
            <label className="form-label">ইমেইল</label>

            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="ইমেইল লিখুন"
            />
          </div>

          <div className="mt-4">
            <label className="form-label">পাসওয়ার্ড</label>

            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="পাসওয়ার্ড লিখুন"
            />
          </div>

          {loginError && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            disabled={loggingIn}
            className="btn-primary mt-5 w-full"
          >
            {loggingIn ? "লগইন হচ্ছে..." : "লগইন করুন"}
          </button>
        </form>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-5">
        <h2 className="font-bold text-red-800">অ্যাডমিন অনুমতি নেই</h2>

        <p className="mt-2 text-sm text-red-700">
          এই অ্যাকাউন্টটি অ্যাডমিন হিসেবে যুক্ত করা হয়নি।
        </p>

        <button
          type="button"
          onClick={handleLogout}
          className="btn-secondary mt-4"
        >
          লগআউট
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            অ্যাডমিন প্যানেল
          </h2>

          <p className="mt-1 text-sm text-slate-500">{session.user.email}</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="btn-secondary inline-flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          লগআউট
        </button>
      </header>

      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full gap-2 rounded-2xl border border-slate-200 bg-white p-2 sm:min-w-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={[
                "flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:flex-none",
                activeTab === tab.id
                  ? "bg-emerald-700 text-white"
                  : "text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "expenses" && <ExpenseManager />}
      {activeTab === "deposits" && <DepositManager />}
      {activeTab === "travellers" && <TravelerManager />}
    </div>
  );
}
