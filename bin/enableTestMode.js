import nock from 'nock';

import { mockFtxApi } from '../src/api/ftx/mock/index.js';

function enableTestMode() {
  nock.disableNetConnect();
  mockFtxApi();
}

export { enableTestMode };
