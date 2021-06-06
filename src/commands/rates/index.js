import { Ftx } from '../../api/index.js';
import { CliUi, Logger } from '../../common/index.js';
import { composeTableData } from '../composeTableData.js';
import { formatRates } from '../formatRates.js';

function composeCurrenciesFilter(currency) {
  return currency == null ? null : [currency];
}

function createTable() {
  return CliUi.createTable([
    'Currency',
    'Previous\n(hour/year)',
    'Estimated next\n(hour/year)',
  ]);
}

function composeTableEntry(entry) {
  return [entry.coin, formatRates(entry.previous), formatRates(entry.estimate)];
}

async function run(options) {
  const { data, error } = await Ftx.lendingRates.get(options, {
    currencies: composeCurrenciesFilter(options.command.currency),
  });

  if (error != null) {
    Logger.error(error);

    return;
  }

  if (data.length === 0) {
    Logger.info('No lending rates found');

    return;
  }

  const table = createTable();
  const tableData = composeTableData(data, composeTableEntry);

  table.push(...tableData);
  CliUi.logTable(table);
}

const rates = { run };

export { rates };
