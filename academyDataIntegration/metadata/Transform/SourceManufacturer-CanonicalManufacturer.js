data = {
    name: "SourceManufacturer-CanonicalManufacturer.js",
    source: "SourceManufacturer",
    target: "CanonicalManufacturer",
    projection: {
        id: upperCase(manufacturerId),
        fullName: manufacturerName,
        countryCode: trim(countryCode)
    }
}