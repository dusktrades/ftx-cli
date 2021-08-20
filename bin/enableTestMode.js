import nock from 'nock';

import { MockFtxApi } from '../src/mocks/ftx-api/index.js';

function enableTestMode() {
  nock.disableNetConnect();
  MockFtxApi.create();
}

export { enableTestMode };
