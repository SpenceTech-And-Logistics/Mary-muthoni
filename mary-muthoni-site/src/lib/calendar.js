/* "Add to calendar" for events: a Google Calendar link and a downloadable .ics file. */

const compact = (iso) => String(iso || "").replace(/-/g, "");

function range(e) {
  const start = compact(e.date);
  const lastDay = new Date(`${e.endDate || e.date}T00:00:00`);
  lastDay.setDate(lastDay.getDate() + 1); // all-day events end the day after
  const end = lastDay.toISOString().slice(0, 10).replace(/-/g, "");
  return { start, end };
}

const where = (e) => [e.venue, e.town].filter(Boolean).join(", ");

export function googleCalendarUrl(e) {
  const { start, end } = range(e);
  const details = [e.summary, e.time && `Time: ${e.time}`, e.url].filter(Boolean).join("\n");
  const q = new URLSearchParams({ action: "TEMPLATE", text: e.title, dates: `${start}/${end}`, details, location: where(e) });
  return `https://calendar.google.com/calendar/render?${q}`;
}

const esc = (s) => String(s || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

export function downloadIcs(e) {
  const { start, end } = range(e);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Official profile//Events//EN", "BEGIN:VEVENT",
    `UID:${e.id || start}@official-profile`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART;VALUE=DATE:${start}`, `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${esc(e.title)}`, `LOCATION:${esc(where(e))}`,
    `DESCRIPTION:${esc([e.summary, e.time && `Time: ${e.time}`, e.url].filter(Boolean).join("\n"))}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = `${(e.title || "event").slice(0, 40).replace(/[^\w]+/g, "-")}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
