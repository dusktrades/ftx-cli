import got from 'got';

import { convertIsoToUnix, getUnixTimestamp } from '../../../../util/index.js';
import { ENDPOINTS } from '../../endpoints.js';
import { COMMON_HEADERS, composeAuthenticationHeaders } from '../../headers.js';
import { composeUrl } from '../composeUrl.js';
import { handleError } from '../handleError.js';

async function getPage(options, { startTime, endTime }) {
  const endpoint = ENDPOINTS.LENDING_HISTORY({ startTime, endTime });
  const url = composeUrl(endpoint, options.global.exchange);

  const headers = {
    ...COMMON_HEADERS,
    ...composeAuthenticationHeaders({ method: 'get', endpoint, options }),
  };

  try {
    return { data: (await got(url, { headers }).json()).result };
  } catch (error) {
    return handleError(error);
  }
}

function updateRollingEndTime(pageData) {
  const earliestEntry = pageData[0];

  return earliestEntry?.time == null
    ? null
    : convertIsoToUnix(earliestEntry.time) - 1;
}

/**
 * Unsure if pagination is needed or works. It's difficult to test because, at
 * the time of writing, FTX's API has some undocumented limits on result array
 * sizes (which we haven't ran into yet on this endpoint).
 */
async function get(
  options,
  { startTime = 0, endTime = getUnixTimestamp() } = {}
) {
  const data = [];
  let isSearching = true;
  let rollingEndTime = endTime;

  while (isSearching) {
    // Async loop must be sequential for unbounded pagination to work.
    // eslint-disable-next-line no-await-in-loop
    const pageResponse = await getPage(options, {
      startTime,
      endTime: rollingEndTime,
    });

    if (pageResponse.error != null) {
      return pageResponse;
    }

    data.push(...pageResponse.data);
    rollingEndTime = updateRollingEndTime(pageResponse.data);
    isSearching = rollingEndTime != null;
  }

  return { data };
}

const lendingHistory = { get };

export { lendingHistory };
