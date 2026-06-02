data = {
    name: "SourceWindTurbineEvent-CanonicalWindTurbineEvent",
    source: "SourceWindTurbineEvent",
    target: "CanonicalWindTurbineEvent",
    projection: {
        start: dateTime(start),
        end: dateTime(end),
        asset: upperCase(turbineId),
        eventCode: replace(",", "")
    }
}