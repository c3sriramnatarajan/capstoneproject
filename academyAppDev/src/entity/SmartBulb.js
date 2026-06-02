function lifeSpanInYears() {
    var startTime, defectTime, lifespan;
    startTime = this.startDate
    
    defectFilter = "status == 1 && lumens == 0 && parent.id =='" + 'SBMS_serialNo_' + this.id + "'";
    defectDatum = SmartBulbMeasurement.fetch({filter: defectFilter});
    
    defectTime = defectDatum.objs[0].start;
    lifespan = defectTime.millis - startTime.millis;
    lsYears = lifespan / (1000*60*60*24*365);
    return lsYears;
}


function averageTemperatureMonth(endDate) {
    var result = SmartBulb.evalMetric({
        id: this.id,
        expression: "AverageTemperature",
        start: endDate,
        end: endDate,
        interval: "MONTH"
    });
    return result.data()[0];
}

function averageLifeSpan() {
    var lightbulbs, sum, avg, span;
    var lightbulbs = SmartBulb.fetch({ include: '[id, startDate]' }).objs;
    sum = 0;

    for (var i = 0; i < lightbulbs.length; i++) {
        span = lightbulbs[i].lifeSpanInYears();
        sum = sum + span;
    }

    avg = sum / lightbulbs.length;
    return avg;
}



function shortestLifeSpan() {
    var map = {};
    var lowest_value = Infinity;
    var current_value;
    var id;

    var lightbulbs = SmartBulb.fetch({ include: '[id, startDate]' }).objs;

    for (var i = 0; i < lightbulbs.length; i++) {
        current_value = lightbulbs[i].lifeSpanInYears();

        if (current_value < lowest_value) {
            lowest_value = current_value;
            id = lightbulbs[i].id;
        }
    }

    map[id] = lowest_value;
    return map;
}