import { getUnixTimestamp, SECONDS_PER_HOUR } from '../../../../util/index.js';
import { futures } from '../../endpoints/index.js';

function calculateStartTime() {
  return getUnixTimestamp() - SECONDS_PER_HOUR;
}

function composeParameters() {
  return { startTime: calculateStartTime() };
}

async function getPreviousFunding({ exchange }) {
  const parameters = composeParameters();

  return futures.getFundingRates({ exchange, parameters });
}

export { getPreviousFunding };
