data = {
    name: "CanonicalWindTurbineMeasurementSeries-WindTurbineMeasurementSeries",
    source: "CanonicalWindTurbineMeasurementSeries",
    target: "WindTurbineMeasurementSeries",
    projection: {
        // Direct mapping of the series id (e.g. "WTMS_Turbine0")
        id: id,

        // The canonical windTurbine holds "Turbine0"; WindTurbine ids are "TURBINE_0".
        windTurbine: { id: concat("TURBINE_", replace(windTurbine, "Turbine", "")) }
    }
}
