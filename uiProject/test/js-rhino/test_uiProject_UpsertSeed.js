/*
 * Copyright 2009-2025 C3 AI (www.c3.ai). All Rights Reserved.
 * Confidential and Proprietary C3 Materials.
 * This material, including without limitation any software, is the confidential trade secret and proprietary
 * information of C3 and its licensors. Reproduction, use and/or distribution of this material in any form is
 * strictly prohibited except as set forth in a written license agreement with C3 and/or its authorized distributors.
 * This material may be covered by one or more patents or pending patent applications.
 */

const EXPECTED_NUM_AIRCRAFTS = 500;
const EXPECTED_NUM_BASES = 10;
const EXPECTED_NUM_OPERATIONS = 5795;
const EXPECTED_NUM_OPERATION_ALERTS = 14397;
const EXPECTED_NUM_WORK_ORDERS = 14397;
const EXPECTED_NUM_MAINTENANCE_RECORDS = 43068;

describe('test_uiProject_UpsertSeed', function () {
  beforeAll(function () {
    // Ensure seed data is loaded before tests
    C3.pkg().upsertAllSeed();
  });

  it('has no critical SeedData.Issues', function () {
    var regex = new RegExp(`meta://${C3.pkg().name()}/`);
    var issues = C3.pkg()
      .upsertAllSeed()
      .filter((issue) => {
        return issue.severity === DataIssueSeverity.CRITICAL && regex.test(issue.fileUrl);
      });
    expect(issues.length).toBe(0);
  });

  it(`should create exactly ${EXPECTED_NUM_AIRCRAFTS} Aircraft records`, function () {
    const aircraftCount = Aircraft.fetchCount();
    expect(aircraftCount).toBe(EXPECTED_NUM_AIRCRAFTS);
  });

  it(`should create exactly ${EXPECTED_NUM_BASES} Base records`, function () {
    const baseCount = Base.fetchCount();
    expect(baseCount).toBe(EXPECTED_NUM_BASES);
  });

  it(`should create exactly ${EXPECTED_NUM_OPERATIONS} Operation records`, function () {
    const operationCount = Operation.fetchCount();
    expect(operationCount).toBe(EXPECTED_NUM_OPERATIONS);
  });

  it(`should create exactly ${EXPECTED_NUM_OPERATION_ALERTS} OperationAlert records`, function () {
    const operationAlertCount = OperationAlert.fetchCount();
    expect(operationAlertCount).toBe(EXPECTED_NUM_OPERATION_ALERTS);
  });

  it(`should create exactly ${EXPECTED_NUM_WORK_ORDERS} WorkOrder records`, function () {
    const workOrderCount = WorkOrder.fetchCount();
    expect(workOrderCount).toBe(EXPECTED_NUM_WORK_ORDERS);
  });

  it(`should create exactly ${EXPECTED_NUM_MAINTENANCE_RECORDS} MaintenanceRecord records`, function () {
    const maintenanceRecordCount = MaintenanceRecord.fetchCount();
    expect(maintenanceRecordCount).toBe(EXPECTED_NUM_MAINTENANCE_RECORDS);
  });

  /*
    Cleanup data loaded into Types
  */
  afterAll(function () {
    DataGenerator.clearAllData();
  });
});
