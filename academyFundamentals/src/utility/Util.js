/*
 * Copyright 2009-2025 C3 (www.c3.ai). All Rights Reserved.
 * This material, including without limitation any software, is the confidential trade secret and proprietary
 * information of C3 and its licensors. Reproduction, use and/or distribution of this material in any form is
 * strictly prohibited except as set forth in a written license agreement with C3 and/or its authorized distributors.
 * This material may be covered by one or more patents or pending patent applications.
 */

function checkExistingRecords() {
  // Remove any existing City records
  if (City.fetchCount() > 0) {
    City.removeAll(null, true);
  }

  // Remove any existing Store records.
  try {
    // Check the Store Type is Persistable.
    if (Store.fetchCount() > 0) {
      Store.removeAll(null, true);
    }
  } catch (e) {
    // Otherwise, throw an error.
    throw new Error('`Store` is not a Persistable Type: ' + e.message);
  }

  // Remove any existing Product records.
  try {
    // Check the Product Type exists and is Persistable.
    if (Product.fetchCount() > 0) {
      Product.removeAll(null, true);
    }
  } catch (e) {
    // Otherwise, throw an error.
    throw new Error("`Product` Type doesn't exist: " + e.message);
  }

  return 'Successfully removed existing City, Store, and Product records.';
}

function checkPostUpsert() {
  const expectedCounts = [
    { type: Product, expected: 30, name: 'Product' },
    { type: LineItem, expected: 93, name: 'LineItem' },
    { type: City, expected: 10, name: 'City' },
    { type: Sale, expected: 60, name: 'Sale' },
    { type: Store, expected: 30, name: 'Store' },
  ];

  for (const check of expectedCounts) {
    try {
      const actualCount = check.type.fetchCount();
      if (actualCount !== check.expected) {
        throw new Error(`Incorrect number of ${check.name} records. Expected ${check.expected}, found ${actualCount}`);
      }
    } catch (e) {
      const errorMessage = `Encountered an error with the ${check.name} Type: \n ${e.message}`;
      throw new Error(errorMessage);
    }
  }

  return 'All Types have the expected number of records.';
}
