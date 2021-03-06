import chalk from 'chalk';

import { Ftx } from '../../../src/api/index.js';
import { createTable, Logger } from '../../../src/common/index.js';

import {
  convertDecimalToPercentage,
  formatCurrency,
  formatPercentage,
  formatUsd,
} from '../../../src/util/index.js';

import { formatHeadingRow, outputData } from '../helpers/index.js';

const headingRow = formatHeadingRow([
  'Currency',
  'Available without borrowing',
  'Available with borrowing',
  'Borrowed',
  'Total',
  'Total (USD)',
  'Allocation',
]);

const emptySectionRow = [
  {
    colSpan: headingRow.length,
    hAlign: 'center',
    content: chalk.yellow('No balances found.'),
  },
];

async function fetchData(options) {
  const credentials = {
    apiKey: options.key,
    apiSecret: options.secret,
    subaccount: options.subaccount,
  };

  return Ftx.wallet.get({
    exchange: options.exchange,
    credentials,
    sortBy: options.sort,
  });
}

function composeSubaccountHeading(subaccount) {
  return chalk.magenta(
    subaccount === 'main'
      ? chalk.bold('Main account')
      : `Subaccount: ${chalk.bold(subaccount)}`
  );
}

function composeSubheadingRow(content) {
  return [{ colSpan: headingRow.length, hAlign: 'center', content }];
}

function composeBalanceRow(entry) {
  const allocationPercentage = convertDecimalToPercentage(entry.allocation);

  return [
    entry.currency,
    `${formatCurrency(entry.availableWithoutBorrowing)} ${entry.currency}`,
    `${formatCurrency(entry.availableWithBorrowing)} ${entry.currency}`,
    `${formatCurrency(entry.borrowed)} ${entry.currency}`,
    `${formatCurrency(entry.total)} ${entry.currency}`,
    { hAlign: 'right', content: formatUsd(entry.totalUsd) },
    { hAlign: 'right', content: formatPercentage(allocationPercentage, 2) },
  ];
}

function composeBalanceRows(balances) {
  return balances.map((entry) => composeBalanceRow(entry));
}

function composeTotalRow(totalUsd) {
  return [
    chalk.bold('Total'),
    { colSpan: 4, content: '' },
    { hAlign: 'right', content: chalk.bold(formatUsd(totalUsd)) },
  ];
}

function composeTableDataSection({ balances, totalUsd }) {
  if (balances.length === 0) {
    return [emptySectionRow];
  }

  const balanceRows = composeBalanceRows(balances);
  const totalRow = composeTotalRow(totalUsd);

  return [...balanceRows, totalRow];
}

function composeAllSubaccountsTableData({ subaccounts, total }) {
  const subaccountsData = subaccounts.flatMap((entry) => [
    composeSubheadingRow(composeSubaccountHeading(entry.subaccount)),
    ...composeTableDataSection(entry),
  ]);

  const totalData = [
    composeSubheadingRow(chalk.bold.cyan('Total')),
    ...composeTableDataSection(total),
  ];

  return [...subaccountsData, ...totalData];
}

function outputTableData(data) {
  const table = createTable(headingRow);

  const tableData =
    data.subaccounts == null
      ? composeTableDataSection(data)
      : composeAllSubaccountsTableData(data);

  table.push(...tableData);
  Logger.table(table);
}

function outputJsonData(data) {
  Logger.json(data);
}

async function run(options) {
  const data = await fetchData(options);

  outputData(data, options.output, {
    table: outputTableData,
    json: outputJsonData,
  });
}

export { run };
