data = {
    name: "CanonicalWindTurbineMeasurement-WindTurbineMeasurement",
    source: "CanonicalWindTurbineMeasurement",
    target: "WindTurbineMeasurement",
    projection: {
        // Link each data point to its parent series (e.g. "WTMS_Turbine0").
        parent: { id: concat("WTMS_Turbine", turbineId) },

        // The start time of the measurement interval
        start: start,

        // The end time of the measurement interval
        end: end,

        // The measured power output, in watts
        value: value
    }
}
