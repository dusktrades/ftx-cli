import { compareAToZ, compareHighToLow } from '../../../../util/index.js';
import { account, futures } from '../../endpoints/index.js';
import { allowValue } from '../allowValue.js';
import { sortData } from '../sortData.js';

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

function composeSortCompare(sortBy) {
  switch (sortBy) {
    case 'side':
      return (a, b) => compareAToZ(a.side, b.side);
    case 'size':
      return (a, b) => compareHighToLow(a.size, b.size);
    case 'notional-size':
      return (a, b) => compareHighToLow(a.notionalSize, b.notionalSize);
    case 'mark-price':
      return (a, b) => compareHighToLow(a.markPrice, b.markPrice);
    case 'average-open-price':
      return (a, b) => compareHighToLow(a.averageOpenPrice, b.averageOpenPrice);
    case 'break-even-price':
      return (a, b) => compareHighToLow(a.breakEvenPrice, b.breakEvenPrice);
    case 'estimated-liquidation-price':
      return (a, b) =>
        compareHighToLow(
          a.estimatedLiquidationPrice,
          b.estimatedLiquidationPrice
        );
    case 'pnl':
      return (a, b) => compareHighToLow(a.pnl, b.pnl);
    default:
      return null;
  }
}

function initialCompare(a, b) {
  return compareAToZ(a.market, b.market);
}

function collateData(data, filters, sortBy) {
  const filteredData = filterData(data, filters);
  const normalisedData = normaliseData(filteredData);
  const sortCompare = composeSortCompare(sortBy);

  return sortData(normalisedData, initialCompare, sortCompare);
}

async function get({ exchange, credentials, filters, sortBy }) {
  const data = await fetchData(exchange, credentials);

  return collateData(data, filters, sortBy);
}

export { get };
