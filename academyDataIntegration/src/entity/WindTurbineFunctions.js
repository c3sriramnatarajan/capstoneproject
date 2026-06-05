/**
 * Loop through events (already ordered newest -> oldest) and return the first
 * critical one (severity == 3). Pure function, safe for stored calc fields.
 */
function getLatestCriticalEvent(events) {
    // 'events' is already filtered to critical (severity == 3) and ordered
    // newest-first by the calc expression, so the first one is the answer.
    if (!events || events.length === 0) return null;
    return events[0];
}

/**
 * Days between the event's start time and now. Read-calc use only (depends on now()).
 */
function daysSinceCriticalEvent(eventStart) {
    if (!eventStart) return null;
    var startMs = new Date(eventStart).getTime();
    var nowMs = Date.now();
    return (nowMs - startMs) / (1000 * 60 * 60 * 24);
}
