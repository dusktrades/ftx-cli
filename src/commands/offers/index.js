import { Ftx } from '../../api/index.js';
import { CliUi, Logger } from '../../common/index.js';
import { formatCurrency } from '../../util/index.js';
import { composeTableData } from '../composeTableData.js';
import { formatRates } from '../formatRates.js';

function createTable() {
  return CliUi.createTable([
    'Currency',
    'Lendable size',
    'Offered size',
    'Locked size',
    'Minimum lending rate\n(hour/year)',
  ]);
}

async function run(options) {
  function composeTableEntry(entry) {
    return [
      entry.coin,
      formatCurrency(entry.lendable),
      formatCurrency(entry.offered),
      formatCurrency(entry.locked),
      formatRates(entry.minRate, 'lending', options.global.enableColours),
    ];
  }

  const { data, error } = await Ftx.lendingOffers.get(options, {
    active: true,
  });

  if (error != null) {
    Logger.error(error);

    return;
  }

  if (data.length === 0) {
    Logger.info('No lending offers found');

    return;
  }

  const table = createTable();
  const tableData = composeTableData(data, composeTableEntry);

  table.push(...tableData);
  CliUi.logTable(table);
}

const offers = { run };

export { offers };
