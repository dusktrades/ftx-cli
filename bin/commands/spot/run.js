import { Ftx } from '../../../src/api/index.js';
import { createTable, Logger } from '../../../src/common/index.js';

import {
  formatNormalNumberNotation,
  shorthandNumber,
} from '../../../src/util/index.js';

import {
  composeTableData,
  formatChange,
  outputData,
} from '../helpers/index.js';

async function fetchData(options) {
  return Ftx.spot.get({
    exchange: options.exchange,
    filters: {
      currencies: options.currency,
      type: options.type,
      quoteCurrencies: options.quoteCurrency,
      tokenLeverage: options.tokenLeverage,
    },
    sortBy: options.sort,
  });
}

function composeTable() {
  return createTable([
    'Name',
    'Market price',
    'Change\n(hour/24 hours)',
    'Volume\n(USD, 24 hours)',
  ]);
}

function composeTableEntry(entry) {
  return [
    entry.name,
    `${formatNormalNumberNotation(entry.marketPrice)} ${entry.quoteCurrency}`,
    formatChange(entry),
    `$${shorthandNumber(entry.volumeUsd24h)}`,
  ];
}

function outputTableData(data) {
  const table = composeTable();
  const tableData = composeTableData(data, (entry) => composeTableEntry(entry));

  table.push(...tableData);
  Logger.table(table);
}

function outputJsonData(data) {
  Logger.json(data);
}

async function run(options) {
  const data = await fetchData(options);

  outputData(data, options.output, {
    table: outputTableData,
    json: outputJsonData,
  });
}

export { run };
