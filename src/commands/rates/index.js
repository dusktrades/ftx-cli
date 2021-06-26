import { Ftx } from '../../api/index.js';
import { CliUi } from '../../common/index.js';
import { composeTableData } from '../composeTableData.js';
import { formatRates } from '../formatRates.js';

function createTable() {
  return CliUi.createTable([
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

async function run(options) {
  const data = await Ftx.lendingRates.get({
    exchange: options.global.exchange,
    filters: {
      currencies: options.command.currency,
    },
    sortBy: options.command.sort,
  });

  const table = createTable();

  const tableData = composeTableData(data, (entry) =>
    composeTableEntry(entry, options.global.enableColours)
  );

  table.push(...tableData);
  CliUi.logTable(table);
}

const rates = { run };

export { rates };
