import { setServerTimeOffset } from '../src/api/ftx/endpoints/request.js';
import { setTimer } from '../src/util/index.js';

async function syncTime({ exchange, syncIntervalMilliseconds }) {
  // Wait for immediate server time sync before we send any command requests.
  await setServerTimeOffset({ exchange });

  // Set up recurring server time sync.
  return setTimer({
    callback: () => setServerTimeOffset({ exchange }),
    intervalMilliseconds: syncIntervalMilliseconds,
  });
}

export { syncTime };
