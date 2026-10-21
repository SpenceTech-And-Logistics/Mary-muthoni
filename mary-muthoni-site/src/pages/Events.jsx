import { useState } from "react";
import Seo from "../components/Seo";
import { CtaBand, Empty, PageHead } from "../components/Blocks";
import { useContent } from "../lib/contentContext";
import { dayMonth, formatDate, isUpcoming } from "../lib/format";
import { downloadIcs, googleCalendarUrl } from "../lib/calendar";

function EventRow({ e, past }) {
  const d = dayMonth(e.date);
  const when = e.endDate && e.endDate !== e.date ? `${formatDate(e.date)} to ${formatDate(e.endDate)}` : formatDate(e.date);
  return (
    <article className={`event-row ${past ? "is-past" : ""}`} id={e.id}>
      <div className="date-chip big"><div className="dd">{d.day}</div><div className="mon">{d.month}</div><div className="yr">{d.year}</div></div>
      <div className="event-row-main">
        <div className="kicker">{[e.type, e.role].filter(Boolean).join(" · ").toUpperCase()}</div>
        <h3>{e.title}</h3>
        <div className="muted small">{[when, e.time, [e.venue, e.town].filter(Boolean).join(", ")].filter(Boolean).join(" · ")}</div>
        {e.summary && <p className="small mt-xs">{e.summary}</p>}
      </div>
      <div className="event-row-actions">
        {!past && (
          <>
            <a className="pill pill-teal" href={googleCalendarUrl(e)} target="_blank" rel="noopener noreferrer">Add to Google Calendar</a>
            <button type="button" className="pill pill-outline" onClick={() => downloadIcs(e)}>Download .ics</button>
          </>
        )}
        {e.url && <a className="underline-link" href={e.url} target="_blank" rel="noopener noreferrer">Event page &#8599;</a>}
      </div>
    </article>
  );
}

function Events() {
  const { events, displayName } = useContent();
  const upcoming = events.filter(isUpcoming);
  const past = events.filter((e) => !isUpcoming(e)).reverse();
  const [tab, setTab] = useState(upcoming.length ? "upcoming" : "past");
  const list = tab === "upcoming" ? upcoming : past;

  return (
    <>
      <Seo title="Events" path="/events" description={`Conferences, launches, site visits and speaking engagements of ${displayName}.`} />
      <PageHead eyebrow="EVENTS" title="Engagements and events.">
        <p className="page-intro">Conferences, launches, site visits and speaking engagements. Add upcoming events to your calendar.</p>
      </PageHead>
      <section>
        <div className="container">
          <div className="tabs" role="tablist" aria-label="Events">
            <button type="button" role="tab" aria-selected={tab === "upcoming"} className={tab === "upcoming" ? "is-active" : ""} onClick={() => setTab("upcoming")}>Upcoming <span className="count">{upcoming.length}</span></button>
            <button type="button" role="tab" aria-selected={tab === "past"} className={tab === "past" ? "is-active" : ""} onClick={() => setTab("past")}>Past <span className="count">{past.length}</span></button>
          </div>
          <div className="event-list" role="tabpanel">
            {list.length === 0 && <Empty>{tab === "upcoming" ? "New engagements will be listed here as they are confirmed." : "No past events yet."}</Empty>}
            {list.map((e) => <EventRow key={e.id} e={e} past={tab === "past"} />)}
          </div>
        </div>
      </section>
      <CtaBand title="Invite the Principal Secretary to speak or attend." label="Send an invitation" />
    </>
  );
}

export default Events;
