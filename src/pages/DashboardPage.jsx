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
          description="সব মিলিয়ে মোট জমা"
        />

        <StatCard
          label="মোট খরচ"
          value={formatMoney(summary.totalExpenses)}
          description="সব মিলিয়ে মোট খরচ"
        />

        <StatCard
          label="বর্তমান তহবিল"
          value={formatMoney(summary.cashInHand)}
          accent={summary.cashInHand >= 0 ? "positive" : "negative"}
          description="জমা - খরচ"
        />

        <StatCard
          label="জনপ্রতি খরচ"
          value={formatMoney(summary.perPersonExpense)}
          description="সমান ভাগে হিসাব"
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900">যাত্রীদের হিসাব</h3>
        </div>

        {summary.settlements.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500">
            কোনো যাত্রী যোগ করা হয়নি।
          </div>
        ) : (
          <div className="space-y-4">
            {summary.settlements.map((traveller) => {
              const isDue = traveller.balance < -0.01;
              const isExtra = traveller.balance > 0.01;
              const isSettled = !isDue && !isExtra;

              return (
                <article
                  key={traveller.id}
                  className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-xl font-bold text-slate-900">
                        {traveller.name}
                      </h4>

                      {traveller.note && (
                        <p className="mt-1 text-xs text-slate-500">
                          {traveller.note}
                        </p>
                      )}
                    </div>

                    <span
                      className={[
                        "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
                        isDue
                          ? "bg-red-50 text-red-700"
                          : isExtra
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-700",
                      ].join(" ")}
                    >
                      {isDue ? "বাকি" : isExtra ? "অতিরিক্ত জমা" : "সমান"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-emerald-50 p-3">
                      <p className="text-xs font-medium text-emerald-700">
                        জমা
                      </p>
                      <p className="mt-1 text-2xl font-black text-emerald-700">
                        {formatMoney(traveller.deposited)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-100 p-3">
                      <p className="text-xs font-medium text-slate-600">
                        খরচের অংশ
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-900">
                        {formatMoney(traveller.expenseShare)}
                      </p>
                    </div>

                    <div
                      className={[
                        "rounded-2xl p-3",
                        isDue
                          ? "bg-red-50"
                          : isExtra
                            ? "bg-emerald-50"
                            : "bg-slate-100",
                      ].join(" ")}
                    >
                      <p
                        className={[
                          "text-xs font-medium",
                          isDue
                            ? "text-red-700"
                            : isExtra
                              ? "text-emerald-700"
                              : "text-slate-600",
                        ].join(" ")}
                      >
                        ব্যালেন্স
                      </p>

                      <p
                        className={[
                          "mt-1 text-2xl font-black",
                          isDue
                            ? "text-red-600"
                            : isExtra
                              ? "text-emerald-700"
                              : "text-slate-900",
                        ].join(" ")}
                      >
                        {traveller.balance > 0 ? "+" : ""}
                        {formatMoney(traveller.balance)}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900">সাম্প্রতিক খরচ</h3>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500">
            কোনো খরচ নেই।
          </div>
        ) : (
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {expense.description}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(expense.expense_date)}
                      {expense.place && ` · ${expense.place}`}
                    </p>
                  </div>

                  <p className="shrink-0 text-lg font-black text-slate-900">
                    {formatMoney(expense.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
