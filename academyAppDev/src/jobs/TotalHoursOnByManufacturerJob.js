/*
 * Process a set of smart bulbs and return the total hours the smart bulbs were on grouped by manufacturers
 */
function map(batch, objs, job) {

    // For a batch of smart bulbs, calculate the total hours the smart bulbs were on for a manufacturer and
    // return a map with the key the manufacturer and the value of the total hours.
    var intermediaryGroup = {};
    var manufacturers = objs.pluck('manufacturer').unique();

    // Iterate over each manufacturer, aggregating metric results for all related smart bulbs
    manufacturers.each(function (manufacturer) {

        // Only the bulbs in this batch made by this manufacturer.
        var bulbIds = objs.filter(function (bulb) {
            return bulb.manufacturer == manufacturer;
        }).pluck('id');

        // Evaluate the "hours on" metric for those bulbs over the job's time range.
        var spec = EvalMetricsSpec.make({
            ids: bulbIds,
            expressions: ["DurationOnInHours"],
            start: job.startDate,
            end: job.endDate,
            interval: job.interval
        });
        var result = SmartBulb.evalMetrics(spec);

        // DurationOnInHours is a running total, so each bulb's final (peak) value
        // is its total hours on over the range. Add those up for this manufacturer.
        var manufacturerTotal = 0;
        bulbIds.each(function (id) {
            manufacturerTotal += result.timeseries("DurationOnInHours", id).data().max();
        });

        intermediaryGroup[manufacturer] = manufacturerTotal;
    });
    return intermediaryGroup;
  }
  
  /*
   * Persists the total hours on of a smart bulb for a manufacturer for a given time range
   */
  function reduce(outKey, interValues, job) {
  
    var mfg = outKey;
    var total = interValues.sum();

    // store the results
    TotalHoursOnByManufacturer.make({
        manufacturer: mfg,
        start: job.startDate,
        end: job.endDate,
        totalHours: total
    }).merge();

    return total;
  }