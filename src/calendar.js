const pad = (n) => String(n).padStart(2, '0');

const stamp = (d) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
  `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

const clean = (t = '') =>
  String(t)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');

export function downloadCalendar(event, title, hours = 4) {
  const start = new Date(event.start);
  const end = new Date(start.getTime() + hours * 60 * 60 * 1000);

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bir Haberimiz Var//TR',
    'BEGIN:VEVENT',
    `UID:${start.getTime()}@birhaberimizvar.com`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${clean(title)}`,
    `LOCATION:${clean([event.place, event.city].filter(Boolean).join(', '))}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  link.download = 'davetiye.ics';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

export function mapsLink(query) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}