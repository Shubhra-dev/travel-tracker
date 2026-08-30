export default function StatCard({
  label,
  value,
  description,
  accent = "default",
}) {
  const accentClass =
    accent === "positive"
      ? "text-emerald-700"
      : accent === "negative"
        ? "text-red-600"
        : "text-slate-900";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>

      <p className={`mt-2 text-2xl font-bold sm:text-3xl ${accentClass}`}>
        {value}
      </p>

      {description && (
        <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">
          {description}
        </p>
      )}
    </div>
  );
}
