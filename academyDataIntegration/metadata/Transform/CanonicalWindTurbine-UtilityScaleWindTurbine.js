data = {
    name: 'CanonicalWindTurbine-UtilityScaleWindTurbine',
    source: 'CanonicalWindTurbine',
    target: 'UtilityScaleWindTurbine',
    condition: turbineType == 'utility',
    projection: {
        // Map the canonical's asset onto the entity's unique id field
        id: asset,

        // The power in watts of the WindTurbine
        power: powerInWatts,

        // The latitude of the WindTurbine
        latitude: latitude,

        // The longitude of the WindTurbine
        longitude: longitude,

        // The reference to the Manufacturer's id
        manufacturer: { id: manufacturer },
    },
};
