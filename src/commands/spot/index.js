import { Ftx } from '../../api/index.js';
import { createTable, Logger } from '../../common/index.js';

import {
  formatNormalNumberNotation,
  shorthandNumber,
} from '../../util/index.js';

import { composeTableData } from '../composeTableData.js';
import { formatChange } from '../formatChange.js';
import { outputData } from '../outputData.js';

async function fetchData(options) {
  return Ftx.spot.get({
    exchange: options.global.exchange,
    filters: {
      currencies: options.command.currency,
      type: options.command.type,
      quoteCurrencies: options.command.quoteCurrency,
      tokenLeverage: options.command.tokenLeverage,
    },
    sortBy: options.command.sort,
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

  outputData(data, options.global.output, {
    table: outputTableData,
    json: outputJsonData,
  });
}

const spot = { run };

export { spot };
