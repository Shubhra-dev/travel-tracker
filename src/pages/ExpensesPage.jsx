import { useTripData } from "../context/TripDataContext";

import {
  formatDate,
  formatMoney,
  getTourDay,
  groupByDate,
} from "../lib/format";

export default function ExpensesPage() {
  const { expenses, trip, loading } = useTripData();

  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        Loading expenses...
      </p>
    );
  }

  const groupedExpenses = groupByDate(expenses, "expense_date");

  const dates = Object.keys(groupedExpenses).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-semibold text-emerald-700">Daily Spending</p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Expense History
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Complete date-wise common fund expenses.
        </p>
      </header>

      {dates.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          No expenses recorded yet.
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
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
                <div>
                  <h3 className="font-bold text-slate-900">
                    {formatDate(date)}
                  </h3>

                  {dayNumber && (
                    <p className="mt-0.5 text-xs font-medium text-emerald-700">
                      Tour Day {dayNumber}
                    </p>
                  )}
                </div>

                <p className="font-bold text-slate-900">
                  {formatMoney(dayTotal)}
                </p>
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

                      <span className="mt-1.5 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                        {expense.category}
                      </span>
                    </div>

                    <p className="shrink-0 font-semibold text-slate-900">
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
