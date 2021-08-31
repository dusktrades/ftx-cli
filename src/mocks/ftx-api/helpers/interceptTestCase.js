import nock from 'nock';

import { COMMON_REQUEST_HEADERS } from './commonRequestHeaders.js';
import { HOSTNAME } from './hostname.js';

function interceptTestCase({
  endpoint,
  method,
  additionalRequestHeaders,
  statusCode,
  response,
}) {
  nock(HOSTNAME, {
    reqheaders: {
      ...COMMON_REQUEST_HEADERS,
      ...additionalRequestHeaders,
    },
  })
    .persist()
    [method](`/api/${endpoint}`)
    .reply(statusCode, response);
}

export { interceptTestCase };
