data = {
    name: "SourceWindTurbineEvent-CanonicalWindTurbineEvent",
    source: "SourceWindTurbineEvent",
    target: "CanonicalWindTurbineEvent",
    projection: {
        start: dateTime(start),
        end: dateTime(end),
        asset: concat("TURBINE_", asset),
        eventCode: event_code,
        id: trim(event_id),
        severity: split(event_code, "-")[1]
    }
}