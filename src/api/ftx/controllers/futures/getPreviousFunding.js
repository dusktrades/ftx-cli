import { getUnixTimestamp, SECONDS_PER_HOUR } from '../../../../util/index.js';
import { futures } from '../../endpoints/index.js';

function calculateStartTime(endTime) {
  return endTime - SECONDS_PER_HOUR;
}

function composeParameters() {
  const endTime = getUnixTimestamp();

  return {
    startTime: calculateStartTime(endTime),
    endTime,
  };
}

async function getPreviousFunding(exchange) {
  const parameters = composeParameters();

  return futures.getFundingRates(exchange, parameters);
}

export { getPreviousFunding };
