import { compareAToZ } from '../../../../util/index.js';
import { userRewards } from '../../endpoints/index.js';

function normaliseData({ lendingInterestByCoin, lendingInterestUsd }) {
  const currencies = lendingInterestByCoin
    .map(({ coin, value, valueUsd }) => ({
      currency: coin,
      value,
      valueUsd,
    }))
    .sort((a, b) => compareAToZ(a.currency, b.currency));

  return {
    currencies,
    totalUsd: lendingInterestUsd,
  };
}

async function get({ exchange, credentials }) {
  const data = await userRewards.getUserRewards({ exchange, credentials });

  return normaliseData(data);
}

export { get };
