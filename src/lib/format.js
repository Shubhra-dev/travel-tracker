export function formatMoney(value) {
  const amount = Number(value || 0);

  return `Rs. ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function parseDate(dateString) {
  if (!dateString) return null;

  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function formatDate(dateString) {
  const date = parseDate(dateString);

  if (!date) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function todayISO() {
  const now = new Date();

  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000);

  return local.toISOString().slice(0, 10);
}

export function getTourDay(dateString, startDate) {
  if (!dateString || !startDate) return null;

  const dateParts = dateString.split("-").map(Number);
  const startParts = startDate.split("-").map(Number);

  const dateUTC = Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]);

  const startUTC = Date.UTC(startParts[0], startParts[1] - 1, startParts[2]);

  const difference = Math.floor((dateUTC - startUTC) / 86400000) + 1;

  return difference > 0 ? difference : null;
}

export function groupByDate(items, dateKey) {
  return items.reduce((groups, item) => {
    const date = item[dateKey];

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(item);

    return groups;
  }, {});
}
