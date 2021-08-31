import { Ftx } from '../../api/index.js';
import { createTable, Logger } from '../../common/index.js';
import { formatCurrency, formatUsd } from '../../util/index.js';

function composeTable() {
  return createTable([
    'Currency',
    'Total interest earned\n(currency)',
    'Total interest earned\n(USD)',
  ]);
}

function composeTableEntry(entry) {
  return [
    entry.coin,
    { hAlign: 'right', content: formatCurrency(entry.value) },
    { hAlign: 'right', content: formatUsd(entry.valueUsd) },
  ];
}

function composeTableData(data) {
  const rows = data.lendingInterestByCoin.map((entry) =>
    composeTableEntry(entry)
  );

  const totalRow = [
    'Total',
    { colSpan: 1, content: '' },
    { hAlign: 'right', content: formatUsd(data.lendingInterestUsd) },
  ];

  return [...rows, totalRow];
}

async function run(options) {
  const credentials = {
    apiKey: options.global.key,
    apiSecret: options.global.secret,
    subaccount: options.global.subaccount,
  };

  const data = await Ftx.userRewards.get({
    exchange: options.global.exchange,
    credentials,
  });

  const table = composeTable();
  const tableData = composeTableData(data);

  table.push(...tableData);
  Logger.table(table);
}

const earnings = { run };

export { earnings };
