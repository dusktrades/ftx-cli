import { removeNullValues } from '../../../util/index.js';

const NORMALISE_PARAMETERS_MAP = {
  startTime: 'start_time',
  endTime: 'end_time',
};

function normaliseParameterKey(key) {
  return NORMALISE_PARAMETERS_MAP[key] ?? key;
}

function normaliseParameters(parameters) {
  return Object.fromEntries(
    Object.entries(parameters).map(([key, value]) => [
      normaliseParameterKey(key),
      value,
    ])
  );
}

function composeQueryString(parameters = {}) {
  const filteredParameters = removeNullValues(parameters);
  const normalisedParameters = normaliseParameters(filteredParameters);
  const encodedParameters = new URLSearchParams(normalisedParameters);

  if (encodedParameters == null) {
    return '';
  }

  return `?${encodedParameters}`;
}

export { composeQueryString };
