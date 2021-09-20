import { interceptTestCase } from '../../helpers/index.js';

function mockGetServerTime() {
  interceptTestCase({
    endpoint: 'time',
    method: 'get',
    requiresAuthentication: false,
    statusCode: 200,
    response: {
      success: true,
      result: '2021-01-01T00:00:00.000000+00:00',
    },
  });
}

export { mockGetServerTime };
