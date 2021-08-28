import chalk from 'chalk';

import { Ftx } from '../../api/index.js';
import { createTable, Logger } from '../../common/index.js';

import {
  formatCurrency,
  formatPercentage,
  formatUsd,
} from '../../util/index.js';

const columnHeadingRow = [
  'Currency',
  'Available with borrowing',
  'Available without borrowing',
  'Borrowed',
  'Total',
  'Total (USD)',
  'Allocation',
];

const emptyBalancesRow = [
  {
    colSpan: columnHeadingRow.length,
    hAlign: 'center',
    content: chalk.yellow('No balances found.'),
  },
];

function composeSubaccountHeading(subaccount) {
  return chalk.magenta(
    subaccount === 'main'
      ? chalk.bold('Main account')
      : `Subaccount: ${chalk.bold(subaccount)}`
  );
}

function composeAccountHeadingRow(content) {
  return [{ colSpan: columnHeadingRow.length, hAlign: 'center', content }];
}

function composeBalanceRow(entry) {
  return [
    entry.coin,
    `${formatCurrency(entry.free)} ${entry.coin}`,
    `${formatCurrency(entry.availableWithoutBorrow)} ${entry.coin}`,
    `${formatCurrency(entry.spotBorrow)} ${entry.coin}`,
    `${formatCurrency(entry.total)} ${entry.coin}`,
    { hAlign: 'right', content: formatUsd(entry.usdValue) },
    {
      hAlign: 'right',
      content: formatPercentage(entry.allocationPercentage, 2),
    },
  ];
}

function composeBalanceRows(balances) {
  return balances.map((entry) => composeBalanceRow(entry));
}

function composeTotalRow(totalBalanceUsd) {
  return [
    'Total',
    { colSpan: 4, content: '' },
    { hAlign: 'right', content: chalk.bold(formatUsd(totalBalanceUsd)) },
  ];
}

function composeSubaccountTableData({
  subaccount,
  balances,
  subaccountBalanceUsd,
}) {
  const subaccountHeading = composeSubaccountHeading(subaccount);
  const accountHeadingRow = composeAccountHeadingRow(subaccountHeading);

  if (balances.length === 0) {
    return [accountHeadingRow, emptyBalancesRow];
  }

  const balanceRows = composeBalanceRows(balances);
  const totalRow = composeTotalRow(subaccountBalanceUsd);

  return [accountHeadingRow, ...balanceRows, totalRow];
}

function composeTotalAccountTableData({ balances, totalAccountBalanceUsd }) {
  const accountHeadingRow = composeAccountHeadingRow(chalk.bold.cyan('Total'));

  const balanceRows = composeBalanceRows(balances);
  const totalRow = composeTotalRow(totalAccountBalanceUsd);

  return [accountHeadingRow, ...balanceRows, totalRow];
}

function composeTableData({ subaccounts, totalAccount }) {
  const tableData = [];

  if (subaccounts.length > 1) {
    const totalAccountTableData = composeTotalAccountTableData(totalAccount);

    tableData.push(...totalAccountTableData);
  }

  for (const subaccountEntry of subaccounts) {
    const subaccountTableData = composeSubaccountTableData(subaccountEntry);

    tableData.push(...subaccountTableData);
  }

  return tableData;
}

async function run(options) {
  const credentials = {
    apiKey: options.global.key,
    apiSecret: options.global.secret,
    subaccount: options.global.subaccount,
  };

  const data = await Ftx.wallet.get({
    exchange: options.global.exchange,
    credentials,
  });

  const table = createTable(columnHeadingRow);
  const tableData = composeTableData(data);

  table.push(...tableData);
  Logger.table(table);
}

const wallet = { run };

export { wallet };
