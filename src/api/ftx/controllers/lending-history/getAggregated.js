import { EmptyResultsError } from '../../../../common/errors/index.js';
import { compareAToZ } from '../../../../util/index.js';
import { userRewards } from '../user-rewards/index.js';
import { get } from './get.js';

function getCurrencyMetrics(metricsEntry) {
  if (metricsEntry == null) {
    return { totalHoursLent: 0, totalHourlyRate: 0 };
  }

  return metricsEntry;
}

function updateCurrencyMetrics(lendingHistoryEntry, metricsEntry) {
  const currencyMetrics = getCurrencyMetrics(metricsEntry);

  return {
    totalHoursLent: currencyMetrics.totalHoursLent + 1,
    totalHourlyRate: currencyMetrics.totalHourlyRate + lendingHistoryEntry.rate,
  };
}

function calculateLendingMetrics(lendingHistory) {
  const metrics = {};

  for (const entry of lendingHistory) {
    metrics[entry.coin] = updateCurrencyMetrics(entry, metrics[entry.coin]);
  }

  return metrics;
}

function findProceedsByCurrency(currency, rewards) {
  const proceeds = rewards.lendingInterestByCoin.find(
    (entry) => entry.coin === currency
  );

  if (proceeds == null) {
    return { value: 0, valueUsd: 0 };
  }

  return proceeds;
}

function composeEntry([currency, values], rewards) {
  const hourlyRateDecimal = values.totalHourlyRate / values.totalHoursLent;
  const proceeds = findProceedsByCurrency(currency, rewards);

  return {
    currency,
    totalHoursLent: values.totalHoursLent,
    hourlyRateDecimal,
    proceeds: proceeds.value,
    proceedsUsd: proceeds.valueUsd,
  };
}

function composeData(lendingHistory, rewards) {
  const lendingMetrics = calculateLendingMetrics(lendingHistory);

  return Object.entries(lendingMetrics).map((entry) =>
    composeEntry(entry, rewards)
  );
}

function sortData(data) {
  return [...data].sort((a, b) => compareAToZ(a.currency, b.currency));
}

function processData(lendingHistory, rewards) {
  const data = composeData(lendingHistory, rewards);

  return {
    lendingEarningsUsd: rewards.lendingInterestUsd,
    metricsByCurrency: sortData(data),
  };
}

async function getAggregated({ exchange, credentials }) {
  const [lendingHistory, rewards] = await Promise.all([
    get({ exchange, credentials }),
    userRewards.get({ exchange, credentials }),
  ]);

  if (lendingHistory.length === 0) {
    throw new EmptyResultsError('No lending history found');
  }

  return processData(lendingHistory, rewards);
}

export { getAggregated };
