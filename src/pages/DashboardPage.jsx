import StatCard from "../components/StatCard";
import { useTripData } from "../context/TripDataContext";
import { formatDate, formatMoney } from "../lib/format";

export default function DashboardPage() {
  const { expenses, loading, summary } = useTripData();

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-slate-500">
        হিসাব লোড হচ্ছে...
      </div>
    );
  }

  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-slate-900">যাত্রার হিসাব</h2>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="মোট জমা"
          value={formatMoney(summary.totalDeposits)}
          accent="positive"
        />

        <StatCard label="মোট খরচ" value={formatMoney(summary.totalExpenses)} />

        <StatCard
          label="বর্তমান তহবিল"
          value={formatMoney(summary.cashInHand)}
          accent={summary.cashInHand >= 0 ? "positive" : "negative"}
        />

        <StatCard
          label="জনপ্রতি খরচ"
          value={formatMoney(summary.perPersonExpense)}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          <h3 className="font-bold text-slate-900">যাত্রীদের হিসাব</h3>
        </div>

        {summary.settlements.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            কোনো যাত্রী যোগ করা হয়নি।
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
                      জমা {formatMoney(traveller.deposited)}
                    </p>
                  </div>

                  <div className="flex justify-between sm:block">
                    <span className="text-xs text-slate-500 sm:block">
                      খরচের অংশ
                    </span>
                    <span className="text-sm font-medium">
                      {formatMoney(traveller.expenseShare)}
                    </span>
                  </div>

                  <div className="flex justify-between sm:block">
                    <span className="text-xs text-slate-500 sm:block">
                      ব্যালেন্স
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
                      {isDue ? "বাকি" : isExtra ? "অতিরিক্ত জমা" : "সমান"}
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
          <h3 className="font-bold text-slate-900">সাম্প্রতিক খরচ</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {recentExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex justify-between gap-4 px-4 py-4 sm:px-5"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {expense.description}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {formatDate(expense.expense_date)}
                  {expense.place && ` · ${expense.place}`}
                </p>
              </div>

              <p className="font-bold">{formatMoney(expense.amount)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
