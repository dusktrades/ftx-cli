import nock from 'nock';

import { COMMON_REQUEST_HEADERS } from './commonRequestHeaders.js';
import { HOSTNAME } from './hostname.js';

function interceptTestCase({
  endpoint,
  method,
  requiresAuthentication,
  additionalRequestHeaders,
  statusCode,
  response,
}) {
  const access = requiresAuthentication ? 'authenticated' : 'public';

  nock(HOSTNAME, {
    reqheaders: {
      ...COMMON_REQUEST_HEADERS[access],
      ...additionalRequestHeaders,
    },
  })
    .persist()
    [method](`/api/${endpoint}`)
    .reply(statusCode, response);
}

export { interceptTestCase };
