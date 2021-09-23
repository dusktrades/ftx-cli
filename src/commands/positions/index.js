import chalk from 'chalk';

import { Ftx } from '../../api/index.js';
import { createTable, Logger } from '../../common/index.js';

import {
  colourBySign,
  formatNormalNumberNotation,
  formatUsd,
} from '../../util/index.js';

import { formatHeadingRow } from '../formatHeadingRow.js';
import { outputData } from '../outputData.js';

const headingRow = formatHeadingRow([
  'Market',
  'Side',
  'Size',
  'Notional size',
  'Mark price',
  'Average open price',
  'Break-even price',
  'Estimated liquidation price',
  'PnL',
]);

async function fetchData(options) {
  const credentials = {
    apiKey: options.global.key,
    apiSecret: options.global.secret,
    subaccount: options.global.subaccount,
  };

  return Ftx.positions.get({
    exchange: options.global.exchange,
    credentials,
    filters: { market: options.command.market },
    sortBy: options.command.sort,
  });
}

function composeEmptyRow() {
  return [
    [
      {
        colSpan: headingRow.length,
        hAlign: 'center',
        content: chalk.yellow('No positions found.'),
      },
    ],
  ];
}

function normaliseSide(side) {
  return side === 'sell' ? chalk.red('Short') : chalk.green('Long');
}

function formatEstimatedLiquidationPrice(price) {
  return price === 0 ? '-' : formatUsd(price, { strictDecimalPlaces: false });
}

function formatPnl(pnl) {
  const formattedUsd = formatUsd(pnl, { explicitSign: true });

  return colourBySign(formattedUsd, pnl);
}

function composeTableEntry(entry) {
  return [
    entry.market,
    normaliseSide(entry.side),
    `${formatNormalNumberNotation(entry.size)} ${entry.underlying}`,
    formatUsd(entry.notionalSize),
    formatUsd(entry.markPrice, { strictDecimalPlaces: false }),
    formatUsd(entry.averageOpenPrice, { strictDecimalPlaces: false }),
    formatUsd(entry.breakEvenPrice, { strictDecimalPlaces: false }),
    formatEstimatedLiquidationPrice(entry.estimatedLiquidationPrice),
    formatPnl(entry.pnl),
  ];
}

function composeTableData(data) {
  return data.length === 0
    ? composeEmptyRow()
    : data.map((entry) => composeTableEntry(entry));
}

function outputTableData(data) {
  const table = createTable(headingRow);
  const tableData = composeTableData(data);

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

const positions = { run };

export { positions };
