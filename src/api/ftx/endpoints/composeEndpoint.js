import { removeNullValues } from '../../../util/index.js';

const normalisedQueryParameters = {
  startTime: 'start_time',
  endTime: 'end_time',
};

function normaliseParameterKey(key) {
  return normalisedQueryParameters[key] ?? key;
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

  return encodedParameters == null ? '' : `?${encodedParameters}`;
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
