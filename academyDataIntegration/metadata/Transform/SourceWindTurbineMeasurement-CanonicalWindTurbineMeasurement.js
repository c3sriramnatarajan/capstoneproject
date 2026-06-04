data = {
    name: "SourceWindTurbineMeasurement-CanonicalWindTurbineMeasurement",
    source: "SourceWindTurbineMeasurement",
    target: "CanonicalWindTurbineMeasurement",
    projection: {
        measurementId: measurement_id,
        turbineId: turbine_id,
        start: dateTime(start_time),
        end: dateTime(end_time),
        value: watts
    }
}
