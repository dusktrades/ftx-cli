import { Ftx } from '../../api/index.js';
import { createTable, Logger } from '../../common/index.js';
import { formatCurrency } from '../../util/index.js';
import { composeTableData } from '../composeTableData.js';
import { formatRates } from '../formatRates.js';

function composeTable() {
  return createTable([
    'Currency',
    'Lendable size',
    'Offered size',
    'Locked size',
    'Minimum lending rate\n(hour/year)',
  ]);
}

function composeTableEntry(entry, enableColours) {
  return [
    entry.coin,
    formatCurrency(entry.lendable),
    formatCurrency(entry.offered),
    formatCurrency(entry.locked),
    formatRates(entry.minRate, 'lending', enableColours),
  ];
}

async function run(options) {
  const credentials = {
    apiKey: options.global.key,
    apiSecret: options.global.secret,
    subaccount: options.global.subaccount,
  };

  const data = await Ftx.lendingOffers.get({
    exchange: options.global.exchange,
    credentials,
    filters: { active: true },
    sortBy: options.command.sort,
  });

  const table = composeTable();

  const tableData = composeTableData(data, (entry) =>
    composeTableEntry(entry, options.global.colour)
  );

  table.push(...tableData);
  Logger.table(table);
}

const offers = { run };

export { offers };
