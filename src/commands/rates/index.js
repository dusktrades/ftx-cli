import { Ftx } from '../../api/index.js';
import { createTable, Logger } from '../../common/index.js';
import { composeTableData } from '../composeTableData.js';
import { formatRates } from '../formatRates.js';
import { outputData } from '../outputData.js';

async function fetchData(options) {
  return Ftx.lendingRates.get({
    exchange: options.global.exchange,
    filters: { currencies: options.command.currency },
    sortBy: options.command.sort,
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

  outputData(data, options.global.output, {
    table: outputTableData,
    json: outputJsonData,
  });
}

const rates = { run };

export { rates };
