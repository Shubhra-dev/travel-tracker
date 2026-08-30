import { useTripData } from "../context/TripDataContext";

import { formatDate, formatMoney, groupByDate } from "../lib/format";

export default function DepositsPage() {
  const { deposits, travellers, loading } = useTripData();

  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        Loading deposits...
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
      <header>
        <p className="text-sm font-semibold text-emerald-700">Common Fund</p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Deposit History
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Date-wise deposits made by each traveller.
        </p>
      </header>

      {dates.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          No deposits recorded yet.
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
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
                <h3 className="font-bold text-slate-900">{formatDate(date)}</h3>

                <p className="font-bold text-emerald-700">
                  {formatMoney(dayTotal)}
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {dayDeposits.map((deposit) => (
                  <div
                    key={deposit.id}
                    className="flex items-start justify-between gap-4 px-4 py-4 sm:px-5"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {travellerNames.get(deposit.traveller_id) ||
                          "Unknown Traveller"}
                      </p>

                      {deposit.note && (
                        <p className="mt-1 text-xs text-slate-500">
                          {deposit.note}
                        </p>
                      )}
                    </div>

                    <p className="shrink-0 font-bold text-emerald-700">
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
