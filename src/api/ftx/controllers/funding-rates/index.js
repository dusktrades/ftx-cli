import got from 'got';

import { getUnixTimestamp } from '../../../../util/index.js';
import { ENDPOINTS } from '../../endpoints.js';
import { COMMON_HEADERS } from '../../headers.js';
import { composeUrl } from '../composeUrl.js';
import { handleError } from '../handleError.js';

const SECONDS_PER_HOUR = 3600;

function composeEndpoint() {
  const endTime = getUnixTimestamp();
  const startTime = endTime - SECONDS_PER_HOUR;

  return ENDPOINTS.FUNDING_RATES({ startTime, endTime });
}

async function getPrevious(options) {
  const endpoint = composeEndpoint();
  const url = composeUrl(endpoint, options.global.exchange);

  try {
    return {
      data: (await got(url, { headers: COMMON_HEADERS }).json()).result,
    };
  } catch (error) {
    return handleError(error);
  }
}

const fundingRates = { getPrevious };

export { fundingRates };
