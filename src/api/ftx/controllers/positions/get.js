import { compareAToZ, compareHighToLow } from '../../../../util/index.js';
import { account, futures } from '../../endpoints/index.js';
import { allowValue } from '../allowValue.js';

async function fetchData(exchange, credentials) {
  const [positionsData, futuresData] = await Promise.all([
    account.getPositions({ exchange, credentials }),
    futures.getFutures({ exchange }),
  ]);

  return {
    positions: positionsData,
    futures: futuresData,
  };
}

function hasSize(size) {
  return size > 0;
}

function filterData(data, filters) {
  const filteredPositions = data.positions.filter(
    ({ future, size }) => allowValue(filters.market, future) && hasSize(size)
  );

  return {
    ...data,
    positions: filteredPositions,
  };
}

function findFuturesEntry(market, futuresData) {
  return futuresData.find(({ name }) => name === market);
}

function normaliseData(data) {
  return data.positions.map((position) => {
    const { underlying, mark: markPrice } = findFuturesEntry(
      position.future,
      data.futures
    );

    return {
      market: position.future,
      underlying,
      side: position.side,
      size: position.size,
      notionalSize: Math.abs(position.cost),
      markPrice,
      averageOpenPrice: position.recentAverageOpenPrice,
      breakEvenPrice: position.recentBreakEvenPrice,
      estimatedLiquidationPrice: position.estimatedLiquidationPrice,
      pnl: position.recentPnl,
    };
  });
}

function composeCompareFunction(sortBy) {
  if (['side', 'S'].includes(sortBy)) {
    return (a, b) => compareAToZ(a.side, b.side);
  }

  if (['size', 's'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.size, b.size);
  }

  if (['notional-size', 'ns'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.notionalSize, b.notionalSize);
  }

  if (['mark-price', 'mp'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.markPrice, b.markPrice);
  }

  if (['average-open-price', 'op'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.averageOpenPrice, b.averageOpenPrice);
  }

  if (['break-even-price', 'bep'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.breakEvenPrice, b.breakEvenPrice);
  }

  if (['estimated-liquidation-price', 'lp'].includes(sortBy)) {
    return (a, b) =>
      compareHighToLow(
        a.estimatedLiquidationPrice,
        b.estimatedLiquidationPrice
      );
  }

  if (sortBy === 'pnl') {
    return (a, b) => compareHighToLow(a.pnl, b.pnl);
  }

  return null;
}

function sortData(data, sortBy) {
  const alphabeticalData = [...data].sort((a, b) =>
    compareAToZ(a.market, b.market)
  );

  const compareFunction = composeCompareFunction(sortBy);

  return compareFunction == null
    ? alphabeticalData
    : alphabeticalData.sort(compareFunction);
}

function collateData(data, filters, sortBy) {
  const filteredData = filterData(data, filters);
  const normalisedData = normaliseData(filteredData);

  return sortData(normalisedData, sortBy);
}

async function get({ exchange, credentials, filters, sortBy }) {
  const data = await fetchData(exchange, credentials);

  return collateData(data, filters, sortBy);
}

export { get };
