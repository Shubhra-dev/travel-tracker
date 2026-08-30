import { useTripData } from "../context/TripDataContext";

import { formatDate, formatMoney, groupByDate } from "../lib/format";

export default function DepositsPage() {
  const { deposits, travellers, loading } = useTripData();

  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        জমার হিসাব লোড হচ্ছে...
      </p>
    );
  }

  const travellerNames = new Map(
    travellers.map((traveller) => [traveller.id, traveller.name]),
  );

  const groupedDeposits = groupByDate(deposits, "deposit_date");

  const dates = Object.keys(groupedDeposits).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900">জমার তালিকা</h2>

      {dates.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          কোনো জমা নেই।
        </div>
      ) : (
        dates.map((date) => {
          const dayDeposits = groupedDeposits[date];

          const dayTotal = dayDeposits.reduce(
            (sum, deposit) => sum + Number(deposit.amount || 0),
            0,
          );

          return (
            <section
              key={date}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex justify-between bg-slate-50 px-4 py-3">
                <h3 className="font-bold">{formatDate(date)}</h3>

                <p className="font-bold text-emerald-700">
                  {formatMoney(dayTotal)}
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {dayDeposits.map((deposit) => (
                  <div
                    key={deposit.id}
                    className="flex justify-between gap-4 px-4 py-4"
                  >
                    <div>
                      <p className="font-semibold">
                        {travellerNames.get(deposit.traveller_id)}
                      </p>

                      {deposit.note && (
                        <p className="text-xs text-slate-500">{deposit.note}</p>
                      )}
                    </div>

                    <p className="font-bold text-emerald-700">
                      +{formatMoney(deposit.amount)}
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
