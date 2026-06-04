/**
 * WindTurbineMeasurementBatchJob.js
 *
 * Implementation of the three batch-job stages plus two pure helper functions.
 */

var MEASUREMENT_FSC = "WindTurbineMeasurementSourceCollection";
var SERIES_FSC = "WindTurbineMeasurementSeriesSourceCollection";

/**
 * Stage 1 - list the raw files in the data-load mount and schedule batches of 2.
 *
 * @param {WindTurbineMeasurementBatchJob} job
 * @param {WindTurbineMeasurementBatchJobOptions} options
 */
function doStart(job, options) {
    var log = Logger.for("WindTurbineMeasurementBatchJob.doStart");
    var mountUrl = FileSystem.mounts().get("data-load");

    // List every file in the mount, skipping anything already archived.
    var listing = FileSystem.listFiles(mountUrl, -1);
    var files = listing.files;
    var urls = [];
    for (var i = 0; i < files.length; i++) {
        var u = files[i].url;
        if (u.toLowerCase().endsWith(".csv") && u.indexOf("/archive/") < 0) {
            urls.push(u);
        }
    }
    log.info("doStart found {} raw file(s) to process", urls.length);

    // Divide the files into batches of 2 file URLs each, and schedule each batch.
    var batchSize = 2;
    for (var j = 0; j < urls.length; j += batchSize) {
        var batch = WindTurbineMeasurementBatchJobBatch.make({
            fileUrls: urls.slice(j, j + batchSize)
        });
        job.scheduleBatch(batch);
    }
}

/**
 * Stage 2 - clean each file in the batch, log outliers, generate the series
 * records, upload both outputs to their inboxes, and archive the original.
 *
 * @param {WindTurbineMeasurementBatchJobBatch} batch
 * @param {WindTurbineMeasurementBatchJob} job
 * @param {WindTurbineMeasurementBatchJobOptions} options
 */
function processBatch(batch, job, options) {
    var log = Logger.for("WindTurbineMeasurementBatchJob.processBatch");
    var detectOutliers = !options || options.filterOutliers !== false;

    // Build turbine lookups once: valid ids (for FK checks) and rated power (for outliers).
    var turbines = WindTurbine.fetch({ include: "id, power", limit: -1 }).objs;
    var validIds = {};
    var powerById = {};
    for (var t = 0; t < turbines.length; t++) {
        validIds[turbines[t].id] = true;
        powerById[turbines[t].id] = turbines[t].power;
    }

    var measInbox = FileSourceCollection.forName(MEASUREMENT_FSC).inboxUrl();
    var seriesInbox = FileSourceCollection.forName(SERIES_FSC).inboxUrl();

    // The "archive" folder in the data-load mount. C3 has no explicit mkdir; the
    // folder is created the first time a file is moved into this path below.
    var archiveUrl = FileSystem.mounts().get("data-load") + "archive/";

    var urls = batch.fileUrls;
    for (var f = 0; f < urls.length; f++) {
        var url = urls[f];
        var name = url.substring(url.lastIndexOf("/") + 1);

        var raw = File.make({ url: url }).readString();
        var lines = raw.split("\n");

        var cleanedRows = ["measurement_id,turbine_id,start_time,end_time,watts"];
        var seenTurbines = {};
        var kept = 0, droppedFk = 0, outliers = 0;

        for (var i = 1; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line) continue;
            var cols = line.split(",");
            if (cols.length < 5) continue;

            var measurementId = cols[0].trim();
            var turbineNum = cols[1].trim();
            var watts = parseFloat(cols[4]);
            var turbineId = "TURBINE_" + turbineNum;

            // (1) Foreign-key validity: drop rows for turbines that do not exist.
            if (!validIds[turbineId]) {
                droppedFk++;
                continue;
            }

            // (3) Normalize datetime formatting.
            var start = WindTurbineMeasurementBatchJob.normalizeDateTime(cols[2]);
            var end = WindTurbineMeasurementBatchJob.normalizeDateTime(cols[3]);

            // (2) Detect + log outliers to OpenSearch. Never remove the data point.
            if (detectOutliers && WindTurbineMeasurementBatchJob.isOutlier(watts, powerById[turbineId])) {
                outliers++;
                log.warn("OUTLIER turbine={} time={} value={} ratedPower={} file={}",
                    turbineId, start, watts, powerById[turbineId], name);
            }

            cleanedRows.push(measurementId + "," + turbineNum + "," + start + "," + end + "," + watts);
            seenTurbines[turbineNum] = true;
            kept++;
        }

        // Generate WindTurbineMeasurementSeries records (id, windTurbine) for the turbines seen.
        var seriesRows = ["id,windTurbine"];
        var nums = Object.keys(seenTurbines);
        for (var s = 0; s < nums.length; s++) {
            seriesRows.push("WTMS_Turbine" + nums[s] + ",Turbine" + nums[s]);
        }

        // Upload both outputs to their FileSourceCollection inboxes.
        File.make({ url: measInbox + "WindTurbineMeasurement_clean_" + name }).writeString(cleanedRows.join("\n"));
        File.make({ url: seriesInbox + "WindTurbineMeasurementSeries_" + name }).writeString(seriesRows.join("\n"));

        log.info("Processed {}: kept={}, droppedInvalidTurbine={}, outliersLogged={}",
            name, kept, droppedFk, outliers);

        // Archive the original raw file once processing succeeds.
        File.make({ url: url }).move(archiveUrl + name);
    }
}

/**
 * Stage 3 - sync and process the uploaded SourceFiles after all batches finish.
 *
 * @param {WindTurbineMeasurementBatchJob} job
 * @param {WindTurbineMeasurementBatchJobOptions} options
 */
function allComplete(job, options) {
    var log = Logger.for("WindTurbineMeasurementBatchJob.allComplete");
    SourceFile.syncAll(FileSourceCollection.forName(MEASUREMENT_FSC).inboxUrl());
    SourceFile.syncAll(FileSourceCollection.forName(SERIES_FSC).inboxUrl());
    SourceFile.processAll();
    log.info("allComplete: synced and processed source files for both collections");
    return "WindTurbineMeasurementBatchJob complete";
}

/**
 * Pure helper: unify slash-formatted dates to dash format.
 */
function normalizeDateTime(raw) {
    if (!raw) return raw;
    return raw.trim().replace(/\//g, "-");
}

/**
 * Pure helper: true when value deviates 20% or more from rated power.
 */
function isOutlier(value, power) {
    if (!power || power <= 0) return false;
    return Math.abs(value - power) / power >= 0.20;
}
