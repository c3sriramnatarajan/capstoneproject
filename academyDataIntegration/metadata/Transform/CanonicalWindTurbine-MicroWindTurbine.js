data = {
    name: 'CanonicalWindTurbine-MicroWindTurbine',
    source: 'CanonicalWindTurbine',
    target: 'MicroWindTurbine',
    condition: turbineType == 'micro',
    projection: {
        //We are trying to map everything in the context of microwindturbine from the windturbines
        //we are saying that id should be what asset is
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