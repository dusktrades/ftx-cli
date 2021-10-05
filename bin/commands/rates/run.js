import { Ftx } from '../../../src/api/index.js';
import { createTable, Logger } from '../../../src/common/index.js';
import { composeTableData, formatRates, outputData } from '../helpers/index.js';

async function fetchData(options) {
  return Ftx.lendingRates.get({
    exchange: options.exchange,
    filters: { currencies: options.currency },
    sortBy: options.sort,
  });
}

function composeTable() {
  return createTable([
    'Currency',
    'Previous\n(hour/year)',
    'Estimated next\n(hour/year)',
  ]);
}

function composeTableEntry(entry, enableColours) {
  return [
    entry.coin,
    formatRates(entry.previous, 'lending', enableColours),
    formatRates(entry.estimate, 'lending', enableColours),
  ];
}

function outputTableData(data) {
  const table = composeTable();
  const tableData = composeTableData(data, (entry) => composeTableEntry(entry));

  table.push(...tableData);
  Logger.table(table);
}

function composeJsonData(data) {
  return data.map(({ coin, previous, estimate }) => ({
    currency: coin,
    previousHourlyRate: previous,
    nextHourlyRate: estimate,
  }));
}

function outputJsonData(data) {
  const jsonData = composeJsonData(data);

  Logger.json(jsonData);
}

async function run(options) {
  const data = await fetchData(options);

  outputData(data, options.output, {
    table: outputTableData,
    json: outputJsonData,
  });
}

export { run };
