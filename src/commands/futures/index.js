import { Ftx } from '../../api/index.js';
import { CliUi } from '../../common/index.js';
import { shorthandNumber } from '../../util/index.js';
import { composeTableData } from '../composeTableData.js';
import { formatChange } from '../formatChange.js';
import { formatPrice } from '../formatPrice.js';
import { formatRates } from '../formatRates.js';

async function getData(options) {
  return Ftx.futures.getStats({
    exchange: options.global.exchange,
    filters: {
      currencies: options.command.currency,
      type: options.command.type,
    },
    sortBy: options.command.sort,
  });
}

function createTable() {
  return CliUi.createTable([
    'Name',
    'Last price',
    'Mark price',
    'Change\n(hour/24 hours)',
    'Volume\n(24 hours)',
    'Volume\n(USD, 24 hours)',
    'Open interest',
    'Open interest\n(USD)',
    'Previous funding rate\n(hour/year)',
    'Estimated next funding rate\n(hour/year)',
  ]);
}

function formatFundingRates(fundingRate, enableColours) {
  if (fundingRate == null) {
    return '-';
  }

  return formatRates(fundingRate, 'funding', enableColours);
}

function composeTableEntry(entry, enableColours) {
  return [
    entry.name,
    formatPrice(entry.lastPrice),
    formatPrice(entry.markPrice),
    formatChange(entry, enableColours),
    `${shorthandNumber(entry.volume24h)} ${entry.underlying}`,
    `$${shorthandNumber(entry.volumeUsd24h)}`,
    `${shorthandNumber(entry.openInterest)} ${entry.underlying}`,
    `$${shorthandNumber(entry.openInterestUsd)}`,
    formatFundingRates(entry.previousFundingRate, enableColours),
    formatFundingRates(entry.nextFundingRate, enableColours),
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

const futures = { run };

export { futures };
