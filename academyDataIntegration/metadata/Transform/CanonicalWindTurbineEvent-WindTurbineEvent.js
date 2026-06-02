data = {
  name: 'CanonicalWindTurbineEvent-WindTurbineEvent',
  source: 'CanonicalWindTurbineEvent',
  target: 'WindTurbineEvent',
  projection: {
    // The event code associated with the WindTurbineEvent
    eventCode: eventCode,

    // The id of the WindTurbine this event is associated with
    asset: { id: turbineId },

    // The start time of the WindTurbineEvent
    start: start,

    // The end time of the WindTurbineEvent
    end: end,
  },
};
