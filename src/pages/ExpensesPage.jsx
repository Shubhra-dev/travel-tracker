import { useMemo, useState } from "react";
import { useTripData } from "../context/TripDataContext";

import {
  formatDate,
  formatMoney,
  getTourDay,
  groupByDate,
} from "../lib/format";

export default function ExpensesPage() {
  const { expenses, trip, loading } = useTripData();

  const [dateFilter, setDateFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [placeFilter, setPlaceFilter] = useState("");

  const categories = useMemo(() => {
    return [...new Set(expenses.map((item) => item.category).filter(Boolean))];
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const dateMatch = !dateFilter || expense.expense_date === dateFilter;

      const categoryMatch =
        !categoryFilter || expense.category === categoryFilter;

      const placeMatch =
        !placeFilter ||
        (expense.place || "").toLowerCase().includes(placeFilter.toLowerCase());

      return dateMatch && categoryMatch && placeMatch;
    });
  }, [expenses, dateFilter, categoryFilter, placeFilter]);

  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        খরচ লোড হচ্ছে...
      </p>
    );
  }

  const groupedExpenses = groupByDate(filteredExpenses, "expense_date");

  const dates = Object.keys(groupedExpenses).sort((a, b) => b.localeCompare(a));

  function clearFilters() {
    setDateFilter("");
    setCategoryFilter("");
    setPlaceFilter("");
  }

  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">খরচের তালিকা</h2>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <label className="form-label">তারিখ</label>
            <input
              type="date"
              className="form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">ক্যাটাগরি</label>
            <select
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">সব</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">স্থান</label>
            <input
              className="form-control"
              value={placeFilter}
              onChange={(e) => setPlaceFilter(e.target.value)}
              placeholder="যেমন: হরিদ্বার"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              className="btn-secondary w-full"
            >
              ফিল্টার মুছুন
            </button>
          </div>
        </div>
      </section>

      {dates.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          কোনো খরচ পাওয়া যায়নি।
        </div>
      ) : (
        dates.map((date) => {
          const dayNumber = getTourDay(date, trip?.start_date);
          const dayExpenses = groupedExpenses[date];

          const dayTotal = dayExpenses.reduce(
            (sum, expense) => sum + Number(expense.amount || 0),
            0,
          );

          return (
            <section
              key={date}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
                <div>
                  <h3 className="font-bold text-slate-900">
                    {formatDate(date)}
                  </h3>

                  {dayNumber && (
                    <p className="text-xs text-emerald-700">
                      যাত্রার দিন {dayNumber}
                    </p>
                  )}
                </div>

                <p className="font-bold">{formatMoney(dayTotal)}</p>
              </div>

              <div className="divide-y divide-slate-100">
                {dayExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-start justify-between gap-5 px-4 py-4 sm:px-5"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {expense.description}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px]">
                          {expense.category}
                        </span>

                        {expense.place && (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">
                            {expense.place}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="shrink-0 font-semibold">
                      {formatMoney(expense.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
