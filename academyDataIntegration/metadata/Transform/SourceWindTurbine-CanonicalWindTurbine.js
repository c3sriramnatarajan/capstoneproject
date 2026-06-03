data = {
    name: "SourceWindTurbine-CanonicalWindTurbine",
    source: "SourceWindTurbine",
    target: "CanonicalWindTurbine",
    projection: {
        asset: concat("TURBINE_", turbineId),
        latitude: split(lat_long, "_")[0],
        longitude: split(lat_long, "_")[1],
        powerInWatts: powerInkW * 1000,
        manufacturer: replace(manufacturer, ":", ""),
        turbineType: trim(turbineType)

    }
}