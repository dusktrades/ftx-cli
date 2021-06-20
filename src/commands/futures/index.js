import chalk from 'chalk';

import { Ftx } from '../../api/index.js';
import { CliUi, Logger } from '../../common/index.js';
import { formatPercentageChange, shorthandNumber } from '../../util/index.js';
import { composeTableData } from '../composeTableData.js';
import { formatRates } from '../formatRates.js';

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

function formatPrice(price) {
  if (price == null) {
    return '-';
  }

  /**
   * API will return price precision based on price increments; don't need to
   * override decimal places.
   */
  return `$${price}`;
}

function getChangePercentageColour(changePercentage) {
  if (changePercentage > 0) {
    return 'green';
  }

  if (changePercentage < 0) {
    return 'red';
  }

  return 'white';
}

function formatChangePercentage(changePercentage, options) {
  const formattedChangePercentage = formatPercentageChange(changePercentage);

  if (!options.global.enableColours) {
    return formattedChangePercentage;
  }

  const colour = getChangePercentageColour(changePercentage);

  return chalk[colour](formattedChangePercentage);
}

function formatChange(entry, options) {
  return [entry.change1hPercentage, entry.change24hPercentage]
    .map((changePercentage) =>
      formatChangePercentage(changePercentage, options)
    )
    .join(' / ');
}

function formatFundingRates(fundingRate, options) {
  if (fundingRate == null) {
    return '-';
  }

  return formatRates(fundingRate, 'funding', options.global.enableColours);
}

async function run(options) {
  function composeTableEntry(entry) {
    return [
      entry.name,
      formatPrice(entry.lastPrice),
      formatPrice(entry.markPrice),
      formatChange(entry, options),
      `${entry.volume24h} ${entry.underlying}`,
      `$${shorthandNumber(entry.volumeUsd24h)}`,
      `${entry.openInterest} ${entry.underlying}`,
      `$${shorthandNumber(entry.openInterestUsd)}`,
      formatFundingRates(entry.previousFundingRate, options),
      formatFundingRates(entry.nextFundingRate, options),
    ];
  }

  const { data, error } = await Ftx.futures.getStats(options);

  if (error != null) {
    Logger.error(error);

    return;
  }

  const table = createTable();
  const tableData = composeTableData(data, composeTableEntry);

  table.push(...tableData);
  CliUi.logTable(table);
}

const futures = { run };

export { futures };
