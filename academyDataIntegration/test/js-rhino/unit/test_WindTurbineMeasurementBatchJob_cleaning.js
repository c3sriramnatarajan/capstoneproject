/**
 * Unit tests for the pure cleaning helpers on WindTurbineMeasurementBatchJob.
 * These do not touch the database or filesystem, so they live under test/js-rhino/unit.
 */
describe("WindTurbineMeasurementBatchJob cleaning helpers", function () {

    describe("normalizeDateTime", function () {

        it("converts slash-formatted dates to dash format", function () {
            expect(WindTurbineMeasurementBatchJob.normalizeDateTime("2025/01/01 00:00"))
                .toEqual("2025-01-01 00:00");
        });

        it("leaves dash-formatted dates unchanged", function () {
            expect(WindTurbineMeasurementBatchJob.normalizeDateTime("2025-06-15 13:00"))
                .toEqual("2025-06-15 13:00");
        });

        it("trims surrounding whitespace", function () {
            expect(WindTurbineMeasurementBatchJob.normalizeDateTime("  2025/03/03 09:00 "))
                .toEqual("2025-03-03 09:00");
        });
    });

    describe("isOutlier", function () {

        it("flags values 20% or more above rated power", function () {
            expect(WindTurbineMeasurementBatchJob.isOutlier(1200, 1000)).toBe(true);
        });

        it("flags values 20% or more below rated power", function () {
            expect(WindTurbineMeasurementBatchJob.isOutlier(800, 1000)).toBe(true);
        });

        it("does not flag values within 20% of rated power", function () {
            expect(WindTurbineMeasurementBatchJob.isOutlier(1100, 1000)).toBe(false);
            expect(WindTurbineMeasurementBatchJob.isOutlier(900, 1000)).toBe(false);
        });

        it("treats exactly 20% deviation as an outlier (boundary)", function () {
            expect(WindTurbineMeasurementBatchJob.isOutlier(1200, 1000)).toBe(true);
        });

        it("returns false when rated power is missing or non-positive", function () {
            expect(WindTurbineMeasurementBatchJob.isOutlier(500, 0)).toBe(false);
            expect(WindTurbineMeasurementBatchJob.isOutlier(500, null)).toBe(false);
        });
    });
});
