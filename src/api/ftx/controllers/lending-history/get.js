import { convertIsoToUnix, getUnixTimestamp } from '../../../../util/index.js';
import { spotMargin } from '../../endpoints/index.js';

function updateRollingEndTime(pageData) {
  const earliestEntry = pageData[0];

  if (earliestEntry == null) {
    return null;
  }

  return convertIsoToUnix(earliestEntry.time) - 1;
}

/**
 * Unsure if pagination is needed or works. It's difficult to test because, at
 * the time of writing, FTX's API has some undocumented limits on result array
 * sizes (which we haven't ran into yet on this endpoint).
 */
async function get({ exchange, credentials }) {
  const data = [];
  let rollingEndTime = getUnixTimestamp();
  let isFetching = true;

  while (isFetching) {
    // Async loop must be sequential for unbounded pagination to work.
    // eslint-disable-next-line no-await-in-loop
    const pageResponse = await spotMargin.getMyLendingHistory({
      exchange,
      credentials,
      queryParameters: { startTime: 0, endTime: rollingEndTime },
    });

    data.push(...pageResponse);
    rollingEndTime = updateRollingEndTime(pageResponse);
    isFetching = rollingEndTime != null;
  }

  return data;
}

export { get };
