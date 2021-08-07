import { removeNullValues } from '../../../util/index.js';

const NORMALISED_QUERY_PARAMETERS = {
  startTime: 'start_time',
  endTime: 'end_time',
};

function normaliseParameterKey(key) {
  return NORMALISED_QUERY_PARAMETERS[key] ?? key;
}

function normaliseParameters(parameters) {
  return Object.fromEntries(
    Object.entries(parameters).map(([key, value]) => [
      normaliseParameterKey(key),
      value,
    ])
  );
}

function composeQueryString(queryParameters = {}) {
  const filteredParameters = removeNullValues(queryParameters);
  const normalisedParameters = normaliseParameters(filteredParameters);
  const encodedParameters = new URLSearchParams(normalisedParameters);

  if (encodedParameters == null) {
    return '';
  }

  return `?${encodedParameters}`;
}

// Raw endpoint means an endpoint without any query parameters.
function composeEndpoint(rawEndpoint, queryParameters) {
  if (queryParameters == null) {
    return rawEndpoint;
  }

  const queryString = composeQueryString(queryParameters);

  return `${rawEndpoint}${queryString}`;
}

export { composeEndpoint };
