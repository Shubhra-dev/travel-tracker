import StatCard from "../components/StatCard";

import { useTripData } from "../context/TripDataContext";

import { formatDate, formatMoney } from "../lib/format";

export default function DashboardPage() {
  const { expenses, loading, summary } = useTripData();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading trip accounts...</p>
      </div>
    );
  }

  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold text-emerald-700">Trip Accounts</p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Common Fund Overview
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          All deposits go into one common fund. Total expenses are automatically
          divided equally between all travellers.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total Collected"
          value={formatMoney(summary.totalDeposits)}
          description="Total money deposited"
          accent="positive"
        />

        <StatCard
          label="Total Spent"
          value={formatMoney(summary.totalExpenses)}
          description="All trip expenses"
        />

        <StatCard
          label="Cash in Hand"
          value={formatMoney(summary.cashInHand)}
          description="Collected minus expenses"
          accent={summary.cashInHand >= 0 ? "positive" : "negative"}
        />

        <StatCard
          label="Expense / Person"
          value={formatMoney(summary.perPersonExpense)}
          description={`${summary.travellerCount} traveller${
            summary.travellerCount === 1 ? "" : "s"
          }`}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          <h3 className="font-bold text-slate-900">Traveller Settlement</h3>

          <p className="mt-1 text-xs text-slate-500">
            Positive means extra deposited. Negative means amount still due.
          </p>
        </div>

        {summary.settlements.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No travellers added yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {summary.settlements.map((traveller) => {
              const isDue = traveller.balance < -0.01;

              const isExtra = traveller.balance > 0.01;

              return (
                <div
                  key={traveller.id}
                  className="grid gap-3 px-4 py-4 sm:grid-cols-[1.3fr_1fr_1fr_1fr] sm:items-center sm:px-5"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {traveller.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Deposited {formatMoney(traveller.deposited)}
                    </p>
                  </div>

                  <div className="flex justify-between sm:block">
                    <span className="text-xs text-slate-500 sm:block">
                      Expense Share
                    </span>

                    <span className="text-sm font-medium text-slate-800">
                      {formatMoney(traveller.expenseShare)}
                    </span>
                  </div>

                  <div className="flex justify-between sm:block">
                    <span className="text-xs text-slate-500 sm:block">
                      Balance
                    </span>

                    <span
                      className={[
                        "text-sm font-bold",
                        isDue
                          ? "text-red-600"
                          : isExtra
                            ? "text-emerald-700"
                            : "text-slate-700",
                      ].join(" ")}
                    >
                      {traveller.balance > 0 ? "+" : ""}
                      {formatMoney(traveller.balance)}
                    </span>
                  </div>

                  <div className="sm:text-right">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                        isDue
                          ? "bg-red-50 text-red-700"
                          : isExtra
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600",
                      ].join(" ")}
                    >
                      {isDue ? "Due" : isExtra ? "Extra Paid" : "Settled"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          <h3 className="font-bold text-slate-900">Recent Expenses</h3>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No expense recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-start justify-between gap-4 px-4 py-4 sm:px-5"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-900">
                    {expense.description}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(expense.expense_date)} · {expense.category}
                  </p>
                </div>

                <p className="shrink-0 font-bold text-slate-900">
                  {formatMoney(expense.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
