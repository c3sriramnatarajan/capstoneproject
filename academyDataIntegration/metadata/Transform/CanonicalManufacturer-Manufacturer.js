data = {
  name: 'CanonicalManufacturer-Manufacturer',
  source: 'CanonicalManufacturer',
  target: 'Manufacturer',
  projection: {
    // Manufacturer's id
    id: id,

    countryCode: countryCode,

    // Manufacturer's full name
    fullName: fullName,
  },
};
