import { Ftx } from '../../../src/api/index.js';
import { createTable, Logger } from '../../../src/common/index.js';
import { formatCurrency } from '../../../src/util/index.js';
import { composeTableData, formatRates, outputData } from '../helpers/index.js';

async function fetchData(options) {
  const credentials = {
    apiKey: options.key,
    apiSecret: options.secret,
    subaccount: options.subaccount,
  };

  return Ftx.lendingOffers.get({
    exchange: options.exchange,
    credentials,
    filters: { active: true },
    sortBy: options.sort,
  });
}

function composeTable() {
  return createTable([
    'Currency',
    'Lendable size',
    'Offered size',
    'Locked size',
    'Minimum lending rate\n(hour/year)',
  ]);
}

function composeTableEntry(entry) {
  return [
    entry.coin,
    formatCurrency(entry.lendableCorrected),
    formatCurrency(entry.offered),
    formatCurrency(entry.locked),
    formatRates(entry.minRate, 'lending'),
  ];
}

function outputTableData(data) {
  const table = composeTable();
  const tableData = composeTableData(data, (entry) => composeTableEntry(entry));

  table.push(...tableData);
  Logger.table(table);
}

function composeJsonData(data) {
  return data.map(({ coin, locked, lendable, offered, minRate }) => ({
    currency: coin,
    locked,
    lendable,
    offered,
    minHourlyRate: minRate,
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
