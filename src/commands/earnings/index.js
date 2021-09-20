import { Ftx } from '../../api/index.js';
import { createTable, Logger } from '../../common/index.js';
import { formatCurrency, formatUsd } from '../../util/index.js';
import { outputData } from '../outputData.js';

async function fetchData(options) {
  const credentials = {
    apiKey: options.global.key,
    apiSecret: options.global.secret,
    subaccount: options.global.subaccount,
  };

  return Ftx.lendingEarnings.get({
    exchange: options.global.exchange,
    credentials,
  });
}

function composeTable() {
  return createTable(['Currency', 'Interest earned', 'Interest earned (USD)']);
}

function composeTableEntry({ currency, value, valueUsd }) {
  return [
    currency,
    { hAlign: 'right', content: formatCurrency(value) },
    { hAlign: 'right', content: formatUsd(valueUsd) },
  ];
}

function composeTableData({ currencies, totalUsd }) {
  const rows = currencies.map((entry) => composeTableEntry(entry));

  const totalRow = [
    'Total',
    { colSpan: 1, content: '' },
    { hAlign: 'right', content: formatUsd(totalUsd) },
  ];

  return [...rows, totalRow];
}

function outputTableData(data) {
  const table = composeTable();
  const tableData = composeTableData(data);

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

const earnings = { run };

export { earnings };
