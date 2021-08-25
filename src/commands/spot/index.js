import BigNumber from 'bignumber.js';

import { Ftx } from '../../api/index.js';
import { CliUi } from '../../common/index.js';
import { shorthandNumber } from '../../util/index.js';
import { composeTableData } from '../composeTableData.js';
import { formatChange } from '../formatChange.js';

async function getData(options) {
  return Ftx.spot.get({
    exchange: options.global.exchange,
    filters: {
      currencies: options.command.currency,
      type: options.command.type,
      quoteCurrencies: options.command.quoteCurrency,
      tokenLeverage: options.command.tokenLeverage,
    },
    sortBy: options.command.sort,
  });
}

function createTable() {
  return CliUi.createTable([
    'Name',
    'Price',
    'Change\n(hour/24 hours)',
    'Volume\n(USD, 24 hours)',
  ]);
}

function composeTableEntry(entry, enableColours) {
  return [
    entry.name,

    // BigNumber has its own toFixed method.
    // eslint-disable-next-line unicorn/require-number-to-fixed-digits-argument
    `${BigNumber(entry.price).toFixed()} ${entry.quoteCurrency}`,
    formatChange(entry, enableColours),
    `$${shorthandNumber(entry.volumeUsd24h)}`,
  ];
}

async function run(options) {
  const data = await getData(options);
  const table = createTable();

  const tableData = composeTableData(data, (entry) =>
    composeTableEntry(entry, options.global.colour)
  );

  table.push(...tableData);
  CliUi.logTable(table);
}

const spot = { run };

export { spot };
