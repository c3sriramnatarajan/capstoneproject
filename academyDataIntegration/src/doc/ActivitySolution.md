### FileSourceCollections:
**WindTurbineSourceCollection.json**

```json
{
    "name": "WindTurbineSourceCollection",
    "source": "SourceWindTurbine",
    "sourceSystem": {
        "name": "Canonical"
    }
}
```

**WindTurbineEventSourceCollection.json**

```json
{
    "name": "WindTurbineEventSourceCollection",
    "source": "SourceWindTurbineEvent",
    "sourceSystem": {
        "name": "Canonical"
    }
}
```

**ManufacturerSourceCollection.json**

```json
{
    "name": "ManufacturerSourceCollection",
    "source": "SourceManufacturer",
    "sourceSystem": {
        "name": "Canonical"
    }
}
```

### Sources:
**SourceWindTurbine.c3typ**

```javascript
type SourceWindTurbine mixes Source { 
    @ser(name="turbine id")
    turbineId: string

    lat_long: string

    manufacturer: string

    @ser(name="power(kW)")
    powerInkW: double
}
```

**SourceWindTurbineEvent.c3typ**

```javascript
type SourceWindTurbineEvent mixes Source {
    start: string

    end: string

    asset: string

    event_code: string
}
```

**SourceManufacturer.c3typ**

```javascript
type SourceManufacturer mixes Source {
    @ser(name="manufacturer id")
    manufacturerId: string

    @ser(name="manufacturer name")
    manufacturerName: string 
}
```

### Transforms
**SourceWindTurbine-CanonicalWindTurbine.js**

```javascript
data = {
    name: "SourceWindTurbine-CanonicalWindTurbine",
    source: "SourceWindTurbine",
    target: "CanonicalWindTurbine",
    projection: {
        asset: concat("TURBINE_",turbineId),
        latitude: split(lat_long, "_")[0],
        longitude: split(lat_long, "_")[1],
        powerInWatts: powerInkW*1000,
        manufacturer: replace(manufacturer,":", "")
    }
}
```

**SourceWindTurbineEvent-CanonicalWindTurbineEvent.js**

```javascript
data = {
    name: "SourceWindTurbineEvent-CanonicalWindTurbineEvent",
    source: "SourceWindTurbineEvent",
    target: "CanonicalWindTurbineEvent",
    condition: exists(end),
    projection: {
        asset: upperCase(asset),
        start: dateTime(start),
        end: dateTime(end),
        eventCode: replace(event_code, "-", "")
    }
}
```

**SourceManufacturer-CanonicalManufacturer.js**

```javascript
data = {
    name: "SourceManufacturer-CanonicalManufacturer",
    source: "SourceManufacturer",
    target: "CanonicalManufacturer",
    projection: {
        id: upperCase(manufacturerId),
        fullName: manufacturerName
    }
}
```
