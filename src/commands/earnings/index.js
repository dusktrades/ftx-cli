import { Ftx } from '../../api/index.js';
import { CliUi } from '../../common/index.js';
import { formatCurrency, formatUsd } from '../../util/index.js';
import { formatRates } from '../formatRates.js';

function createTable() {
  return CliUi.createTable([
    'Currency',
    'Total lending duration',
    'Average lending rate\n(hour/year)',
    'Total earnings',
    'Total earnings\n(USD)',
  ]);
}

function formatDuration(totalHoursLent) {
  const totalDaysLent = Math.ceil(totalHoursLent / 24);
  const hourString = totalHoursLent === 1 ? 'hour' : 'hours';
  const dayString = totalDaysLent === 1 ? 'day' : 'days';

  return `${totalHoursLent} ${hourString} (~${totalDaysLent} ${dayString})`;
}

function composeTableEntry(entry, enableColours) {
  return [
    entry.currency,
    formatDuration(entry.totalHoursLent),
    formatRates(entry.hourlyRateDecimal, 'lending', enableColours),
    formatCurrency(entry.proceeds),
    formatUsd(entry.proceedsUsd),
  ];
}

function composeTableData(data, enableColours) {
  const metricRows = data.metricsByCurrency.map((entry) =>
    composeTableEntry(entry, enableColours)
  );

  const totalRow = [
    'Total',
    { content: '', colSpan: 3 },
    formatUsd(data.lendingEarningsUsd),
  ];

  return [...metricRows, totalRow];
}

async function run(options) {
  const credentials = {
    apiKey: options.global.key,
    apiSecret: options.global.secret,
    subaccount: options.global.subaccount,
  };

  const data = await Ftx.lendingHistory.getAggregated({
    exchange: options.global.exchange,
    credentials,
  });

  const table = createTable();
  const tableData = composeTableData(data, options.global.enableColours);

  table.push(...tableData);

  // TODO: Change to Logger.table().
  CliUi.logTable(table);
}

const earnings = { run };

export { earnings };
