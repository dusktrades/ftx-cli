import { Ftx } from '../../api/index.js';
import { CliUi, Logger } from '../../common/index.js';

import {
  formatCurrency,
  formatUsd,
  sortAlphabetically,
} from '../../util/index.js';

import { formatRates } from '../formatRates.js';

function calculateAggregateMetrics(lendingHistory) {
  const aggregateMetrics = {};

  for (const entry of lendingHistory.data) {
    const totalHoursLent =
      (aggregateMetrics[entry.coin]?.totalHoursLent ?? 0) + 1;

    const totalHourlyRate =
      (aggregateMetrics[entry.coin]?.totalHourlyRate ?? 0) + entry.rate;

    aggregateMetrics[entry.coin] = { totalHoursLent, totalHourlyRate };
  }

  return Object.entries(aggregateMetrics);
}

function createTable() {
  return CliUi.createTable([
    'Currency',
    'Total lending duration',
    'Average lending rate\n(hour/year)',
    'Total earnings',
    'Total earnings\n(USD)',
  ]);
}

function getProceedsByCurrency(userRewards, currency) {
  const proceeds = userRewards.data.lendingInterestByCoin.find(
    (entry) => entry.coin === currency
  );

  return proceeds ?? { value: 0, valueUsd: 0 };
}

function formatDuration(totalHoursLent) {
  const totalDaysLent = Math.ceil(totalHoursLent / 24);
  const hourString = totalHoursLent === 1 ? 'hour' : 'hours';
  const dayString = totalDaysLent === 1 ? 'day' : 'days';

  return `${totalHoursLent} ${hourString} (~${totalDaysLent} ${dayString})`;
}

function composeTableEntry(
  [currency, { totalHourlyRate, totalHoursLent }],
  userRewards,
  enableColours
) {
  const hourlyRateDecimal = totalHourlyRate / totalHoursLent;
  const proceeds = getProceedsByCurrency(userRewards, currency);

  return [
    currency,
    formatDuration(totalHoursLent),
    formatRates(hourlyRateDecimal, enableColours),
    formatCurrency(proceeds.value),
    formatUsd(proceeds.valueUsd),
  ];
}

function composeTableData(aggregateMetrics, userRewards, enableColours) {
  return [
    ...aggregateMetrics
      .map((entry) => composeTableEntry(entry, userRewards, enableColours))
      .sort(([currencyA], [currencyB]) =>
        sortAlphabetically(currencyA, currencyB)
      ),
    [
      'Total',
      { content: '', colSpan: 3 },
      formatUsd(userRewards.data.lendingInterestUsd),
    ],
  ];
}

async function run(options) {
  const [lendingHistory, userRewards] = await Promise.all([
    Ftx.lendingHistory.get(options),
    Ftx.userRewards.get(options),
  ]);

  if (lendingHistory.error != null) {
    Logger.error(lendingHistory.error);

    return;
  }

  if (userRewards.error != null) {
    Logger.error(userRewards.error);

    return;
  }

  if (lendingHistory.data.length === 0) {
    Logger.info('No lending history found');

    return;
  }

  const aggregateMetrics = calculateAggregateMetrics(lendingHistory);
  const table = createTable();

  const tableData = composeTableData(
    aggregateMetrics,
    userRewards,
    options.global.enableColours
  );

  table.push(...tableData);
  CliUi.logTable(table);
}

const earnings = { run };

export { earnings };
