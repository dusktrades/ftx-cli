import { removeNullValues } from '../../util/index.js';

function normaliseParameters(parameters) {
  const parameterNames = {
    startTime: 'start_time',
    endTime: 'end_time',
  };

  return Object.fromEntries(
    Object.entries(parameters).map(([name, value]) => [
      parameterNames[name] ?? name,
      value,
    ])
  );
}

function composeQueryString(parameters = {}) {
  const filteredParameters = removeNullValues(parameters);
  const normalisedParameters = normaliseParameters(filteredParameters);
  const encodedParameters = new URLSearchParams(normalisedParameters);

  return encodedParameters == null ? '' : `?${encodedParameters}`;
}

const ENDPOINTS = {
  FUNDING_RATES(parameters) {
    return `funding_rates${composeQueryString(parameters)}`;
  },
  FUTURES: 'futures',
  FUTURE_STATS(name) {
    return `futures/${name}/stats`;
  },
  LENDING_HISTORY(parameters) {
    return `spot_margin/lending_history${composeQueryString(parameters)}`;
  },
  LENDING_INFO: 'spot_margin/lending_info',
  LENDING_OFFERS: 'spot_margin/offers',
  LENDING_RATES: 'spot_margin/lending_rates',
  USER_REWARDS: 'user_rewards',
};

export { ENDPOINTS };
