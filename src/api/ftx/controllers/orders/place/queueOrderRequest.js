import { RateLimitError } from '../../../../../common/errors/index.js';
import { queues } from '../../../queues/index.js';

function handleError(error, retryQueueOrderRequest) {
  if (error instanceof RateLimitError) {
    // Order failed due to exceeding rate limit; retry with increased priority.
    return retryQueueOrderRequest();
  }

  throw error;
}

function queueOrderRequest(request, priority = 0) {
  function retryQueueOrderRequest() {
    return queueOrderRequest(request, priority + 1);
  }

  return queues.orders
    .add(request, { priority })
    .catch((error) => handleError(error, retryQueueOrderRequest));
}

export { queueOrderRequest };
