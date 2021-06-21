import { Ftx } from '../../api/index.js';
import { CliUi, Logger } from '../../common/index.js';
import { composeTableData } from '../composeTableData.js';
import { formatRates } from '../formatRates.js';

function createTable() {
  return CliUi.createTable([
    'Currency',
    'Previous\n(hour/year)',
    'Estimated next\n(hour/year)',
  ]);
}

async function run(options) {
  function composeTableEntry(entry) {
    return [
      entry.coin,
      formatRates(entry.previous, 'lending', options.global.enableColours),
      formatRates(entry.estimate, 'lending', options.global.enableColours),
    ];
  }

  const { data, error } = await Ftx.lendingRates.get(options, {
    currencies: options.command.currency,
  });

  if (error != null) {
    Logger.error(error, options);

    return;
  }

  if (data.length === 0) {
    Logger.info('No lending rates found', options);

    return;
  }

  const table = createTable();
  const tableData = composeTableData(data, composeTableEntry);

  table.push(...tableData);
  CliUi.logTable(table);
}

const rates = { run };

export { rates };
