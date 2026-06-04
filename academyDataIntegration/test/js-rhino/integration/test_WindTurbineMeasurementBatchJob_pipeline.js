/**
 * Integration test for the WindTurbineMeasurementBatchJob cleaning pipeline.
 *
 * This test exercises processBatch directly (bypassing the async batch queue) so the
 * assertions are deterministic. It seeds one raw file in the data-load mount containing:
 *   - a valid row (turbine 0)
 *   - a row whose datetime uses the slash format (turbine 1)
 *   - a row referencing a non-existent turbine (should be dropped)
 * It then verifies the cleaned output written to the measurement inbox.
 *
 * Lives under test/js-rhino/integration because it reads/writes the filesystem.
 *
 * PRECONDITION: WindTurbine entities TURBINE_0 and TURBINE_1 must exist in the app.
 */
describe("WindTurbineMeasurementBatchJob pipeline", function () {

    var mountUrl, measInbox, rawName, rawUrl;

    beforeAll(function () {
        mountUrl = FileSystem.mounts().get("data-load");
        measInbox = FileSourceCollection.forName("WindTurbineMeasurementSourceCollection").inboxUrl();
        rawName = "test_WindTurbineMeasurement_seed.csv";
        rawUrl = mountUrl + rawName;

        var rawCsv = [
            "measurement_id,turbine_id,start_time,end_time,watts",
            "1,0,2025-01-01 00:00,2025-01-01 01:00,1000",
            "2,1,2025/01/01 00:00,2025/01/01 01:00,2000",   // slash format -> must be normalized
            "3,9999,2025-01-01 00:00,2025-01-01 01:00,500"  // invalid turbine -> must be dropped
        ].join("\n");

        File.make({ url: rawUrl }).writeString(rawCsv);
    });

    it("drops invalid-turbine rows, normalizes dates, and writes a cleaned file to the inbox", function () {
        var batch = WindTurbineMeasurementBatchJobBatch.make({ fileUrls: [rawUrl] });
        var options = WindTurbineMeasurementBatchJobOptions.make({ filterOutliers: true });

        WindTurbineMeasurementBatchJob.processBatch(batch, null, options);

        // The cleaned file should have been written to the measurement inbox.
        var outUrl = measInbox + "WindTurbineMeasurement_clean_" + rawName;
        var out = File.make({ url: outUrl }).readString();
        var rows = out.split("\n");

        // Header + 2 valid rows (the invalid-turbine row is dropped).
        expect(rows.length).toEqual(3);

        // The slash-formatted timestamp must have been normalized to dashes.
        expect(out.indexOf("2025/01/01")).toEqual(-1);
        expect(out.indexOf("2,1,2025-01-01 00:00,2025-01-01 01:00,2000")).toBeGreaterThan(-1);

        // The non-existent turbine 9999 must not appear.
        expect(out.indexOf(",9999,")).toEqual(-1);
    });

    it("ingests the cleaned data into WindTurbineMeasurement via sync + process", function () {
        // allComplete syncs both inboxes and processes the SourceFiles through the
        // Part C pipeline. After this, the cleaned points must be queryable.
        WindTurbineMeasurementBatchJob.allComplete(null, null);

        var ingested = WindTurbineMeasurement.fetch({
            filter: "parent.id == 'WTMS_Turbine0'",
            limit: 1
        });
        expect(ingested.count).toBeGreaterThan(0);

        // The series header for the seeded turbine must also exist.
        var series = WindTurbineMeasurementSeries.fetch({
            filter: "id == 'WTMS_Turbine0'",
            limit: 1
        });
        expect(series.count).toBeGreaterThan(0);
    });

    afterAll(function () {
        // Best-effort cleanup of files this test created.
        try { File.make({ url: mountUrl + "archive/" + rawName }).delete(); } catch (e) {}
        try { File.make({ url: measInbox + "WindTurbineMeasurement_clean_" + rawName }).delete(); } catch (e) {}
    });
});
