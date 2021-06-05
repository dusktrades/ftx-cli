import got from 'got';

import { ENDPOINTS } from '../../endpoints.js';
import { COMMON_HEADERS, composeAuthenticationHeaders } from '../../headers.js';
import { composeUrl } from '../composeUrl.js';
import { handleError } from '../handleError.js';

async function get(options) {
  const endpoint = ENDPOINTS.USER_REWARDS;
  const url = composeUrl(endpoint, options.global.exchange);

  const headers = {
    ...COMMON_HEADERS,
    ...composeAuthenticationHeaders({
      method: 'get',
      endpoint,
      options,
    }),
  };

  try {
    return { data: (await got(url, { headers }).json()).result };
  } catch (error) {
    return handleError(error);
  }
}

const userRewards = { get };

export { userRewards };
