import { useTripData } from "../context/TripDataContext";

import { formatMoney } from "../lib/format";

export default function TravellersPage() {
  const { summary, loading } = useTripData();

  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        Loading travellers...
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-semibold text-emerald-700">Yatra Group</p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">Travellers</h2>

        <p className="mt-2 text-sm text-slate-500">
          {summary.travellerCount} traveller
          {summary.travellerCount === 1 ? "" : "s"} · Equal expense share{" "}
          {formatMoney(summary.perPersonExpense)}
        </p>
      </header>

      {summary.settlements.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          No travellers added yet.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {summary.settlements.map((traveller, index) => {
            const due = traveller.balance < -0.01;

            const extra = traveller.balance > 0.01;

            return (
              <article
                key={traveller.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 font-bold text-emerald-700">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        {traveller.name}
                      </h3>

                      {traveller.note && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {traveller.note}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={[
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      due
                        ? "bg-red-50 text-red-700"
                        : extra
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600",
                    ].join(" ")}
                  >
                    {due ? "Due" : extra ? "Extra" : "Settled"}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-[11px] text-slate-500">Deposited</p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {formatMoney(traveller.deposited)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-500">Expense</p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {formatMoney(traveller.expenseShare)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-500">Balance</p>

                    <p
                      className={[
                        "mt-1 text-sm font-bold",
                        due
                          ? "text-red-600"
                          : extra
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
    </div>
  );
}
