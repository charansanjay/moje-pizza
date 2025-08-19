export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'CZK',
  }).format(value);
}

export function formatDate(dateStr: string) {
  // date format should be 26/2/2022 12:00 PM

  return new Date(dateStr)
    .toLocaleString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      /* hour: '2-digit',
      minute: '2-digit', */
      /* weekday: 'short',
      hour12: true, */
    })
    .replace(',', ' -');

  /*   return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr)); */
}

export function calcMinutesLeft(dateStr: string) {
  const d1 = new Date().getTime();
  const d2 = new Date(dateStr).getTime();
  return Math.round((d2 - d1) / 60000);
}
