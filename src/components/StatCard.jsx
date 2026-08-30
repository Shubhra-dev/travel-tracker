export default function StatCard({
  label,
  value,
  description,
  accent = "default",
}) {
  const styles =
    accent === "positive"
      ? {
          wrap: "border-emerald-200 bg-emerald-50/70",
          value: "text-emerald-700",
          badge: "bg-emerald-100 text-emerald-700",
        }
      : accent === "negative"
        ? {
            wrap: "border-red-200 bg-red-50/70",
            value: "text-red-600",
            badge: "bg-red-100 text-red-700",
          }
        : {
            wrap: "border-slate-200 bg-white",
            value: "text-slate-900",
            badge: "bg-slate-100 text-slate-600",
          };

  return (
    <div className={`rounded-3xl border p-4 shadow-sm sm:p-5 ${styles.wrap}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-slate-500">
            {label}
          </p>

          <p
            className={`mt-2 text-3xl font-black leading-none ${styles.value}`}
          >
            {value}
          </p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles.badge}`}
        >
          হিসাব
        </span>
      </div>

      {description && (
        <p className="mt-3 text-xs leading-5 text-slate-500">{description}</p>
      )}
    </div>
  );
}
