data = {
  name: 'CanonicalWindTurbine-WindTurbine',
  source: 'CanonicalWindTurbine',
  target: 'WindTurbine',
  projection: {
    // The id of the WindTurbine
    asset: asset,

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
