import { Ftx } from '../../api/index.js';
import { createTable, Logger } from '../../common/index.js';
import { formatUsd, shorthandNumber } from '../../util/index.js';
import { composeTableData } from '../composeTableData.js';
import { formatChange } from '../formatChange.js';
import { formatRates } from '../formatRates.js';
import { outputData } from '../outputData.js';

async function fetchData(options) {
  return Ftx.futures.getStats({
    exchange: options.global.exchange,
    filters: {
      // TODO: Remove deprecated currency option.
      underlying: options.command.underlying ?? options.command.currency,
      type: options.command.type,
    },
    sortBy: options.command.sort,
  });
}

function composeTable() {
  return createTable([
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

function formatFundingRates(fundingRate) {
  return fundingRate == null ? '-' : formatRates(fundingRate, 'funding');
}

function composeTableEntry(entry) {
  return [
    entry.name,
    formatUsd(entry.lastPrice, { strictDecimalPlaces: false }),
    formatUsd(entry.markPrice, { strictDecimalPlaces: false }),
    formatChange(entry),
    `${shorthandNumber(entry.volume24h)} ${entry.underlying}`,
    `$${shorthandNumber(entry.volumeUsd24h)}`,
    `${shorthandNumber(entry.openInterest)} ${entry.underlying}`,
    `$${shorthandNumber(entry.openInterestUsd)}`,
    formatFundingRates(entry.previousFundingRate),
    formatFundingRates(entry.nextFundingRate),
  ];
}

function outputTableData(data) {
  const table = composeTable();
  const tableData = composeTableData(data, (entry) => composeTableEntry(entry));

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

const futures = { run };

export { futures };
