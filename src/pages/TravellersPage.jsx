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
      <h2 className="text-2xl font-bold text-slate-900">যাত্রী</h2>

      <div className="grid gap-3 md:grid-cols-2">
        {summary.settlements.map((traveller) => {
          const due = traveller.balance < -0.01;
          const extra = traveller.balance > 0.01;

          return (
            <article
              key={traveller.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex justify-between">
                <h3 className="font-bold">{traveller.name}</h3>

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
                  {due ? "বাকি" : extra ? "অতিরিক্ত" : "সমান"}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 border-t pt-4">
                <div>
                  <p className="text-[11px] text-slate-500">জমা</p>
                  <p className="font-bold">
                    {formatMoney(traveller.deposited)}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-slate-500">খরচ</p>
                  <p className="font-bold">
                    {formatMoney(traveller.expenseShare)}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-slate-500">ব্যালেন্স</p>

                  <p
                    className={`font-bold ${
                      due ? "text-red-600" : extra ? "text-emerald-700" : ""
                    }`}
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
    </div>
  );
}
