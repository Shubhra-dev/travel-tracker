import { useTripData } from "../context/TripDataContext";
import { formatMoney } from "../lib/format";

export default function TravellersPage() {
  const { summary, loading } = useTripData();

  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        যাত্রী লোড হচ্ছে...
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">যাত্রী</h2>
      </div>

      {summary.settlements.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          কোনো যাত্রী নেই।
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {summary.settlements.map((traveller) => {
            const due = traveller.balance < -0.01;
            const extra = traveller.balance > 0.01;
            const settled = !due && !extra;

            return (
              <article
                key={traveller.id}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-slate-900">
                      {traveller.name}
                    </h3>

                    {traveller.note && (
                      <p className="mt-1 text-xs text-slate-500">
                        {traveller.note}
                      </p>
                    )}
                  </div>

                  <span
                    className={[
                      "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
                      due
                        ? "bg-red-50 text-red-700"
                        : extra
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-700",
                    ].join(" ")}
                  >
                    {due ? "বাকি" : extra ? "অতিরিক্ত" : "সমান"}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-xs font-medium text-emerald-700">জমা</p>
                    <p className="mt-1 text-3xl font-black text-emerald-700">
                      {formatMoney(traveller.deposited)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-100 p-4">
                      <p className="text-xs font-medium text-slate-600">
                        খরচের অংশ
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-900">
                        {formatMoney(traveller.expenseShare)}
                      </p>
                    </div>

                    <div
                      className={[
                        "rounded-2xl p-4",
                        due
                          ? "bg-red-50"
                          : extra
                            ? "bg-emerald-50"
                            : "bg-slate-100",
                      ].join(" ")}
                    >
                      <p
                        className={[
                          "text-xs font-medium",
                          due
                            ? "text-red-700"
                            : extra
                              ? "text-emerald-700"
                              : "text-slate-600",
                        ].join(" ")}
                      >
                        ব্যালেন্স
                      </p>

                      <p
                        className={[
                          "mt-1 text-2xl font-black",
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
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
